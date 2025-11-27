# PayPal Integration Setup Guide

This guide will help you configure PayPal as a payment provider in your application alongside Stripe.

## Overview

The boilerplate now supports both **Stripe** and **PayPal** as payment providers. Users can select their preferred payment method on the pricing page, and the system will seamlessly handle subscriptions through either provider.

## Features

- ✅ Dual payment provider support (Stripe & PayPal)
- ✅ Seamless provider switching on frontend
- ✅ Sandbox and Live mode support for PayPal
- ✅ Comprehensive webhook handling
- ✅ Email notifications for both providers
- ✅ Shared subscription status across providers
- ✅ No impact on existing Stripe integration

## Prerequisites

1. **PayPal Developer Account**: [Sign up here](https://developer.paypal.com/)
2. **PayPal Business Account** (for live mode)
3. Laravel application with existing Stripe integration

## Configuration Steps

### 1. Create PayPal App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Click **Apps & Credentials**
3. Select **Sandbox** or **Live** mode
4. Click **Create App**
5. Enter app name and click **Create App**
6. Copy your **Client ID** and **Secret**

### 2. Create PayPal Product & Plans

#### Using PayPal Dashboard:

1. Go to your PayPal Business Account
2. Navigate to **Products & Services** → **Subscriptions**
3. Click **Create Plan**
4. Create two plans:
   - **Monthly Plan**: $80/month
   - **Yearly Plan**: $800/year
5. Copy the **Product ID** and **Plan IDs**

#### Using PayPal API (Alternative):

```bash
# You can also create products/plans via API
# See: https://developer.paypal.com/docs/api/subscriptions/v1/
```

### 3. Environment Variables

Update your `.env` file with PayPal credentials:

```env
# Payment Provider Selection
PAYMENT_PROVIDER=stripe  # or 'paypal' to set as default

# PayPal Configuration
PAYPAL_ENABLED=true
PAYPAL_MODE=sandbox  # or 'live' for production

# Sandbox Credentials (for testing)
PAYPAL_SANDBOX_CLIENT_ID=your_sandbox_client_id
PAYPAL_SANDBOX_CLIENT_SECRET=your_sandbox_client_secret
PAYPAL_SANDBOX_PRODUCT_ID=your_sandbox_product_id
PAYPAL_SANDBOX_MONTHLY_PLAN_ID=your_sandbox_monthly_plan_id
PAYPAL_SANDBOX_YEARLY_PLAN_ID=your_sandbox_yearly_plan_id
PAYPAL_SANDBOX_WEBHOOK_ID=your_sandbox_webhook_id

# Live Credentials (for production)
PAYPAL_LIVE_CLIENT_ID=your_live_client_id
PAYPAL_LIVE_CLIENT_SECRET=your_live_client_secret
PAYPAL_LIVE_PRODUCT_ID=your_live_product_id
PAYPAL_LIVE_MONTHLY_PLAN_ID=your_live_monthly_plan_id
PAYPAL_LIVE_YEARLY_PLAN_ID=your_live_yearly_plan_id
PAYPAL_LIVE_WEBHOOK_ID=your_live_webhook_id
PAYPAL_LIVE_APP_ID=your_live_app_id

# General Settings
PAYPAL_CURRENCY=USD
PAYPAL_LOCALE=en_US
```

### 4. Configure Webhooks

#### Create Webhook in PayPal:

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
2. Select your app
3. Click **Webhooks** in sidebar
4. Click **Add Webhook**
5. Enter webhook URL: `https://yourdomain.com/paypal/webhook`
6. Select events to subscribe:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.CREATED`
   - `BILLING.SUBSCRIPTION.EXPIRED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - `BILLING.SUBSCRIPTION.REACTIVATED`
   - `BILLING.SUBSCRIPTION.SUSPENDED`
   - `BILLING.SUBSCRIPTION.UPDATED`
   - `PAYMENT.SALE.COMPLETED`
7. Click **Save**
8. Copy the **Webhook ID** to your `.env` file

#### Test Webhooks Locally:

Use [ngrok](https://ngrok.com/) to expose your local server:

```bash
ngrok http 8000
```

Use the ngrok URL for your webhook endpoint during development.

## Database

The migration has already been run, adding these fields to the `users` table:

- `payment_provider` - Stores 'stripe' or 'paypal'
- `paypal_subscription_id` - PayPal subscription ID
- `paypal_payer_id` - PayPal payer ID
- `paypal_subscription_ends_at` - Next billing date

The existing `subscription_status` field is shared between both providers.

## Frontend Usage

### Payment Provider Toggle

The pricing page now includes a toggle to switch between Stripe and PayPal:

```tsx
// The PricingSection component handles provider selection
<PricingSection
    isAuthenticated={auth.user !== null}
    isUserSubscribed={auth.user?.has_active_subscription ?? false}
    defaultPaymentProvider="stripe"  // or "paypal"
/>
```

Users can switch between providers before selecting a plan. The selected provider determines which payment flow is used.

## Routes

### PayPal Routes:

```php
// Subscription creation
GET /subscribe/paypal/{planType}

// Success callback
GET /paypal/subscription-success?subscription_id={id}

// Cancel callback
GET /paypal/subscription-cancel

// Billing portal (redirects to PayPal)
GET /paypal/billing-portal

// Webhook endpoint
POST /paypal/webhook
```

### Stripe Routes (unchanged):

```php
GET /subscribe/{planType}
GET /subscription-success
GET /subscription-cancel
GET /billing-portal
POST /stripe/webhook
```

## Controllers

### PayPalController

Handles PayPal subscription creation and management:

- `createSubscription()` - Creates PayPal subscription
- `subscriptionSuccess()` - Handles successful subscription
- `subscriptionCancel()` - Handles cancelled subscription
- `redirectToBillingPortal()` - Redirects to PayPal account management

### PayPalWebhookController

Processes PayPal webhook events:

- `handleSubscriptionActivated()`
- `handleSubscriptionCancelled()`
- `handleSubscriptionSuspended()`
- `handlePaymentFailed()`
- `handleSubscriptionExpired()`
- `handleSubscriptionReactivated()`
- `handleSubscriptionUpdated()`

## Configuration Files

### `config/payment.php`

Main payment configuration file that handles both providers:

```php
return [
    'default' => env('PAYMENT_PROVIDER', 'stripe'),
    'providers' => [
        'stripe' => [...],
        'paypal' => [...],
    ],
];
```

### `config/paypal.php`

PayPal-specific configuration with sandbox/live credentials.

## Testing

### 1. Test Sandbox Account

PayPal provides test accounts in sandbox mode:

1. Go to [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
2. Use test buyer account credentials
3. Test subscription flow end-to-end

### 2. Test Payment Flow

1. Navigate to pricing page
2. Toggle to PayPal
3. Click on a plan
4. Complete checkout with sandbox account
5. Verify:
   - User redirected to success page
   - Database updated with PayPal data
   - Email notifications sent
   - Webhooks received

### 3. Test Subscription Management

1. User can access `/paypal/billing-portal`
2. Redirected to PayPal account management
3. Can cancel/update subscription
4. Webhook updates database accordingly

## Switching Providers

### Enabling/Disabling Providers

Control which payment providers are available in your `.env` file:

```env
# Enable/disable individual providers
STRIPE_ENABLED=true   # Set to false to disable Stripe
PAYPAL_ENABLED=true   # Set to false to disable PayPal

# Set the default provider (used when both are enabled)
PAYMENT_PROVIDER=stripe  # or 'paypal'
```

**Frontend Behavior:**
- **Both enabled**: Toggle buttons appear on pricing page, users can choose
- **Only Stripe enabled**: Only Stripe checkout, no toggle shown
- **Only PayPal enabled**: Only PayPal checkout, no toggle shown
- **Both disabled**: Defaults to Stripe (fallback behavior)

### Default Provider

When both providers are enabled, set the default in `.env`:

```env
PAYMENT_PROVIDER=paypal  # Changes default for entire app
```

This determines which provider is pre-selected on the pricing page.

### Per-User Selection

When both providers are enabled, users can choose their preferred provider on the pricing page via the toggle buttons. The selection only affects that specific checkout session.

### Provider-Specific Data

The `payment_provider` field on the user model tracks which provider they used:

```php
$user->payment_provider; // 'stripe' or 'paypal'
```

## Email Notifications

PayPal integration uses the same email templates as Stripe:

- `UserSubscriptionConfirmationEmail` - Sent to user
- `AdminNewSubscriptionEmail` - Sent to admin

Both emails work for PayPal subscriptions automatically.

## Subscription Status

The `subscription_status` field is provider-agnostic and shared:

- `active` - Subscription is active
- `canceled` - Subscription cancelled
- `past_due` - Payment failed
- `suspended` - Temporarily suspended
- `expired` - Subscription expired

The `hasActiveSubscription()` method works regardless of provider:

```php
$user->hasActiveSubscription(); // Returns true if status is 'active'
```

## Production Checklist

- [ ] Switch `PAYPAL_MODE` to `live`
- [ ] Add live PayPal credentials to `.env`
- [ ] Configure webhooks with production URL
- [ ] Test small real payment in live mode
- [ ] Verify webhook delivery in PayPal dashboard
- [ ] Monitor logs for any errors
- [ ] Set up proper error monitoring (Sentry, etc.)
- [ ] Test subscription cancellation flow
- [ ] Verify email notifications work in production

## Troubleshooting

### Webhook Verification Fails

**Issue**: Webhooks return 400 error

**Solution**:
- Verify webhook URL is publicly accessible
- Check webhook ID in `.env` matches PayPal dashboard
- Review webhook logs in PayPal dashboard
- Check `storage/logs/laravel.log` for detailed errors

### User Not Updated After Payment

**Issue**: User data not updating after successful payment

**Solution**:
- Check webhook is configured correctly
- Verify CSRF exception is in place for `/paypal/*`
- Review webhook logs
- Check user has proper subscription_id saved

### Payment Redirect Doesn't Work

**Issue**: User not redirected after payment

**Solution**:
- Verify routes are registered
- Check Inertia.js is configured correctly
- Ensure success/cancel URLs are correct in PayPal response

### Sandbox vs Live Confusion

**Issue**: Using wrong credentials

**Solution**:
- Always check `PAYPAL_MODE` setting
- Sandbox and live use different client IDs/secrets
- Use correct product/plan IDs for each mode

## Additional Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Subscriptions API](https://developer.paypal.com/docs/api/subscriptions/v1/)
- [PayPal Webhooks Guide](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)
- [srmklive/laravel-paypal Package](https://github.com/srmklive/laravel-paypal)

## Support

For issues or questions:

1. Check PayPal Developer documentation
2. Review application logs (`storage/logs/laravel.log`)
3. Check webhook events in PayPal dashboard
4. Review the package GitHub issues

---

**Last Updated**: 2025-11-27
