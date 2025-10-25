export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="font-mono text-lg font-bold">
                            {"<"}
                            <span className="text-accent">TYPE</span>
                            {"/>"}
                        </div>
                        <p className="mt-2 font-mono text-sm text-muted-foreground">
                            A minimalistic typewriter-inspired blog platform.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-mono text-sm font-bold uppercase tracking-wider">Navigation</h4>
                        <ul className="mt-4 space-y-2 font-mono text-sm">
                            <li>
                                <a href="/" className="hover:text-accent">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="hover:text-accent">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="hover:text-accent">
                                    About
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="font-mono text-sm font-bold uppercase tracking-wider">Info</h4>
                        <p className="mt-4 font-mono text-sm text-muted-foreground">
                            Built with Next.js, Tailwind CSS, and tw-animate-css.
                        </p>
                    </div>
                </div>

                <div className="mt-8 border-t border-border pt-8 text-center font-mono text-sm text-muted-foreground">
                    <p>&copy; 2025 Typewriter Blog. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
