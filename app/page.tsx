import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import HomeContent from './_ui/home-content'
import { SpinnerCustom } from '@/components/ui/spinner'
import { getQueryClient, trpc } from '@/trpc/server'

const Home = () => {
  const queryClient = getQueryClient()
  void Promise.all([
    queryClient.prefetchQuery(trpc.post.getall.queryOptions()),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={"Error"}>
        {/* // TODO: add skeleton here */}
        <Suspense fallback={<SpinnerCustom />}>
          <HomeContent />
        </Suspense>
      </ErrorBoundary>

    </HydrationBoundary>
  )
}

export default Home
