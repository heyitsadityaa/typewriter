import { createTRPCRouter } from "../init";
import { CategoryRouter } from "./category";
import { postRouter } from "./post";

export const appRouter = createTRPCRouter({
    post: postRouter,
    category: CategoryRouter
})

export type AppRouter = typeof appRouter;