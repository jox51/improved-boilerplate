import React from 'react';

interface ExchangeLogoItemProps {
    name: string;
    textColorClass: string;
    link?: string;
}

const ExchangeLogoItem: React.FC<ExchangeLogoItemProps> = ({
    name,
    textColorClass,
    link,
}) => {
    const content = (
        <div className="bg-gray-700 rounded-lg p-4 text-center hover:bg-gray-600 transition-colors">
            <span className={`${textColorClass} font-bold`}>{name}</span>
        </div>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                {content}
            </a>
        );
    }

    return content;
};

export default ExchangeLogoItem;