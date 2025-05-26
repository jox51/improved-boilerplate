import { Head, Link, usePage } from "@inertiajs/react";
import { BlogPost, PaginatedResponse, PageProps, Category } from "@/types";
import BlogLayout from "@/Layouts/BlogLayout";
import EnhancedPagination from "@/Components/EnhancedPagination";

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
            <div
                className="border-b border-slate-300 -mx-4 sm:-mx-6 lg:-mx-8 relative"
                style={bannerImageUrl ? {
                    backgroundImage: `url(${bannerImageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                } : {}}
            >
                {/* Overlay for better text readability when using custom image */}
                {bannerImageUrl && (
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                )}
                
                <div
                    className={`px-4 sm:px-6 lg:px-8 py-16 relative z-10 ${
                        !bannerImageUrl ? 'bg-slate-200' : ''
                    }`}
                >
                    <div className="text-center">
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
                            bannerImageUrl ? 'text-white' : 'text-slate-900'
                        }`}>
                            {appName} Blog
                        </h1>
                        <p className={`text-xl md:text-2xl max-w-2xl mx-auto ${
                            bannerImageUrl ? 'text-gray-100' : 'text-slate-600'
                        }`}>
                            Insights, updates, and stories about arbitrage
                            opportunities and market analysis
                        </p>
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
                        <div className="space-y-8">
                            {postsData.data.map((post, index) => (
                                <article
                                    key={post.id}
                                    className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 ${
                                        index === 0 ? "md:flex" : ""
                                    }`}
                                >
                                    {index === 0 ? (
                                        // Featured post layout
                                        <>
                                            <div className="md:w-1/2 p-8">
                                                <div className="flex items-center mb-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                        Featured
                                                    </span>
                                                </div>

                                                <Link
                                                    href={`/${blog_base_path}/${post.slug}`}
                                                    className="block"
                                                >
                                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-slate-600 transition-colors duration-200">
                                                        {post.title}
                                                    </h2>
                                                </Link>

                                                {post.excerpt && (
                                                    <p className="text-slate-600 mb-6 text-lg leading-relaxed line-clamp-3">
                                                        {post.excerpt}
                                                    </p>
                                                )}

                                                {/* Tags for featured post */}
                                                {post.tags &&
                                                    post.tags.length > 0 && (
                                                        <div className="mb-4">
                                                            <div className="flex flex-wrap gap-2">
                                                                {post.tags
                                                                    .slice(0, 3)
                                                                    .map(
                                                                        (
                                                                            tag,
                                                                            index
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                                                                            >
                                                                                #
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                {post.tags
                                                                    .length >
                                                                    3 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                                        +
                                                                        {post
                                                                            .tags
                                                                            .length -
                                                                            3}{" "}
                                                                        more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-slate-600">
                                                                    {post.user?.name?.charAt(
                                                                        0
                                                                    ) || "A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {post.user
                                                                    ?.name ||
                                                                    "Anonymous"}
                                                            </p>
                                                            <p className="text-sm text-slate-500">
                                                                {formatDate(
                                                                    post.published_at ||
                                                                        post.created_at
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

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
                                            <div className="md:w-1/2 bg-slate-50 flex items-center justify-center p-8">
                                                {post.thumbnail_url ||
                                                post.featured_image_path ? (
                                                    <img
                                                        src={
                                                            post.thumbnail_url ||
                                                            `storage/${post.featured_image_path}`
                                                        }
                                                        alt={
                                                            post.thumbnail_alt_text ||
                                                            post.title
                                                        }
                                                        className="w-full h-64 object-cover rounded-lg shadow-sm"
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
                                                ) : (
                                                    <div className="text-center">
                                                        <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                            <svg
                                                                className="w-12 h-12 text-slate-600"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <p className="text-slate-600 font-medium">
                                                            Featured Article
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        // Regular post layout
                                        <div className="flex">
                                            {(post.thumbnail_url ||
                                                post.featured_image_path) && (
                                                <div className="w-48 flex-shrink-0">
                                                    <img
                                                        src={
                                                            post.thumbnail_url ||
                                                            `storage/${post.featured_image_path}`
                                                        }
                                                        alt={
                                                            post.thumbnail_alt_text ||
                                                            post.title
                                                        }
                                                        className="w-full h-32 object-cover rounded-l-xl"
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
                                            <div className="p-6 flex-1">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-slate-600">
                                                                    {post.user?.name?.charAt(
                                                                        0
                                                                    ) || "A"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">
                                                                {post.user
                                                                    ?.name ||
                                                                    "Anonymous"}
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

                                                {/* Tags for regular posts */}
                                                {post.tags &&
                                                    post.tags.length > 0 && (
                                                        <div className="mb-4">
                                                            <div className="flex flex-wrap gap-1">
                                                                {post.tags
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            tag,
                                                                            index
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600"
                                                                            >
                                                                                #
                                                                                {
                                                                                    tag
                                                                                }
                                                                            </span>
                                                                        )
                                                                    )}
                                                                {post.tags
                                                                    .length >
                                                                    2 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                                        +
                                                                        {post
                                                                            .tags
                                                                            .length -
                                                                            2}
                                                                    </span>
                                                                )}
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
                                    )}
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
