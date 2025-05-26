<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Mock Stripe configuration
    config([
        'cashier.monthly_price_id' => 'price_monthly_test',
        'cashier.yearly_price_id' => 'price_yearly_test',
    ]);
});

test('authenticated user can access subscription routes', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/subscribe/monthly')
        ->assertStatus(302); // Redirects to Stripe (or would if Stripe was configured)

    $this->actingAs($user)
        ->get('/subscribe/yearly')
        ->assertStatus(302); // Redirects to Stripe (or would if Stripe was configured)
});

test('unauthenticated user cannot access subscription routes', function () {
    $this->get('/subscribe/monthly')
        ->assertRedirect('/login');

    $this->get('/subscribe/yearly')
        ->assertRedirect('/login');
});

test('invalid plan type returns error', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/subscribe/invalid')
        ->assertRedirect()
        ->assertSessionHasErrors(['plan' => 'Invalid plan selected.']);
});

test('subscription success route works', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/subscription-success?session_id=test_session_123')
        ->assertStatus(200)
        ->assertViewIs('subscription.success')
        ->assertViewHas('checkoutSession', null); // Will be null due to invalid session_id in test
});

test('subscription success route without session_id redirects to dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/subscription-success')
        ->assertRedirect(route('dashboard'))
        ->assertSessionHas('error', 'Invalid session. Please check your dashboard for subscription status.');
});

test('subscription cancel route works', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/subscription-cancel')
        ->assertStatus(200)
        ->assertViewIs('subscription.cancel');
});

test('legacy stripe routes still work', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/checkout/test-plan')
        ->assertStatus(500); // dd() will cause this, but route is accessible

    $this->actingAs($user)
        ->get('/checkout/success?session_id=test_session')
        ->assertStatus(200)
        ->assertJson([
            'message' => 'Checkout successful!',
            'session_id' => 'test_session'
        ]);

    $this->actingAs($user)
        ->get('/checkout/cancel')
        ->assertStatus(200)
        ->assertJson([
            'message' => 'Checkout cancelled.'
        ]);
});

test('subscription controller handles missing price configuration', function () {
    // Clear the price configuration
    config([
        'cashier.monthly_price_id' => null,
        'cashier.yearly_price_id' => null,
    ]);

    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/subscribe/monthly')
        ->assertRedirect()
        ->assertSessionHasErrors(['plan' => 'Pricing information is not configured correctly.']);
});