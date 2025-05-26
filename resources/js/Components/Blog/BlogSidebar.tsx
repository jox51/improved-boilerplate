import { Link, usePage } from "@inertiajs/react";
import { Category, BlogPost, PageProps } from "@/types";
import SocialLinks from "@/Components/SocialLinks";

interface BlogSidebarProps {
    categories?: Category[];
    recentPosts?: BlogPost[];
    popularTags?: string[];
}

export default function BlogSidebar({ categories = [], recentPosts = [], popularTags = [] }: BlogSidebarProps) {
    const { blog_base_path, socialLinks } = usePage<PageProps>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <aside className="w-full lg:w-80 space-y-8">
            {/* Categories Section */}
            {categories.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Categories
                    </h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/${blog_base_path}/category/${category.slug}`}
                                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                            >
                                <span className="text-slate-700 group-hover:text-slate-900 font-medium">
                                    {category.name}
                                </span>
                                {category.posts_count !== undefined && (
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                        {category.posts_count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Posts Section */}
            {recentPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recent Posts
                    </h3>
                    <div className="space-y-4">
                        {recentPosts.map((post) => (
                            <article key={post.id} className="group">
                                <Link
                                    href={`/${blog_base_path}/${post.slug}`}
                                    className="block"
                                >
                                    <h4 className="text-sm font-medium text-slate-900 group-hover:text-slate-600 transition-colors line-clamp-2 mb-2">
                                        {post.title}
                                    </h4>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <time dateTime={post.published_at || post.created_at}>
                                            {formatDate(post.published_at || post.created_at)}
                                        </time>
                                        {post.user?.name && (
                                            <>
                                                <span className="mx-1">•</span>
                                                <span>{post.user.name}</span>
                                            </>
                                        )}
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Tags Section */}
            {popularTags.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Social Links Section */}
            <SocialLinks socialLinks={socialLinks} />

            {/* Quick Links Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Quick Links
                </h3>
                <div className="space-y-2">
                    <Link
                        href="/"
                        className="block p-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        🏠 Home
                    </Link>
                    <Link
                        href="/contact-us"
                        className="block p-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        📧 Contact Us
                    </Link>
                    <Link
                        href="/privacy-policy"
                        className="block p-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        🔒 Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="block p-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        📋 Terms of Service
                    </Link>
                </div>
            </div>
        </aside>
    );
}