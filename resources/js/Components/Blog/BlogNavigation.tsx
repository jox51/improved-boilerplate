import { Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import Logo from "../../../images/logo.png";

export default function BlogNavigation() {
    const { blog_base_path, appName } = usePage<PageProps>().props;
    return (
        <nav className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo/Brand */}
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 group cursor-pointer"
                    >
                        <img
                            src={Logo}
                            alt={appName}
                            className="h-10 w-10 rounded-lg group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-xl font-serif font-bold tracking-tight text-white group-hover:text-teal-400 transition-colors">
                            {appName}
                        </span>
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link
                        href={`/${blog_base_path}`}
                        className="text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        All Posts
                    </Link>
                    <Link
                        href="/"
                        className="text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/contact-us"
                        className="text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        Contact
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                        type="button"
                        className="text-slate-400 hover:text-white focus:outline-none focus:text-white"
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
        </nav>
    );
}
