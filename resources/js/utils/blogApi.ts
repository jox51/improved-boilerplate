import { BlogPost } from "@/types";

export interface CreatePostData {
    title: string;
    content: string;
    excerpt?: string;
    status: "draft" | "published";
    featured_image?: File;
    category_ids?: number[];
}

export interface UpdatePostData extends CreatePostData {
    // Same as CreatePostData for now
}

interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export const createBlogApi = (basePath: string) => ({
    // Public endpoints
    async getPosts(): Promise<BlogPost[]> {
        const response = await window.axios.get<PaginatedResponse<BlogPost>>(`/${basePath}/posts`);
        // Extract the data array from the paginated response
        return response.data.data;
    },

    async getPost(slug: string): Promise<BlogPost> {
        const response = await window.axios.get(`/${basePath}/posts/${slug}`);
        return response.data;
    },

    // Protected endpoints (require authentication)
    async getMyPosts(): Promise<BlogPost[]> {
        const response = await window.axios.get<PaginatedResponse<BlogPost>>(`/${basePath}/my-posts`);
        return response.data.data;
    },

    async getDrafts(): Promise<BlogPost[]> {
        const response = await window.axios.get<PaginatedResponse<BlogPost>>(`/${basePath}/drafts`);
        return response.data.data;
    },

    async createPost(data: CreatePostData): Promise<BlogPost> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('status', data.status);
        if (data.excerpt) {
            formData.append('excerpt', data.excerpt);
        }
        if (data.featured_image) {
            formData.append('featured_image', data.featured_image);
        }
        if (data.category_ids && data.category_ids.length > 0) {
            data.category_ids.forEach((categoryId, index) => {
                formData.append(`category_ids[${index}]`, categoryId.toString());
            });
        }

        const response = await window.axios.post(`/${basePath}/posts`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updatePost(slug: string, data: UpdatePostData): Promise<BlogPost> {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('status', data.status);
        formData.append('_method', 'PUT'); // Laravel method spoofing for file uploads
        if (data.excerpt) {
            formData.append('excerpt', data.excerpt);
        }
        if (data.featured_image) {
            formData.append('featured_image', data.featured_image);
        }
        if (data.category_ids && data.category_ids.length > 0) {
            data.category_ids.forEach((categoryId, index) => {
                formData.append(`category_ids[${index}]`, categoryId.toString());
            });
        }

        const response = await window.axios.post(`/${basePath}/posts/${slug}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deletePost(slug: string): Promise<void> {
        await window.axios.delete(`/${basePath}/posts/${slug}`);
    },
});

// Default export for backward compatibility (uses 'blog' as default)
export const blogApi = createBlogApi('blog');
