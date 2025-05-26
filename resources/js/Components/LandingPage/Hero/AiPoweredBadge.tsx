import React from 'react';

const AiPoweredBadge: React.FC = () => {
    return (
        <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <i className="fas fa-bolt text-green-400 mr-2"></i>
            <span className="text-green-300 text-sm font-medium">AI-Powered Scanner</span>
        </div>
    );
};

export default AiPoweredBadge;