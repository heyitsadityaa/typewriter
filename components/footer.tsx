import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="font-mono text-2xl font-bold tracking-tighter transition-all duration-300 ease-out group-hover:text-accent-foreground">
                                {"<"}
                                <span className="">TYPE</span>
                                {"/>"}
                            </div>
                        </Link>
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

                    <div>
                        <h4 className="font-mono text-sm font-bold uppercase tracking-wider">About Me</h4>
                        <ul className="mt-4 space-y-2 font-mono text-sm">
                            <li>
                                <a href="https://github.com/heyitsadityaa" className="hover:text-accent">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://aditya-portfolio-five-psi.vercel.app" className="hover:text-accent">
                                    Portfolio
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/aditya-prakash-06199427b" className="hover:text-accent">
                                    LinkedIn
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
                    <p>&copy; 2025 Typewriter Blog. All rights reserved. (Not Really)</p>
                </div>
            </div>
        </footer>
    )
}
