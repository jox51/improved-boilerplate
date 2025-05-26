import React from 'react';

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    gradientFrom: string;
    gradientTo: string;
    borderColor: string;
    hoverBorderColor: string;
    titleColor: string;
    aosDelay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
    gradientFrom,
    gradientTo,
    borderColor,
    hoverBorderColor,
    titleColor,
    aosDelay = ''
}) => {
    return (
        <div 
            className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-8 border ${borderColor} ${hoverBorderColor} transition-all duration-300 transform hover:scale-105`}
            data-aos="fade-up"
            data-aos-delay={aosDelay}
        >
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className={`text-2xl font-bold mb-4 ${titleColor}`}>
                {title}
            </h3>
            <p className="text-gray-300">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;