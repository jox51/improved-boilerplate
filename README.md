# Laravel React Boilerplate

A modern, feature-rich boilerplate for building web applications with Laravel and React. This boilerplate includes a custom blogging system, MySQL database, Stripe subscriptions, contact forms, Google Tag Manager, and SEO optimization.

## 🚀 Features

-   **Laravel & React** - Modern full-stack framework combination
-   **Custom Blogging System** - Built-in blog with Laravel backend and React/Inertia.js frontend
    -   Admin dashboard for managing posts, categories, and blog settings
    -   Rich text editor for creating and editing posts
    -   Category management with hierarchical organization
    -   Customizable public blog layout with sidebar (categories, recent posts, social links)
    -   Enhanced pagination with "jump to page" functionality
    -   SEO-optimized blog posts with meta tags and descriptions
-   **MySQL Database** - Robust data storage
-   **Stripe Integration** - Subscription payment processing
-   **Contact Form** - Powered by Formspree
-   **Analytics** - Google Tag Manager setup
-   **SEO Optimization** - Meta tags and sitemap generation
-   **Authentication** - Protected routes for subscribed users

## 📋 Prerequisites

-   PHP >= 8.0
-   Node.js >= 16
-   Composer
-   MySQL
-   Stripe CLI (for local development)

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
cd my-boilerplate
```

2. Install dependencies:

```bash
composer install && npm install
```

3. Copy the environment file:

```bash
cp .env.example .env
```

4. Generate application key:

```bash
php artisan key:generate
```

## ⚙️ Configuration

### Stripe Setup

1. Create a new project in the [Stripe Dashboard](https://dashboard.stripe.com)
2. Add the following to your `.env` file:

```env
STRIPE_SECRET_KEY=your_secret_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

3. Setup Stripe webhooks:
    - Install Laravel Cashier
    - Publish migrations and configs
    - Run migrations
    - Add `use Billable` trait to User model
    - Use Stripe CLI for local webhook testing
    - Create webhooks using:
        ```bash
        php artisan cashier:webhook --url "https://your-domain.com/stripe/webhook"
        ```
        Note: Use ngrok for local webhook testing

### Email Configuration

1. Add Gmail credentials to `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
```

### Contact Form

1. Create a form at [Formspree](https://formspree.io)
2. Add your form ID to `.env`:

```env
FORMSPREE_FORM_ID=your_form_id
```

### Google Tag Manager

Add your GTM ID to `.env`:

```env
GTM_ID=your_gtm_id
```

### Blogging System

The custom blogging system is fully integrated and requires minimal configuration:

1. **Application Branding**: The blog uses your app name for branding

```env
APP_NAME="Your App Name"
```

2. **Social Media Integration**: Configure social media URLs for the blog sidebar (defaults to homepage if not set)

```env
YOUTUBE_URL=https://youtube.com/@yourchannel
TWITTER_URL=https://twitter.com/youraccount
TIKTOK_URL=https://tiktok.com/@youraccount
FACEBOOK_URL=https://facebook.com/yourpage
INSTAGRAM_URL=https://instagram.com/youraccount
LINKEDIN_URL=https://linkedin.com/in/yourprofile
```

3. **Blog Administration**: Access the blog admin dashboard at `/admin/blog/dashboard` (requires admin privileges)

    - Manage blog posts and categories
    - Configure blog settings and banner images
    - Monitor blog analytics and engagement
    - Add admin email to `app/Http/Middleware/Admin.php`

4. **Blog Features**:
    - Public blog accessible at `/blog`
    - Category-based post organization at `/blog/category/{slug}`
    - Individual post pages with SEO optimization
    - Responsive design with customizable sidebar
    - Admin-only post creation and editing interface

## 🔒 Security

-   CSRF protection is configured for all routes except webhooks
-   Protected routes ensure only subscribed and authenticated users can access specific areas
-   Secure environment variable handling

## 🗺️ SEO

-   Automated sitemap generation
-   Meta description and keyword support
-   SEO-friendly Head tags

## 📝 License

[Your License] © [Your Name]
