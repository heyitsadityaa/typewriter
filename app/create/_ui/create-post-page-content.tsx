"use client"

import { LayoutWrapper } from '@/components/layout-wrapper'
import PostForm from '@/components/post-form'

const CreatePostPageContent = () => {

    return (
        <LayoutWrapper>
            <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
                <h1 className="font-mono text-4xl font-bold tracking-tighter">Create New Post</h1>
                <p className="mt-2 font-mono text-muted-foreground">Write and publish your thoughts.</p>

                <div className="mt-8 rounded-lg border border-border bg-card p-8 animate-slide-up">
                    <PostForm mode='create' />
                </div>
            </div>
        </LayoutWrapper>
    )
}

export default CreatePostPageContent
