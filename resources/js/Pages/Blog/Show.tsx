import { Head, Link, usePage } from "@inertiajs/react";
import { BlogPost, PageProps, Category } from "@/types";
import BlogLayout from "@/Layouts/BlogLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Share2 } from "lucide-react";

interface BlogShowProps extends PageProps {
    slug: string;
    post?: BlogPost;
    sidebarData?: {
        categories?: Category[];
        recentPosts?: BlogPost[];
        popularTags?: string[];
    };
}

export default function BlogShow() {
    const { props } = usePage<BlogShowProps>();
    const { post, slug, blog_base_path, sidebarData, appName } = props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (!post) {
        return (
            <BlogLayout sidebarData={sidebarData}>
                <Head title={`Post Not Found - ${appName} Blog`} />
                <div className="py-12">
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <svg
                                className="mx-auto h-16 w-16 text-slate-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <h1 className="mt-4 text-2xl font-bold text-slate-100">
                                Post Not Found
                            </h1>
                            <p className="mt-2 text-slate-400">
                                The blog post you are looking for does not exist
                                or has been removed.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={`/${blog_base_path}`}
                                    className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors duration-200 font-medium shadow-lg shadow-teal-500/20"
                                >
                                    <ArrowLeft className="mr-2 w-4 h-4" />
                                    Back to Blog
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </BlogLayout>
        );
    }

    return (
        <BlogLayout sidebarData={sidebarData}>
            <Head title={`${post.title} - ${appName} Blog`}>
                {post.meta_description && (
                    <meta name="description" content={post.meta_description} />
                )}
                {post.keyword_seed && (
                    <meta name="keywords" content={post.keyword_seed} />
                )}
            </Head>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="max-w-4xl mx-auto"
            >
                {/* Back Button */}
                <Link
                    href={`/${blog_base_path}`}
                    className="inline-flex items-center text-slate-400 hover:text-white mb-6 pl-0 hover:pl-2 transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="font-medium">Back to Stories</span>
                </Link>

                {/* Article */}
                <article>
                    {/* Header */}
                    <header className="mb-10 text-center">
                        {/* Tags */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            {post.tags && post.tags.length > 0 ? (
                                post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : post.categories && post.categories.length > 0 ? (
                                post.categories.map((category) => (
                                    <span
                                        key={category.id}
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 uppercase tracking-wider"
                                    >
                                        {category.name}
                                    </span>
                                ))
                            ) : null}
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta */}
                        <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span>{post.user?.name || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {formatDate(post.published_at || post.created_at)}
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {(post.thumbnail_url || post.featured_image_path) && (
                        <div className="relative aspect-[21/9] mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-teal-500/10">
                            <img
                                src={
                                    post.thumbnail_url ||
                                    `/storage/${post.featured_image_path}`
                                }
                                alt={post.thumbnail_alt_text || post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Excerpt */}
                    {post.excerpt && (
                        <div className="mb-8 p-6 bg-slate-900/50 rounded-lg border-l-4 border-teal-500 backdrop-blur-sm">
                            <p className="text-lg text-slate-300 italic leading-relaxed">
                                {post.excerpt}
                            </p>
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-slate-300 prose-a:text-teal-400 prose-blockquote:border-teal-500 prose-blockquote:bg-slate-900/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: post.content,
                            }}
                        />
                    </div>

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 italic">
                            Enjoyed this read? Share it with your network.
                        </p>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Link copied to clipboard!");
                            }}
                            className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Article
                        </button>
                    </div>
                </article>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-800 backdrop-blur-sm">
                        <h3 className="text-lg font-semibold text-slate-100 mb-4">
                            Enjoyed this article?
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Check out more insights and updates on our blog.
                        </p>
                        <Link
                            href={`/${blog_base_path}`}
                            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors duration-200 font-medium shadow-lg shadow-teal-500/20"
                        >
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Back to All Posts
                        </Link>
                    </div>
                </div>
            </motion.div>
        </BlogLayout>
    );
}
