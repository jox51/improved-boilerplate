import React from 'react';
import SectionHeading from './Shared/SectionHeading';
import FeatureCard from './Features/FeatureCard';

interface Feature {
    icon: string;
    title: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
    borderColor: string;
    hoverBorderColor: string;
    titleColor: string;
    aosDelay: string;
}

const FeaturesSection: React.FC = () => {
    const features: Feature[] = [
        {
            icon: "🎯",
            title: "Spot-to-Spot Arbitrage",
            description: "Find price discrepancies for the same asset across different centralized exchanges.",
            gradientFrom: "from-orange-500/20",
            gradientTo: "to-red-500/20",
            borderColor: "border-orange-500/30",
            hoverBorderColor: "hover:border-orange-400/50",
            titleColor: "text-orange-400",
            aosDelay: "100"
        },
        {
            icon: "📈",
            title: "Futures Arbitrage",
            description: "Capitalize on price differences between spot markets and futures contracts.",
            gradientFrom: "from-blue-500/20",
            gradientTo: "to-cyan-500/20",
            borderColor: "border-blue-500/30",
            hoverBorderColor: "hover:border-blue-400/50",
            titleColor: "text-blue-400",
            aosDelay: "200"
        },
        {
            icon: "🔄",
            title: "DEX-to-DEX Arbitrage",
            description: "Uncover opportunities within and between decentralized exchanges.",
            gradientFrom: "from-purple-500/20",
            gradientTo: "to-pink-500/20",
            borderColor: "border-purple-500/30",
            hoverBorderColor: "hover:border-purple-400/50",
            titleColor: "text-purple-400",
            aosDelay: "300"
        },
        {
            icon: "🌐",
            title: "Multi-Exchange Support",
            description: "Monitor 20+ major CEXs and DEXs simultaneously.",
            gradientFrom: "from-green-500/20",
            gradientTo: "to-emerald-500/20",
            borderColor: "border-green-500/30",
            hoverBorderColor: "hover:border-green-400/50",
            titleColor: "text-green-400",
            aosDelay: "400"
        },
        {
            icon: "🚨",
            title: "Real-Time Alerts",
            description: "Instant notifications via email, Telegram, or in-app for profitable trades.",
            gradientFrom: "from-yellow-500/20",
            gradientTo: "to-orange-500/20",
            borderColor: "border-yellow-500/30",
            hoverBorderColor: "hover:border-yellow-400/50",
            titleColor: "text-yellow-400",
            aosDelay: "500"
        },
        {
            icon: "⚙️",
            title: "Advanced Filtering",
            description: "Customize your scans by exchange, pair, profit margin, and volume.",
            gradientFrom: "from-indigo-500/20",
            gradientTo: "to-blue-500/20",
            borderColor: "border-indigo-500/30",
            hoverBorderColor: "hover:border-indigo-400/50",
            titleColor: "text-indigo-400",
            aosDelay: "600"
        }
    ];

    return (
        <section id="features" className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title={
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Why Choose Arbscreener?
                        </span>
                    }
                    subtitle="Discover powerful features designed to maximize your arbitrage profits"
                    subtitleClassName="text-gray-400"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            gradientFrom={feature.gradientFrom}
                            gradientTo={feature.gradientTo}
                            borderColor={feature.borderColor}
                            hoverBorderColor={feature.hoverBorderColor}
                            titleColor={feature.titleColor}
                            aosDelay={feature.aosDelay}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;