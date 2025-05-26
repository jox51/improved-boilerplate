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
        <div className="min-h-screen bg-slate-50">
            <BlogNavigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <footer className="bg-white border-t border-slate-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center text-slate-600">
                        <p>&copy; 2025 {appName}. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
