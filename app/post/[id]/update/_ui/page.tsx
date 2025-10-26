"use client"

import { LayoutWrapper } from '@/components/layout-wrapper'
import PostForm from '@/components/post-form'
import React from 'react'

import { useParams } from 'next/navigation'

const UpdateContent = () => {
    const params = useParams();
    const id = params.id ? Number(params.id) : undefined;
    return (
        <LayoutWrapper>
            <PostForm mode='update' postId={id} />
        </LayoutWrapper>
    )
}

export default UpdateContent
