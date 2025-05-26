<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class StripeWebhookTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the webhook route exists and is accessible.
     */
    public function test_webhook_route_exists()
    {
        $response = $this->post('/stripe/webhook', [], [
            'Content-Type' => 'application/json',
        ]);

        // The webhook will fail without proper Stripe signature, but the route should exist
        // We expect a 400 or 403 response, not a 404
        $this->assertNotEquals(404, $response->getStatusCode());
    }

    /**
     * Test that the webhook route is named correctly.
     */
    public function test_webhook_route_name()
    {
        $this->assertTrue(route('cashier.webhook') !== null);
        $this->assertStringContainsString('stripe/webhook', route('cashier.webhook'));
    }

    /**
     * Test webhook controller methods exist.
     */
    public function test_webhook_controller_methods_exist()
    {
        $controller = new \App\Http\Controllers\StripeWebhookController();
        
        $this->assertTrue(method_exists($controller, 'handleWebhook'));
        $this->assertTrue(method_exists($controller, 'handleCheckoutSessionCompleted'));
        $this->assertTrue(method_exists($controller, 'handleInvoicePaymentSucceeded'));
        $this->assertTrue(method_exists($controller, 'handleCustomerSubscriptionCreated'));
        $this->assertTrue(method_exists($controller, 'handleCustomerSubscriptionUpdated'));
        $this->assertTrue(method_exists($controller, 'handleCustomerSubscriptionDeleted'));
    }

    /**
     * Test that the controller extends the correct parent class.
     */
    public function test_webhook_controller_inheritance()
    {
        $controller = new \App\Http\Controllers\StripeWebhookController();
        
        $this->assertInstanceOf(
            \Laravel\Cashier\Http\Controllers\WebhookController::class,
            $controller
        );
    }
}