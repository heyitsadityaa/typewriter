import { baseProcedure, createTRPCRouter } from '../init';

import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { TRPCError } from '@trpc/server';
import { postCategories, posts } from "@/db/schema"
import { db } from '@/db/drizzle';

export const postRouter = createTRPCRouter({
    getall: baseProcedure.query(async ({ ctx }) => {
        try {
            const allPosts = await ctx.db.select().from(posts);
            return allPosts;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch all posts',
                cause: error as Error,
            });
        }
    }),

    getPostById: baseProcedure
        .input(z.object({ id: z.int() }))
        .query(async ({ ctx, input }) => {
            try {
                const post = await ctx.db.query.posts.findFirst({
                    where: eq(posts.id, input.id)
                })

                if (!post) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No post found',
                    });
                }

                return post;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch post',
                    cause: error as Error,
                });
            }
        }),

    createPost: baseProcedure
        .input(
            z.object({
                title: z.string().min(2).max(50),
                content: z.string(),
                published: z.boolean().default(false),
                author: z.string().optional().default("Anonymous"),
                categoryIds: z.array(z.number())
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const [createdPost] = await ctx.db.insert(posts).values({
                    title: input.title,
                    content: input.content,
                    published: input.published,
                    author: input.author
                }).returning();

                if (input.categoryIds.length > 0) {
                    await ctx.db.insert(postCategories).values(
                        input.categoryIds.map(id => ({
                            postId: createdPost.id,
                            categoryId: id
                        }))
                    );
                }
                return createdPost;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create post',
                    cause: error as Error,
                });
            }
        }),

    updatePostById: baseProcedure
        .input(
            z.object({
                id: z.int(),
                title: z.string().optional(),
                content: z.string().optional(),
                slug: z.string().min(2),
                published: z.boolean().optional(),
                author: z.string().optional().default("Anonymous"),
                categoryIds: z.array(z.number())
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.transaction(async (tx) => {

                    const [updatedPost] = await tx
                        .update(posts)
                        .set({
                            title: input.title,
                            content: input.content,
                            published: input.published,
                            author: input.author,
                            updatedAt: new Date(),
                        })
                        .where(eq(posts.id, input.id))
                        .returning();

                    if (!updatedPost) {
                        throw new TRPCError({
                            code: "NOT_FOUND",
                            message: "Post not found",
                        });
                    }


                    if (input.categoryIds && input.categoryIds.length > 0) {

                        await tx
                            .delete(postCategories)
                            .where(eq(postCategories.postId, input.id));

                        await tx.insert(postCategories).values(
                            input.categoryIds.map((categoryId) => ({
                                postId: input.id,
                                categoryId,
                            }))
                        );
                    }

                    return updatedPost;
                });

                return result;
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to update post",
                    cause: error as Error,
                });
            }
        }),

    deletePostById: baseProcedure
        .input(z.object({ id: z.int() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const existing = await ctx.db.query.posts.findFirst({
                    where: eq(posts.id, input.id)
                })

                if (!existing) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No post found to delete.'
                    })
                }

                const result = await ctx.db
                    .delete(posts)
                    .where(eq(posts.id, input.id)).returning()
                return result[0]

            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to delete post',
                    cause: error as Error,
                });
            }
        }),
});