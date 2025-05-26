import React from "react";
import ArbitrageOpportunityRow from "./ArbitrageOpportunityRow";
import TotalOpportunitiesDisplay from "./TotalOpportunitiesDisplay";

const LiveArbitrageCard: React.FC = () => {
    const opportunities = [
        {
            pair: "Analytics",
            pairColor: "text-orange-400",
            fromExchange: "Dashboard",
            toExchange: "Reports",
            percentage: "+24.5%",
            profit: "Efficiency gain",
        },
        {
            pair: "Automation",
            pairColor: "text-blue-400",
            fromExchange: "Workflows",
            toExchange: "Tasks",
            percentage: "+18.9%",
            profit: "Time saved",
        },
        {
            pair: "Insights",
            pairColor: "text-purple-400",
            fromExchange: "Data",
            toExchange: "Actions",
            percentage: "+31.2%",
            profit: "Performance boost",
        },
    ];

    return (
        <div className="trading-card rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                <h3 className="text-xl font-bold text-green-400">
                    Live Platform Insights
                </h3>
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
                amount="47,293"
                description="Total insights generated today"
            />
        </div>
    );
};

export default LiveArbitrageCard;
