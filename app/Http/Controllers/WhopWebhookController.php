<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\UserSubscriptionConfirmationEmail;
use App\Mail\AdminNewSubscriptionEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

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

            case 'membership.expired':
                return $this->handleExpiredSubscription($data);

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
            $receiptId = $data['id'] ?? $data['receipt_id'] ?? null;

            if (!$email) {
                Log::error('Missing email in Whop webhook', $data);
                return response()->json(['error' => 'Missing required data'], 400);
            }

            // Find the user by email
            $user = User::where('email', $email)->first();

            if ($user) {
                // Determine plan type
                $planType = $this->determinePlanType($planId);

                // Update user subscription status
                $user->update([
                    'payment_provider' => 'whop',
                    'whop_payment_id' => $receiptId,
                    'subscription_status' => 'active',
                ]);

                // Send confirmation emails
                try {
                    Mail::to($user->email)->send(new UserSubscriptionConfirmationEmail($user, $planType, 'active'));
                    Mail::to(config('mail.from.address'))->send(new AdminNewSubscriptionEmail($user, $planType, 'active'));
                } catch (\Exception $e) {
                    Log::error('Failed to send Whop subscription confirmation emails: ' . $e->getMessage());
                }

                Log::info('Whop subscription activated for: ' . $email);
            } else {
                Log::warning('No user found for email: ' . $email);
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

            // Find and update the user
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->update([
                    'subscription_status' => 'past_due',
                ]);

                Log::info('Whop subscription payment failed for: ' . $email);
            }

            return response()->json(['message' => 'Payment failure processed'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop payment failure: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Handle expired subscription from Whop
     */
    private function handleExpiredSubscription($data)
    {
        try {
            $email = $data['email'] ?? $data['customer']['email'] ?? null;

            if (!$email) {
                return response()->json(['error' => 'Missing email'], 400);
            }

            // Find and update the user
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->update([
                    'subscription_status' => 'canceled',
                ]);

                Log::info('Whop subscription expired for: ' . $email);
            }

            return response()->json(['message' => 'Subscription expiration processed'], 200);

        } catch (\Exception $e) {
            Log::error('Error processing Whop subscription expiration: ' . $e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    /**
     * Determine plan type from plan ID
     */
    protected function determinePlanType(?string $planId): string
    {
        if (!$planId) {
            return 'monthly';
        }

        $monthlyPlanId = config('payment.providers.whop.monthly_plan_id');
        $yearlyPlanId = config('payment.providers.whop.yearly_plan_id');

        if ($planId === $yearlyPlanId) {
            return 'yearly';
        }

        return 'monthly';
    }
}
