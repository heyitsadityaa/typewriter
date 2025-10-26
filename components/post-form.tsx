"use client"

import React from 'react'
import { useForm } from '@tanstack/react-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { toast } from 'sonner'
import { redirect, useRouter } from 'next/navigation'
import { Spinner } from './ui/spinner'

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
    const queryClient = useQueryClient()
    const router = useRouter()
    // Fetch post data if in update mode
    const postQuery = mode === "update" && postId !== undefined
        ? useSuspenseQuery(trpc.post.getPostById.queryOptions({ id: postId }))
        : null;

    const createPost = mode === 'create' ? useMutation(trpc.post.createPost.mutationOptions({
        onError: () => {
            toast("Failed to create post.", {
                closeButton: true,
                description: "An error occurred while creating the post."
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.post.getPostById.queryKey({ id: postId }) })
        },
    })) : null;

    const updatePost = mode === 'update' ? useMutation(trpc.post.updatePostById.mutationOptions({
        onError: () => {
            toast("Failed to updating post.", {
                closeButton: true,
                description: "An error occurred while updating the post."
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.post.getPostById.queryKey({ id: postId }) })
        },
    })) : null;

    const defaultValues: PostValues = mode === "update" && postQuery?.data
        ? {
            title: postQuery.data.title ?? "",
            content: postQuery.data.content ?? "",
            author: postQuery.data.author ?? "",
            categories: [],
            published: !!postQuery.data.published,
        }
        : {
            title: "",
            content: "",
            author: "",
            categories: [],
            published: false,
        };

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
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
                            author: value.author,
                            published: value.published = true,
                            categoryIds: value.categories = [1],
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
                            categoryIds: value.categories = [1],
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
                    <Button className="w-full sm:w-auto" variant="secondary" type="button">
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
