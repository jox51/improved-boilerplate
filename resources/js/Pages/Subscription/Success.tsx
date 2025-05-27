import React, { useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "@/Components/LandingPage/Layout";
import { PageProps } from "@/types";
import { trackSubscriptionSuccess } from "../../utils/gtmUtils";

interface CheckoutSessionData {
    customer_email?: string;
    subscription_id?: string;
    plan_description?: string;
    status?: string;
    period_end_timestamp?: number;
}

interface SuccessPageProps extends PageProps {
    checkoutSession?: CheckoutSessionData | null;
    status?: string;
    laravelVersion?: string;
    phpVersion?: string;
}

export default function Success({
    checkoutSession,
    status,
    laravelVersion,
    phpVersion,
}: SuccessPageProps) {
    useEffect(() => {
        // Track subscription success with available data
        const planName = checkoutSession?.plan_description || "Unknown Plan";
        const userId = checkoutSession?.customer_email; // Using email as user identifier
        const additionalData = {
            subscription_id: checkoutSession?.subscription_id,
            status: checkoutSession?.status,
            period_end_timestamp: checkoutSession?.period_end_timestamp,
        };
        
        trackSubscriptionSuccess(planName, userId, additionalData);
    }, [checkoutSession]);

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return "";
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadgeClasses = (status?: string) => {
        if (status === "active") {
            return "bg-green-100 text-green-800";
        }
        return "bg-yellow-100 text-yellow-800";
    };

    return (
        <>
            <Head title="Subscription Successful" />
            <Layout laravelVersion={laravelVersion} phpVersion={phpVersion}>
                <div className="min-h-full flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-950/90 to-stone-900/90">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
                                <svg
                                    className="w-8 h-8 text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Thank You for Subscribing!
                            </h1>

                            <p className="text-lg text-gray-300 mb-8">
                                Your subscription has been processed
                                successfully.
                            </p>
                        </div>

                        {checkoutSession ? (
                            <>
                                {/* Subscription Details Card */}
                                <div className="bg-gray-800/50 backdrop-blur-sm shadow-lg rounded-lg p-6 border border-gray-700/50">
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

                                    <div className="space-y-3">
                                        {checkoutSession.customer_email && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                                <span className="text-gray-300 font-medium">
                                                    Email:
                                                </span>
                                                <span className="text-white">
                                                    {
                                                        checkoutSession.customer_email
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {checkoutSession.subscription_id && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                                <span className="text-gray-300 font-medium">
                                                    Subscription ID:
                                                </span>
                                                <span className="text-white font-mono text-sm">
                                                    {
                                                        checkoutSession.subscription_id
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {checkoutSession.plan_description && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                                <span className="text-gray-300 font-medium">
                                                    Plan:
                                                </span>
                                                <span className="text-white font-semibold">
                                                    {
                                                        checkoutSession.plan_description
                                                    }
                                                </span>
                                            </div>
                                        )}

                                        {checkoutSession.status && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                                                <span className="text-gray-300 font-medium">
                                                    Status:
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                                                        checkoutSession.status
                                                    )}`}
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                                                    {checkoutSession.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        checkoutSession.status.slice(
                                                            1
                                                        )}
                                                </span>
                                            </div>
                                        )}

                                        {checkoutSession.period_end_timestamp && (
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-300 font-medium">
                                                    Next Billing Date:
                                                </span>
                                                <span className="text-white">
                                                    {formatDate(
                                                        checkoutSession.period_end_timestamp
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <svg
                                            className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <div>
                                            <h3 className="text-sm font-medium text-blue-300 mb-1">
                                                What's Next?
                                            </h3>
                                            <p className="text-sm text-blue-200">
                                                You can manage your
                                                subscription, update payment
                                                methods, and view billing
                                                history from your dashboard.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Error State */
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
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
                                            Unable to Retrieve Details
                                        </h3>
                                        <p className="text-sm text-yellow-200">
                                            There was an issue retrieving your
                                            subscription details, but your
                                            payment may have been successful.
                                            Please check your dashboard or
                                            contact support if you need
                                            assistance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <Link
                                href="/app"
                                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-center inline-flex items-center justify-center transform hover:scale-105"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 7.5m0 0L16.5 12M21 7.5H3"
                                    />
                                </svg>
                                Go to App
                            </Link>

                            <Link
                                href="/"
                                className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 font-medium py-3 px-6 rounded-lg transition duration-200 text-center inline-flex items-center justify-center border border-gray-600/50"
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
                                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                    />
                                </svg>
                                Back to Home
                            </Link>
                        </div>

                        {/* Support Contact */}
                        <div className="text-center pt-6 border-t border-gray-700/50">
                            <p className="text-sm text-gray-400">
                                Need help?
                                <a
                                    href="mailto:support@arbscreener.com"
                                    className="text-blue-400 hover:text-blue-300 font-medium ml-1"
                                >
                                    Contact Support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
