<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Payment Provider
    |--------------------------------------------------------------------------
    |
    | This option controls the default payment provider used by your application.
    | You may set this to "stripe" or "paypal" depending on which provider
    | you want to use for processing payments and subscriptions.
    |
    */

    'default' => env('PAYMENT_PROVIDER', 'stripe'),

    /*
    |--------------------------------------------------------------------------
    | Payment Providers
    |--------------------------------------------------------------------------
    |
    | Here you may configure the payment providers used by your application.
    | Each provider has its own configuration options.
    |
    */

    'providers' => [
        'stripe' => [
            'enabled' => env('STRIPE_ENABLED', true),
            'key' => env('STRIPE_KEY'),
            'secret' => env('STRIPE_SECRET'),
            'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
            'monthly_product_id' => env('STRIPE_MONTHLY_PRODUCT_ID'),
            'monthly_price_id' => env('STRIPE_MONTHLY_PRICE_ID'),
            'yearly_product_id' => env('STRIPE_YEARLY_PRODUCT_ID'),
            'yearly_price_id' => env('STRIPE_YEARLY_PRICE_ID'),
        ],

        'paypal' => [
            'enabled' => env('PAYPAL_ENABLED', false),
            'mode' => env('PAYPAL_MODE', 'sandbox'), // 'sandbox' or 'live'

            'sandbox' => [
                'client_id' => env('PAYPAL_SANDBOX_CLIENT_ID', ''),
                'client_secret' => env('PAYPAL_SANDBOX_CLIENT_SECRET', ''),
                'product_id' => env('PAYPAL_SANDBOX_PRODUCT_ID', ''),
                'monthly_plan_id' => env('PAYPAL_SANDBOX_MONTHLY_PLAN_ID', ''),
                'yearly_plan_id' => env('PAYPAL_SANDBOX_YEARLY_PLAN_ID', ''),
                'webhook_id' => env('PAYPAL_SANDBOX_WEBHOOK_ID', ''),
            ],

            'live' => [
                'client_id' => env('PAYPAL_LIVE_CLIENT_ID', ''),
                'client_secret' => env('PAYPAL_LIVE_CLIENT_SECRET', ''),
                'product_id' => env('PAYPAL_LIVE_PRODUCT_ID', ''),
                'monthly_plan_id' => env('PAYPAL_LIVE_MONTHLY_PLAN_ID', ''),
                'yearly_plan_id' => env('PAYPAL_LIVE_YEARLY_PLAN_ID', ''),
                'webhook_id' => env('PAYPAL_LIVE_WEBHOOK_ID', ''),
            ],

            'currency' => env('PAYPAL_CURRENCY', 'USD'),
            'locale' => env('PAYPAL_LOCALE', 'en_US'),
        ],
    ],
];
