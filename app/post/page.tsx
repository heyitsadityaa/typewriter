import { SpinnerCustom } from "@/components/ui/spinner";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Suspense } from "react";
import AllPostsContents from "./_ui/post-content";
import { ErrorBoundary } from 'react-error-boundary'

const AllPosts = () => {
    const queryClient = getQueryClient()
    // Fire-and-forget multiple prefetches
    void Promise.all([
        queryClient.prefetchQuery(trpc.post.getall.queryOptions()),
        queryClient.prefetchQuery(trpc.category.getall.queryOptions()),
    ]);
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={"Error"}>
                <Suspense fallback={<SpinnerCustom />}>
                    <AllPostsContents />
                </Suspense>
            </ErrorBoundary>

        </HydrationBoundary>
    );
}

export default AllPosts