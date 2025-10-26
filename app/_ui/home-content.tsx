"use client"

import { LayoutWrapper } from "@/components/layout-wrapper";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function HomeContent() {
    const trpc = useTRPC();
    const postQuery = useSuspenseQuery(trpc.post.getall.queryOptions());
    return (
        <LayoutWrapper>
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="space-y-8 text-center">
                    <div className="space-y-4 animate-fade-in">
                        <h1 className="font-mono text-5xl font-bold tracking-tighter md:text-6xl transition-all duration-300 ease-out">
                            Welcome to
                            <br />
                            <span className="text-accent-foreground">Typewriter</span>
                        </h1>
                        <p className="font-mono text-lg text-muted-foreground">
                            A minimalistic, vintage-inspired blog platform for writers and thinkers.
                        </p>
                    </div>

                    <div
                        className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-slide-up"
                        style={{ animationDelay: "0.1s" }}
                    >
                        <Link href="/post">
                            <Button
                                size="lg"
                                className="font-mono transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
                            >
                                Read Blog
                            </Button>
                        </Link>
                        <Link href="/create">
                            <Button
                                size="lg"
                                variant="outline"
                                className="font-mono bg-transparent transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
                            >
                                Start Writing
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Featured Posts Preview */}
                <div className="mt-20 space-y-8">
                    <h2 className="font-mono text-2xl font-bold tracking-tighter animate-slide-up">Popular Posts</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {postQuery.data?.slice(0, 3).map((i) => (
                            <article
                                key={i.id}
                                className="group space-y-3 rounded-lg border border-border bg-card p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] animate-slide-up"
                                style={{ animationDelay: `${i.id * 0.1}s` }}
                            >
                                <div className="space-y-2">
                                    {/* <div className="inline-block rounded bg-muted px-2 py-1 font-mono text-xs font-bold uppercase transition-all duration-300 ease-out group-hover:bg-accent group-hover:text-accent-foreground">
                                        Technology
                                    </div> */}
                                    <h3 className="font-mono text-lg font-bold transition-all duration-300 ease-out group-hover:text-accent-foreground">
                                        {i.title}
                                    </h3>
                                </div>
                                <p className="font-mono text-sm text-muted-foreground">
                                    {i.content
                                        .split(" ")
                                        .slice(0, 10)
                                        .join(" ")}
                                </p>
                                <div className="flex items-center justify-between pt-4">
                                    <span className="font-mono text-xs text-muted-foreground">{i.createdAt ? i.createdAt.toLocaleDateString() : ""}
                                    </span>

                                    <Link href={`/post/${i.id}`}>
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
                        ))}
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
}
