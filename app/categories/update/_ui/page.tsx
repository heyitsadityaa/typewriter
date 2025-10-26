"use client"

import CategoryForm from '@/components/category-form'
import { LayoutWrapper } from '@/components/layout-wrapper'
import React from 'react'

const UpdateContent = ({ id }: { id: number }) => {
    return (
        <LayoutWrapper>
            <CategoryForm mode='update' categoryId={id} />
        </LayoutWrapper>
    )
}

export default UpdateContent
