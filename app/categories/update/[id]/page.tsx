export const dynamic = "force-dynamic";

import { SpinnerCustom } from '@/components/ui/spinner'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import UpdateContent from '../_ui/page'

const UpdateCategory = () => {
    const queryClient = getQueryClient();
    // await queryClient.prefetchQuery(
    //     trpc.category.getCategoryById.queryOptions({ id: categoryId })
    // );
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={"Error"}>
                <Suspense fallback={<SpinnerCustom />}>
                    <UpdateContent />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
};

export default UpdateCategory;
