import React from 'react';

interface TotalOpportunitiesDisplayProps {
    amount: string;
    description: string;
}

const TotalOpportunitiesDisplay: React.FC<TotalOpportunitiesDisplayProps> = ({
    amount,
    description
}) => {
    return (
        <div className="text-center pt-4 border-t border-gray-700">
            <span className="text-2xl font-bold text-green-400 number-ticker">{amount}</span>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    );
};

export default TotalOpportunitiesDisplay;