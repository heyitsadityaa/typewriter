"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { SpinnerCustom } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";

const EachPostContent = ({ id }: { id: number }) => {
    const trpc = useTRPC();
    const postQuery = useSuspenseQuery(trpc.post.getPostById.queryOptions({ id }));

    if (postQuery.isLoading) return <div><SpinnerCustom /></div>;
    if (postQuery.error) return <div>Error loading post</div>;
    if (!postQuery.data) return <div>Post not found</div>;

    const post = postQuery.data;

    return (
        <LayoutWrapper>
            <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
                {/* Header */}
                <header className="space-y-4 border-b border-border pb-8 animate-slide-down">
                    <div className="inline-block rounded bg-muted px-2 py-1 font-mono text-xs font-bold uppercase transition-all duration-300 ease-out hover:bg-accent hover:text-accent-foreground">
                        {/* {post.category} */}
                    </div>
                    <div className="flex items-center justify-between">

                        <h1 className="font-mono text-4xl font-bold tracking-tighter">{post.title}</h1>

                        <div className="inline-flex items-center justify-center gap-2">
                            <Link href={`/post/${post.id}/update`} aria-label="Edit post">
                                <button
                                    type="button"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded bg-muted px-2 py-1 text-sm transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground"
                                    title="Edit"
                                >
                                    <Pencil />
                                </button>
                            </Link>

                            <Button
                                type="button"
                                aria-label="Delete post"
                                title="Delete"
                                onClick={() => {
                                    if (confirm("Delete this post? This action cannot be undone.")) {
                                        // TODO: implement deletion logic
                                        try {

                                            toast.success("Post deleted");
                                            // refresh or update state as needed
                                            if (typeof window !== "undefined") window.location.reload();
                                        } catch (err) {
                                            toast.error("Failed to delete post");
                                            console.error(err);
                                        }
                                    }
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded bg-muted/80 px-2 py-1 text-sm text-destructive transition-all duration-200 ease-out hover:bg-destructive/10"
                            >
                                <Trash className="text-red-500" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date"}</span>
                        <span>•</span>
                        <span>
                            {(() => {
                                const text = post.content ?? "";
                                const words = text.trim().length ? text.trim().split(/\s+/).filter(Boolean).length : 0;
                                const wpm = 200; // words per minute reading speed
                                const minutes = Math.max(1, Math.ceil(words / wpm));
                                const lengthTag = words < 400 ? "Short read" : words > 800 ? "Long read" : "Medium read";
                                return `${words} words • ${minutes} min read • ${lengthTag}`;
                            })()}
                        </span>
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-invert mt-8 max-w-none font-mono text-foreground animate-slide-up">
                    <div className="space-y-4 whitespace-pre-wrap">{post.content}</div>
                </div>

                {/* Footer */}
                <footer className="mt-12 border-t border-border pt-8 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                    <div className="space-y-4">
                        <div className="rounded-lg bg-muted/30 p-6 transition-all duration-300 ease-out hover:bg-muted/50">
                            <h3 className="font-mono font-bold">About the author</h3>
                            <p className="mt-2 font-mono text-sm text-muted-foreground">
                                {post.author === "Anonymous"
                                    ? "This post was written by an anonymous author. We care about our writers' privacy and respect their choice to remain unnamed."
                                    : `${post.author} is a writer and developer passionate about sharing knowledge.`}
                            </p>
                        </div>
                        <Link href="/post">
                            <Button
                                variant="outline"
                                className="font-mono bg-transparent transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
                            >
                                ← Back to Blog
                            </Button>
                        </Link>
                    </div>
                </footer>
            </article>
        </LayoutWrapper>
    );
};

export default EachPostContent;