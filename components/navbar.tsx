"use client"

import React from 'react'
import { ModeToggle } from './toggle-mode'
import Link from 'next/link'
import { Button } from './ui/button'

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur transition-all duration-300 ease-out">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="font-mono text-2xl font-bold tracking-tighter transition-all duration-300 ease-out group-hover:text-accent-foreground">
                            {"<"}
                            <span className="">TYPE</span>
                            {"/>"}
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden gap-8 md:flex">
                        <Link
                            href="/"
                            className="font-mono text-sm font-medium transition-all duration-300 ease-out hover:text-accent-foreground"
                        >
                            Home
                        </Link>
                        <Link
                            href="/post"
                            className="font-mono text-sm font-medium transition-all duration-300 ease-out hover:text-accent-foreground"
                        >
                            Blog
                        </Link>
                        <Link
                            href="/categories/manage"
                            className="font-mono text-sm font-medium transition-all duration-300 ease-out hover:text-accent-foreground"
                        >
                            Categories
                        </Link>
                        <Link
                            href="https://aditya-portfolio-five-psi.vercel.app"
                            className="font-mono text-sm font-medium transition-all duration-300 ease-out hover:text-accent-foreground"
                        >
                            About Me
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Link href="/create">
                            <Button
                                className="font-mono transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1"
                                size="sm"
                            >
                                New Post
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar
