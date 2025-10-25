"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PostCardProps {
    post: {
        id: number
        title: string
        slug: string
        content: string
        // category: string
        author: string
        createdAt: Date
        published: boolean
    }
    categoryName?: string
    size?: "small" | "medium" | "large"
}

export function PostCard({ post, categoryName, size = "medium" }: PostCardProps) {
    const sizeClasses = {
        small: "col-span-1",
        medium: "col-span-1 md:col-span-2",
        large: "col-span-1 md:col-span-2 lg:col-span-3",
    }

    const heightClasses = {
        small: "min-h-[300px]",
        medium: "min-h-[350px]",
        large: "min-h-[400px]",
    }

    return (
        <article
            className={`group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-fade-in ${sizeClasses[size]} ${heightClasses[size]} flex flex-col`}
        >
            {/* {post.featured && (
                <div className="absolute top-4 right-4 inline-block rounded bg-accent px-2 py-1 font-mono text-xs font-bold uppercase text-accent-foreground">
                    Featured
                </div>
            )} */}

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
                    <Link href={`/blog/${post.slug}`}>
                        <h2
                            className={`font-mono font-bold transition-all duration-300 ease-out group-hover:text-accent ${size === "large" ? "text-3xl" : size === "medium" ? "text-2xl" : "text-xl"}`}
                        >
                            {post.title}
                        </h2>
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4 font-mono text-sm text-muted-foreground">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
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
