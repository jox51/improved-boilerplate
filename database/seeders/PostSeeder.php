<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user or create one if none exists
        $user = User::first();
        
        if (!$user) {
            $user = User::create([
                'name' => 'Blog Author',
                'email' => 'author@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Create sample blog posts
        $posts = [
            [
                'title' => 'Welcome to Our New Blog',
                'content' => '<p>We are excited to announce the launch of our new blog system! This marks a significant milestone in our journey to provide better content and insights to our community.</p><p>Our blog will feature regular updates about our platform, industry insights, tutorials, and much more. Stay tuned for exciting content coming your way.</p><p>Thank you for being part of our community, and we look forward to sharing valuable content with you through this new platform.</p>',
                'excerpt' => 'We are excited to announce the launch of our new blog system! This marks a significant milestone in our journey to provide better content.',
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Getting Started with Our Platform',
                'content' => '<p>New to our platform? This comprehensive guide will help you get started and make the most of all the features we offer.</p><p>First, make sure you have created your account and verified your email address. Once that\'s done, you can explore the dashboard and familiarize yourself with the interface.</p><p>Here are some key features to explore:</p><ul><li>Dashboard overview</li><li>Account settings</li><li>Subscription management</li><li>Support resources</li></ul><p>If you have any questions, don\'t hesitate to reach out to our support team.</p>',
                'excerpt' => 'New to our platform? This comprehensive guide will help you get started and make the most of all the features we offer.',
                'status' => 'published',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Understanding Our Subscription Plans',
                'content' => '<p>We offer flexible subscription plans designed to meet the needs of different users. Whether you\'re an individual user or part of a larger organization, we have a plan that\'s right for you.</p><p>Our plans include:</p><ul><li><strong>Basic Plan</strong> - Perfect for individual users getting started</li><li><strong>Pro Plan</strong> - Ideal for power users who need advanced features</li><li><strong>Enterprise Plan</strong> - Designed for organizations with specific requirements</li></ul><p>Each plan comes with different features and usage limits. You can upgrade or downgrade your plan at any time through your account settings.</p><p>For more detailed information about what\'s included in each plan, visit our pricing page or contact our sales team.</p>',
                'excerpt' => 'We offer flexible subscription plans designed to meet the needs of different users, from individuals to large organizations.',
                'status' => 'published',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Upcoming Features and Improvements',
                'content' => '<p>We\'re constantly working to improve our platform and add new features based on user feedback. Here\'s a sneak peek at what\'s coming soon.</p><p>Some of the exciting features we\'re working on include:</p><ul><li>Enhanced dashboard with more customization options</li><li>Advanced analytics and reporting</li><li>Mobile app for iOS and Android</li><li>Integration with popular third-party tools</li><li>Improved collaboration features</li></ul><p>We\'ll be rolling out these features gradually over the coming months. Keep an eye on our blog and announcements for updates.</p><p>As always, we welcome your feedback and suggestions. Your input helps us prioritize which features to work on next.</p>',
                'excerpt' => 'We\'re constantly working to improve our platform. Here\'s a sneak peek at the exciting features coming soon.',
                'status' => 'draft',
                'published_at' => null,
            ],
        ];

        foreach ($posts as $postData) {
            $postData['user_id'] = $user->id;
            $postData['slug'] = Post::generateUniqueSlug($postData['title']);
            
            Post::create($postData);
        }
    }
}
