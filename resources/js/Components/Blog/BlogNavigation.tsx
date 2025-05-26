import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function BlogNavigation() {
    const { blog_base_path, appName } = usePage<PageProps>().props;
    return (
        <nav className="bg-white shadow-sm border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-slate-900 hover:text-slate-600 transition-colors"
                        >
                            {appName}
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href={`/${blog_base_path}`}
                            className="text-slate-700 hover:text-slate-600 font-medium transition-colors"
                        >
                            All Posts
                        </Link>
                        <Link
                            href="/"
                            className="text-slate-700 hover:text-slate-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/contact-us"
                            className="text-slate-700 hover:text-slate-600 font-medium transition-colors"
                        >
                            Contact
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-slate-700 hover:text-slate-600 focus:outline-none focus:text-slate-600"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
