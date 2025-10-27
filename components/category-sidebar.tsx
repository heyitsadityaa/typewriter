"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react";

interface Category {
    id: number
    title: string
    description: string;
    slug: string
}

interface CategorySidebarProps {
    categories: Category[]
    activeCategory?: number
    onCategoryChange?: (categoryId: number | null) => void
}

export function CategorySidebar({ categories, activeCategory, onCategoryChange }: CategorySidebarProps) {
    return (
        <aside className="w-full space-y-4 md:w-48">
            <div>
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider">Categories</h3>
                <div className="mt-4 space-y-2">
                    <Button
                        variant={!activeCategory ? "default" : "ghost"}
                        className="w-full justify-start font-mono text-sm"
                        onClick={() => onCategoryChange?.(null)}
                    >
                        All Posts
                    </Button>
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            variant={activeCategory === category.id ? "default" : "ghost"}
                            className="w-full justify-start font-mono text-sm"
                            onClick={() => onCategoryChange?.(category.id)}
                        >
                            {category.title}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="border-t border-border pt-4">
                <h3 className="font-mono text-sm font-bold uppercase tracking-wider">Quick Links</h3>
                <div className="mt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start font-mono text-sm" asChild>
                        <a href="/categories/create"><PlusCircle /> Create Category</a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start font-mono text-sm" asChild>
                        <a href="/categories">Manage Categories</a>
                    </Button>
                </div>
            </div>
        </aside>
    )
}
