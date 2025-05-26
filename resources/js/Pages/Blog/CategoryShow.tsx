import { Head, Link, usePage } from "@inertiajs/react";
import { BlogPost, Category, PaginatedResponse, PageProps } from "@/types";
import BlogLayout from "@/Layouts/BlogLayout";
import EnhancedPagination from "@/Components/EnhancedPagination";

interface CategoryShowProps extends PageProps {
    category: Category;
    posts: PaginatedResponse<BlogPost>;
    sidebarData?: {
        categories?: Category[];
        recentPosts?: BlogPost[];
        popularTags?: string[];
    };
}

export default function CategoryShow() {
    const { props } = usePage<CategoryShowProps>();
    const { category, posts: postsData, blog_base_path, sidebarData, appName } = props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <BlogLayout sidebarData={sidebarData}>
            <Head title={`Category: ${category.name} - ${appName} Blog`}>
                <meta
                    name="description"
                    content={category.description || `Browse all posts in the ${category.name} category on ${appName} Blog`}
                />
            </Head>

            {/* Category Header Section */}
            <div className="bg-slate-100 border-b border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        {/* Breadcrumb */}
                        <nav className="flex justify-center mb-6">
                            <ol className="flex items-center space-x-2 text-sm">
                                <li>
                                    <Link
                                        href={`/${blog_base_path}`}
                                        className="text-slate-600 hover:text-slate-800 transition-colors"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li className="text-slate-400">/</li>
                                <li className="text-slate-900 font-medium">
                                    {category.name}
                                </li>
                            </ol>
                        </nav>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
                            {category.name}
                        </h1>
                        
                        {category.description && (
                            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto">
                                {category.description}
                            </p>
                        )}
                        
                        <div className="mt-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-200 text-slate-700">
                                {postsData.total} {postsData.total === 1 ? 'post' : 'posts'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12">
                {postsData.data.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <svg
                                className="mx-auto h-12 w-12 text-slate-400"
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
                            <h3 className="mt-4 text-lg font-medium text-slate-900">
                                No posts found in this category
                            </h3>
                            <p className="mt-2 text-slate-500">
                                Check back later for new content in {category.name}.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={`/${blog_base_path}`}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-colors"
                                >
                                    Browse All Posts
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Posts List */}
                        <div className="space-y-8">
                            {postsData.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    <div className="flex">
                                        {(post.thumbnail_url || post.featured_image_path) && (
                                            <div className="w-48 flex-shrink-0">
                                                <img
                                                    src={post.thumbnail_url || `/storage/${post.featured_image_path}`}
                                                    alt={post.thumbnail_alt_text || post.title}
                                                    className="w-full h-32 object-cover rounded-l-xl"
                                                    onError={(e) => {
                                                        console.error(
                                                            `Failed to load image for post "${post.title}":`,
                                                            post.thumbnail_url || post.featured_image_path
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <div className="p-6 flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-slate-600">
                                                                {post.user?.name?.charAt(0) || "A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {post.user?.name || "Anonymous"}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {formatDate(
                                                                post.published_at || post.created_at
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/${blog_base_path}/${post.slug}`}
                                                className="block group"
                                            >
                                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-slate-600 transition-colors duration-200">
                                                    {post.title}
                                                </h3>
                                            </Link>

                                            {post.excerpt && (
                                                <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* Tags */}
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.tags.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                        {post.tags.length > 3 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                                +{post.tags.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Categories (excluding current category) */}
                                            {post.categories && post.categories.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.categories
                                                            .filter(cat => cat.id !== category.id)
                                                            .slice(0, 2)
                                                            .map((cat) => (
                                                                <Link
                                                                    key={cat.id}
                                                                    href={`/${blog_base_path}/category/${cat.slug}`}
                                                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                                                >
                                                                    {cat.name}
                                                                </Link>
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            <Link
                                                href={`/${blog_base_path}/${post.slug}`}
                                                className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
                                            >
                                                Read more
                                                <svg
                                                    className="ml-2 w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
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