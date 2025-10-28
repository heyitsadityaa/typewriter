export const dynamic = "force-dynamic";

import { SpinnerCustom } from "@/components/ui/spinner";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import CreateCategoryContent from "./_ui/create-category-content";

const createCategory = () => {
    const queryClient = getQueryClient()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ErrorBoundary fallback={"Error"}>
                <Suspense fallback={<SpinnerCustom />}>
                    <CreateCategoryContent />
                </Suspense>
            </ErrorBoundary>
        </HydrationBoundary>
    );
}

export default createCategory;
