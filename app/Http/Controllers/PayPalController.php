<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Mail\UserSubscriptionConfirmationEmail;
use App\Mail\AdminNewSubscriptionEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PayPalController extends Controller
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
     * Get PayPal plan ID based on plan type
     */
    protected function getPlanId(string $planType)
    {
        $mode = config('paypal.mode');
        $field = $planType === 'monthly' ? 'monthly_plan_id' : 'yearly_plan_id';
        return config("paypal.{$mode}.{$field}");
    }

    /**
     * Get PayPal product ID based on plan type
     */
    protected function getProductId(string $planType)
    {
        $mode = config('paypal.mode');
        $field = $planType === 'monthly' ? 'monthly_product_id' : 'yearly_product_id';
        return config("paypal.{$mode}.{$field}");
    }

    /**
     * Create recurring subscription
     */
    public function createSubscription(Request $request, string $planType)
    {
        if (!in_array($planType, ['monthly', 'yearly'])) {
            return redirect()->back()->with('error', 'Invalid plan type.');
        }

        $provider = new PayPalClient;
        $provider->setApiCredentials($this->getPayPalConfig());
        $token = $provider->getAccessToken();

        $user = Auth::user();
        $startTime = Carbon::now()->addSeconds(5)->format('Y-m-d\TH:i:s\Z');

        $mode = config('paypal.mode');
        $productId = $this->getProductId($planType);
        $billingPlanId = $this->getPlanId($planType);

        // Validate that we have the necessary IDs
        if (empty($productId)) {
            Log::error('PayPal product ID not configured', [
                'mode' => $mode,
                'config_key' => "paypal.{$mode}.product_id"
            ]);
            return redirect()->back()->with('error', 'PayPal product ID not configured. Please contact support.');
        }

        if (empty($billingPlanId)) {
            Log::error('PayPal billing plan ID not configured', [
                'mode' => $mode,
                'plan_type' => $planType,
                'config_key' => "paypal.{$mode}.{$planType}_plan_id"
            ]);
            return redirect()->back()->with('error', 'PayPal billing plan not configured. Please contact support.');
        }

        Log::info('PayPal subscription attempt', [
            'mode' => $mode,
            'product_id' => $productId,
            'plan_id' => $billingPlanId,
            'plan_type' => $planType,
            'user_id' => $user->id
        ]);

        try {
            $response = $provider->addProductById($productId)
                ->addBillingPlanById($billingPlanId)
                ->setReturnAndCancelUrl(
                    route('paypal.subscription.success'),
                    route('paypal.subscription.cancel')
                )
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
                Log::error('PayPal subscription creation failed', [
                    'response' => $response,
                    'user_id' => $user->id,
                    'plan_type' => $planType
                ]);
                return redirect()->back()->with('error', 'Unable to create subscription at this time.');
            }

        } catch (\Exception $e) {
            Log::error('PayPal subscription error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
                'plan_type' => $planType
            ]);
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Handle subscription success callback
     */
    public function subscriptionSuccess(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials($this->getPayPalConfig());
        $token = $provider->getAccessToken();

        try {
            $subscriptionId = $request->subscription_id;

            if (!$subscriptionId) {
                return redirect()->route('home')->with('error', 'Invalid subscription.');
            }

            $subscription = $provider->showSubscriptionDetails($subscriptionId);
            $user = Auth::user();

            if (isset($subscription['status']) && $subscription['status'] === 'ACTIVE') {
                $nextBillingTime = isset($subscription['billing_info']['next_billing_time'])
                    ? Carbon::parse($subscription['billing_info']['next_billing_time'])
                    : Carbon::now()->addMonth();

                /** @var \App\Models\User $user */
                $user->update([
                    'payment_provider' => 'paypal',
                    'paypal_subscription_id' => $subscription['id'],
                    'subscription_status' => 'active',
                    'paypal_subscription_ends_at' => $nextBillingTime,
                    'paypal_payer_id' => $subscription['subscriber']['payer_id'] ?? null,
                ]);

                // Determine plan type from subscription
                $planType = $this->determinePlanType($subscription);

                // Send confirmation emails
                try {
                    Mail::to($user->email)->send(new UserSubscriptionConfirmationEmail($user, $planType, 'active'));
                    Mail::to(config('mail.from.address'))->send(new AdminNewSubscriptionEmail($user, $planType, 'active'));
                } catch (\Exception $e) {
                    Log::error('PayPal subscription email error', [
                        'error' => $e->getMessage(),
                        'user_id' => $user->id
                    ]);
                }

                return Inertia::render('Subscription/Success', [
                    'customerEmail' => $user->email,
                    'subscriptionId' => $subscription['id'],
                    'planDescription' => ucfirst($planType) . ' Subscription',
                    'status' => 'active',
                    'nextBillingDate' => $nextBillingTime->format('F j, Y'),
                    'message' => 'Subscription activated successfully!'
                ]);
            } else {
                return redirect()->back()->with('error', 'Subscription activation failed.');
            }

        } catch (\Exception $e) {
            Log::error('PayPal subscription success error', [
                'error' => $e->getMessage(),
                'subscription_id' => $request->subscription_id ?? null
            ]);
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Handle subscription cancellation
     */
    public function subscriptionCancel()
    {
        return Inertia::render('Subscription/Cancel', [
            'message' => 'Subscription cancelled by user.'
        ]);
    }

    /**
     * Determine plan type from subscription data
     */
    protected function determinePlanType($subscription): string
    {
        if (!isset($subscription['plan_id'])) {
            return 'monthly';
        }

        $mode = config('paypal.mode');
        $monthlyPlanId = config("paypal.{$mode}.monthly_plan_id");
        $yearlyPlanId = config("paypal.{$mode}.yearly_plan_id");

        if ($subscription['plan_id'] === $yearlyPlanId) {
            return 'yearly';
        }

        return 'monthly';
    }

    /**
     * Redirect to PayPal billing portal (manage subscription)
     */
    public function redirectToBillingPortal(Request $request)
    {
        $user = Auth::user();

        if (!$user->paypal_subscription_id) {
            return redirect()->back()->with('error', 'No active PayPal subscription found.');
        }

        $provider = new PayPalClient;
        $provider->setApiCredentials($this->getPayPalConfig());
        $token = $provider->getAccessToken();

        try {
            // PayPal doesn't have a direct billing portal like Stripe
            // Users need to manage subscriptions through PayPal.com
            return redirect()->away('https://www.paypal.com/myaccount/autopay/');
        } catch (\Exception $e) {
            Log::error('PayPal billing portal error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            return redirect()->back()->with('error', 'Unable to access billing portal.');
        }
    }
}
