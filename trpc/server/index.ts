import 'server-only';
import { cache } from 'react'
import { appRouter } from './routers/_app'
import { createTRPCContext } from './init';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { makeQueryClient } from '../client/query-client';

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
    ctx: createTRPCContext,
    router: appRouter,
    queryClient: getQueryClient,
})