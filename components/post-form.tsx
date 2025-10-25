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
import { useSuspenseQuery } from '@tanstack/react-query'
import Link from 'next/link'

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

    // Fetch post data if in update mode
    const postQuery = mode === "update" && postId !== undefined
        ? useSuspenseQuery(trpc.post.getPostById.queryOptions({ id: postId }))
        : null;

    const defaultValues: PostValues = mode === "update" && postQuery?.data
        ? {
            title: postQuery.data.title ?? "",
            content: postQuery.data.content ?? "",
            author: postQuery.data.author ?? "",
            categories: [], // You may want to fetch categories as well
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
        onSubmit: ({ value }) => { }
    })
    return (
        <div>
            <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}>
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
                                placeholder="Enter post title"
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

                <form.Field name="categories" validators={{
                    onChange: ({ value }) => {
                        return value
                            .length > 0 ? "*Category is required" : undefined
                    }
                }}>
                    {(field) => (
                        <div>
                            <Label htmlFor="categories">Category</Label>
                            {/* <Input
                                placeholder="Enter post title"
                                className="mt-2 font-mono"
                                type="text"
                                id="title"
                                name="title"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            /> */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className='rounded-md text-sm font-bold text-primary cursor-pointer'>*Select category</DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Billing</DropdownMenuItem>
                                    <DropdownMenuItem>Team</DropdownMenuItem>
                                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {field.state.meta.errors.length > 0 && (
                                <em className='text-red-500'>{field.state.meta.errors.join(", ")}</em>
                            )}
                        </div>
                    )}
                </form.Field>

                <form.Field name="content" validators={{
                    onChange: ({ value }) => {
                        return value
                            .trim() === "" ? "*Content is required" : undefined
                    }
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
                                placeholder="Enter Author Name OR Anonyms"
                                className="mt-2 font-mono"
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
            </form>

            <div className="flex gap-4 mt-5">
                <Button variant="default">{mode === 'create' ? 'Publish' : 'Update'}</Button>
                <Button variant="secondary">Save as Draft</Button>
                <Button variant="secondary"><Link href='/post'>Cancel</Link></Button>
            </div>
        </div>
    )
}

export default PostForm
