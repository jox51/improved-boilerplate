<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    /**
     * Create a new Stripe Checkout session for subscription
     *
     * @param Request $request
     * @param string $planType
     * @return \Illuminate\Http\Response|\Laravel\Cashier\Checkout\Response
     */
    public function createCheckoutSession(Request $request, string $planType)
    {
        $user = $request->user();
        $priceId = null;

        // Determine the price ID based on plan type
        if ($planType === 'monthly') {
            $priceId = config('cashier.monthly_price_id');
        } elseif ($planType === 'yearly') {
            $priceId = config('cashier.yearly_price_id');
        } else {
            // Handle invalid plan type
            return redirect()->back()->withErrors(['plan' => 'Invalid plan selected.']);
        }

        // Check if price ID is configured
        if (!$priceId) {
            return redirect()->back()->withErrors(['plan' => 'Pricing information is not configured correctly.']);
        }

        // Create the checkout session
        return $user->newSubscription('default', $priceId)
                    ->checkout([
                        'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
                        'cancel_url' => route('subscription.cancel'),
                    ]);
    }

    /**
     * Handle successful subscription payment
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function subscriptionSuccess(Request $request)
    {
        $sessionId = $request->get('session_id');
        
        if (!$sessionId) {
            Log::warning('Subscription success accessed without session_id');
            return redirect()->route('dashboard')->with('error', 'Invalid session. Please check your dashboard for subscription status.');
        }

        try {
            // Initialize Stripe client
            $stripe = new \Stripe\StripeClient(config('cashier.secret'));
            
            // Retrieve checkout session with expanded data
            $checkoutSession = $stripe->checkout->sessions->retrieve($sessionId, [
                'expand' => ['line_items', 'subscription']
            ]);
            
            Log::info('Stripe checkout session retrieved successfully', [
                'session_id' => $sessionId,
                'customer_email' => $checkoutSession->customer_details->email ?? 'N/A',
                'subscription_id' => $checkoutSession->subscription->id ?? 'N/A'
            ]);
            
            // Extract only necessary data from checkout session
            $checkoutSessionData = null;
            if ($checkoutSession) {
                $checkoutSessionData = [
                    'customer_email' => $checkoutSession->customer_details->email ?? null,
                    'subscription_id' => $checkoutSession->subscription->id ?? null,
                    'plan_description' => $checkoutSession->line_items->data[0]->description ?? null,
                    'status' => $checkoutSession->subscription->status ?? null,
                    'period_end_timestamp' => $checkoutSession->subscription->current_period_end ?? null,
                ];
            }
            
            return Inertia::render('Subscription/Success', [
                'checkoutSession' => $checkoutSessionData,
                'status' => session('status'),
            ]);
            
        } catch (\Stripe\Exception\ApiErrorException $e) {
            Log::error('Stripe Checkout Session retrieval failed', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
                'error_type' => get_class($e)
            ]);
            
            return Inertia::render('Subscription/Success', [
                'checkoutSession' => null,
                'status' => 'Could not retrieve subscription details. Your payment may have been processed successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Unexpected error during subscription success handling', [
                'session_id' => $sessionId,
                'error' => $e->getMessage()
            ]);
            
            return redirect()->route('dashboard')->with('error', 'An unexpected error occurred. Please check your dashboard for subscription status.');
        }
    }

    /**
     * Handle cancelled subscription payment
     *
     * @return \Illuminate\Http\Response
     */
    public function subscriptionCancel()
    {
        Log::info('User cancelled subscription checkout');
        
        return Inertia::render('Subscription/Cancel');
    }

    /**
     * Show billing information page with subscription details
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function showBillingInformation(Request $request)
    {
        $user = $request->user();
        
        // Determine subscription status
        $subscriptionStatus = $user->subscribed('default');
        
        // Get subscription renewal date
        $renewalDate = null;
        if ($subscriptionStatus && $user->subscription('default')) {
            $subscription = $user->subscription('default');
            $renewalDateTimestamp = $subscription->asStripeSubscription()->current_period_end;
            $renewalDate = Carbon::createFromTimestamp($renewalDateTimestamp);
        }
        
        // Get user name
        $userName = $user->name;
        
        // Generate billing portal URL
        $billingPortalUrl = route('billing.portal');
        
        return Inertia::render('Subscription/Show', [
            'subscriptionStatus' => $subscriptionStatus,
            'renewalDate' => $renewalDate,
            'userName' => $userName,
            'billingPortalUrl' => $billingPortalUrl,
        ]);
    }

    /**
     * Redirect authenticated user to Stripe billing portal
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function redirectToBillingPortal(Request $request)
    {
        return $request->user()->redirectToBillingPortal(route('app.index'));
    }
}