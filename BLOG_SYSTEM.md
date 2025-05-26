# Blog System Implementation

This document describes the blog system that has been integrated into the Laravel application.

## Overview

The blog system replaces the previous WordPress setup with a native Laravel implementation that integrates seamlessly with the existing application architecture.

## Database Schema

### Posts Table
- `id` - Primary key (auto-increment)
- `user_id` - Foreign key to users table (author)
- `title` - Blog post title (string, max 255 chars)
- `slug` - URL-friendly slug (unique string)
- `content` - Main blog post content (text)
- `excerpt` - Optional short summary (string, max 500 chars)
- `status` - Post status: 'draft', 'published', or 'archived'
- `published_at` - Publication timestamp (nullable)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### Public Endpoints
- `GET /api/blog/posts` - List all published posts (paginated)
- `GET /api/blog/posts/{slug}` - View a single post by slug

### Protected Endpoints (require authentication)
- `POST /api/blog/posts` - Create a new post
- `PUT /api/blog/posts/{slug}` - Update an existing post
- `DELETE /api/blog/posts/{slug}` - Delete a post
- `GET /api/blog/my-posts` - Get current user's posts (including drafts)
- `GET /api/blog/drafts` - Get current user's draft posts

## Files Created/Modified

### Migration
- `database/migrations/2025_05_26_121257_create_posts_table.php`

### Models
- `app/Models/Post.php` - Post model with relationships and helper methods
- `app/Models/User.php` - Added posts relationship

### Controllers
- `app/Http/Controllers/BlogPostController.php` - Main blog API controller

### Form Requests
- `app/Http/Requests/StoreBlogPostRequest.php` - Validation for creating posts
- `app/Http/Requests/UpdateBlogPostRequest.php` - Validation for updating posts

### Routes
- `routes/api.php` - API routes for blog functionality

### Seeders & Factories
- `database/seeders/PostSeeder.php` - Sample blog posts
- `database/factories/PostFactory.php` - Post factory for testing
- `database/seeders/DatabaseSeeder.php` - Updated to include PostSeeder

## Features

### Automatic Slug Generation
- Slugs are automatically generated from post titles
- Duplicate slugs are handled by appending numbers
- Slugs are updated when titles change

### Post Status Management
- Draft posts are only visible to their authors
- Published posts have automatic publication timestamps
- Archived posts are preserved but not publicly visible

### User Authorization
- Users can only edit/delete their own posts
- Authentication required for creating, updating, and deleting posts
- Public endpoints allow viewing published posts without authentication

### Validation
- Comprehensive validation for all post fields
- Custom error messages for better user experience
- Proper handling of optional fields like excerpt and published_at

## Usage Examples

### Create a Post
```bash
POST /api/blog/posts
Content-Type: application/json
Authorization: Bearer {token}

{
    "title": "My First Blog Post",
    "content": "<p>This is the content of my blog post.</p>",
    "excerpt": "A short summary of the post",
    "status": "published"
}
```

### Get Published Posts
```bash
GET /api/blog/posts
```

### Get a Specific Post
```bash
GET /api/blog/posts/my-first-blog-post
```

## Next Steps

The backend implementation is complete and ready for frontend integration. The React frontend can now consume these API endpoints to display and manage blog posts.

Consider adding these features in future iterations:
- Categories and tags
- Comments system
- Post search functionality
- Rich text editor integration
- Image upload and management
- SEO metadata fields