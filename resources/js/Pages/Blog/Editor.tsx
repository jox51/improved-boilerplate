import { Head, router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { BlogPost, PageProps, Category } from "@/types";
import { createBlogApi, CreatePostData, UpdatePostData } from "@/utils/blogApi";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Props extends PageProps {
    slug?: string;
    post?: BlogPost;
    allCategories?: Category[];
}

export default function BlogEditor({ slug, post: initialPost, allCategories = [] }: Props) {
    const { blog_admin_path } = usePage<PageProps>().props;
    const blogApi = createBlogApi(blog_admin_path);
    const [post, setPost] = useState<BlogPost | null>(initialPost || null);
    const [title, setTitle] = useState(initialPost?.title || "");
    const [content, setContent] = useState(initialPost?.content || "");
    const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
    const [status, setStatus] = useState<"draft" | "published">(
        (initialPost?.status as "draft" | "published") || "draft"
    );
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        initialPost?.categories?.map(cat => cat.id) || []
    );
    const [featuredImage, setFeaturedImage] = useState<File | null>(null);
    const [featuredImagePreview, setFeaturedImagePreview] = useState<
        string | null
    >(initialPost?.featured_image_path || null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!slug;

    useEffect(() => {
        if (isEditing && slug && !initialPost) {
            fetchPost();
        }
    }, [slug]);

    const fetchPost = async () => {
        if (!slug) return;

        setLoading(true);
        try {
            const data = await blogApi.getPost(slug);
            setPost(data);
            setTitle(data.title);
            setContent(data.content);
            setExcerpt(data.excerpt || "");
            setStatus(data.status as "draft" | "published");
            setSelectedCategoryIds(data.categories?.map(cat => cat.id) || []);
            if (data.featured_image_path) {
                setFeaturedImagePreview(data.featured_image_path);
            }
        } catch (err) {
            setError("Failed to load post");
            console.error("Error fetching post:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (saveStatus: "draft" | "published") => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const postData: CreatePostData | UpdatePostData = {
                title: title.trim(),
                content,
                excerpt: excerpt.trim() || undefined,
                status: saveStatus,
                featured_image: featuredImage || undefined,
                category_ids: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
            };

            if (isEditing && slug) {
                await blogApi.updatePost(slug, postData);
            } else {
                await blogApi.createPost(postData);
            }

            router.visit(route('blog.admin.dashboard'));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to save post");
            console.error("Error saving post:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.visit(route('blog.admin.dashboard'));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFeaturedImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setFeaturedImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFeaturedImage(null);
        setFeaturedImagePreview(null);
        // Reset file input
        const fileInput = document.getElementById(
            "featured_image"
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "script",
        "indent",
        "direction",
        "color",
        "background",
        "align",
        "link",
        "image",
        "video",
    ];

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title={isEditing ? "Edit Post" : "New Post"} />
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">
                                Loading post...
                            </p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={isEditing ? "Edit Post" : "New Post"} />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {isEditing
                                        ? "Edit Post"
                                        : "Create New Post"}
                                </h1>
                                <button
                                    onClick={handleCancel}
                                    className="text-slate-500 hover:text-slate-700"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-slate-700 mb-2"
                                    >
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                                        placeholder="Enter post title..."
                                        required
                                    />
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label
                                        htmlFor="excerpt"
                                        className="block text-sm font-medium text-slate-700 mb-2"
                                    >
                                        Excerpt (Optional)
                                    </label>
                                    <textarea
                                        id="excerpt"
                                        value={excerpt}
                                        onChange={(e) =>
                                            setExcerpt(e.target.value)
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                                        placeholder="Brief description of the post..."
                                    />
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Categories (Optional)
                                    </label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-300 rounded-md p-3">
                                        {allCategories.length > 0 ? (
                                            allCategories.map((category) => (
                                                <label
                                                    key={category.id}
                                                    className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-1 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategoryIds.includes(category.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedCategoryIds([...selectedCategoryIds, category.id]);
                                                            } else {
                                                                setSelectedCategoryIds(
                                                                    selectedCategoryIds.filter(id => id !== category.id)
                                                                );
                                                            }
                                                        }}
                                                        className="rounded border-slate-300 text-slate-600 focus:ring-slate-500"
                                                    />
                                                    <span className="text-sm text-slate-700">
                                                        {category.name}
                                                    </span>
                                                    {category.description && (
                                                        <span className="text-xs text-slate-500">
                                                            - {category.description}
                                                        </span>
                                                    )}
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">
                                                No categories available. Create categories first to assign them to posts.
                                            </p>
                                        )}
                                    </div>
                                    {selectedCategoryIds.length > 0 && (
                                        <p className="mt-2 text-sm text-slate-600">
                                            Selected: {selectedCategoryIds.length} categor{selectedCategoryIds.length === 1 ? 'y' : 'ies'}
                                        </p>
                                    )}
                                </div>

                                {/* Featured Image */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Featured Image (Optional)
                                    </label>
                                    <div className="space-y-4">
                                        {featuredImagePreview && (
                                            <div className="relative">
                                                <img
                                                    src={featuredImagePreview}
                                                    alt="Featured image preview"
                                                    className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-300"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                id="featured_image"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                                            />
                                            <p className="mt-1 text-sm text-slate-500">
                                                PNG, JPG, GIF up to 2MB
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Content *
                                    </label>
                                    <div className="border border-slate-300 rounded-md">
                                        <ReactQuill
                                            theme="snow"
                                            value={content}
                                            onChange={setContent}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            style={{ minHeight: "300px" }}
                                        />
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(
                                                e.target.value as
                                                    | "draft"
                                                    | "published"
                                            )
                                        }
                                        className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>

                                    <div className="space-x-3">
                                        <button
                                            onClick={() => handleSave("draft")}
                                            disabled={saving}
                                            className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save as Draft"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleSave("published")
                                            }
                                            disabled={saving}
                                            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors duration-200 disabled:opacity-50"
                                        >
                                            {saving
                                                ? "Publishing..."
                                                : "Publish"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
