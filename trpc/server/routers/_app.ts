import { createTRPCRouter } from "../init";
import { CategoryRouter } from "./category";
import { postRouter } from "./post";
import { PostCategoryRouter } from "./post-categories";

export const appRouter = createTRPCRouter({
    post: postRouter,
    category: CategoryRouter,
    postCategories: PostCategoryRouter,
})

export type AppRouter = typeof appRouter;