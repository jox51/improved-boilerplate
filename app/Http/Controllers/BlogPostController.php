<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBlogPostRequest;
use App\Http\Requests\UpdateBlogPostRequest;
use App\Models\BlogSetting;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    /**
     * Display the public blog index page with Inertia.
     */
    public function showPublicBlogIndex(): Response
    {
        $postsPerPage = config('blog.posts_per_page', 10);
        
        $posts = Post::with('user:id,name')
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate($postsPerPage);

        // Get sidebar data
        $sidebarData = $this->getSidebarData();

        // Get banner image URL
        $bannerImagePath = BlogSetting::get('banner_image_path');
        $bannerImageUrl = $bannerImagePath ? asset('storage/' . $bannerImagePath) : null;

        return Inertia::render('Blog/Index', [
            'posts' => $posts,
            'sidebarData' => $sidebarData,
            'bannerImageUrl' => $bannerImageUrl,
        ]);
    }

    /**
     * Display the public blog post page with Inertia.
     */
    public function showPublicBlogPost(string $slug): Response
    {
        $post = Post::with('user:id,name', 'categories')
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        // Get sidebar data
        $sidebarData = $this->getSidebarData();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'slug' => $slug,
            'sidebarData' => $sidebarData,
        ]);
    }

    /**
     * Display posts by category for public viewing.
     */
    public function showByCategory(Category $category): Response
    {
        $postsPerPage = config('blog.posts_per_page', 10);
        
        $posts = $category->posts()
            ->with('user:id,name')
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate($postsPerPage);

        // Get sidebar data
        $sidebarData = $this->getSidebarData();

        return Inertia::render('Blog/CategoryShow', [
            'category' => $category,
            'posts' => $posts,
            'sidebarData' => $sidebarData,
        ]);
    }

    /**
     * Display a listing of published posts (API endpoint).
     */
    public function index(): JsonResponse
    {
        $posts = Post::with('user:id,name')
            ->published()
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return response()->json($posts);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(StoreBlogPostRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['user_id'] = Auth::id();
        
        // Generate unique slug from title
        $validated['slug'] = Post::generateUniqueSlug($validated['title']);

        // Handle featured image upload
        if ($request->hasFile('featured_image') && $request->file('featured_image')->isValid()) {
            $featuredImage = $request->file('featured_image');
            $path = $featuredImage->store('post_images', 'public');
            $validated['featured_image_path'] = $path;
        }

        // Set published_at to now if status is published and no date provided
        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post = Post::create($validated);
        
        // Sync categories if provided
        if (isset($validated['category_ids'])) {
            $post->categories()->sync($validated['category_ids']);
        }
        
        $post->load('user:id,name', 'categories');

        return response()->json($post, 201);
    }

    /**
     * Display the specified post by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $post = Post::with('user:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        // Only show published posts to non-authors
        if (!$post->isPublished() && $post->user_id !== Auth::id()) {
            abort(404);
        }

        return response()->json($post);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(UpdateBlogPostRequest $request, string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        // Check if user owns the post
        if ($post->user_id !== Auth::id()) {
            abort(403, 'Unauthorized to update this post.');
        }

        $validated = $request->validated();

        // Generate new slug if title changed
        if ($validated['title'] !== $post->title) {
            $validated['slug'] = Post::generateUniqueSlug($validated['title'], $post->id);
        }

        // Handle featured image upload
        if ($request->hasFile('featured_image') && $request->file('featured_image')->isValid()) {
            // Delete old image if it exists
            if ($post->featured_image_path && Storage::disk('public')->exists($post->featured_image_path)) {
                Storage::disk('public')->delete($post->featured_image_path);
            }
            
            // Store new image
            $featuredImage = $request->file('featured_image');
            $path = $featuredImage->store('post_images', 'public');
            $validated['featured_image_path'] = $path;
        }

        // Set published_at to now if status changed to published and no date provided
        // FIX: Use empty() instead of direct access to handle missing key
        if ($validated['status'] === 'published' &&
            $post->status !== 'published' &&
            empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $post->update($validated);
        
        // Sync categories if provided
        if (isset($validated['category_ids'])) {
            $post->categories()->sync($validated['category_ids']);
        }
        
        $post->load('user:id,name', 'categories');

        return response()->json($post);
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(string $slug): JsonResponse
    {
        $post = Post::where('slug', $slug)->firstOrFail();

        // Check if user owns the post
        if ($post->user_id !== Auth::id()) {
            abort(403, 'Unauthorized to delete this post.');
        }

        // Delete featured image if it exists
        if ($post->featured_image_path && Storage::disk('public')->exists($post->featured_image_path)) {
            Storage::disk('public')->delete($post->featured_image_path);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully.']);
    }

    /**
     * Get posts for the authenticated user (including drafts).
     */
    public function myPosts(): JsonResponse
    {
        $posts = Post::where('user_id', Auth::id())
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return response()->json($posts);
    }

    /**
     * Get draft posts for the authenticated user.
     */
    public function drafts(): JsonResponse
    {
        $posts = Post::where('user_id', Auth::id())
            ->draft()
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return response()->json($posts);
    }

    /**
     * Display the admin dashboard with Inertia.
     */
    public function adminDashboard(Request $request): Response
    {
        // Optionally, fetch data to pass to the dashboard
        // For example, posts by the authenticated user:
        $posts = $request->user()->posts()->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('Blog/Dashboard', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new post.
     */
    public function create(): Response
    {
        $allCategories = Category::orderBy('name')->get();
        
        return Inertia::render('Blog/Editor', [
            'allCategories' => $allCategories,
        ]);
    }

    /**
     * Show the form for editing the specified post.
     */
    public function edit(string $slug): Response
    {
        $post = Post::where('slug', $slug)->firstOrFail();
        
        // Check if user owns the post
        if ($post->user_id !== Auth::id()) {
            abort(403, 'Unauthorized to edit this post.');
        }
        
        $post->load('categories');
        $allCategories = Category::orderBy('name')->get();
        
        return Inertia::render('Blog/Editor', [
            'post' => $post,
            'allCategories' => $allCategories,
            'slug' => $slug,
        ]);
    }

    /**
     * Get sidebar data for public blog pages.
     */
    private function getSidebarData(): array
    {
        // Get categories with post counts
        $categories = Category::withCount(['posts' => function ($query) {
            $query->published();
        }])
        ->having('posts_count', '>', 0)
        ->orderBy('posts_count', 'desc')
        ->limit(8)
        ->get();

        // Get recent posts
        $recentPosts = Post::with('user:id,name')
            ->published()
            ->orderBy('published_at', 'desc')
            ->limit(5)
            ->get();

        // Get popular tags from recent posts
        $popularTags = Post::published()
            ->whereNotNull('tags')
            ->orderBy('published_at', 'desc')
            ->limit(20)
            ->get()
            ->pluck('tags')
            ->flatten()
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take(10)
            ->keys()
            ->toArray();

        return [
            'categories' => $categories,
            'recentPosts' => $recentPosts,
            'popularTags' => $popularTags,
        ];
    }
}
