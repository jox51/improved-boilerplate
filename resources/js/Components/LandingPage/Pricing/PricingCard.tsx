import React from "react";
import PlanFeatureListItem from "./PlanFeatureListItem";
import { Link } from "@inertiajs/react";
import { trackButtonClick } from "../../../utils/gtmUtils";

interface PricingCardProps {
    planName: string;
    price: string;
    pricePeriod: string;
    features: string[];
    buttonText: string;
    buttonLink: string;
    isPopular?: boolean;
    popularText?: string;
    savingsText?: string;
    aosDelay?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    gradientFrom?: string;
    gradientTo?: string;
    priceColor: string;
    buttonGradientFrom: string;
    buttonGradientTo: string;
    buttonHoverGradientFrom: string;
    buttonHoverGradientTo: string;
    hasProfitGlow?: boolean;
    isAuthenticated: boolean;
    isUserSubscribed: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
    planName,
    price,
    pricePeriod,
    features,
    buttonText,
    buttonLink,
    isPopular = false,
    popularText = "Most Popular",
    savingsText,
    aosDelay = "",
    borderColor = "border-gray-700",
    hoverBorderColor = "hover:border-blue-500/50",
    gradientFrom,
    gradientTo,
    priceColor,
    buttonGradientFrom,
    buttonGradientTo,
    buttonHoverGradientFrom,
    buttonHoverGradientTo,
    hasProfitGlow = false,
    isAuthenticated,
    isUserSubscribed,
}) => {
    const cardClasses =
        isPopular && gradientFrom && gradientTo
            ? `bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-8 border-2 border-purple-500 relative overflow-hidden`
            : `bg-gray-800 rounded-2xl p-8 border ${borderColor} ${hoverBorderColor} transition-all duration-300`;

    const buttonClasses = `w-full bg-gradient-to-r ${buttonGradientFrom} ${buttonGradientTo} hover:${buttonHoverGradientFrom} hover:${buttonHoverGradientTo} py-3 rounded-xl text-white font-semibold text-center block transition-all duration-300 transform hover:scale-105${
        hasProfitGlow ? " profit-glow" : ""
    }`;

    // Determine button text and link based on authentication and subscription status
    const getButtonText = () => {
        if (isUserSubscribed) {
            return "Go to App";
        }
        if (!isAuthenticated) {
            return "Sign Up to Subscribe";
        }
        return buttonText;
    };

    const getButtonLink = () => {
        if (isUserSubscribed) {
            return "/app";
        }
        if (!isAuthenticated) {
            return "/register";
        }
        return `/subscribe/${buttonLink}`;
    };

    const actualButtonText = getButtonText();
    const actualButtonLink = getButtonLink();

    return (
        <div
            className={cardClasses}
            data-aos="fade-up"
            data-aos-delay={aosDelay}
        >
            {isPopular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-full text-sm font-bold">
                    {popularText}
                </div>
            )}

            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                    {planName}
                </h3>
                {savingsText && (
                    <div className="text-green-400 font-semibold mb-4">
                        {savingsText}
                    </div>
                )}
                <div className="mb-6">
                    <span className={`text-5xl font-black ${priceColor}`}>
                        {price}
                    </span>
                    <span className="text-gray-400 ml-2">{pricePeriod}</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                    <PlanFeatureListItem key={index} featureText={feature} />
                ))}
            </ul>

            <a
                href={actualButtonLink}
                className={buttonClasses}
                onClick={() => {
                    // Determine appropriate button name based on user state
                    let buttonName = "select_plan";
                    if (isUserSubscribed) {
                        buttonName = "go_to_app";
                    } else if (!isAuthenticated) {
                        buttonName = "sign_up_to_subscribe";
                    } else {
                        buttonName = `select_plan_${planName.toLowerCase().replace(/\s+/g, '_')}`;
                    }
                    
                    trackButtonClick(buttonName, {
                        button_location: "pricing",
                        plan_name: planName,
                        plan_price: price,
                        user_status: isAuthenticated ? "authenticated" : "visitor",
                        user_subscribed: isUserSubscribed,
                    });
                }}
            >
                {actualButtonText}
            </a>
        </div>
    );
};

export default PricingCard;
