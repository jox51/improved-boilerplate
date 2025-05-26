import React, { useEffect, useRef } from "react";
import { PageProps } from "@/types";
import { initNavbarScrollBehavior } from "@/utils/landingPageUtils";
import { usePage, Link } from "@inertiajs/react";
import Logo from "../../../images/logo.png";

interface NavigationBarProps {
    auth?: PageProps["auth"];
    className?: string;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
    className = "",
    auth,
}) => {
    const navRef = useRef<HTMLElement>(null);
    const { blog_base_path } = usePage<PageProps>().props;

    useEffect(() => {
        initNavbarScrollBehavior(navRef.current);
    }, []);

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 transition-transform duration-300 ${className}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    >
                        <div className="flex items-center">
                            <img
                                src={Logo}
                                alt="Arbscreener"
                                className="w-16 h-16 object-contain"
                            />
                            <i className="fas fa-chart-line mr-2"></i>
                            Arbscreener
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/#features"
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            Features
                        </Link>
                        <a
                            href="/#how-it-works"
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            How It Works
                        </a>
                        <a
                            href="/#pricing"
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            Pricing
                        </a>
                        <a
                            href="/#testimonials"
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            Reviews
                        </a>
                        <Link
                            href={`/${blog_base_path}`}
                            className="text-gray-300 hover:text-blue-400 transition-colors"
                        >
                            Blog
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {auth?.user ? (
                            // Logged in user display
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {auth.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-300 font-medium">
                                        Welcome, {auth.user.name}
                                    </span>
                                </div>
                                <a
                                    href="/dashboard"
                                    className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                                >
                                    Dashboard
                                </a>
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            // Guest user display
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-300 hover:text-white transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
