import React from 'react'
import { useForm } from '@tanstack/react-form'
import { useTRPC } from '@/trpc/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import Link from 'next/link'

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
    const router = useRouter()

    // Fetch category data if in update mode
    const categoryQuery = mode === "update" && categoryId !== undefined
        ? useSuspenseQuery(trpc.category.getCategoryById.queryOptions({ id: categoryId }))
        : null;

    const createCategory = mode === 'create' ? useMutation(trpc.category.createCategory.mutationOptions({
        onError: () => {
            console.log("An error occurred while creating the category.");
        },
        onSuccess: () => {
            console.log("Created category successfully.");
            router.push("/categories");

        },
    })) : null;

    const updateCategory = mode === 'update' ? useMutation(trpc.category.updateCategoryById.mutationOptions({
        onError: () => {
            console.log("An error occurred while updating the category.");
        },
        onSuccess: () => {
            console.log("Updated category successfully.");
            router.push("/categories");
        },
    })) : null;

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
        onSubmit: async ({ value }) => {
            if (mode === 'create') {
                if (createCategory) {
                    toast.promise(createCategory.mutateAsync({
                        title: value.title,
                        description: value.description,
                        slug: value.slug
                    }),
                        {
                            loading: <span className="flex items-center gap-2">Creating category...</span>,
                            success: "Category created successfully",
                            error: "Failed to create category",
                        }
                    )

                }
            } else if (mode === 'update' && categoryId && updateCategory) {
                if (updateCategory) {
                    toast.promise(
                        updateCategory.mutateAsync({
                            id: categoryId,
                            title: value.title,
                            description: value.description,
                            slug: value.slug
                        }), {
                        loading: <span className="flex items-center gap-2">Updating category...</span>,
                        success: "Category updated successfully",
                        error: "Failed to update category",
                    }
                    )
                }
            }
        }
    })
    return (
        <div className='w-full max-w-2xl mx-auto px-2 sm:px-4 py-6'>
            <form className="space-y-6" onSubmit={(e) => {
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
                <form.Field name="description" validators={{
                    onChange: ({ value }) => {
                        return value
                            .trim() === "" ? "*Description is required" : undefined
                    }
                }}>
                    {(field) => (
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                placeholder="Enter Category Description"
                                className="mt-2 font-mono"
                                type="text"
                                id="description"
                                name="description"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <em className='text-red-500'>{field.state.meta.errors.join(", ")}</em>
                            )}
                        </div>
                    )}
                </form.Field>

                {/* slug */}
                <form.Field name="slug" validators={{
                    onChange: ({ value }) => {
                        return value
                            .trim() === "" ? "*Slug is required" : undefined
                    }
                }}>
                    {(field) => (
                        <div>
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                placeholder="Enter Category Slug"
                                className="mt-2 font-mono"
                                type="text"
                                id="slug"
                                name="slug"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <em className='text-red-500'>{field.state.meta.errors.join(", ")}</em>
                            )}
                        </div>
                    )}
                </form.Field>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-5">
                    <Button className="w-full sm:w-auto" variant="default" type="submit">
                        {mode === "create" ? "Create Category" : "Update Category"}
                    </Button>
                    <Button className="w-full sm:w-auto" variant="secondary" type="button">
                        <Link href="/categories">
                            Cancel
                        </Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CategoryForm;
