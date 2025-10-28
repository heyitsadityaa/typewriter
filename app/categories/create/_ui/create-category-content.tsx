"use client"

import CategoryForm from '@/components/category-form'
import { LayoutWrapper } from '@/components/layout-wrapper'
import React from 'react'

const CreateCategoryContent = () => {
    return (
        <LayoutWrapper>
            <CategoryForm mode='create' />
        </LayoutWrapper>
    )
}

export default CreateCategoryContent
