import { Head, Link, usePage } from "@inertiajs/react";
import { BlogPost, PageProps, Category } from "@/types";
import BlogLayout from "@/Layouts/BlogLayout";
import { useEffect } from "react";

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

    useEffect(() => {
        if (post) {
            console.log("Blog post data:", post);
            console.log("Featured image URL:", post?.featured_image_path);
        }
    }, [post]);

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
                                className="mx-auto h-16 w-16 text-slate-400"
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
                            <h1 className="mt-4 text-2xl font-bold text-slate-900">
                                Post Not Found
                            </h1>
                            <p className="mt-2 text-slate-600">
                                The blog post you are looking for does not exist
                                or has been removed.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={`/${blog_base_path}`}
                                    className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium"
                                >
                                    <svg
                                        className="mr-2 w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
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

            <div className="py-8">
                {/* Back to blog link */}
                <div className="mb-8">
                    <Link
                        href={`/${blog_base_path}`}
                        className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
                    >
                        <svg
                            className="mr-2 w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Blog
                    </Link>
                </div>

                {/* Article */}
                <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
                    {/* Featured Image - prioritize Arvow thumbnail over featured_image_path */}
                    {(post.thumbnail_url || post.featured_image_path) && (
                        <div className="w-full">
                            <img
                                src={
                                    post.thumbnail_url ||
                                    `/storage/${post.featured_image_path}`
                                }
                                alt={post.thumbnail_alt_text || post.title}
                                className="w-full h-64 md:h-80 object-cover"
                                onError={(e) => {
                                    console.error(
                                        `Failed to load image for post "${post.title}":`,
                                        post.thumbnail_url ||
                                            post.featured_image_path
                                    );
                                    console.error(
                                        "Image element:",
                                        e.currentTarget
                                    );
                                }}
                                onLoad={() => {
                                    console.log(
                                        `Successfully loaded image for post "${post.title}":`,
                                        post.thumbnail_url ||
                                            post.featured_image_path
                                    );
                                }}
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                            <span className="text-sm font-medium text-slate-600">
                                                {post.user?.name?.charAt(0) ||
                                                    "A"}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {post.user?.name || "Anonymous"}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {formatDate(
                                                post.published_at ||
                                                    post.created_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            {post.categories && post.categories.length > 0 && (
                                <div className="mt-4">
                                    <span className="text-sm font-medium text-slate-600 mr-2">
                                        Categories:
                                    </span>
                                    <div className="inline-flex flex-wrap gap-2">
                                        {post.categories.map(
                                            (category, index) => (
                                                <Link
                                                    key={category.id}
                                                    href={route(
                                                        "blog.category.show",
                                                        category.slug
                                                    )}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors duration-200"
                                                >
                                                    {category.name}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </header>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Excerpt */}
                        {post.excerpt && (
                            <div className="mb-8 p-6 bg-slate-50 rounded-lg border-l-4 border-slate-500">
                                <p className="text-lg text-slate-700 italic leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-a:text-slate-600 prose-a:no-underline hover:prose-a:underline">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            />
                        </div>
                    </div>
                </article>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">
                            Enjoyed this article?
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Check out more insights and updates on our blog.
                        </p>
                        <Link
                            href={`/${blog_base_path}`}
                            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors duration-200 font-medium"
                        >
                            <svg
                                className="mr-2 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back to All Posts
                        </Link>
                    </div>
                </div>
            </div>
        </BlogLayout>
    );
}
