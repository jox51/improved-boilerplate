<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WhopController extends Controller
{
    /**
     * Get Whop plan ID based on plan type
     */
    protected function getPlanId(string $planType): ?string
    {
        $field = $planType === 'monthly' ? 'monthly_plan_id' : 'yearly_plan_id';
        return config("payment.providers.whop.{$field}");
    }

    /**
     * Show subscription page with Whop checkout
     */
    public function createSubscription(Request $request, string $planType)
    {
        if (!in_array($planType, ['monthly', 'yearly'])) {
            return redirect()->back()->with('error', 'Invalid plan type.');
        }

        $user = Auth::user();
        $planId = $this->getPlanId($planType);

        // Validate that we have the necessary plan ID
        if (empty($planId)) {
            Log::error('Whop plan ID not configured', [
                'plan_type' => $planType,
                'config_key' => "payment.providers.whop.{$planType}_plan_id"
            ]);
            return redirect()->back()->with('error', 'Whop plan not configured. Please contact support.');
        }

        Log::info('Whop subscription attempt', [
            'plan_id' => $planId,
            'plan_type' => $planType,
            'user_id' => $user->id
        ]);

        // Render the Whop subscription page with embedded checkout
        return Inertia::render('Subscription/WhopCheckout', [
            'planId' => $planId,
            'planType' => $planType,
            'userEmail' => $user->email,
            'userName' => $user->name,
        ]);
    }

    /**
     * Handle subscription success callback
     */
    public function subscriptionSuccess(Request $request)
    {
        $user = Auth::user();
        $receiptId = $request->get('receipt_id');
        $planId = $request->get('plan_id');

        if (!$receiptId || !$planId) {
            return redirect()->route('dashboard')->with('error', 'Invalid subscription data.');
        }

        try {
            // Determine plan type based on plan ID
            $planType = $this->determinePlanType($planId);

            // Update user subscription status
            /** @var \App\Models\User $user */
            $user->update([
                'payment_provider' => 'whop',
                'whop_payment_id' => $receiptId,
                'subscription_status' => 'active',
            ]);

            Log::info('Whop subscription success', [
                'user_id' => $user->id,
                'receipt_id' => $receiptId,
                'plan_type' => $planType
            ]);

            return Inertia::render('Subscription/WhopSuccess', [
                'customerEmail' => $user->email,
                'receiptId' => $receiptId,
                'planDescription' => ucfirst($planType) . ' Subscription',
                'status' => 'active',
                'message' => 'Subscription activated successfully!'
            ]);

        } catch (\Exception $e) {
            Log::error('Whop subscription success error', [
                'error' => $e->getMessage(),
                'receipt_id' => $receiptId ?? null
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
     * Determine plan type from plan ID
     */
    protected function determinePlanType(string $planId): string
    {
        $monthlyPlanId = config('payment.providers.whop.monthly_plan_id');
        $yearlyPlanId = config('payment.providers.whop.yearly_plan_id');

        if ($planId === $yearlyPlanId) {
            return 'yearly';
        }

        return 'monthly';
    }

    /**
     * Redirect to Whop manage subscription page
     */
    public function redirectToBillingPortal(Request $request)
    {
        $user = Auth::user();

        if (!$user->whop_payment_id) {
            return redirect()->back()->with('error', 'No active Whop subscription found.');
        }

        try {
            // Redirect to Whop's subscription management page
            // Users manage their subscriptions directly on Whop
            return redirect()->away('https://whop.com/hub/');
        } catch (\Exception $e) {
            Log::error('Whop billing portal error', [
                'error' => $e->getMessage(),
                'user_id' => $user->id
            ]);
            return redirect()->back()->with('error', 'Unable to access billing portal.');
        }
    }
}
