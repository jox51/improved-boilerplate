import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/App/AppLayout";

interface SubscriptionShowProps {
    subscriptionStatus: boolean | string;
    renewalDate: string | null;
    userName: string;
    billingPortalUrl: string;
}

export default function SubscriptionShowPage({
    subscriptionStatus,
    renewalDate,
    userName,
    billingPortalUrl,
}: SubscriptionShowProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    console.log({ renewalDate });

    const getStatusDisplay = (status: boolean | string) => {
        if (typeof status === "boolean") {
            return status ? "Active" : "Inactive";
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getStatusBadgeClasses = (status: boolean | string) => {
        const isActive =
            (typeof status === "boolean" && status) ||
            (typeof status === "string" && status.toLowerCase() === "active");

        return isActive
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-red-100 text-red-800 border-red-200";
    };

    const isActiveSubscription =
        (typeof subscriptionStatus === "boolean" && subscriptionStatus) ||
        (typeof subscriptionStatus === "string" &&
            subscriptionStatus.toLowerCase() === "active");

    return (
        <AppLayout title="Billing Information">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Billing Information
                    </h1>
                    <p className="text-gray-300">
                        Manage your subscription and billing details
                    </p>
                </div>

                {/* User Information */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <svg
                            className="w-5 h-5 text-blue-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        Account Information
                    </h2>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-300 font-medium">Name:</span>
                        <span className="text-white">{userName}</span>
                    </div>
                </div>

                {/* Subscription Status */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <svg
                            className="w-5 h-5 text-blue-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Subscription Details
                    </h2>

                    <div className="space-y-4">
                        {/* Status */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                            <span className="text-gray-300 font-medium">
                                Status:
                            </span>
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClasses(
                                    subscriptionStatus
                                )}`}
                            >
                                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                                {getStatusDisplay(subscriptionStatus)}
                            </span>
                        </div>

                        {/* Renewal Date */}
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-300 font-medium">
                                {isActiveSubscription
                                    ? "Renews on:"
                                    : "Subscription:"}
                            </span>
                            <span className="text-white">
                                {renewalDate ? (
                                    formatDate(renewalDate)
                                ) : (
                                    <span className="text-gray-400">
                                        No active subscription
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Billing Portal Link */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                        <svg
                            className="w-5 h-5 text-blue-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        Manage Subscription
                    </h2>

                    <p className="text-gray-300 mb-4">
                        Access your billing portal to update payment methods,
                        view billing history, and manage your subscription
                        settings.
                    </p>

                    <a
                        href={billingPortalUrl}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                        Go to Billing Portal
                    </a>
                </div>

                {/* Additional Information */}
                {!isActiveSubscription && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-6">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-yellow-300 mb-1">
                                    No Active Subscription
                                </h3>
                                <p className="text-sm text-yellow-200">
                                    You currently don't have an active
                                    subscription. Visit the billing portal to
                                    subscribe to a plan and unlock all features.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
