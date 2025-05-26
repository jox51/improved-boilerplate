import React from 'react';

const ScrollIndicator: React.FC = () => {
    return (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <i className="fas fa-chevron-down text-white text-2xl opacity-70"></i>
        </div>
    );
};

export default ScrollIndicator;