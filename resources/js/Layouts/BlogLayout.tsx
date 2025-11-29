import { PropsWithChildren } from "react";
import BlogNavigation from "@/Components/Blog/BlogNavigation";
import BlogSidebar from "@/Components/Blog/BlogSidebar";
import { Category, BlogPost } from "@/types";
import { usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

interface BlogLayoutProps extends PropsWithChildren {
    sidebarData?: {
        categories?: Category[];
        recentPosts?: BlogPost[];
        popularTags?: string[];
    };
    showSidebar?: boolean;
}

export default function BlogLayout({
    children,
    sidebarData = {},
    showSidebar = true,
}: BlogLayoutProps) {
    const { appName } = usePage<PageProps>().props;
    return (
        <div className="nebula-blog min-h-screen bg-slate-950 text-slate-200 selection:bg-teal-500/30 selection:text-teal-200">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-900/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-cyan-900/10 rounded-full blur-[128px]" />
            </div>

            <BlogNavigation />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div
                    className={`flex gap-12 ${
                        showSidebar ? "lg:flex-row" : ""
                    } flex-col`}
                >
                    {/* Main Content */}
                    <main
                        className={`flex-1 ${
                            showSidebar ? "lg:max-w-none" : "max-w-4xl mx-auto"
                        }`}
                    >
                        {children}
                    </main>

                    {/* Sidebar - Now on the right */}
                    {showSidebar && (
                        <div className="lg:block">
                            <div className="sticky top-20">
                                <BlogSidebar
                                    categories={sidebarData.categories}
                                    recentPosts={sidebarData.recentPosts}
                                    popularTags={sidebarData.popularTags}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-800 py-12 mt-12 bg-slate-950 relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        &copy; 2025 {appName}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
