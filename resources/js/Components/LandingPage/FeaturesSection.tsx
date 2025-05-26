import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import FeatureCard from "./Features/FeatureCard";

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
            title: "Advanced Analytics",
            description:
                "Get deep insights into your data with powerful analytics and visualization tools.",
            gradientFrom: "from-orange-500/20",
            gradientTo: "to-red-500/20",
            borderColor: "border-orange-500/30",
            hoverBorderColor: "hover:border-orange-400/50",
            titleColor: "text-orange-400",
            aosDelay: "100",
        },
        {
            icon: "📈",
            title: "Real-time Monitoring",
            description:
                "Monitor your systems and processes in real-time with instant notifications.",
            gradientFrom: "from-blue-500/20",
            gradientTo: "to-cyan-500/20",
            borderColor: "border-blue-500/30",
            hoverBorderColor: "hover:border-blue-400/50",
            titleColor: "text-blue-400",
            aosDelay: "200",
        },
        {
            icon: "🔄",
            title: "Automation Tools",
            description:
                "Automate repetitive tasks and workflows to increase efficiency and productivity.",
            gradientFrom: "from-purple-500/20",
            gradientTo: "to-pink-500/20",
            borderColor: "border-purple-500/30",
            hoverBorderColor: "hover:border-purple-400/50",
            titleColor: "text-purple-400",
            aosDelay: "300",
        },
        {
            icon: "🌐",
            title: "Multi-Platform Support",
            description:
                "Connect and integrate with 20+ popular platforms and services simultaneously.",
            gradientFrom: "from-green-500/20",
            gradientTo: "to-emerald-500/20",
            borderColor: "border-green-500/30",
            hoverBorderColor: "hover:border-green-400/50",
            titleColor: "text-green-400",
            aosDelay: "400",
        },
        {
            icon: "🚨",
            title: "Smart Alerts",
            description:
                "Instant notifications via email, Slack, or in-app for important events and updates.",
            gradientFrom: "from-yellow-500/20",
            gradientTo: "to-orange-500/20",
            borderColor: "border-yellow-500/30",
            hoverBorderColor: "hover:border-yellow-400/50",
            titleColor: "text-yellow-400",
            aosDelay: "500",
        },
        {
            icon: "⚙️",
            title: "Custom Filtering",
            description:
                "Customize your dashboard with advanced filtering, sorting, and personalization options.",
            gradientFrom: "from-indigo-500/20",
            gradientTo: "to-blue-500/20",
            borderColor: "border-indigo-500/30",
            hoverBorderColor: "hover:border-indigo-400/50",
            titleColor: "text-indigo-400",
            aosDelay: "600",
        },
    ];

    return (
        <section id="features" className="py-20 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title={
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Why Choose Our Platform?
                        </span>
                    }
                    subtitle="Discover powerful features designed to streamline your workflow and boost productivity"
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
