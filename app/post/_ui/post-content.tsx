"use client"

import { LayoutWrapper } from '@/components/layout-wrapper';
import { PostCard } from '@/components/post-card';
import { SpinnerCustom } from '@/components/ui/spinner';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';

const AllPostsContents = () => {
    const trpc = useTRPC();
    const postsQuery = useSuspenseQuery(trpc.post.getall.queryOptions());
    const categoriesQuery = useSuspenseQuery(trpc.category.getall.queryOptions());

    const posts = postsQuery.data ?? [];
    const categories = categoriesQuery.data ?? [];
    const isLoading = postsQuery.isLoading || categoriesQuery.isLoading;
    const error = postsQuery.error ?? categoriesQuery.error;

    if (isLoading) return <SpinnerCustom />;
    if (error) return <div>Error loading posts</div>;
    if (posts.length === 0) return "No data";
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
                        {/* <SidebarFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            /> */}
                    </div>

                    {/* Posts Grid */}
                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="rounded-lg border border-border bg-card p-6 animate-pulse-soft min-h-[300px]"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                        <div className="h-6 w-24 rounded bg-muted mb-3"></div>
                                        <div className="h-8 w-3/4 rounded bg-muted mb-3"></div>
                                        <div className="h-4 w-full rounded bg-muted mb-2"></div>
                                        <div className="h-4 w-5/6 rounded bg-muted"></div>
                                    </div>
                                ))}
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