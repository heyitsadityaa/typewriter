import { baseProcedure, createTRPCRouter } from '../init';

import { z } from 'zod';
import { eq } from 'drizzle-orm';

import { TRPCError } from '@trpc/server';
import { categories } from '@/db/schema';

export const CategoryRouter = createTRPCRouter({
    getall: baseProcedure.query(async ({ ctx }) => {
        try {
            const result = await ctx.db.select().from(categories)
            return result;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to fetch all posts',
                cause: error as Error,
            });
        }
    }),
    getCategoryById: baseProcedure
        .input(z.object({ id: z.int() }))
        .query(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.query.categories.findFirst({ where: eq(categories.id, input.id) })

                if (!result) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No category found',
                    })
                }

                return result;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to fetch category',
                    cause: error as Error,
                });
            }
        }),

    createCategory: baseProcedure
        .input(
            z.object({
                title: z.string().min(2).max(50),
                slug: z.string().min(2).max(50),
                description: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const result = await ctx.db.insert(categories).values({
                    title: input.title,
                    slug: input.slug,
                    description: input.description
                }).returning();

                return result;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to create category',
                    cause: error as Error,
                });
            }
        }),

    updateCategoryById: baseProcedure
        .input(
            z.object({
                id: z.int(),
                title: z.string().min(2).max(50).optional(),
                slug: z.string().min(2).max(50).optional(),
                description: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const existing = await ctx.db.query.categories.findFirst({
                    where: eq(categories.id, input.id)
                })

                if (!existing) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No category found to update.'
                    })
                }

                const result = await ctx.db.update(categories).set({
                    ...(input.title && { title: input.title }),
                    ...(input.description && { description: input.description }),
                    ...(input.slug && { slug: input.slug })
                })

            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update post',
                    cause: error as Error,
                });
            }
        }),

    deleteCategoryById: baseProcedure
        .input(z.object({ id: z.int() }))
        .mutation(async ({ ctx, input }) => {
            try {
                const existing = await ctx.db.query.categories.findFirst({
                    where: eq(categories.id, input.id)
                });

                if (!existing) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No category found to delete.'
                    })
                }

                const result = await ctx.db.delete(categories).where(eq(categories.id, input.id))

                return result;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to delete post',
                    cause: error as Error,
                });
            }
        }),
})