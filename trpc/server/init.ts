import { db } from "@/db/drizzle";
import { cache } from "react";
import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'

export const createTRPCContext = cache(() => ({ db }))

type Context = {
    db: typeof db;
};

const t = initTRPC.context<Context>().create({
    transformer: superjson,
})

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// No need of this since theirs no Auth.
// export const protectedProcedure = t.procedure.use(t.middleware(async ({ ctx, next }) => {
//     const session = await getSession();
//     if (!session) throw new TRPCError({
//         code: "UNAUTHORIZED"
//     })
//     return next({
//         ctx: {
//             ...ctx,
//             user: session.user
//         }
//     })
// }))