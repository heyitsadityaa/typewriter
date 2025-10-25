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
                const [category] = await ctx.db
                    .insert(categories)
                    .values(input)
                    .returning();
                return category;
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
                });

                if (!existing) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'No category found to update.'
                    });
                }

                const [updatedCategory] = await ctx.db
                    .update(categories)
                    .set({
                        ...(input.title !== undefined && { title: input.title }),
                        ...(input.slug !== undefined && { slug: input.slug }),
                        ...(input.description !== undefined && { description: input.description })
                    })
                    .where(eq(categories.id, input.id))
                    .returning();

                return updatedCategory;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update category',
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
                    });
                }

                const [deletedCategory] = await ctx.db
                    .delete(categories)
                    .where(eq(categories.id, input.id))
                    .returning();

                return deletedCategory;
            } catch (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to delete category',
                    cause: error as Error,
                });
            }
        }),

})