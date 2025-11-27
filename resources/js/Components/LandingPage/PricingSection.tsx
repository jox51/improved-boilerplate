import React, { useState } from "react";
import SectionHeading from "./Shared/SectionHeading";
import PricingCard from "./Pricing/PricingCard";

interface PricingSectionProps {
    isAuthenticated: boolean;
    isUserSubscribed: boolean;
    stripeEnabled?: boolean;
    paypalEnabled?: boolean;
    defaultPaymentProvider?: "stripe" | "paypal";
}

const PricingSection: React.FC<PricingSectionProps> = ({
    isAuthenticated,
    isUserSubscribed,
    stripeEnabled = true,
    paypalEnabled = false,
    defaultPaymentProvider = "stripe",
}) => {
    // Determine the initial payment provider based on what's enabled
    const getInitialProvider = (): "stripe" | "paypal" => {
        // If both are enabled, use the default
        if (stripeEnabled && paypalEnabled) {
            return defaultPaymentProvider;
        }
        // If only one is enabled, use that one
        if (stripeEnabled) return "stripe";
        if (paypalEnabled) return "paypal";
        // Fallback to stripe if neither is explicitly enabled
        return "stripe";
    };

    const [paymentProvider, setPaymentProvider] = useState<"stripe" | "paypal">(getInitialProvider());
    // Pricing plans data
    const monthlyFeatures = [
        "All Project Types",
        "Real-Time Alerts",
        "5 Exchange Connections",
        "Standard Support",
    ];

    const yearlyFeatures = [
        "All Monthly Features",
        "Unlimited Connections",
        "Priority Support",
        "Advanced Analytics",
    ];

    return (
        <section id="pricing" className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Flexible Plans for Every Trader"
                    subtitle="Choose the plan that fits your trading needs"
                    titleClassName="text-white"
                    subtitleClassName="text-gray-400"
                />

                {/* Payment Provider Toggle - Only show if both providers are enabled */}
                {stripeEnabled && paypalEnabled && (
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                            <button
                                onClick={() => setPaymentProvider("stripe")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    paymentProvider === "stripe"
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                                    </svg>
                                    Pay with Stripe
                                </span>
                            </button>
                            <button
                                onClick={() => setPaymentProvider("paypal")}
                                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    paymentProvider === "paypal"
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                                    </svg>
                                    Pay with PayPal
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <PricingCard
                        planName="Monthly"
                        price="$80"
                        pricePeriod="per month"
                        features={monthlyFeatures}
                        buttonText="Choose Monthly"
                        buttonLink="monthly"
                        aosDelay="100"
                        priceColor="text-blue-400"
                        buttonGradientFrom="from-blue-500"
                        buttonGradientTo="to-blue-600"
                        buttonHoverGradientFrom="from-blue-600"
                        buttonHoverGradientTo="to-blue-700"
                        isAuthenticated={isAuthenticated}
                        isUserSubscribed={isUserSubscribed}
                        paymentProvider={paymentProvider}
                    />

                    <PricingCard
                        planName="Yearly"
                        price="$800"
                        pricePeriod="per year"
                        features={yearlyFeatures}
                        buttonText="Choose Yearly"
                        buttonLink="yearly"
                        isPopular={true}
                        popularText="Most Popular"
                        savingsText="Save $160"
                        aosDelay="200"
                        gradientFrom="from-purple-900/50"
                        gradientTo="to-blue-900/50"
                        priceColor="text-purple-400"
                        buttonGradientFrom="from-purple-500"
                        buttonGradientTo="to-blue-600"
                        buttonHoverGradientFrom="from-purple-600"
                        buttonHoverGradientTo="to-blue-700"
                        hasProfitGlow={true}
                        isAuthenticated={isAuthenticated}
                        isUserSubscribed={isUserSubscribed}
                        paymentProvider={paymentProvider}
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
