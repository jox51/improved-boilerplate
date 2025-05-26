import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "@/Components/LandingPage/Layout";
import { PageProps } from "@/types";

interface CancelPageProps extends PageProps {
    laravelVersion?: string;
    phpVersion?: string;
}

export default function Cancel({
    laravelVersion,
    phpVersion,
}: CancelPageProps) {
    return (
        <>
            <Head title="Subscription Cancelled" />
            <Layout laravelVersion={laravelVersion} phpVersion={phpVersion}>
                <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-950/90 to-stone-900/90">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-center">
                            {/* Cancel Icon */}
                            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-500/20 border border-yellow-500/30 mb-6">
                                <svg
                                    className="w-8 h-8 text-yellow-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            
                            {/* Main Heading */}
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Subscription Cancelled
                            </h1>
                            
                            <p className="text-lg text-gray-300 mb-8">
                                Your subscription process was cancelled. You can try again anytime.
                            </p>
                        </div>

                        {/* Information Card */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
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
                                    <h3 className="text-sm font-medium text-blue-300 mb-1">No Charges Applied</h3>
                                    <p className="text-sm text-blue-200">
                                        Your payment method was not charged. You can return to our pricing page to select a different plan or try again later.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6">
                            <Link
                                href="/"
                                className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 text-center inline-flex items-center justify-center transform hover:scale-105"
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
                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                </svg>
                                View Pricing
                            </Link>
                            
                            <Link
                                href="/dashboard"
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
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                    />
                                </svg>
                                Go to Dashboard
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