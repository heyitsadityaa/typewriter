"use client"

import React, { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Spinner } from './ui/spinner'
import { useDraftStore } from '@/store'

interface PostValues {
    title: string
    content: string
    author?: string
    categories: Array<number>
    published: boolean
}

interface PostFormProps {
    mode: "create" | "update";
    postId?: number;
}

const PostForm: React.FC<PostFormProps> = ({ mode, postId }) => {
    const trpc = useTRPC();
    const router = useRouter()
    // Fetch post data if in update mode
    const postQuery = mode === "update" && postId !== undefined ? useSuspenseQuery(trpc.post.getPostById.queryOptions({ id: postId })) : null;

    const categoriesQuery = useSuspenseQuery(trpc.category.getall.queryOptions());

    const categories = categoriesQuery?.data ?? [];

    const eachPostCategory = mode === "update" && postId !== undefined ? useSuspenseQuery(trpc.postCategories.eachPostCategory.queryOptions({ id: postId })) : null;

    const createPost = mode === 'create' ? useMutation(trpc.post.createPost.mutationOptions({
        onError: () => {
            console.log("An error occurred while creating the post.");
        },
        onSuccess: () => {
            console.log("Created post successfully.");
        },
    })) : null;

    const updatePost = mode === 'update' ? useMutation(trpc.post.updatePostById.mutationOptions({
        onError: () => {
            console.log("An error occurred while updating the post.");
        },
        onSuccess: () => {
            console.log("Updated post successfully.");
        },
    })) : null;

    const categoryIds =
        mode === "update" && eachPostCategory?.data
            ? eachPostCategory.data.map((cat) => cat.categoryId)
            : [];

    const defaultValues: PostValues = mode === "update" && postQuery?.data
        ? {
            title: postQuery.data.title ?? "",
            content: postQuery.data.content ?? "",
            author: postQuery.data.author ?? "",
            categories: categoryIds,
            published: !!postQuery.data.published,
        }
        : {
            title: "",
            content: "",
            author: "",
            categories: [],
            published: false,
        };

    const saveDraft = useDraftStore((s) => s.saveDraft)
    const [showDraftNote, setShowDraftNote] = useState(false)

    // key strategy: "draft:new" for new posts, "draft:<id>" for existing
    const draftKey = mode === "create" ? "draft:new" : `draft:${postId}`

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            console.log("onSubmit values:", value);
            let toastId: string | number | undefined;
            if (mode === 'create') {
                if (createPost) {
                    try {
                        toastId = toast(
                            <span className="flex items-center gap-2">
                                <Spinner />
                                Publishing post...
                            </span>
                        );
                        await createPost.mutateAsync({
                            title: value.title,
                            content: value.content,
                            author: value.author?.trim() ? value.author : "Anonymous",
                            published: value.published = true,
                            categoryIds: value.categories,
                        });
                        toast.success("Post created successfully!", { id: toastId, closeButton: true });
                        router.push("/post");
                    } catch (error) {
                        toast.error("Failed to create post.", { id: toastId, closeButton: true });
                        console.log(error);
                    }

                }
            } else if (mode === 'update' && postId && updatePost) {
                if (updatePost) {
                    try {
                        toastId = toast(
                            <span className="flex items-center gap-2">
                                <Spinner />
                                Updating post...
                            </span>
                        );
                        await updatePost.mutateAsync({
                            id: postId,
                            title: value.title,
                            content: value.content,
                            author: value.author,
                            published: value.published = true,
                            categoryIds: value.categories,
                        });
                        toast.success("Post updated successfully!", { closeButton: true });
                        router.push("/post")
                    } catch (error) {
                        toast.error("Failed to update post.", { id: toastId, closeButton: true });
                        console.log(error);
                    }
                }
            }
        }
    })
    return (
        <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-6">
            <form
                className="space-y-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.Field name="title" validators={{
                    onChange: ({ value }) => value.trim() === "" ? "*Title is required" : undefined
                }}>
                    {(field) => (
                        <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                placeholder="Enter post title"
                                className="mt-2 font-mono w-full"
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

                <form.Field name="categories">
                    {(field) => (
                        <div>
                            <Label>Categories</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {categories.map(category => (
                                    <label key={category.id} className="flex items-center gap-1">
                                        <input
                                            type='checkbox'
                                            name="categories"
                                            checked={Array.isArray(field.state.value) && field.state.value.includes(category.id)}
                                            onChange={e => {
                                                const target = e.target as HTMLInputElement;
                                                if (target.checked) {
                                                    field.handleChange([...(field.state.value || []), category.id]);
                                                } else {
                                                    field.handleChange((field.state.value || []).filter((id: number) => id !== category.id));
                                                }
                                            }}
                                        />
                                        {category.title}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </form.Field>

                <form.Field name="content" validators={{
                    onChange: ({ value }) => value.trim() === "" ? "*Content is required" : undefined
                }}>
                    {(field) => (
                        <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                placeholder="Enter post content"
                                className="mt-2 font-mono w-full"
                                rows={10}
                                id="content"
                                name="content"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <em className='text-red-500'>{field.state.meta.errors.join(", ")}</em>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field name="author">
                    {(field) => (
                        <div>
                            <Label htmlFor="author">Author (Optional)</Label>
                            <Input
                                placeholder="Enter Author Name OR Anonymous"
                                className="mt-2 font-mono w-full"
                                type="text"
                                id="author"
                                name="author"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                            {field.state.meta.errors.length > 0 && (
                                <em>{field.state.meta.errors.join(", ")}</em>
                            )}
                        </div>
                    )}
                </form.Field>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-5">
                    <Button className="w-full sm:w-auto" variant="default" type="submit">
                        {mode === "create" ? "Publish" : "Update"}
                    </Button>

                    <Button
                        onClick={() => {
                            const values: PostValues = {
                                title: form.state.values.title ?? "",
                                content: form.state.values.content ?? "",
                                author: form.state.values.author ?? "",
                                categories: form.state.values.categories ?? [],
                                published: false,
                            };
                            saveDraft(draftKey, values);
                            setShowDraftNote(true);
                            setTimeout(() => {
                                setShowDraftNote(false);
                                router.push("/post");
                            }, 900);
                        }}
                        className="w-full sm:w-auto"
                        variant="secondary"
                        type="button"
                    >
                        Save as Draft
                    </Button>

                    <Button className="w-full sm:w-auto" variant="secondary" type="button">
                        <Link href="/post">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default PostForm
