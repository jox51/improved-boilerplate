import React from 'react';

interface ArbitrageOpportunityRowProps {
    pair: string;
    pairColor: string;
    fromExchange: string;
    toExchange: string;
    percentage: string;
    profit: string;
}

const ArbitrageOpportunityRow: React.FC<ArbitrageOpportunityRowProps> = ({
    pair,
    pairColor,
    fromExchange,
    toExchange,
    percentage,
    profit
}) => {
    return (
        <div className="flex justify-between items-center bg-gray-800/50 rounded-lg p-3">
            <div>
                <span className={`${pairColor} font-bold`}>{pair}</span>
                <div className="text-xs text-gray-400">{fromExchange} → {toExchange}</div>
            </div>
            <div className="text-right">
                <span className="text-green-400 font-bold number-ticker">{percentage}</span>
                <div className="text-xs text-gray-400">{profit}</div>
            </div>
        </div>
    );
};

export default ArbitrageOpportunityRow;