import React from "react";
import { Link } from "@inertiajs/react";
import AiPoweredBadge from "./Hero/AiPoweredBadge";
import HeroInfoPoint from "./Hero/HeroInfoPoint";
import LiveArbitrageCard from "./Hero/LiveArbitrageCard";
import ScrollIndicator from "./Hero/ScrollIndicator";

interface HeroSectionProps {
    isSubscribed?: boolean;
    isAuthenticated?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    isSubscribed = false,
    isAuthenticated = false,
}) => {
    const infoPoints = [
        {
            icon: "⚡️",
            text: "AI-powered platform for advanced analytics and real-time monitoring",
            delay: 100,
        },
        {
            icon: "🔗",
            text: "Real-time data analysis across multiple sources and platforms",
            delay: 200,
        },
        {
            icon: "👥",
            text: "Discover insights and opportunities before others do",
            delay: 300,
        },
        {
            icon: "📈",
            text: "Maximize your productivity and efficiency with zero manual effort",
            delay: 400,
        },
    ];

    return (
        <section className="min-h-screen gradient-bg  flex items-center justify-center relative overflow-hidden pt-24 pb-10 ">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 to-stone-900/90"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div
                        className="text-center lg:text-left"
                        data-aos="fade-right"
                    >
                        <AiPoweredBadge />

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight text-white">
                            Powerful{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Analytics
                            </span>{" "}
                            for <br />
                            <span className="text-blue-400">Modern Teams</span>
                            <br />
                            <span className="text-2xl md:text-4xl">
                                Instantly 🚀
                            </span>
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {infoPoints.map((point, index) => (
                                <HeroInfoPoint
                                    key={index}
                                    icon={point.icon}
                                    text={point.text}
                                    delay={point.delay}
                                />
                            ))}
                        </div>

                        <Link
                            href={
                                isSubscribed
                                    ? "/app"
                                    : isAuthenticated
                                    ? "#pricing"
                                    : "/register"
                            }
                            className="inline-flex items-center bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 profit-glow"
                        >
                            <span className="text-xl mr-3">🚀</span>
                            {isSubscribed
                                ? "Go to App"
                                : isAuthenticated
                                ? "Subscribe Now"
                                : "Join Now"}
                        </Link>
                    </div>

                    <div className="relative" data-aos="fade-left">
                        <LiveArbitrageCard />
                    </div>
                </div>
            </div>

            <ScrollIndicator />
        </section>
    );
};

export default HeroSection;
