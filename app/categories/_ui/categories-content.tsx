"use client"

import CategoryForm from '@/components/category-form'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Edit2, Pencil, PlusCircle, Trash, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

const CategoriesContent = () => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()
    const categoriesQuery = useSuspenseQuery(trpc.category.getall.queryOptions());

    const categories = categoriesQuery.data ?? [];

    const deleteCategory = useMutation(trpc.category.deleteCategoryById.mutationOptions({
        onError: () => {
            toast("Failed to delete category.", {
                closeButton: true,
                description: "An error occurred while deleting the category."
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.category.getall.queryKey() })
        }
    }))

    return (
        <LayoutWrapper>
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="font-mono text-4xl font-bold tracking-tighter">Existing Categories</h1>
                        <p className="mt-2 font-mono text-muted-foreground">Create and organize your post categories.</p>
                    </div>
                    <Button asChild>
                        <Link href="/categories/create" className="flex items-center gap-2">
                            <span>Create Category</span>
                            <PlusCircle />
                        </Link>
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Categories List */}
                    <div className="space-y-4">
                        {categories.length > 0 ? (
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-card p-4 gap-2"
                                    >
                                        <div className="font-mono text-base">{category.title}</div>
                                        <div className="flex flex-row gap-2 justify-end">
                                            <Link href={`/categories/update/${category.id}`} passHref>
                                                <Button
                                                    type="button"
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded bg-muted px-2 py-1 text-sm transition-all duration-200 ease-out hover:bg-accent hover:text-accent-foreground text-accent-foreground"
                                                    title="Edit"
                                                >
                                                    <Pencil />
                                                </Button>
                                            </Link>
                                            <Button
                                                type="button"
                                                aria-label="Delete category"
                                                title="Delete"
                                                onClick={async () => {
                                                    let toastId: string | number | undefined;
                                                    if (confirm("Delete this category? This action cannot be undone.")) {
                                                        try {
                                                            toastId = toast(
                                                                <span className="flex items-center gap-2">
                                                                    <Spinner /> Deleting category...
                                                                </span>
                                                            );
                                                            await deleteCategory.mutateAsync({ id: category.id });
                                                            toast.success("Category deleted", { id: toastId });


                                                        } catch (err) {
                                                            toast.error("Failed to delete category");
                                                            console.error(err);
                                                        }
                                                    }
                                                }}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded bg-muted/80 px-2 py-1 text-sm text-destructive transition-all duration-200 ease-out hover:bg-destructive/10"
                                            >
                                                <Trash className="text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center">
                                <p className="font-mono text-muted-foreground">No categories yet. Create one to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    )
}

export default CategoriesContent
