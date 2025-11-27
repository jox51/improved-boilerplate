<?php

return [
    /*
    |--------------------------------------------------------------------------
    | PayPal Mode
    |--------------------------------------------------------------------------
    |
    | This value determines which PayPal environment to use: 'sandbox' or 'live'.
    | Sandbox should be used for development and testing, while live is for
    | production. This will determine which credentials set is used.
    |
    */

    'mode' => env('PAYPAL_MODE', 'sandbox'),

    /*
    |--------------------------------------------------------------------------
    | Sandbox Credentials
    |--------------------------------------------------------------------------
    |
    | These credentials are used when running in sandbox mode for testing.
    | Get these from the PayPal Developer Dashboard.
    |
    */

    'sandbox' => [
        'client_id' => env('PAYPAL_SANDBOX_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_SANDBOX_CLIENT_SECRET', ''),
        'app_id' => 'APP-80W284485P519543T', // Default sandbox app ID
        'monthly_product_id' => env('PAYPAL_SANDBOX_PRODUCT_ID', ''),
        'monthly_plan_id' => env('PAYPAL_SANDBOX_MONTHLY_PLAN_ID', ''),
        'yearly_product_id' => env('PAYPAL_SANDBOX_YEARLY_PRODUCT_ID', ''),
        'yearly_plan_id' => env('PAYPAL_SANDBOX_YEARLY_PLAN_ID', ''),
        'webhook_id' => env('PAYPAL_SANDBOX_WEBHOOK_ID', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | Live Credentials
    |--------------------------------------------------------------------------
    |
    | These credentials are used when running in live mode for production.
    | Get these from your PayPal business account.
    |
    */

    'live' => [
        'client_id' => env('PAYPAL_LIVE_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_LIVE_CLIENT_SECRET', ''),
        'app_id' => env('PAYPAL_LIVE_APP_ID', ''),
        'monthly_product_id' => env('PAYPAL_LIVE_PRODUCT_ID', ''),
        'monthly_plan_id' => env('PAYPAL_LIVE_MONTHLY_PLAN_ID', ''),
        'yearly_product_id' => env('PAYPAL_LIVE_YEARLY_PRODUCT_ID', ''),
        'yearly_plan_id' => env('PAYPAL_LIVE_YEARLY_PLAN_ID', ''),
        'webhook_id' => env('PAYPAL_LIVE_WEBHOOK_ID', ''),
    ],

    /*
    |--------------------------------------------------------------------------
    | General Settings
    |--------------------------------------------------------------------------
    |
    | These settings apply to both sandbox and live modes.
    |
    */

    'currency' => env('PAYPAL_CURRENCY', 'USD'),
    'locale' => env('PAYPAL_LOCALE', 'en_US'),
    'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'),
    'notify_url' => env('PAYPAL_NOTIFY_URL', ''),
    'validate_ssl' => env('PAYPAL_VALIDATE_SSL', true),
];
