"use client"

import CategoryForm from '@/components/category-form'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { useParams } from 'next/navigation'
import React from 'react'

const UpdateContent = () => {
    const params = useParams();
    const id = params.id ? Number(params.id) : undefined;

    return (
        <LayoutWrapper>
            <CategoryForm mode='update' categoryId={id} />
        </LayoutWrapper>
    )
}

export default UpdateContent
