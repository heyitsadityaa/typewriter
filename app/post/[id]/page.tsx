export const dynamic = "force-dynamic";

import { getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import EachPostContent from "../_ui/each-post-content";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { SpinnerCustom } from "@/components/ui/spinner";
import { Metadata } from "next";

const EachPost = () => {
  const queryClient = getQueryClient();
  // void queryClient.prefetchQuery(
  //   trpc.post.getPostById.queryOptions({ id: Number(params.id) })
  // );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={"Error"}>
        <Suspense fallback={<SpinnerCustom />}>
          <EachPostContent />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default EachPost;