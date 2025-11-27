<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PayPalWebhookController extends Controller
{
    /**
     * Get PayPal configuration based on mode (sandbox/live)
     */
    protected function getPayPalConfig()
    {
        $mode = config('paypal.mode');

        return [
            'mode' => $mode,
            'sandbox' => [
                'client_id' => config('paypal.sandbox.client_id'),
                'client_secret' => config('paypal.sandbox.client_secret'),
                'app_id' => config('paypal.sandbox.app_id', 'APP-80W284485P519543T'),
            ],
            'live' => [
                'client_id' => config('paypal.live.client_id'),
                'client_secret' => config('paypal.live.client_secret'),
                'app_id' => config('paypal.live.app_id', ''),
            ],
            'currency' => config('paypal.currency', 'USD'),
            'locale' => config('paypal.locale', 'en_US'),
            'payment_action' => config('paypal.payment_action', 'Sale'),
            'notify_url' => config('paypal.notify_url', ''),
            'validate_ssl' => config('paypal.validate_ssl', true),
        ];
    }

    /**
     * Handle PayPal webhook events
     */
    public function handleWebhook(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials($this->getPayPalConfig());
        $token = $provider->getAccessToken();
        $provider->setAccessToken($token);

        $mode = config('paypal.mode');
        $webhookId = config("paypal.{$mode}.webhook_id");

        Log::info('PayPal Webhook Received', [
            'event_type' => $request->input('event_type'),
            'resource_type' => $request->input('resource_type')
        ]);

        $provider->setWebHookID($webhookId);

        try {
            $result = $provider->verifyIPN($request);
            Log::info('PayPal Webhook Verification', ['result' => $result]);

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

                    case 'PAYMENT.SALE.COMPLETED':
                        return $this->handlePaymentCompleted($payload);

                    default:
                        Log::info('PayPal unhandled webhook event', ['event_type' => $eventType]);
                        return response()->json(['message' => 'Event received'], 200);
                }
            }

            Log::error('PayPal webhook verification failed', ['result' => $result]);
            return response()->json(['message' => 'Webhook verification failed'], 400);

        } catch (\Exception $e) {
            Log::error('PayPal webhook error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Webhook error'], 500);
        }
    }

    /**
     * Handle subscription activated event
     */
    private function handleSubscriptionActivated($payload)
    {
        $subscriptionId = $payload['resource']['id'];
        $nextBillingTime = Carbon::parse($payload['resource']['billing_info']['next_billing_time']);

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();

        if ($user) {
            $user->update([
                'subscription_status' => 'active',
                'paypal_subscription_ends_at' => $nextBillingTime,
            ]);

            Log::info('PayPal subscription activated', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        } else {
            Log::warning('PayPal subscription activated but user not found', [
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Subscription activated'], 200);
    }

    /**
     * Handle subscription cancelled event
     */
    private function handleSubscriptionCancelled($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'canceled',
                'paypal_subscription_ends_at' => now()
            ]);

            Log::info('PayPal subscription cancelled', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Subscription cancelled'], 200);
    }

    /**
     * Handle subscription suspended event
     */
    private function handleSubscriptionSuspended($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'suspended'
            ]);

            Log::info('PayPal subscription suspended', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Subscription suspended'], 200);
    }

    /**
     * Handle payment failed event
     */
    private function handlePaymentFailed($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'past_due'
            ]);

            Log::warning('PayPal payment failed', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Payment failed'], 200);
    }

    /**
     * Handle subscription created event
     */
    private function handleSubscriptionCreated($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        Log::info('PayPal subscription created', [
            'subscription_id' => $subscriptionId
        ]);

        return response()->json(['message' => 'Subscription created'], 200);
    }

    /**
     * Handle subscription expired event
     */
    private function handleSubscriptionExpired($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $user->update([
                'subscription_status' => 'expired',
                'paypal_subscription_ends_at' => now()
            ]);

            Log::info('PayPal subscription expired', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Subscription expired'], 200);
    }

    /**
     * Handle subscription reactivated event
     */
    private function handleSubscriptionReactivated($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $nextBillingTime = isset($payload['resource']['billing_info']['next_billing_time'])
                ? Carbon::parse($payload['resource']['billing_info']['next_billing_time'])
                : Carbon::now()->addMonth();

            $user->update([
                'subscription_status' => 'active',
                'paypal_subscription_ends_at' => $nextBillingTime
            ]);

            Log::info('PayPal subscription reactivated', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId
            ]);
        }

        return response()->json(['message' => 'Subscription reactivated'], 200);
    }

    /**
     * Handle subscription updated event
     */
    private function handleSubscriptionUpdated($payload)
    {
        $subscriptionId = $payload['resource']['id'];

        $user = User::where('paypal_subscription_id', $subscriptionId)->first();
        if ($user) {
            $updates = [
                'subscription_status' => strtolower($payload['resource']['status'] ?? 'active')
            ];

            if (isset($payload['resource']['billing_info']['next_billing_time'])) {
                $updates['paypal_subscription_ends_at'] = Carbon::parse($payload['resource']['billing_info']['next_billing_time']);
            }

            $user->update($updates);

            Log::info('PayPal subscription updated', [
                'user_id' => $user->id,
                'subscription_id' => $subscriptionId,
                'updates' => $updates
            ]);
        }

        return response()->json(['message' => 'Subscription updated'], 200);
    }

    /**
     * Handle payment completed event
     */
    private function handlePaymentCompleted($payload)
    {
        Log::info('PayPal payment completed', [
            'payment_id' => $payload['resource']['id'] ?? null
        ]);

        return response()->json(['message' => 'Payment completed'], 200);
    }
}
