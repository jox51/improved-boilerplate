import React from "react";

interface HowItWorksStepItemProps {
    stepNumber: string | number;
    title: string;
    description: string;
    iconClass: string;
    gradientFrom: string;
    gradientTo: string;
    titleColor: string;
    iconBgColor: string;
    aosDelay?: string;
}

const HowItWorksStepItem: React.FC<HowItWorksStepItemProps> = ({
    stepNumber,
    title,
    description,
    iconClass,
    gradientFrom,
    gradientTo,
    titleColor,
    iconBgColor,
    aosDelay = "",
}) => {
    return (
        <div 
            className="text-center" 
            data-aos="fade-up" 
            data-aos-delay={aosDelay}
        >
            <div className="relative mb-8">
                <div className={`w-32 h-32 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center mx-auto mb-6 glow`}>
                    <span className="text-4xl font-black text-white">{stepNumber}</span>
                </div>
                <div className={`absolute -top-4 -right-4 w-8 h-8 ${iconBgColor} rounded-full flex items-center justify-center`}>
                    <i className={`${iconClass} text-white text-sm`}></i>
                </div>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${titleColor}`}>{title}</h3>
            <p className="text-gray-300 text-lg">{description}</p>
        </div>
    );
};

export default HowItWorksStepItem;
