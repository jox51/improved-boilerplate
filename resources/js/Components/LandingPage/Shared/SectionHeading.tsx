import React from 'react';

interface SectionHeadingProps {
    title: string | React.ReactNode;
    subtitle?: string;
    className?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    aosDelay?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
    title,
    subtitle,
    className = '',
    titleClassName = '',
    subtitleClassName = '',
    aosDelay = ''
}) => {
    return (
        <div 
            className={`text-center mb-16 ${className}`} 
            data-aos="fade-up"
            data-aos-delay={aosDelay}
        >
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${titleClassName}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`text-xl max-w-3xl mx-auto ${subtitleClassName}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;