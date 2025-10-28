"use client"

import { CategorySidebar } from '@/components/category-sidebar';
import { LayoutWrapper } from '@/components/layout-wrapper';
import { PostCard } from '@/components/post-card';
import { Button } from '@/components/ui/button';
import { Spinner, SpinnerCustom } from '@/components/ui/spinner';
import { PostValues } from '@/store';
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AllPostsContents = () => {
    const trpc = useTRPC();

    const [activeCategory, setActiveCategory] = useState<number | undefined>();

    const [draftKey, setDraftKey] = useState<string | null>(null);
    const [draft, setDraft] = useState<PostValues | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("typewriter-drafts");
            if (!raw) return;

            const parsed = JSON.parse(raw);
            const drafts = parsed?.state?.drafts ?? {};

            const foundKey = Object.keys(drafts).find((k) =>
                k.toLowerCase().includes("draft")
            );
            if (!foundKey) return;

            setDraftKey(foundKey);
            setDraft(drafts[foundKey]?.values ?? null);
        } catch (err) {
            console.error("Failed to load drafts:", err);
            setDraftKey(null);
            setDraft(null);
        }
    }, []);

    const postsQuery =
        activeCategory !== undefined
            ? useSuspenseQuery(trpc.postCategories.filterByCategory.queryOptions({ id: activeCategory }))
            : useSuspenseQuery(trpc.post.getall.queryOptions());

    const posts = (postsQuery.data ?? [])
        .map((post: any) => {
            const id = post.id ?? post.postId;
            if (!id) return null;
            return {
                id,
                title: post.title,
                content: post.content,
                author: post.author ?? "Anonymous",
                published: post.published ?? true,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt ?? null,
                categoryId: post.categoryId,
            };
        })
        .filter(Boolean) as Array<any>;

    const categoriesQuery = useSuspenseQuery(trpc.category.getall.queryOptions());

    const categories = categoriesQuery.data ?? "";
    const isLoading = postsQuery.isLoading || categoriesQuery.isLoading;
    const error = postsQuery.error ?? categoriesQuery.error;

    if (isLoading) return <SpinnerCustom />;
    if (error) return <div>Error loading posts</div>;

    const handleClearDraft = () => {
        if (!draftKey) return;

        localStorage.removeItem("typewriter-drafts");
        setDraftKey(null);
        setDraft(null);
        toast.success("Draft cleared");
    };

    return (
        <LayoutWrapper>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h1 className="font-mono text-4xl font-bold tracking-tighter animate-fade-in">Blog</h1>
                <p className="mt-2 font-mono text-muted-foreground animate-slide-up">Thoughts, stories, and ideas.</p>

                <div className="mt-12 grid gap-8 lg:grid-cols-4">
                    <div className="lg:col-span-1 animate-slide-down">
                        <CategorySidebar
                            categories={categories}
                            activeCategory={activeCategory}
                            onCategoryChange={(categoryId) => setActiveCategory(categoryId === null ? undefined : Number(categoryId))}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        {isLoading ? (
                            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                <Spinner />
                            </div>
                        ) : posts.length > 0 ? (
                            <>
                                {draft && (
                                    <div className='border border-accent-foreground rounded-md px-6 py-4 mb-6 w-full'>
                                        <div className="flex items-center justify-between">
                                            <div className="text-base font-medium"><span className='text-accent-foreground/40'>Draft:</span> {draft.title || 'No title'}</div>
                                            <Button onClick={handleClearDraft} variant="secondary">
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post.id}
                                            post={{
                                                ...post,
                                                author: post.author ?? "Anonymous",
                                                published: !!post.published,
                                                createdAt: post.createdAt ?? new Date(),
                                            }}
                                            categoryName={categories.find((c) => c.id === post.id)?.title}
                                        />
                                    ))}
                                </div>
                            </>
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