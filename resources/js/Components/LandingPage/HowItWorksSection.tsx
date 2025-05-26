import React from "react";
import SectionHeading from "./Shared/SectionHeading";
import HowItWorksStepItem from "./HowItWorks/HowItWorksStepItem";

interface Step {
    number: string | number;
    title: string;
    description: string;
}

interface HowItWorksSectionProps {
    title: string;
    steps: Step[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
    title,
    steps,
}) => {
    // Define step configurations with colors and icons based on the template
    const stepConfigurations = [
        {
            gradientFrom: "from-blue-500",
            gradientTo: "to-purple-600",
            titleColor: "text-blue-400",
            iconBgColor: "bg-green-500",
            iconClass: "fas fa-link",
            aosDelay: "100",
        },
        {
            gradientFrom: "from-purple-500",
            gradientTo: "to-pink-600",
            titleColor: "text-purple-400",
            iconBgColor: "bg-yellow-500",
            iconClass: "fas fa-cog",
            aosDelay: "200",
        },
        {
            gradientFrom: "from-green-500",
            gradientTo: "to-emerald-600",
            titleColor: "text-green-400",
            iconBgColor: "bg-orange-500",
            iconClass: "fas fa-dollar-sign",
            aosDelay: "300",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title={title}
                    subtitle="Get started with Arbscreener in just a few simple steps"
                    titleClassName="text-white"
                    subtitleClassName="text-gray-400"
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {steps.map((step, index) => {
                        const config = stepConfigurations[index] || stepConfigurations[0];
                        return (
                            <HowItWorksStepItem
                                key={index}
                                stepNumber={step.number}
                                title={step.title}
                                description={step.description}
                                iconClass={config.iconClass}
                                gradientFrom={config.gradientFrom}
                                gradientTo={config.gradientTo}
                                titleColor={config.titleColor}
                                iconBgColor={config.iconBgColor}
                                aosDelay={config.aosDelay}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
