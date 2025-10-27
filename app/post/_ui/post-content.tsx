"use client"

import { CategorySidebar } from '@/components/category-sidebar';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { PostCard } from '@/components/post-card';
import { Spinner, SpinnerCustom } from '@/components/ui/spinner';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

const AllPostsContents = () => {
    const trpc = useTRPC();

    const [activeCategory, setActiveCategory] = useState<number | undefined>()

    const postsQuery =
        activeCategory !== undefined
            ? useSuspenseQuery(trpc.postCategories.filterByCategory.queryOptions({ id: activeCategory }))
            : useSuspenseQuery(trpc.post.getall.queryOptions());

    // Normalize posts to a common shape
    const posts = (postsQuery.data ?? [])
        .map((post: any) => {
            const id = post.id ?? post.postId;
            if (!id) return null; // skip malformed items
            return {
                id,
                title: post.title,
                content: post.content,
                author: post.author ?? "Anonymous",
                published: post.published ?? true,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt ?? null,
                // try to capture a category id if returned by the API
                categoryId: post.categoryId ?? post.category_id ?? undefined,
            };
        })
        .filter(Boolean) as Array<any>;

    const categoriesQuery = useSuspenseQuery(trpc.category.getall.queryOptions());

    const categories = categoriesQuery.data ?? "";
    const isLoading = postsQuery.isLoading || categoriesQuery.isLoading;
    const error = postsQuery.error ?? categoriesQuery.error;

    if (isLoading) return <SpinnerCustom />;
    if (error) return <div>Error loading posts</div>;
    // if (posts.length === 0) return "No data";
    // if (categories.length === 0) return "No category";

    const getCardSize = (index: number, isFeatured: boolean): "small" | "medium" | "large" => {
        if (isFeatured && index === 0) return "large"
        if (isFeatured && index === 1) return "medium"
        if (index < 3) return "medium"
        return "small"
    }

    return (
        <LayoutWrapper>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="font-mono text-4xl font-bold tracking-tighter animate-fade-in">Blog</h1>
                <p className="mt-2 font-mono text-muted-foreground animate-slide-up">Thoughts, stories, and ideas.</p>

                <div className="mt-12 grid gap-8 lg:grid-cols-4">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 animate-slide-down">
                        <CategorySidebar
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={(categoryId) => setActiveCategory(categoryId === null ? undefined : Number(categoryId))}
                        />
                    </div>

                    {/* Posts Grid */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                <Spinner />
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                                {posts.map((post, index) => (
                                    <PostCard
                                        key={post.id}
                                        post={{
                                            ...post,
                                            author: post.author ?? "Anonymous",
                                            published: !!post.published,
                                            createdAt: post.createdAt ?? new Date(),
                                        }}
                                        categoryName={categories.find((c) => c.id === post.id)?.title}
                                        size={getCardSize(index, true)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-border bg-card p-12 text-center animate-fade-in">
                                <p className="font-mono text-muted-foreground">No posts found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}

export default AllPostsContents;