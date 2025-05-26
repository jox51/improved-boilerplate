import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    hoverEffect = false,
}) => {
    const baseClasses = 'bg-white rounded-lg shadow-lg border border-gray-200';
    const hoverClasses = hoverEffect ? 'hover:shadow-xl hover:scale-105 transition-all duration-300' : '';
    const clickableClasses = onClick ? 'cursor-pointer' : '';
    
    const combinedClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;
    
    return (
        <div
            className={combinedClasses}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;