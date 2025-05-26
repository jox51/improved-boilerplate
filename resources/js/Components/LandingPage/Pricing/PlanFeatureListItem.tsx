import React from 'react';

interface PlanFeatureListItemProps {
    featureText: string;
}

const PlanFeatureListItem: React.FC<PlanFeatureListItemProps> = ({ featureText }) => {
    return (
        <li className="flex items-center">
            <i className="fas fa-check text-green-400 mr-3"></i>
            <span className="text-gray-300">{featureText}</span>
        </li>
    );
};

export default PlanFeatureListItem;