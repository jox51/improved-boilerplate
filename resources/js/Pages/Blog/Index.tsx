import { Head, Link, usePage } from "@inertiajs/react";
import { BlogPost, PaginatedResponse, PageProps, Category } from "@/types";
import BlogLayout from "@/Layouts/BlogLayout";
import EnhancedPagination from "@/Components/EnhancedPagination";
import { motion } from "framer-motion";
import { Clock, Calendar } from "lucide-react";

interface BlogIndexProps extends PageProps {
    posts: PaginatedResponse<BlogPost>;
    sidebarData?: {
        categories?: Category[];
        recentPosts?: BlogPost[];
        popularTags?: string[];
    };
    bannerImageUrl?: string;
}

export default function BlogIndex() {
    const { props } = usePage<BlogIndexProps>();
    const { posts: postsData, blog_base_path, sidebarData, appName, bannerImageUrl } = props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <BlogLayout sidebarData={sidebarData}>
            <Head title="Blog" />

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center max-w-2xl mx-auto"
            >
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Explore the Unknown
                </h1>
                <p className="text-slate-400 text-lg">
                    Curated insights on technology, design, and the future.
                    Powered by human creativity and innovation.
                </p>
            </motion.div>

            {/* Main Content */}
            <div className="py-6">
                {postsData.data.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <svg
                                className="mx-auto h-12 w-12 text-slate-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-slate-100">
                                No posts yet
                            </h3>
                            <p className="mt-2 text-slate-500">
                                We're working on some great content. Check back
                                soon!
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Posts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                            {postsData.data.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5 }}
                                    className="group relative flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors duration-300 cursor-pointer backdrop-blur-sm"
                                >
                                    {/* Featured Image */}
                                    {(post.thumbnail_url || post.featured_image_path) && (
                                        <div className="aspect-video w-full overflow-hidden relative">
                                            <img
                                                src={
                                                    post.thumbnail_url ||
                                                    `/storage/${post.featured_image_path}`
                                                }
                                                alt={post.thumbnail_alt_text || post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60" />
                                        </div>
                                    )}

                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Tags and Read Time */}
                                        <div className="flex items-center gap-3 text-xs text-teal-400 font-medium mb-3">
                                            {post.tags && post.tags.length > 0 && (
                                                <span className="bg-teal-500/10 px-2 py-1 rounded-full border border-teal-500/20">
                                                    {post.tags[0]}
                                                </span>
                                            )}
                                            {post.categories && post.categories.length > 0 && !post.tags?.length && (
                                                <span className="bg-teal-500/10 px-2 py-1 rounded-full border border-teal-500/20">
                                                    {post.categories[0].name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <Link href={`/${blog_base_path}/${post.slug}`}>
                                            <h3 className="text-xl font-bold text-slate-100 mb-2 font-serif leading-tight group-hover:text-teal-400 transition-colors">
                                                {post.title}
                                            </h3>
                                        </Link>

                                        {/* Excerpt */}
                                        {post.excerpt && (
                                            <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        {/* Author and Date */}
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                    {post.user?.name?.charAt(0) || "A"}
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {post.user?.name || "Anonymous"}
                                                </span>
                                            </div>
                                            <span className="text-xs text-slate-500">
                                                {formatDate(post.published_at || post.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>

                        {/* Enhanced Pagination */}
                        <div className="mt-12">
                            <EnhancedPagination
                                currentPage={postsData.current_page}
                                lastPage={postsData.last_page}
                                total={postsData.total}
                                links={postsData.links}
                                prevPageUrl={postsData.prev_page_url}
                                nextPageUrl={postsData.next_page_url}
                                className="justify-center"
                            />
                        </div>
                    </>
                )}
            </div>
        </BlogLayout>
    );
}
