<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'appName' => config('app.name'),
            'blog_base_path' => config('blog.base_path', 'blog'),
            'blog_admin_path' => config('blog.admin_path', 'admin'),
            'socialLinks' => [
                'youtube' => env('YOUTUBE_URL') ?: 'https://www.youtube.com',
                'twitter' => env('TWITTER_URL') ?: 'https://www.twitter.com',
                'tiktok' => env('TIKTOK_URL') ?: 'https://www.tiktok.com',
                'facebook' => env('FACEBOOK_URL') ?: 'https://www.facebook.com',
                'instagram' => env('INSTAGRAM_URL') ?: 'https://www.instagram.com',
                'linkedin' => env('LINKEDIN_URL') ?: 'https://www.linkedin.com',
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
