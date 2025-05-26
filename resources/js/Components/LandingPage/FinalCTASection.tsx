import React from "react";

interface FinalCTASectionProps {
    headline?: string;
    ctaText?: string;
    ctaLink?: string;
    subtext?: string;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({
    headline = "Ready to Maximize Your Arbitrage Profits?",
    ctaText = "Start Your Free Trial",
    ctaLink = "https://arbscreener.com/register",
    subtext = "Join thousands of traders already using Arbscreener to discover profitable opportunities.",
}) => {
    return (
        <section className="py-20 bg-gradient-to-br from-indigo-950/90 to-stone-900/90">
            <div
                className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                data-aos="fade-up"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                    {headline}
                </h2>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    {subtext}
                </p>
                <a
                    href={ctaLink}
                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-12 py-4 rounded-xl text-white font-bold text-xl transition-all duration-300 transform hover:scale-105 profit-glow"
                >
                    <i className="fas fa-rocket mr-3"></i>
                    {ctaText}
                </a>
            </div>
        </section>
    );
};

export default FinalCTASection;
