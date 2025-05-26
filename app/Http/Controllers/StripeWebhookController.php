<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Http\Controllers\WebhookController as CashierWebhookController;
use App\Models\User;
use App\Mail\UserSubscriptionConfirmationEmail;
use App\Mail\AdminNewSubscriptionEmail;

class StripeWebhookController extends CashierWebhookController
{
    /**
     * Handle a checkout session completed event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleCheckoutSessionCompleted(array $payload)
    {
        Log::info('Stripe Webhook Received: checkout.session.completed', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'subscription' => $payload['data']['object']['subscription'] ?? null,
        ]);

        // You can add custom logic here before calling the parent method
        // For example, sending notifications, updating other parts of your application, etc.

        $response = parent::handleCheckoutSessionCompleted($payload);

        // You can also add custom logic after Cashier has processed the event
        $customerId = $payload['data']['object']['customer'] ?? null;
        $subscriptionStripeId = $payload['data']['object']['subscription'] ?? null;

        if ($customerId) {
            $user = User::where('stripe_id', $customerId)->first();
            if ($user && $subscriptionStripeId) {
                $user->refresh(); // Refresh to get any updates from parent call
                $subscription = $user->subscriptions()->where('stripe_id', $subscriptionStripeId)->first();
                if ($subscription && !empty($subscription->stripe_status) && $user->subscription_status !== $subscription->stripe_status) {
                    $user->subscription_status = $subscription->stripe_status;
                    $user->save();
                    Log::info('User subscription_status updated via checkout.session.completed.', [
                        'user_id' => $user->id,
                        'new_status' => $user->subscription_status,
                        'stripe_subscription_id' => $subscriptionStripeId
                    ]);
                }

                // Note: Subscription emails are now sent from handleCustomerSubscriptionUpdated when status becomes 'active'
                // This prevents sending emails prematurely when subscription status is still 'incomplete'
            } elseif (!$user) {
                Log::warning('User not found for checkout.session.completed.', ['customer_id' => $customerId]);
            }
        }

        return $response;
    }

    /**
     * Handle an invoice payment succeeded event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handleInvoicePaymentSucceeded($payload)
    {
        Log::info('Stripe Webhook Received: invoice.payment_succeeded', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'subscription' => $payload['data']['object']['subscription'] ?? null,
            'amount_paid' => $payload['data']['object']['amount_paid'] ?? null,
        ]);
        
        // Add custom logic here if needed
        // For example, sending payment confirmation emails, updating user credits, etc.
        $customerId = $payload['data']['object']['customer'] ?? null;
        $subscriptionStripeId = $payload['data']['object']['subscription'] ?? null;

        if ($customerId) {
            $user = User::where('stripe_id', $customerId)->first();
            if ($user && $subscriptionStripeId) {
                // Refresh user to ensure we have the latest state if other events modified it
                $user->refresh();
                $subscription = $user->subscriptions()->where('stripe_id', $subscriptionStripeId)->first();
                if ($subscription && !empty($subscription->stripe_status) && $user->subscription_status !== $subscription->stripe_status) {
                    $user->subscription_status = $subscription->stripe_status;
                    $user->save();
                    Log::info('User subscription_status updated via invoice.payment_succeeded.', [
                        'user_id' => $user->id,
                        'new_status' => $user->subscription_status,
                        'stripe_subscription_id' => $subscriptionStripeId
                    ]);
                } elseif (!$subscription) {
                    Log::warning('Subscription not found for invoice.payment_succeeded.', ['user_id' => $user->id, 'subscription_id' => $subscriptionStripeId]);
                }
            } elseif (!$user) {
                Log::warning('User not found for invoice.payment_succeeded.', ['customer_id' => $customerId]);
            }
        }
        
        return $this->successMethod();
    }

    /**
     * Handle a customer subscription created event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleCustomerSubscriptionCreated(array $payload)
    {
        Log::info('Stripe Webhook Received: customer.subscription.created', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'status' => $payload['data']['object']['status'] ?? null,
        ]);

        // Add custom logic for new subscriptions
        // For example, sending welcome emails, updating user permissions, etc.

        $response = parent::handleCustomerSubscriptionCreated($payload);

        $customerId = $payload['data']['object']['customer'] ?? null;
        $newStatus = $payload['data']['object']['status'] ?? null; // Status of the subscription itself

        if ($customerId) {
            $user = User::where('stripe_id', $customerId)->first();
            if ($user && $newStatus && $user->subscription_status !== $newStatus) {
                $user->subscription_status = $newStatus;
                $user->save();
                Log::info('User subscription_status updated via customer.subscription.created.', [
                    'user_id' => $user->id,
                    'new_status' => $user->subscription_status,
                    'stripe_subscription_id' => $payload['data']['object']['id'] ?? null
                ]);
            } elseif (!$user) {
                Log::warning('User not found for customer.subscription.created.', ['customer_id' => $customerId]);
            }
        }

        return $response;
    }

    /**
     * Handle a customer subscription updated event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleCustomerSubscriptionUpdated(array $payload)
    {
        Log::info('Stripe Webhook Received: customer.subscription.updated', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'status' => $payload['data']['object']['status'] ?? null,
            'current_period_end' => $payload['data']['object']['current_period_end'] ?? null,
        ]);

        // Add custom logic for subscription updates
        // For example, handling plan changes, updating billing cycles, etc.

        $response = parent::handleCustomerSubscriptionUpdated($payload);

        $customerId = $payload['data']['object']['customer'] ?? null;
        $newStatus = $payload['data']['object']['status'] ?? null; // Status of the subscription itself
        $subscriptionStripeId = $payload['data']['object']['id'] ?? null;

        if ($customerId) {
            $user = User::where('stripe_id', $customerId)->first();
            if ($user && $newStatus && $user->subscription_status !== $newStatus) {
                $user->subscription_status = $newStatus;
                $user->save();
                Log::info('User subscription_status updated via customer.subscription.updated.', [
                    'user_id' => $user->id,
                    'new_status' => $user->subscription_status,
                    'stripe_subscription_id' => $subscriptionStripeId
                ]);

                // Send subscription confirmation emails when subscription becomes active
                if ($newStatus === 'active' && $subscriptionStripeId) {
                    $subscription = $user->subscriptions()->where('stripe_id', $subscriptionStripeId)->first();
                    if ($subscription) {
                        $this->sendSubscriptionEmails($user, $subscription);
                        Log::info('Subscription emails triggered by customer.subscription.updated with active status', [
                            'user_id' => $user->id,
                            'subscription_id' => $subscriptionStripeId,
                            'status' => $newStatus
                        ]);
                    } else {
                        Log::warning('Subscription not found for sending emails in customer.subscription.updated', [
                            'user_id' => $user->id,
                            'subscription_id' => $subscriptionStripeId
                        ]);
                    }
                }
            } elseif (!$user) {
                Log::warning('User not found for customer.subscription.updated.', ['customer_id' => $customerId]);
            }
        }

        return $response;
    }

    /**
     * Handle a customer subscription deleted event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleCustomerSubscriptionDeleted(array $payload)
    {
        Log::info('Stripe Webhook Received: customer.subscription.deleted', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'status' => $payload['data']['object']['status'] ?? null,
        ]);

        // Add custom logic for subscription cancellations
        // For example, sending cancellation emails, updating user access, etc.

        $response = parent::handleCustomerSubscriptionDeleted($payload);

        $customerId = $payload['data']['object']['customer'] ?? null;
        // For a deleted subscription, the status effectively becomes 'canceled'.
        // The payload status for a deleted subscription object is typically 'canceled'.
        $statusToSet = $payload['data']['object']['status'] ?? 'canceled';


        if ($customerId) {
            $user = User::where('stripe_id', $customerId)->first();
            if ($user && $user->subscription_status !== $statusToSet) {
                $user->subscription_status = $statusToSet;
                $user->save();
                Log::info('User subscription_status updated to canceled via customer.subscription.deleted.', [
                    'user_id' => $user->id,
                    'new_status' => $user->subscription_status,
                    'stripe_subscription_id' => $payload['data']['object']['id'] ?? null
                ]);
            } elseif (!$user) {
                Log::warning('User not found for customer.subscription.deleted.', ['customer_id' => $customerId]);
            }
        }

        return $response;
    }

    /**
     * Handle an invoice payment failed event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleInvoicePaymentFailed(array $payload)
    {
        Log::warning('Stripe Webhook Received: invoice.payment_failed', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'subscription' => $payload['data']['object']['subscription'] ?? null,
            'amount_due' => $payload['data']['object']['amount_due'] ?? null,
        ]);

        // Add custom logic for failed payments
        // For example, sending payment failure notifications, updating user status, etc.

        return parent::handleInvoicePaymentFailed($payload);
    }

    /**
     * Handle a payment method attached event.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handlePaymentMethodAttached(array $payload)
    {
        Log::info('Stripe Webhook Received: payment_method.attached', [
            'id' => $payload['id'] ?? null,
            'customer' => $payload['data']['object']['customer'] ?? null,
            'type' => $payload['data']['object']['type'] ?? null,
        ]);

        // Add custom logic for payment method updates
        // For example, updating user payment preferences, sending confirmations, etc.

        return parent::handlePaymentMethodAttached($payload);
    }

    /**
     * Send subscription confirmation emails to user and admin
     *
     * @param User $user
     * @param \Laravel\Cashier\Subscription $subscription
     * @return void
     */
    private function sendSubscriptionEmails(User $user, $subscription)
    {
        try {
            // Determine plan type from subscription
            $planType = $this->determinePlanType($subscription);
            $subscriptionStatus = $subscription->stripe_status ?? 'active';

            // Send confirmation email to user
            Mail::to($user->email)->send(new UserSubscriptionConfirmationEmail($user, $planType, $subscriptionStatus));
            
            // Send notification email to admin
            $adminEmail = config('mail.from.address');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new AdminNewSubscriptionEmail($user, $planType, $subscriptionStatus));
            }

            Log::info('Subscription emails sent successfully', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'admin_email' => $adminEmail,
                'plan_type' => $planType,
                'subscription_status' => $subscriptionStatus
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to send subscription emails', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    /**
     * Determine plan type from subscription
     *
     * @param \Laravel\Cashier\Subscription $subscription
     * @return string
     */
    private function determinePlanType($subscription)
    {
        if (!$subscription) {
            return 'unknown';
        }

        // Get the price ID from the subscription
        $stripeSubscription = $subscription->asStripeSubscription();
        $priceId = $stripeSubscription->items->data[0]->price->id ?? null;

        // Compare with configured price IDs
        $monthlyPriceId = config('cashier.monthly_price_id');
        $yearlyPriceId = config('cashier.yearly_price_id');

        if ($priceId === $monthlyPriceId) {
            return 'monthly';
        } elseif ($priceId === $yearlyPriceId) {
            return 'yearly';
        }

        // Fallback: try to determine from price nickname or interval
        $interval = $stripeSubscription->items->data[0]->price->recurring->interval ?? null;
        if ($interval === 'month') {
            return 'monthly';
        } elseif ($interval === 'year') {
            return 'yearly';
        }

        return 'subscription';
    }

}