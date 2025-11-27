import React from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface WhopCheckoutProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    planId: string;
    planType: 'monthly' | 'yearly';
    userEmail: string;
    userName: string;
}

export default function WhopCheckout({ auth, planId, planType, userEmail, userName }: WhopCheckoutProps) {
    if (!planId) {
        return (
            <>
                <Head title="Checkout Error" />
                <AuthenticatedLayout
                    header={
                        <h2 className="text-xl font-semibold leading-tight text-white">
                            Subscription Checkout
                        </h2>
                    }
                >
                    <div className="py-12">
                        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                            <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-sm sm:rounded-lg">
                                <div className="p-6 text-white">
                                    <div className="text-center text-red-400">
                                        <p className="text-lg font-semibold mb-4">Configuration Error</p>
                                        <p>Whop Plan ID is not configured. Please contact support.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AuthenticatedLayout>
            </>
        );
    }

    return (
        <>
            <Head title={`${planType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription - Whop Checkout`} />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        {planType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription Checkout
                    </h2>
                }
            >
                <div className="py-12 bg-gray-900">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-gray-800 border border-gray-700 shadow-xl sm:rounded-lg">
                            <div className="p-8">
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold text-white mb-3">
                                        Complete Your {planType === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
                                    </h3>
                                    <p className="text-gray-400">
                                        You're subscribing as: <strong className="text-blue-400">{userEmail}</strong>
                                    </p>
                                </div>

                                {/* Whop Checkout Embed */}
                                <div className="relative bg-gray-900 rounded-lg p-6 border border-gray-700">
                                    {/* Custom CSS to override Whop styles */}
                                    <style dangerouslySetInnerHTML={{ __html: `
                                        /* Force dark theme on Whop widget */
                                        .whop-checkout-wrapper,
                                        .whop-checkout-wrapper iframe,
                                        .whop-checkout-wrapper > div,
                                        [data-whop-checkout],
                                        [data-whop-checkout] > div,
                                        [data-whop-checkout] iframe {
                                            background-color: #111827 !important;
                                        }

                                        /* Hide any white backgrounds */
                                        .whop-checkout-wrapper * {
                                            background-color: transparent !important;
                                        }

                                        /* Ensure proper contrast */
                                        .whop-checkout-wrapper {
                                            color: white !important;
                                        }
                                    ` }} />

                                    <div className="whop-checkout-wrapper min-h-[500px]">
                                        <WhopCheckoutEmbed
                                            planId={planId}
                                            theme="dark"
                                            prefill={{
                                                email: userEmail
                                            }}
                                            skipRedirect={true}
                                            onComplete={(completedPlanId, receiptId) => {
                                                // Redirect to success page with plan and receipt information
                                                const params = new URLSearchParams({
                                                    receipt_id: receiptId || '',
                                                    plan_id: completedPlanId,
                                                });

                                                router.visit(`/whop/subscription-success?${params.toString()}`);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <a
                                        href="/dashboard"
                                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                                    >
                                        Cancel and return to dashboard
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
