import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import PricingCard from "./Pricing/PricingCard";

interface PricingSectionProps {
    isAuthenticated: boolean;
    isUserSubscribed: boolean;
}

const PricingSection: React.FC<PricingSectionProps> = ({
    isAuthenticated,
    isUserSubscribed,
}) => {
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
                    />
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
