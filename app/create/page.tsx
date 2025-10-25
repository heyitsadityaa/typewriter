import { getQueryClient, trpc } from '@/trpc/server';
import React, { Suspense } from 'react'
import CreatePostPageContent from './_ui/create-post-page-content';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { SpinnerCustom } from '@/components/ui/spinner';

const CreatePostPage = () => {
    const queryClient = getQueryClient()
    // Fire-and-forget multiple prefetches
    void Promise.all([
        // queryClient.prefetchQuery(trpc.post.createPost.mutationOptions()),
    ]);
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={"Error"}>
                <Suspense fallback={<SpinnerCustom />}>
                    <CreatePostPageContent />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    )
}

export default CreatePostPage
