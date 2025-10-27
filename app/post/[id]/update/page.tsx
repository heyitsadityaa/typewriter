export const dynamic = "force-dynamic";

import { SpinnerCustom } from "@/components/ui/spinner";
import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'
import UpdateContent from "./_ui/page";

const Update = async () => {
    const queryClient = getQueryClient();
    // void queryClient.prefetchQuery([
    //     // trpc.post.getPostById.queryOptions({ id: postId })
    // ]
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
}

export default Update