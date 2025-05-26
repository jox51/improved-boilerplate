import React from "react";
import { Head } from "@inertiajs/react";
import { useForm, ValidationError } from "@formspree/react";
import Layout from "../Components/LandingPage/Layout";

function ContactFormInternal({ formspreeId }: { formspreeId: string }) {
    const [state, handleSubmit] = useForm(formspreeId);

    if (state.succeeded) {
        return (
            <p className="text-green-400 text-center text-lg font-medium">
                Thanks for reaching out! We'll get back to you soon.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white transition-colors duration-200"
                    placeholder="your.email@example.com"
                    required
                />
                <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                    className="mt-2 text-sm text-red-400"
                />
            </div>

            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                >
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white transition-colors duration-200 resize-vertical"
                    placeholder="Tell us how we can help you..."
                    required
                />
                <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                    className="mt-2 text-sm text-red-400"
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={state.submitting}
                    className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                    {state.submitting ? (
                        <div className="flex items-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                        </div>
                    ) : (
                        "Send Message"
                    )}
                </button>
            </div>
        </form>
    );
}

export default function ContactPage({ formspreeId }: { formspreeId: string }) {
    return (
        <Layout>
            <Head title="Contact Us - Arbscreener" />
            <div className="py-20 px-4 sm:px-6 lg:px-8 ">
                <div className="max-w-2xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                            Get in Touch
                        </h1>
                        <p className="mt-6 text-xl leading-8 text-gray-300 max-w-3xl mx-auto">
                            Have questions about Arbscreener? Need help with
                            your arbitrage opportunities? We'd love to hear from
                            you and help you succeed.
                        </p>
                    </div>

                    {/* Contact Form Card */}
                    <div className="bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
                        <div className="px-8 py-10 sm:px-12 sm:py-12">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Send us a message
                                </h2>
                                <p className="text-gray-400">
                                    Fill out the form below and we'll get back
                                    to you as soon as possible.
                                </p>
                            </div>

                            <ContactFormInternal formspreeId={formspreeId} />
                        </div>

                        {/* Additional Contact Info */}
                        <div className="bg-gray-750 px-8 py-6 sm:px-12 border-t border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-lg font-medium text-white mb-1">
                                        Quick Response
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        We typically respond within 24 hours
                                    </p>
                                </div>
                                <div className="flex items-center text-indigo-400">
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">
                                        Professional Support
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Help Section */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-400 text-sm">
                            Looking for immediate help? Check out our{" "}
                            <a
                                href="#"
                                className="text-indigo-400 hover:text-indigo-300 underline"
                            >
                                documentation
                            </a>{" "}
                            or{" "}
                            <a
                                href="#"
                                className="text-indigo-400 hover:text-indigo-300 underline"
                            >
                                FAQ section
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
