import React from 'react';

interface HeroInfoPointProps {
    icon: string;
    text: string;
    delay?: number;
}

const HeroInfoPoint: React.FC<HeroInfoPointProps> = ({ icon, text, delay = 0 }) => {
    return (
        <div 
            className="flex items-center space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm" 
            data-aos="zoom-in" 
            data-aos-delay={delay}
        >
            <span className="text-2xl">{icon}</span>
            <p className="text-gray-200 text-sm">{text}</p>
        </div>
    );
};

export default HeroInfoPoint;