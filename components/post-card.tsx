"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from 'lucide-react';
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "./ui/spinner";

interface PostCardProps {
    post: {
        id: number
        title: string
        content: string
        author: string
        createdAt: Date
        published: boolean
    }
    categoryName?: string
}

export function PostCard({ post, categoryName }: PostCardProps) {
    const trpc = useTRPC();
    const queryClient = useQueryClient()

    const renderContent = () => {
        if (!post.content) return null;
        const words = post.content.split(/\s+/).filter(Boolean);
        const limit = 30;
        const excerpt = words.slice(0, limit).join(" ");
        return words.length > limit ? `${excerpt}...` : excerpt;
    }

    const deletePost = useMutation(trpc.post.deletePostById.mutationOptions({
        onError: () => {
            toast("Failed to delete post.", {
                closeButton: true,
                description: "An error occurred while deleting the post."
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.post.getall.queryKey() })
        }
    }))

    return (
        <article
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-fade-in min-h-80 flex flex-col"
        >
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <Link href={`/post/${post.id}/update`} aria-label="Edit post">
                    <Button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded bg-muted px-2 py-1 text-sm transition-all text-accent-foreground duration-200 ease-out hover:bg-accent hover:text-accent-foreground"
                        title="Edit"
                    >
                        <Pencil />
                    </Button>
                </Link>

                <Button
                    type="button"
                    aria-label="Delete post"
                    title="Delete"
                    onClick={async () => {
                        let toastId: string | number | undefined;
                        if (confirm("Delete this post? This action cannot be undone.")) {
                            try {
                                toastId = toast(
                                    <span className="flex items-center gap-2">
                                        <Spinner /> Deleting post...
                                    </span>
                                );
                                await deletePost.mutateAsync({ id: post.id });
                                toast.success("Post deleted", { id: toastId });
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
            <div className="flex-1 space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-block rounded bg-muted px-2 py-1 font-mono text-xs font-bold uppercase transition-all duration-300 ease-out group-hover:bg-accent group-hover:text-accent-foreground">
                            {categoryName}
                        </span>
                        {!post.published && (
                            <span className="inline-block rounded bg-destructive/20 px-2 py-1 font-mono text-xs font-bold uppercase text-destructive">
                                Draft
                            </span>
                        )}
                    </div>
                    <Link href={`/post/${post.id}`}>
                        <h2 className="font-mono text-xl font-bold transition-all duration-300 ease-out group-hover:text-accent-foreground">
                            {post.title}
                        </h2>
                    </Link>
                </div>
                <div className="text-accent-foreground/40">{renderContent()}</div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={`/post/${post.id}`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-mono transition-all duration-300 ease-out hover:translate-x-1"
                    >
                        Read →
                    </Button>
                </Link>
            </div>
        </article>
    )
}