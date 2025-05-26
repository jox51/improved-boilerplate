import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    has_active_subscription?: boolean;
}

export interface BlogPost {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    status: "draft" | "published" | "archived";
    published_at?: string;
    created_at: string;
    updated_at: string;
    featured_image_path?: string | null;
    user?: User;
    categories?: Category[];
    // Arvow integration fields
    arvow_id?: string | null;
    content_markdown?: string | null;
    tags?: string[] | null;
    thumbnail_url?: string | null;
    thumbnail_alt_text?: string | null;
    meta_description?: string | null;
    keyword_seed?: string | null;
    language_code?: string | null;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    posts_count?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface SocialLinks {
    youtube: string;
    twitter: string;
    tiktok: string;
    facebook: string;
    instagram: string;
    linkedin: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    appName: string;
    blog_base_path: string;
    blog_admin_path: string;
    socialLinks: SocialLinks;
    ziggy: Config & { location: string };
};
