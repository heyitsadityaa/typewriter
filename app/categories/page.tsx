export const dynamic = "force-dynamic";

import { SpinnerCustom } from "@/components/ui/spinner";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import CategoriesContent from "./_ui/categories-content";

const Categories = () => {
    const queryClient = getQueryClient()
    void Promise.all([
        queryClient.prefetchQuery(trpc.category.getall.queryOptions()),
    ]);
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={"Error"}>
                <Suspense fallback={<SpinnerCustom />}>
                    <CategoriesContent />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}

export default Categories
