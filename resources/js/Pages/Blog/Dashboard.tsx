import { Head, Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { BlogPost, PageProps } from "@/types";
import { createBlogApi } from "@/utils/blogApi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function BlogDashboard({ auth }: PageProps) {
    const { blog_base_path, blog_admin_path } = usePage<PageProps>().props;
    const blogApi = createBlogApi(blog_admin_path);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await blogApi.getMyPosts();
            setPosts(data);
        } catch (err) {
            setError("Failed to load your posts");
            console.error("Error fetching posts:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (post: BlogPost) => {
        if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
            return;
        }

        setDeleteLoading(post.id);
        try {
            await blogApi.deletePost(post.slug);
            setPosts(posts.filter((p) => p.id !== post.id));
        } catch (err) {
            alert("Failed to delete post");
            console.error("Error deleting post:", err);
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case "published":
                return `${baseClasses} bg-green-100 text-green-800`;
            case "draft":
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case "archived":
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Blog Dashboard" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading your posts...
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Blog Dashboard" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Blog Dashboard
                                    </h1>
                                    <p className="text-gray-600">
                                        Manage your blog posts and categories
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        href={route("blog.admin.settings")}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Settings
                                    </Link>
                                    <Link
                                        href={route("blog.admin.categories.index")}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                            />
                                        </svg>
                                        Categories
                                    </Link>
                                    <Link
                                        href={route("blog.admin.create")}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        New Post
                                    </Link>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Posts Table */}
                            {posts.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
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
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No posts
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating your first blog
                                        post.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route("blog.admin.create")}
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4v16m8-8H4"
                                                />
                                            </svg>
                                            New Post
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {posts.map((post) => (
                                                <tr
                                                    key={post.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {post.title}
                                                                </div>
                                                                {post.arvow_id && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                        Arvow
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {post.excerpt && (
                                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                    {
                                                                        post.excerpt
                                                                    }
                                                                </div>
                                                            )}
                                                            {post.tags && post.tags.length > 0 && (
                                                                <div className="mt-1">
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {post.tags.slice(0, 2).map((tag, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                                                                            >
                                                                                #{tag}
                                                                            </span>
                                                                        ))}
                                                                        {post.tags.length > 2 && (
                                                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                                                                +{post.tags.length - 2}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={getStatusBadge(
                                                                post.status
                                                            )}
                                                        >
                                                            {post.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(
                                                            post.created_at
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        {post.status ===
                                                            "published" && (
                                                            <Link
                                                                href={route(
                                                                    "blog.public.show",
                                                                    post.slug
                                                                )}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                View
                                                            </Link>
                                                        )}
                                                        <Link
                                                            href={route(
                                                                "blog.admin.edit",
                                                                post.slug
                                                            )}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    post
                                                                )
                                                            }
                                                            disabled={
                                                                deleteLoading ===
                                                                post.id
                                                            }
                                                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                        >
                                                            {deleteLoading ===
                                                            post.id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
