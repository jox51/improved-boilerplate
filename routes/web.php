<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\ArvowWebhookController;
use App\Http\Controllers\BlogPostController;
use App\Http\Controllers\BlogSettingsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/', function () {
    $appName = config('app.name', 'Awesome Project');
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'gtmId' => config('tag_manager.gtm_id'),
        'appName' => $appName,
    ]);
})->name('welcome');

Route::get('/terms', function () {
    return Inertia::render('TermsPage');
})->name('terms');

Route::get('/privacy-policy', function () {
    return Inertia::render('PrivacyPolicyPage');
})->name('privacy.policy');

Route::get('/contact-us', function () {
    return Inertia::render('ContactPage', [
        'formspreeId' => config('formspree.formspree_id'),
    ]);
})->name('contact.show');

// Webhook routes (outside middleware groups for server-to-server communication)
Route::post('stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])
    ->name('cashier.webhook');

    // Blog routes
$blogBasePath = config('blog.base_path', 'blog');
$blogAdminPath = config('blog.admin_path', 'admin');

// Arvow webhook route
Route::post($blogBasePath . '/webhook', [ArvowWebhookController::class, 'handleWebhook'])
    ->name('arvow.webhook');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/app', [AppController::class, 'index'])
    ->middleware(['auth', 'verified', 'subscribed'])
    ->name('app.index');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Subscription routes
    Route::get('/subscribe/{planType}', [SubscriptionController::class, 'createCheckoutSession'])->name('subscribe.checkout');
    Route::get('/subscription-success', [SubscriptionController::class, 'subscriptionSuccess'])->name('subscription.success');
    Route::get('/subscription-cancel', [SubscriptionController::class, 'subscriptionCancel'])->name('subscription.cancel');
    Route::get('/billing', [SubscriptionController::class, 'showBillingInformation'])->name('billing.show');
    Route::get('/billing-portal', [SubscriptionController::class, 'redirectToBillingPortal'])->name('billing.portal');

    // Legacy Stripe checkout routes (keeping for backward compatibility)
    Route::get('/checkout/{plan}', [StripeController::class, 'checkout'])->name('checkout');
    Route::get('/checkout/success', [StripeController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [StripeController::class, 'cancel'])->name('checkout.cancel');
});



// Public Blog Routes
Route::get('/' . $blogBasePath, [BlogPostController::class, 'showPublicBlogIndex'])->name('blog.public.index');
Route::get('/' . $blogBasePath . '/category/{category:slug}', [BlogPostController::class, 'showByCategory'])->name('blog.category.show');
Route::get('/' . $blogBasePath . '/{slug}', [BlogPostController::class, 'showPublicBlogPost'])->name('blog.public.show');

// Route::get('/' . 'blog3' . '/dashboards', function () {
//     return dd('dashboard');
// })->name('blog.admin.dashboard');

// Protected blog admin routes
Route::middleware(['auth', 'verified', 'admin'])->prefix($blogAdminPath)->name('blog.admin.')->group(function () {

    Route::get('/dashboard', [BlogPostController::class, 'adminDashboard'])->name('dashboard');

    Route::get('/create', [BlogPostController::class, 'create'])->name('create');

    Route::get('/edit/{slug}', [BlogPostController::class, 'edit'])->name('edit');

    // Category management routes
    Route::resource('categories', CategoryController::class);
    
    // Blog settings routes
    Route::get('/settings', [BlogSettingsController::class, 'index'])->name('settings');
    Route::post('/settings/banner-upload', [BlogSettingsController::class, 'uploadBanner'])->name('settings.banner.upload');
    Route::delete('/settings/banner', [BlogSettingsController::class, 'removeBanner'])->name('settings.banner.remove');
    Route::put('/settings/theme', [BlogSettingsController::class, 'updateTheme'])->name('settings.updateTheme');
});

/*
|--------------------------------------------------------------------------
| Blog API Routes (moved from api.php)
|--------------------------------------------------------------------------
*/

// Public blog API routes
Route::prefix($blogBasePath)->group(function () {
    // List all published posts
    Route::get('/posts', [BlogPostController::class, 'index']);
    
    // View a single post by slug
    Route::get('/posts/{slug}', [BlogPostController::class, 'show']);
});

// Protected blog API routes (require authentication)
Route::middleware(['auth', 'verified'])->prefix($blogAdminPath)->group(function () {
    // Create a new post
    Route::post('/posts', [BlogPostController::class, 'store']);
    
    // Update an existing post
    Route::put('/posts/{slug}', [BlogPostController::class, 'update']);
    
    // Delete a post
    Route::delete('/posts/{slug}', [BlogPostController::class, 'destroy']);
    
    // Get current user's posts (including drafts)
    Route::get('/my-posts', [BlogPostController::class, 'myPosts']);
    
    // Get current user's draft posts
    Route::get('/drafts', [BlogPostController::class, 'drafts']);
});

require __DIR__.'/auth.php';

