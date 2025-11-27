# Whop Payment Integration Guide

This document provides a comprehensive guide on how Whop payment provider is integrated into this Laravel/React application. Use this as a reference when implementing Whop in another Laravel/React project.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Architecture](#architecture)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Webhook Integration](#webhook-integration)
7. [Database Schema](#database-schema)
8. [Payment Flow](#payment-flow)
9. [Implementation Checklist](#implementation-checklist)
10. [Testing](#testing)

---

## Overview

Whop is integrated as an alternative payment provider to Stripe for handling booking payments. The integration allows customers to book psychic reading sessions using Whop's embedded checkout.

**Key Features:**
- Embedded Whop checkout widget
- Webhook handling for payment confirmations
- Support for both guest and authenticated users
- Email notifications after successful payment
- Session recovery for incomplete payments

---

## Prerequisites

### Required Accounts & Services
- **Whop Account**: Create an account at [whop.com](https://whop.com)
- **Whop Plan IDs**: Each product/service needs a Whop Plan ID
- **Laravel Application**: Laravel 10+ with Inertia.js
- **React**: React 18+
- **Mail Service**: Configured mail driver for email notifications

### Required Knowledge
- Laravel routing and controllers
- Inertia.js (React)
- React hooks and state management
- Webhook handling and security
- Database migrations

---

## Architecture

### Components Involved

**Backend:**
- `WhopWebhookController.php` - Handles incoming Whop webhooks
- `BookingController.php` - Manages booking creation and success pages
- `Reader` Model - Stores Whop Plan IDs via environment keys
- `Booking` Model - Stores booking and payment information
- `BookingNotificationService.php` - Sends confirmation emails
- Database migrations for Whop-related fields

**Frontend:**
- `ReaderBooking.tsx` - Booking page with Whop checkout
- `WhopSuccess.tsx` - Payment success confirmation page
- Whop Checkout React SDK

---

## Backend Setup

### 1. Install Dependencies

No PHP dependencies required for Whop (unlike Stripe).

### 2. Environment Configuration

Add Whop plan IDs to your `.env` file:

```env
# WHOP PLAN IDs (one for each reader/service)
WHOP_PEYTON_PLAN_ID=plan_xxxxx
WHOP_TAAVET_PLAN_ID=plan_xxxxx
WHOP_SUMMERBREAD_PLAN_ID=plan_xxxxx
# ... add more as needed
```

**Note:** Plan IDs are stored in environment variables, and the `readers` table stores the environment key name (e.g., `WHOP_PEYTON_PLAN_ID`), not the actual plan ID.

### 3. Database Migrations

Create migrations to add Whop-related fields:

#### Migration 1: Add `whop_payment_id` to bookings table

```php
// File: database/migrations/YYYY_MM_DD_add_whop_payment_id_to_bookings_table.php

public function up(): void
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->string('whop_payment_id')->nullable()->after('stripe_session_id');
    });
}

public function down(): void
{
    Schema::table('bookings', function (Blueprint $table) {
        $table->dropColumn('whop_payment_id');
    });
}
```

#### Migration 2: Add `whop_plan_env_key` to readers table

```php
// File: database/migrations/YYYY_MM_DD_add_whop_plan_env_key_to_readers_table.php

public function up(): void
{
    Schema::table('readers', function (Blueprint $table) {
        $table->string('whop_plan_env_key')->nullable()->after('stripe_price_id');
    });
}

public function down(): void
{
    Schema::table('readers', function (Blueprint $table) {
        $table->dropColumn('whop_plan_env_key');
    });
}
```

Run migrations:
```bash
php artisan migrate
```

### 4. Update Models

#### Booking Model

Add `whop_payment_id` to the `$fillable` array:

```php
// File: app/Models/Booking.php

protected $fillable = [
    'user_id',
    'guest_email',
    'guest_session_id',
    'reader_name',
    'reader_slug',
    'booking_date',
    'booking_time',
    'contact_email',
    'contact_phone',
    'amount_paid',
    'currency',
    'stripe_session_id',
    'whop_payment_id',  // Add this
    'payment_status',
    'booking_status',
    'notes',
];
```

#### Reader Model

Add the Whop plan ID retrieval method:

```php
// File: app/Models/Reader.php

protected $fillable = [
    'email',
    'slug',
    'name',
    'description',
    'image',
    'stripe_price_id',
    'stripe_product_id',
    'whop_plan_env_key',  // Add this
    'is_active',
];

/**
 * Get the actual Whop plan ID from the environment variable.
 */
public function getWhopPlanId(): ?string
{
    if ($this->whop_plan_env_key) {
        return env($this->whop_plan_env_key);
    }

    return null;
}
```

### 5. Update ReaderService

Ensure the service includes Whop plan IDs:

```php
// File: app/Services/ReaderService.php

public static function getFormattedReaderData(string $slug): ?array
{
    $reader = self::getReaderBySlug($slug);

    if (!$reader) {
        return null;
    }

    return [
        'name' => $reader['reader_name'],
        'image' => asset('images/reader_images/' . $reader['image']),
        'description' => $reader['description'],
        'priceId' => env($reader['stripe_price_id']),
        'productId' => env($reader['stripe_product_id']),
        'whopPlanId' => $reader['whop_plan_id'],  // Add this
        'slug' => $reader['reader_slug'],
    ];
}
```

### 6. Create WhopWebhookController

Create the webhook handler at `app/Http/Controllers/WhopWebhookController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\BookingNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WhopWebhookController extends Controller
{
    /**
     * Handle Whop webhook events
     */
    public function handleWebhook(Request $request)
    {
        // Log the webhook for debugging
        Log::info('Whop webhook received', $request->all());

        $event = $request->input('event');
        $data = $request->input('data');

        switch ($event) {
            case 'checkout.session.completed':
            case 'membership.created':
            case 'payment.succeeded':
                return $this->handleSuccessfulPayment($data);

            case 'membership.cancelled':
            case 'payment.failed':
                return $this->handleFailedPayment($data);

            default:
                Log::info('Unhandled Whop webhook event: ' . $event);
                return response()->json(['message' => 'Event not handled'], 200);
        }
    }

    /**
     * Handle successful payment from Whop
     */
    private function handleSuccessfulPayment($data)
    {
        try {
            // Extract relevant data from Whop webhook
            $email = $data['email'] ?? $data['customer']['email'] ?? null;
            $planId = $data['plan_id'] ?? $data['product']['id'] ?? null;
            $metadata = $data['metadata'] ?? [];

            if (!$email || !$planId) {
                Log::error('Missing email or plan ID in Whop webhook', $data);
                return response()->json(['error' => 'Missing required data'], 400);
            }

            // Find the booking by email and update payment status
            $booking = Booking::where('contact_email', $email)
                ->where('payment_status', 'pending')
                ->orderBy('created_at', 'desc')
                ->first();

            if ($booking) {
                $booking->payment_status = 'paid';
                $booking->booking_status = 'confirmed';
                $booking->whop_payment_id = $data['id'] ?? null;
                $booking->save();

                // Send confirmation notifications
                try {
                    BookingNotificationService::sendBookingConfirmationEmails($booking);
                } catch (\Exception $e) {
                    Log::error('Failed to send booking confirmation emails: ' . $e->getMessage());
                }

                Log::info('Booking payment confirmed for: ' . $email);
            } else {
                Log::warning('No pending booking found for email: ' . $email);
            }

            return response()->json(['message' => 'Payment processed successfully'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop payment webhook: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle failed payment from Whop
     */
    private function handleFailedPayment($data)
    {
        try {
            $email = $data['email'] ?? $data['customer']['email'] ?? null;

            if (!$email) {
                return response()->json(['error' => 'Missing email'], 400);
            }

            // Find and update the booking
            $booking = Booking::where('contact_email', $email)
                ->where('payment_status', 'pending')
                ->orderBy('created_at', 'desc')
                ->first();

            if ($booking) {
                $booking->payment_status = 'failed';
                $booking->booking_status = 'cancelled';
                $booking->save();

                Log::info('Booking payment failed for: ' . $email);
            }

            return response()->json(['message' => 'Payment failure processed'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop payment failure: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
}
```

### 7. Add Webhook Route

Update `routes/web.php`:

```php
use App\Http\Controllers\WhopWebhookController;

// Webhook route (outside middleware groups for server-to-server communication)
Route::post('whop/webhook', [WhopWebhookController::class, 'handleWebhook'])
    ->name('whop.webhook');
```

### 8. Update CSRF Protection

Exclude the Whop webhook from CSRF verification in `app/Http/Middleware/VerifyCsrfToken.php`:

```php
protected $except = [
    'stripe/*',
    'whop/webhook',  // Add this
];
```

### 9. Add Success Route

Add a route for the Whop success page in `routes/web.php`:

```php
Route::get('/booking/whop-success', [BookingController::class, 'whopSuccess'])
    ->name('booking.whop.success');
```

### 10. Add Success Handler to BookingController

Add the `whopSuccess` method to `app/Http/Controllers/BookingController.php`:

```php
/**
 * Handle successful booking payment from Whop
 */
public function whopSuccess(Request $request)
{
    // Get parameters from our redirect
    $email = $request->get('email');
    $receiptId = $request->get('receipt_id');
    $planId = $request->get('plan_id');
    $readerName = $request->get('reader_name');
    $bookingDate = $request->get('booking_date');
    $bookingTime = $request->get('booking_time');
    $bookingId = $request->get('booking_id');

    // Try to find the booking by ID first, then by email
    $booking = null;
    if ($bookingId) {
        $booking = Booking::find($bookingId);
    }

    if (!$booking && $email) {
        $booking = Booking::where('contact_email', $email)
            ->orderBy('created_at', 'desc')
            ->first();
    }

    // If we found a booking, update it as paid
    if ($booking && $booking->payment_status === 'pending') {
        $booking->update([
            'payment_status' => 'paid',
            'booking_status' => 'confirmed',
            'whop_payment_id' => $receiptId,
        ]);

        // Send confirmation emails
        try {
            BookingNotificationService::sendBookingConfirmationEmails($booking);
        } catch (\Exception $e) {
            Log::error('Failed to send booking confirmation emails', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    // Prepare booking details for display
    $bookingDetails = null;
    if ($booking) {
        $bookingDetails = [
            'reader_name' => $booking->reader_name,
            'booking_date' => $booking->booking_date ? $booking->booking_date->format('Y-m-d') : null,
            'booking_time' => $booking->booking_time,
            'contact_email' => $booking->contact_email,
            'contact_phone' => $booking->contact_phone,
            'payment_status' => $booking->payment_status,
            'receipt_id' => $receiptId,
        ];
    } else {
        // If no booking found in DB, use the URL parameters
        $bookingDetails = [
            'reader_name' => $readerName,
            'booking_date' => $bookingDate,
            'booking_time' => $bookingTime,
            'contact_email' => $email,
            'contact_phone' => null,
            'payment_status' => 'paid',
            'receipt_id' => $receiptId,
        ];
    }

    return Inertia::render('Booking/WhopSuccess', [
        'bookingDetails' => $bookingDetails,
        'email' => $email,
        'receiptId' => $receiptId,
        'planId' => $planId,
    ]);
}
```

---

## Frontend Setup

### 1. Install Whop Checkout SDK

```bash
npm install @whop/checkout
```

Current version in this project: `^0.0.39`

### 2. Import Whop Component

In your booking page component (`ReaderBooking.tsx`):

```tsx
import { WhopCheckoutEmbed } from "@whop/checkout/react";
```

### 3. Implement Checkout Flow

Key components of the booking page:

```tsx
export default function ReaderBooking({ reader, unavailableSlots, auth }: PageProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [contactEmail, setContactEmail] = useState<string>('');
    const [contactPhone, setContactPhone] = useState<string>('');

    // Handle checkout button click
    const handleCheckout = async () => {
        if (!selectedDate || !selectedTime || !contactEmail || !contactPhone) {
            alert('Please fill in all required fields.');
            return;
        }

        try {
            // Create booking record first
            const response = await axios.post('/api/booking/create', {
                readerName: reader.name,
                readerSlug: reader.slug,
                bookingDate: format(selectedDate, 'yyyy-MM-dd'),
                bookingTime: selectedTime,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
            });

            if (response.data.success) {
                // Store booking ID for recovery after payment
                sessionStorage.setItem('pendingBookingId', response.data.bookingId);
                setShowCheckout(true);
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        }
    };

    return (
        <>
            {/* Date/Time Selection UI */}

            {showCheckout ? (
                <div className="card-mystical rounded-2xl p-8">
                    {reader.whopPlanId ? (
                        <WhopCheckoutEmbed
                            planId={reader.whopPlanId}
                            theme="dark"
                            prefill={{
                                email: contactEmail
                            }}
                            skipRedirect={true}
                            onComplete={(planId, receiptId) => {
                                // Redirect to success page with booking details
                                const params = new URLSearchParams({
                                    email: contactEmail,
                                    receipt_id: receiptId || '',
                                    plan_id: planId,
                                    reader_name: reader.name,
                                    booking_date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
                                    booking_time: selectedTime || '',
                                    booking_id: sessionStorage.getItem('pendingBookingId') || ''
                                });

                                window.location.href = `/booking/whop-success?${params.toString()}`;
                            }}
                        />
                    ) : (
                        <div className="text-center text-red-400 p-8">
                            <p>Error: Whop Plan ID is not configured for this reader.</p>
                        </div>
                    )}
                </div>
            ) : (
                {/* Show date/time selection form */}
            )}
        </>
    );
}
```

### 4. Create Success Page Component

Create `resources/js/Pages/Booking/WhopSuccess.tsx`:

```tsx
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Layout from '@/Components/LandingPage/Layout';
import { format, parse } from 'date-fns';

interface BookingDetails {
    reader_name?: string;
    booking_date?: string | null;
    booking_time?: string | null;
    contact_email?: string;
    contact_phone?: string;
    payment_status?: string;
    receipt_id?: string;
}

interface PageProps {
    bookingDetails: BookingDetails | null;
    email?: string;
    receiptId?: string;
    planId?: string;
}

export default function WhopSuccess({ bookingDetails, email, receiptId, planId }: PageProps) {
    return (
        <>
            <Head title="Payment Successful" />
            <Layout>
                <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
                    <div className="container mx-auto px-6 max-w-3xl">
                        <div className="card-mystical rounded-2xl p-12">
                            {/* Success Icon */}
                            <div className="text-center mb-8">
                                <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <i className="fas fa-check text-5xl text-white"></i>
                                </div>

                                <h1 className="text-4xl font-bold text-white mb-4">
                                    Payment Successful!
                                </h1>

                                <p className="text-xl text-gray-300">
                                    Thank you for your booking. Your payment has been processed successfully.
                                </p>
                            </div>

                            {/* Display booking details */}
                            {bookingDetails && (
                                <div className="bg-gray-800/50 rounded-xl p-8 mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-6 text-center">
                                        Booking Details
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Display booking information */}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center">
                                <Link href="/" className="btn-mystical">
                                    Return Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
```

---

## Webhook Integration

### Setting Up Webhooks in Whop

1. **Log into Whop Dashboard**
2. **Navigate to Webhooks Settings**
3. **Add Webhook Endpoint**: `https://yourdomain.com/whop/webhook`
4. **Select Events to Listen To:**
   - `checkout.session.completed`
   - `membership.created`
   - `payment.succeeded`
   - `membership.cancelled`
   - `payment.failed`

### Webhook Security (Optional Enhancement)

For production, add webhook signature verification:

```php
// In WhopWebhookController.php

public function handleWebhook(Request $request)
{
    // Verify webhook signature (if Whop provides one)
    $signature = $request->header('X-Whop-Signature');
    $webhookSecret = config('services.whop.webhook_secret');

    if ($webhookSecret && !$this->verifySignature($request->getContent(), $signature, $webhookSecret)) {
        Log::warning('Invalid Whop webhook signature');
        return response()->json(['error' => 'Invalid signature'], 401);
    }

    // ... rest of the webhook handling
}

private function verifySignature($payload, $signature, $secret)
{
    // Implement signature verification based on Whop's documentation
    // This is a placeholder - check Whop docs for actual implementation
    return hash_equals($signature, hash_hmac('sha256', $payload, $secret));
}
```

Add to `.env`:
```env
WHOP_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## Database Schema

### Bookings Table

Key fields related to Whop:

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `contact_email` | string | Customer email (used to match webhook) |
| `whop_payment_id` | string (nullable) | Whop payment/receipt ID |
| `payment_status` | string | pending, paid, failed |
| `booking_status` | string | pending, confirmed, cancelled |
| `reader_slug` | string | Reference to reader |
| `booking_date` | date | Scheduled date |
| `booking_time` | string | Scheduled time |

### Readers Table

Key fields related to Whop:

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key |
| `slug` | string | Unique identifier |
| `whop_plan_env_key` | string (nullable) | Environment variable key for Whop Plan ID |

---

## Payment Flow

### Step-by-Step Flow

1. **User Selects Date/Time**
   - Customer chooses booking date and time
   - Enters contact information (email, phone)

2. **Create Pending Booking**
   - Frontend calls `/api/booking/create`
   - Backend creates booking with `payment_status: 'pending'`
   - Returns `bookingId` to frontend
   - Frontend stores `bookingId` in sessionStorage

3. **Display Whop Checkout**
   - Frontend shows `WhopCheckoutEmbed` component
   - Passes `planId` from reader configuration
   - Prefills customer email

4. **Customer Completes Payment**
   - Customer enters payment details in Whop widget
   - Whop processes payment

5. **Whop Redirects to Success**
   - `onComplete` callback fires with `planId` and `receiptId`
   - Frontend redirects to `/booking/whop-success` with query params

6. **Success Page Updates Booking**
   - Backend retrieves booking by ID or email
   - Updates `payment_status` to 'paid'
   - Updates `booking_status` to 'confirmed'
   - Stores `whop_payment_id`
   - Sends confirmation emails

7. **Webhook Confirmation (Async)**
   - Whop sends webhook to `/whop/webhook`
   - Backend confirms payment status
   - Additional verification and logging

### Sequence Diagram

```
Customer → Frontend: Select date/time + contact info
Frontend → Backend: POST /api/booking/create
Backend → Database: Create booking (status: pending)
Backend → Frontend: Return bookingId
Frontend: Store bookingId in sessionStorage
Frontend: Display WhopCheckoutEmbed

Customer → Whop: Complete payment
Whop → Frontend: onComplete(planId, receiptId)
Frontend → Browser: Redirect to /booking/whop-success

Browser → Backend: GET /booking/whop-success?params
Backend → Database: Find & update booking (status: paid)
Backend → Email Service: Send confirmation emails
Backend → Frontend: Render success page

Whop → Backend: POST /whop/webhook (async)
Backend → Database: Verify & log payment
```

---

## Implementation Checklist

Use this checklist when implementing Whop in a new Laravel/React project:

### Backend Tasks

- [ ] Install and configure Laravel with Inertia.js
- [ ] Add Whop plan IDs to `.env`
- [ ] Create migration for `whop_payment_id` in bookings table
- [ ] Create migration for `whop_plan_env_key` in readers/products table
- [ ] Run migrations
- [ ] Update Booking model with `whop_payment_id` in fillable
- [ ] Update Reader/Product model with `getWhopPlanId()` method
- [ ] Create `WhopWebhookController.php`
- [ ] Add webhook route in `web.php`
- [ ] Exclude webhook from CSRF protection
- [ ] Add success route in `web.php`
- [ ] Implement `whopSuccess()` method in booking controller
- [ ] Update service to include Whop plan IDs
- [ ] Test webhook locally with tools like ngrok

### Frontend Tasks

- [ ] Install `@whop/checkout` package via npm
- [ ] Import `WhopCheckoutEmbed` in booking component
- [ ] Add state management for checkout flow
- [ ] Implement booking creation API call
- [ ] Implement Whop checkout embed
- [ ] Handle `onComplete` callback
- [ ] Create success page component (`WhopSuccess.tsx`)
- [ ] Style success page to match your design
- [ ] Add error handling for missing plan IDs
- [ ] Test complete booking flow

### Database Tasks

- [ ] Seed readers/products with `whop_plan_env_key` values
- [ ] Verify booking table has all required fields
- [ ] Set up database indexes if needed for performance

### Configuration Tasks

- [ ] Configure Whop webhook endpoint in Whop dashboard
- [ ] Set up email notifications (SMTP, etc.)
- [ ] Test emails are being sent correctly
- [ ] Configure logging for webhook events
- [ ] Add webhook signature verification (optional)

### Testing Tasks

- [ ] Test booking creation
- [ ] Test Whop checkout embed displays correctly
- [ ] Test successful payment flow
- [ ] Test failed payment handling
- [ ] Test webhook receives events
- [ ] Test email notifications
- [ ] Test with both authenticated and guest users
- [ ] Test edge cases (expired sessions, etc.)

---

## Testing

### Local Testing with ngrok

Since Whop webhooks need a public URL:

1. **Install ngrok**: [ngrok.com](https://ngrok.com)

2. **Start your Laravel server**:
   ```bash
   php artisan serve
   ```

3. **Create ngrok tunnel**:
   ```bash
   ngrok http 8000
   ```

4. **Update Whop webhook URL**:
   - Use the ngrok URL: `https://your-ngrok-url.ngrok.io/whop/webhook`

5. **Monitor webhook logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```

### Testing Checklist

1. **Test Successful Payment**
   - [ ] Booking is created with status 'pending'
   - [ ] Whop checkout displays correctly
   - [ ] Payment completes successfully
   - [ ] Success page shows correct booking details
   - [ ] Booking status updates to 'paid' and 'confirmed'
   - [ ] `whop_payment_id` is stored
   - [ ] Confirmation emails are sent
   - [ ] Webhook is received and processed

2. **Test Failed Payment**
   - [ ] Booking remains in 'pending' state
   - [ ] User sees appropriate error message
   - [ ] Can retry payment

3. **Test Guest Bookings**
   - [ ] Guest can book without account
   - [ ] Email is used as identifier
   - [ ] Confirmation email is sent to guest email

4. **Test Webhook Events**
   - [ ] `payment.succeeded` event updates booking
   - [ ] `payment.failed` event marks booking as failed
   - [ ] Unhandled events are logged

---

## Key Differences from Stripe

| Feature | Stripe | Whop |
|---------|--------|------|
| **PHP SDK** | Required (`stripe/stripe-php`) | Not required |
| **JS SDK** | `@stripe/stripe-js`, `@stripe/react-stripe-js` | `@whop/checkout` |
| **Checkout Style** | Embedded checkout with Elements | Embedded checkout widget |
| **Webhook Signature** | Required verification | Optional (check Whop docs) |
| **Plan/Price IDs** | Stored as env variables | Stored as env variable keys in DB |
| **Customer Creation** | Explicit API call | Handled by Whop |
| **Session Management** | Manual session creation | Handled by widget |

---

## Troubleshooting

### Common Issues

**1. Whop Checkout Not Displaying**
- Verify `reader.whopPlanId` is not null
- Check browser console for errors
- Ensure `@whop/checkout` is installed

**2. Webhook Not Receiving Events**
- Check webhook URL in Whop dashboard
- Verify route is not protected by CSRF
- Check firewall/server settings
- Use ngrok for local testing

**3. Booking Not Updating After Payment**
- Check webhook logs in `storage/logs/laravel.log`
- Verify email matching logic in webhook handler
- Ensure booking exists with 'pending' status

**4. Missing Plan ID**
- Verify `.env` has correct plan ID variable
- Verify reader's `whop_plan_env_key` matches env variable name
- Clear config cache: `php artisan config:clear`

**5. Emails Not Sending**
- Check mail configuration in `.env`
- Verify mail driver is set up correctly
- Check logs for email sending errors

---

## Additional Resources

- **Whop Documentation**: [docs.whop.com](https://docs.whop.com)
- **Whop Checkout SDK**: [npmjs.com/package/@whop/checkout](https://www.npmjs.com/package/@whop/checkout)
- **Laravel Documentation**: [laravel.com/docs](https://laravel.com/docs)
- **Inertia.js Documentation**: [inertiajs.com](https://inertiajs.com)

---

## Summary

This integration provides a complete Whop payment solution for a Laravel/React booking system with:

✅ Embedded checkout experience
✅ Webhook handling for payment verification
✅ Email notifications
✅ Support for guest and authenticated users
✅ Database persistence of payment records
✅ Error handling and logging

Follow this guide step-by-step to implement Whop in your Laravel/React application. Adjust routes, models, and controllers to match your specific application structure.

---

**Document Version**: 1.0
**Last Updated**: 2025
**Application**: gg3readings Laravel/React Booking System
