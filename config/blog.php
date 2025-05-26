<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Blog Base Path
    |--------------------------------------------------------------------------
    |
    | This value determines the base path for all blog routes. You can
    | customize this via the BLOG_BASE_PATH environment variable.
    | Default is 'blog' if not specified.
    |
    */
    'base_path' => env('BLOG_BASE_PATH', 'blog'),
    'admin_path' => env('BLOG_ADMIN_PATH', 'admin'),
    
    /*
    |--------------------------------------------------------------------------
    | Posts Per Page
    |--------------------------------------------------------------------------
    |
    | This value determines how many posts are displayed per page on the
    | public blog index. You can customize this via the BLOG_POSTS_PER_PAGE
    | environment variable. Default is 10 if not specified.
    |
    */
    'posts_per_page' => (int) env('BLOG_POSTS_PER_PAGE', 10),
];