# PayPal Integration Guide for Laravel/React Applications

This guide provides a complete implementation of PayPal payments and subscriptions using Laravel (backend) and React with Inertia.js (frontend).

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Webhook Integration](#webhook-integration)
9. [Email Notifications](#email-notifications)
10. [Testing](#testing)

---

## Overview

This implementation supports:
- **One-time payments** (e.g., 24-hour access pass)
- **Recurring subscriptions** (e.g., monthly plans)
- **Webhook handling** for subscription lifecycle events
- **Email notifications** for successful payments/subscriptions
- **Sandbox and Live modes**

---

## Prerequisites

- Laravel 11+
- PHP 8.2+
- Inertia.js
- React
- PayPal Developer Account
- Composer

---

## Installation

### 1. Install PayPal SDK Package

```bash
composer require srmklive/paypal:^3.0
```

### 2. Publish PayPal Configuration

```bash
php artisan vendor:publish --provider="Srmklive\PayPal\Providers\PayPalServiceProvider"
```

---

## Configuration

### 1. Create/Update `config/paypal.php`

```php
<?php

return [
    'mode'    => env('PAYPAL_MODE', 'sandbox'), // 'sandbox' or 'live'

    'sandbox' => [
        'client_id'         => env('PAYPAL_SANDBOX_CLIENT_ID', ''),
        'client_secret'     => env('PAYPAL_SANDBOX_CLIENT_SECRET', ''),
        'app_id'           => 'APP-80W284485P519543T',
    ],

    'live' => [
        'client_id'         => env('PAYPAL_LIVE_CLIENT_ID', ''),
        'client_secret'     => env('PAYPAL_LIVE_CLIENT_SECRET', ''),
        'app_id'           => env('PAYPAL_LIVE_APP_ID', ''),
    ],

    'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'),
    'currency'       => env('PAYPAL_CURRENCY', 'USD'),
    'notify_url'     => env('PAYPAL_NOTIFY_URL', ''),
    'locale'         => env('PAYPAL_LOCALE', 'en_US'),
    'validate_ssl'   => env('PAYPAL_VALIDATE_SSL', true),

    // For subscriptions
    'product_id' => env('PAYPAL_PRODUCT_ID'),
    'billing_plan_id' => env('PAYPAL_BILLING_PLAN_ID')
];
```

### 2. Update `.env` File

```env
# PayPal Configuration
PAYPAL_MODE=sandbox
PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id
PAYPAL_SANDBOX_CLIENT_SECRET=your_sandbox_client_secret

# For Live Mode
PAYPAL_LIVE_CLIENT_ID=your_live_client_id
PAYPAL_LIVE_CLIENT_SECRET=your_live_client_secret
PAYPAL_LIVE_APP_ID=your_live_app_id

# Subscription Settings (optional)
PAYPAL_PRODUCT_ID=your_product_id
PAYPAL_BILLING_PLAN_ID=your_billing_plan_id

# Webhook Settings
PAYPAL_WEBHOOK_ID=your_webhook_id

# Other Settings
PAYPAL_CURRENCY=USD
PAYPAL_LOCALE=en_US
```

### 3. Getting PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Create a new app or use an existing one
3. Copy the **Client ID** and **Secret**
4. For subscriptions, create a **Product** and **Billing Plan** in the PayPal dashboard

---

## Database Setup

### 1. Create Migration for User Subscription Fields

```bash
php artisan make:migration add_subscription_fields_to_users_table
```

**Migration file:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('paypal_subscription_id')->nullable();
            $table->string('subscription_status')->nullable();
            $table->timestamp('subscription_ends_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'paypal_subscription_id',
                'subscription_status',
                'subscription_ends_at'
            ]);
        });
    }
};
```

### 2. Create Migration for Basic Access (One-time Payment)

```bash
php artisan make:migration add_is_basic_to_users_table
```

**Migration file:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_basic')->default(false);
            $table->timestamp('basic_access_ends_at')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_basic', 'basic_access_ends_at']);
        });
    }
};
```

### 3. Update User Model

**`app/Models/User.php`:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'paypal_subscription_id',
        'subscription_status',
        'subscription_ends_at',
        'is_basic',
        'basic_access_ends_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'subscription_ends_at' => 'datetime',
            'basic_access_ends_at' => 'datetime',
        ];
    }
}
```

### 4. Run Migrations

```bash
php artisan migrate
```

---

## Backend Implementation

### 1. Create PayPal Controller

```bash
php artisan make:controller PayPalController
```

**`app/Http/Controllers/PayPalController.php`:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Mail\PaymentSuccessEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\SubscriptionSuccessEmail;

class PayPalController extends Controller
{
    /**
     * Handle one-time payment
     */
    public function handlePayment(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $token = $provider->getAccessToken();

        $order = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('payment.success'),
                "cancel_url" => route('payment.cancel'),
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $request->price
                    ],
                    "description" => "Your Product " . $request->plan . " Plan"
                ]
            ]
        ]);

        if (isset($order['id']) && $order['id'] != null) {
            foreach ($order['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    return Inertia::location($link['href']);
                }
            }
        }

        return redirect()->route('pricing')->with('error', 'Something went wrong.');
    }

    /**
     * Handle payment success callback
     */
    public function paymentSuccess(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $token = $provider->getAccessToken();
        $order = $provider->capturePaymentOrder($request->token);

        if (isset($order['status']) && $order['status'] === 'COMPLETED') {
            $user = Auth::user();

            // Update user access level
            /** @var \App\Models\User $user */
            $user->update([
                'is_basic' => true,
                'basic_access_ends_at' => Carbon::now()->addHours(24)
            ]);

            // Send payment success email
            Mail::to($user->email)->send(new PaymentSuccessEmail($user, $order));

            return Inertia::render('PaypalSuccess', [
                'message' => 'Payment completed successfully!'
            ]);
        } else {
            return redirect()->back()->with('error', 'Payment failed.');
        }
    }

    /**
     * Handle payment cancellation
     */
    public function paymentCancel()
    {
        return redirect()->route('pricing')->with('error', 'Payment cancelled.');
    }

    /**
     * Create recurring subscription
     */
    public function createSubscription(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $token = $provider->getAccessToken();

        $user = Auth::user();
        $startTime = Carbon::now()->addSeconds(5)->format('Y-m-d\TH:i:s\Z');

        $product_id = config('paypal.product_id');
        $billingPlanId = config('paypal.billing_plan_id');

        try {
            $response = $provider->addProductById($product_id)
                ->addBillingPlanById($billingPlanId)
                ->setReturnAndCancelUrl(route('subscription.success'), route('subscription.cancel'))
                ->setupSubscription(
                    $user->name,
                    $user->email,
                    $startTime
                );

            if (isset($response['id']) && $response['status'] === 'APPROVAL_PENDING') {
                foreach ($response['links'] as $link) {
                    if ($link['rel'] === 'approve') {
                        return Inertia::location($link['href']);
                    }
                }
            } else {
                return redirect()->back()->with('error', 'Unable to create subscription at this time.');
            }

        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Handle subscription success callback
     */
    public function subscriptionSuccess(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $token = $provider->getAccessToken();

        try {
            $subscription = $provider->showSubscriptionDetails($request->subscription_id);
            $user = Auth::user();

            if (isset($subscription['status']) && $subscription['status'] === 'ACTIVE') {
                // Send subscription success email
                Mail::to($user->email)->send(new SubscriptionSuccessEmail($user, $subscription));

                /** @var \App\Models\User $user */
                $user->update([
                    'paypal_subscription_id' => $subscription['id'],
                    'subscription_status' => 'active',
                    'subscription_ends_at' => Carbon::parse($subscription['billing_info']['next_billing_time'])
                ]);

                return Inertia::render('PaypalSuccess', [
                    'subscription' => $subscription,
                    'message' => 'Subscription activated successfully!'
                ]);
            } else {
                return redirect()->back()->with('error', 'Subscription activation failed.');
            }

        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Handle subscription cancellation
     */
    public function subscriptionCancel()
    {
        return redirect()->route('pricing')->with('error', 'Subscription cancelled.');
    }
}
```

### 2. Create Webhook Controller

```bash
php artisan make:controller WebhookController
```

**`app/Http/Controllers/WebhookController.php`:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $token = $provider->getAccessToken();
        $provider->setAccessToken($token);
        $webhookId = env('PAYPAL_WEBHOOK_ID');

        Log::info('Webhook Payload', ['request' => $request->all()]);

        $provider->setWebHookID($webhookId);

        try {
            $result = $provider->verifyIPN($request);
            Log::info('Webhook Verification', ['result' => $result]);

            if ($result['verification_status'] === 'SUCCESS') {
                $payload = $request->all();
                $eventType = $payload['event_type'];

                switch ($eventType) {
                    case 'BILLING.SUBSCRIPTION.ACTIVATED':
                        return $this->handleSubscriptionActivated($payload);

                    case 'BILLING.SUBSCRIPTION.CANCELLED':
                        return $this->handleSubscriptionCancelled($payload);

                    case 'BILLING.SUBSCRIPTION.CREATED':
                        return $this->handleSubscriptionCreated($payload);

                    case 'BILLING.SUBSCRIPTION.EXPIRED':
                        return $this->handleSubscriptionExpired($payload);

                    case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                        return $this->handlePaymentFailed($payload);

                    case 'BILLING.SUBSCRIPTION.REACTIVATED':
                        return $this->handleSubscriptionReactivated($payload);

                    case 'BILLING.SUBSCRIPTION.SUSPENDED':
                        return $this->handleSubscriptionSuspended($payload);

                    case 'BILLING.SUBSCRIPTION.UPDATED':
                        return $this->handleSubscriptionUpdated($payload);
                }
            }

            Log::error('PayPal webhook verification failed', ['result' => $result]);
            return response()->json(['message' => 'Webhook verification failed'], 400);

        } catch (\Exception $e) {
            Log::error('PayPal webhook error', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Webhook error'], 500);
        }
    }

    private function handleSubscriptionActivated($payload)
    {
        $subscriptionId = $payload['resource']['id'];
        $nextBillingTime = Carbon::parse($payload['resource']['billing_info']['next_billing_time']);

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();

        if ($user) {
            $user->update([
                'subscription_status' => 'active',
                'subscription_ends_at' => $nextBillingTime,
            ]);

            Log::info('Subscription activated for user', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Subscription activated'], 200);
    }

    private function handleSubscriptionCancelled($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'cancelled',
                'subscription_ends_at' => now()
            ]);
        }

        return response()->json(['message' => 'Subscription cancelled'], 200);
    }

    private function handleSubscriptionSuspended($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'suspended'
            ]);
        }

        return response()->json(['message' => 'Subscription suspended'], 200);
    }

    private function handlePaymentFailed($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'payment_failed'
            ]);
        }

        return response()->json(['message' => 'Payment failed'], 200);
    }

    private function handleSubscriptionCreated($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'created'
            ]);
        }

        return response()->json(['message' => 'Subscription created'], 200);
    }

    private function handleSubscriptionExpired($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'expired',
                'subscription_ends_at' => now()
            ]);
        }

        return response()->json(['message' => 'Subscription expired'], 200);
    }

    private function handleSubscriptionReactivated($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'active',
                'subscription_ends_at' => now()->addMonth()
            ]);
        }

        return response()->json(['message' => 'Subscription reactivated'], 200);
    }

    private function handleSubscriptionUpdated($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'active',
                'subscription_ends_at' => isset($payload['resource']['billing_info']['next_billing_time'])
                    ? Carbon::parse($payload['resource']['billing_info']['next_billing_time'])
                    : $user->subscription_ends_at
            ]);
        }

        return response()->json(['message' => 'Subscription updated'], 200);
    }
}
```

### 3. Add Routes

**`routes/web.php`:**

```php
<?php

use App\Http\Controllers\PayPalController;
use App\Http\Controllers\WebhookController;

// Payment routes (requires authentication)
Route::middleware('auth')->group(function () {
    Route::post('/payment/process', [PayPalController::class, 'handlePayment'])
        ->name('payment.process');
    Route::get('/payment/success', [PayPalController::class, 'paymentSuccess'])
        ->name('payment.success');
    Route::get('/payment/cancel', [PayPalController::class, 'paymentCancel'])
        ->name('payment.cancel');

    Route::post('/subscription/create', [PayPalController::class, 'createSubscription'])
        ->name('subscription.create');
    Route::get('/subscription/success', [PayPalController::class, 'subscriptionSuccess'])
        ->name('subscription.success');
    Route::get('/subscription/cancel', [PayPalController::class, 'subscriptionCancel'])
        ->name('subscription.cancel');
});

// Webhook route (no CSRF protection needed)
Route::post('/paypal/webhook', [WebhookController::class, 'handleWebhook'])
    ->name('paypal.webhook');
```

### 4. Disable CSRF for Webhook

**`app/Http/Middleware/VerifyCsrfToken.php`:**

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    protected $except = [
        'paypal/webhook',
    ];
}
```

---

## Frontend Implementation

### 1. Pricing Component

**`resources/js/Components/Pricing.jsx`:**

```jsx
import { Link } from "@inertiajs/react";

export default function Pricing() {
    const plans = [
        {
            name: "Starter",
            price: "19.99",
            priceText: "one time payment",
            description: "Essential features for casual users",
            features: [
                "One Day Access",
                "Get 24-hour access to premium features",
                "Basic Support",
                "Email Notifications",
            ],
            buttonText: "Start Now",
            href: "payment/process",
            featured: false,
        },
        {
            name: "Pro",
            price: "49.99",
            priceText: "monthly",
            description: "Advanced features for power users",
            features: [
                "No restrictions",
                "Get monthly access to all features",
                "Priority Support",
                "Advanced Analytics",
            ],
            href: "subscription/create",
            buttonText: "Upgrade to Pro",
            featured: true,
        },
    ];

    return (
        <div className="mx-auto px-6 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Simple, Transparent Pricing
                </h2>
                <p className="text-slate-300 text-lg">
                    Choose the plan that best fits your needs
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 px-6">
                {plans.map((plan, index) => (
                    <div
                        key={index}
                        className={`
                            rounded-xl p-8 backdrop-blur-sm transition
                            ${
                                plan.featured
                                    ? "bg-slate-800/50 border-2 border-emerald-500/20 shadow-lg"
                                    : "bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50"
                            }
                        `}
                    >
                        {plan.featured && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </span>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {plan.name}
                            </h3>
                            <div className="flex items-baseline text-white mb-2">
                                <span className="text-4xl font-bold">$</span>
                                <span className="text-5xl font-bold tracking-tight">
                                    {plan.price}
                                </span>
                                <span className="ml-1 text-xl text-slate-400">
                                    /{plan.priceText}
                                </span>
                            </div>
                            <p className="text-slate-300">{plan.description}</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, featureIndex) => (
                                <li
                                    key={featureIndex}
                                    className="flex items-center text-slate-300"
                                >
                                    <svg
                                        className="w-5 h-5 text-emerald-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                            <Link
                                href={plan.href}
                                method="post"
                                data={{
                                    plan: plan.name,
                                    price: plan.price,
                                }}
                                className={`
                                    w-full inline-flex justify-center items-center px-6 py-3 rounded-lg text-center font-semibold transition-all
                                    ${
                                        plan.featured
                                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                                            : "bg-slate-900/50 text-white hover:bg-slate-900/70 border border-slate-700/50"
                                    }
                                `}
                            >
                                {plan.buttonText}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### 2. Success Page Component

**`resources/js/Pages/PaypalSuccess.jsx`:**

```jsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function PaypalSuccess() {
    const { message } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your payment has been processed
                    successfully.
                </p>

                <div className="space-y-4">
                    <Link
                        href={route("dashboard")}
                        className="block w-full bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-700 transition-colors"
                    >
                        Return to Dashboard
                    </Link>

                    <Link
                        href={"/"}
                        className="block w-full text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                        Need help? Contact Support
                    </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        A confirmation email has been sent to your registered
                        email address.
                    </p>
                </div>
            </div>
        </div>
    );
}
```

---

## Email Notifications

### 1. Create Email Mailable Classes

**Payment Success Email:**

```bash
php artisan make:mail PaymentSuccessEmail
```

**`app/Mail/PaymentSuccessEmail.php`:**

```php
<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public array $order
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            from: env('MAIL_FROM_ADDRESS'),
            subject: 'Payment Successful - Welcome to Premium!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.payment-success',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
```

**Subscription Success Email:**

```bash
php artisan make:mail SubscriptionSuccessEmail
```

**`app/Mail/SubscriptionSuccessEmail.php`:**

```php
<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionSuccessEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public array $subscription
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Your Subscription!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.subscription-success',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
```

### 2. Create Email Views

**`resources/views/emails/payment-success.blade.php`:**

```blade
<!DOCTYPE html>
<html>
<head>
    <title>Payment Successful</title>
</head>
<body>
    <h1>Payment Successful!</h1>
    <p>Dear {{ $user->name }},</p>
    <p>Thank you for your payment. Your 24-hour access has been activated.</p>
    <p>Order ID: {{ $order['id'] }}</p>
    <p>Amount: ${{ $order['purchase_units'][0]['amount']['value'] }}</p>
    <p>Status: {{ $order['status'] }}</p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>Your Team</p>
</body>
</html>
```

**`resources/views/emails/subscription-success.blade.php`:**

```blade
<!DOCTYPE html>
<html>
<head>
    <title>Subscription Activated</title>
</head>
<body>
    <h1>Welcome to Your Subscription!</h1>
    <p>Dear {{ $user->name }},</p>
    <p>Your subscription has been successfully activated.</p>
    <p>Subscription ID: {{ $subscription['id'] }}</p>
    <p>Status: {{ $subscription['status'] }}</p>
    <p>Next Billing Date: {{ $subscription['billing_info']['next_billing_time'] ?? 'N/A' }}</p>
    <p>You now have full access to all premium features.</p>
    <p>If you have any questions, please contact our support team.</p>
    <p>Best regards,<br>Your Team</p>
</body>
</html>
```

---

## Webhook Integration

### 1. Setting up PayPal Webhooks

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Navigate to your app
3. Click on "Webhooks" in the sidebar
4. Click "Add Webhook"
5. Enter your webhook URL: `https://yourdomain.com/paypal/webhook`
6. Select events to subscribe to:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.CREATED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - `BILLING.SUBSCRIPTION.REACTIVATED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.UPDATED`
7. Save and copy the Webhook ID to your `.env` file

### 2. Testing Webhooks Locally

Use a tool like [ngrok](https://ngrok.com/) to expose your local development server:

```bash
ngrok http 8000
```

Use the ngrok URL for your webhook endpoint.

---

## Testing

### 1. Test Sandbox Credentials

PayPal provides test accounts in sandbox mode:
- Go to [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
- Use the test buyer account to make purchases
- Use the test seller account credentials in your `.env`

### 2. Test Payment Flow

1. Navigate to your pricing page
2. Click on a payment plan
3. You'll be redirected to PayPal
4. Log in with sandbox buyer credentials
5. Complete the payment
6. Verify you're redirected to the success page
7. Check that the user record is updated
8. Verify the email was sent

### 3. Test Subscription Flow

Similar to payment flow, but:
1. Choose a subscription plan
2. Complete subscription on PayPal
3. Verify subscription is created and activated
4. Check webhook events in PayPal dashboard

### 4. Test Webhooks

1. Manually trigger webhook events from PayPal dashboard
2. Check application logs for webhook processing
3. Verify database updates

---

## Production Checklist

- [ ] Switch `PAYPAL_MODE` to `live` in `.env`
- [ ] Add live PayPal credentials
- [ ] Set up webhooks with production URL
- [ ] Configure proper email settings (SMTP, etc.)
- [ ] Test with small real payment
- [ ] Enable queue workers for emails
- [ ] Set up monitoring for webhook failures
- [ ] Implement proper error handling and logging
- [ ] Add subscription management UI for users
- [ ] Implement subscription cancellation functionality
- [ ] Set up automated tests

---

## Common Issues & Solutions

### Issue: Webhook verification fails
**Solution:** Ensure your webhook URL is publicly accessible and the webhook ID in `.env` matches the one in PayPal dashboard.

### Issue: Payment redirect doesn't work
**Solution:** Check that your routes are properly defined and accessible. Ensure Inertia.js is configured correctly.

### Issue: User not updated after payment
**Solution:** Check logs for errors. Ensure the user is authenticated and the database fields exist.

### Issue: Emails not sending
**Solution:** Configure mail settings in `.env`. Consider using queue workers for email sending.

---

## Additional Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [srmklive/paypal Package Documentation](https://github.com/srmklive/laravel-paypal)
- [Inertia.js Documentation](https://inertiajs.com/)

---

## Support

For issues or questions:
- Check PayPal Developer docs
- Review application logs (`storage/logs/laravel.log`)
- Check webhook events in PayPal dashboard
- Review the package GitHub issues

---

**Last Updated:** 2025-01-27
