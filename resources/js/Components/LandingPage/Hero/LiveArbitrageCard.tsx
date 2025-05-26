import React from 'react';
import ArbitrageOpportunityRow from './ArbitrageOpportunityRow';
import TotalOpportunitiesDisplay from './TotalOpportunitiesDisplay';

const LiveArbitrageCard: React.FC = () => {
    const opportunities = [
        {
            pair: "BTC/USDT",
            pairColor: "text-orange-400",
            fromExchange: "Binance",
            toExchange: "Coinbase",
            percentage: "+2.34%",
            profit: "$1,247 profit"
        },
        {
            pair: "ETH/USDT",
            pairColor: "text-blue-400",
            fromExchange: "Uniswap",
            toExchange: "Kraken",
            percentage: "+1.89%",
            profit: "$892 profit"
        },
        {
            pair: "SOL/USDT",
            pairColor: "text-purple-400",
            fromExchange: "Raydium",
            toExchange: "Bybit",
            percentage: "+3.12%",
            profit: "$2,156 profit"
        }
    ];

    return (
        <div className="trading-card rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-green-400">Live Arbitrage Opportunities</h3>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm">LIVE</span>
                </div>
            </div>
            
            <div className="space-y-3">
                {opportunities.map((opportunity, index) => (
                    <ArbitrageOpportunityRow
                        key={index}
                        pair={opportunity.pair}
                        pairColor={opportunity.pairColor}
                        fromExchange={opportunity.fromExchange}
                        toExchange={opportunity.toExchange}
                        percentage={opportunity.percentage}
                        profit={opportunity.profit}
                    />
                ))}
            </div>
            
            <TotalOpportunitiesDisplay
                amount="$47,293"
                description="Total opportunities found today"
            />
        </div>
    );
};

export default LiveArbitrageCard;