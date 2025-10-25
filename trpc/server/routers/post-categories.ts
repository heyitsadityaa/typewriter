import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { postCategories, posts } from '@/db/schema'

export const PostCategoryRouter = createTRPCRouter({
    filterByCategory: baseProcedure.input(z.object({ id: z.int() })).query(async ({ ctx, input }) => {
        try {
            const result = await ctx.db
                .select({
                    postId: posts.id,
                    title: posts.title,
                    content: posts.content,
                    createdAt: posts.createdAt,
                })
                .from(postCategories)
                .innerJoin(posts, eq(postCategories.postId, posts.id))
                .where(eq(postCategories.categoryId, input.id));

            if (!result.length) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'No post found for this category.',
                })
            }

            return result;

        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to filter by category',
                cause: error as Error,
            });
        }
    })
})