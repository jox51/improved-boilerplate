import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface WhopSuccessProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    customerEmail: string;
    receiptId: string;
    planDescription: string;
    status: string;
    message: string;
}

export default function WhopSuccess({
    auth,
    customerEmail,
    receiptId,
    planDescription,
    status,
    message
}: WhopSuccessProps) {
    return (
        <>
            <Head title="Subscription Successful" />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Subscription Confirmed
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {/* Success Icon */}
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg
                                            className="w-12 h-12 text-green-600"
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

                                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                        Payment Successful!
                                    </h1>

                                    <p className="text-lg text-gray-600 mb-2">
                                        {message || 'Thank you for your subscription!'}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        A confirmation email has been sent to{' '}
                                        <span className="font-semibold">{customerEmail}</span>
                                    </p>
                                </div>

                                {/* Subscription Details */}
                                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
                                        Subscription Details
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="text-sm text-gray-500 mb-1">Plan</div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {planDescription}
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="text-sm text-gray-500 mb-1">Status</div>
                                            <div className="text-lg font-semibold text-green-600 capitalize">
                                                {status}
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="text-sm text-gray-500 mb-1">Email</div>
                                            <div className="text-lg font-semibold text-gray-900">
                                                {customerEmail}
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <div className="text-sm text-gray-500 mb-1">Receipt ID</div>
                                            <div className="text-sm font-mono text-gray-900 break-all">
                                                {receiptId}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-bold text-blue-900 mb-4">
                                        What's Next?
                                    </h3>
                                    <ul className="space-y-3 text-blue-900">
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>You now have full access to all premium features</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>Check your email for your receipt and subscription details</span>
                                        </li>
                                        <li className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span>You can manage your subscription at any time through Whop</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href="/app"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                                            />
                                        </svg>
                                        Go to App
                                    </Link>

                                    <Link
                                        href="/dashboard"
                                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        Return to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
