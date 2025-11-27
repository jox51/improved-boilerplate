<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('payment_provider')->nullable()->after('subscription_status'); // 'stripe' or 'paypal'
            $table->string('paypal_subscription_id')->nullable()->after('payment_provider');
            $table->string('paypal_payer_id')->nullable()->after('paypal_subscription_id');
            $table->timestamp('paypal_subscription_ends_at')->nullable()->after('paypal_payer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'payment_provider',
                'paypal_subscription_id',
                'paypal_payer_id',
                'paypal_subscription_ends_at'
            ]);
        });
    }
};
