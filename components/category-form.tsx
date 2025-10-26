import React from 'react'
import { useForm } from '@tanstack/react-form'
import { useTRPC } from '@/trpc/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { toast } from 'sonner'

interface CategoryValues {
    title: string
    description: string
    slug: string
}

interface CategoryFormProps {
    mode: "create" | "update";
    categoryId?: number;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ mode, categoryId }) => {
    const trpc = useTRPC();

    // Fetch post data if in update mode
    const categoryQuery = mode === "update" && categoryId !== undefined
        ? useSuspenseQuery(trpc.category.getCategoryById.queryOptions({ id: categoryId }))
        : null;

    const createCategory = mode === 'create' ? useMutation(trpc.category.createCategory.mutationOptions({
        onError: () => {
            toast("Failed to create category.", {
                closeButton: true,
                description: "An error occurred while creating the category."
            })
        },
        onSuccess: () => { },
    })) : null;

    const updateCategory = mode === 'update' ? useMutation(trpc.category.updateCategoryById.mutationOptions({
        onError: () => {
            toast("Failed to update post.", {
                closeButton: true,
                description: "An error occurred while updating the category."
            })
        },
        onSuccess: () => { },
    })) : null;

    const deleteCategory = useMutation(trpc.category.deleteCategoryById.mutationOptions({
        onError: () => {
            toast("Failed to delete category.", {
                closeButton: true,
                description: "An error occurred while deleting the category."
            })
        },
        onSuccess: () => { },
    }))

    const defaultValues: CategoryValues = mode === "update" && categoryQuery?.data
        ? {
            title: categoryQuery.data.title ?? "",
            description: categoryQuery.data.description ?? "",
            slug: categoryQuery.data.slug ?? "",
        }
        : {
            title: "",
            description: "",
            slug: "",
        };

    const form = useForm({
        defaultValues,
        onSubmit: ({ value }) => { }
    })
    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}>
                {/* title */}
                <form.Field name="title" validators={{
                    onChange: ({ value }) => {
                        return value
                            .trim() === "" ? "*Title is required" : undefined
                    }
                }}>
                    {(field) => (
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                placeholder="Enter Category Title"
                                className="mt-2 font-mono"
                                type="text"
                                id="title"
                                name="title"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <em className='text-red-500'>{field.state.meta.errors.join(", ")}</em>
                            )}
                        </div>
                    )}
                </form.Field>

                {/* description */}
                {/* slug */}

            </form>

        </div>
    )
}

export default CategoryForm
