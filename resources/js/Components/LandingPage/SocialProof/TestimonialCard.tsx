import React from "react";
import StarRating from "./StarRating";

interface TestimonialCardProps {
    quote: string;
    authorName: string;
    authorTitle?: string;
    authorImage?: string;
    authorInitial?: string;
    avatarGradientFrom?: string;
    avatarGradientTo?: string;
    rating?: number;
    aosDelay?: string;
    hoverBorderColor?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    quote,
    authorName,
    authorTitle,
    authorImage,
    authorInitial = authorName.charAt(0).toUpperCase(),
    avatarGradientFrom = "from-blue-500",
    avatarGradientTo = "to-purple-600",
    rating = 5,
    aosDelay = "100",
    hoverBorderColor = "hover:border-blue-500",
}) => {
    return (
        <div 
            className={`bg-gray-900 rounded-2xl p-8 border border-gray-700 ${hoverBorderColor} transition-all duration-300`}
            data-aos="fade-up" 
            data-aos-delay={aosDelay}
        >
            <div className="mb-6">
                <StarRating rating={rating} />
                <p className="text-gray-300 text-lg italic">"{quote}"</p>
            </div>
            <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-br ${avatarGradientFrom} ${avatarGradientTo} rounded-full flex items-center justify-center mr-4 overflow-hidden`}>
                    {authorImage ? (
                        <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-white font-bold">{authorInitial}</span>
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-white">{authorName}</h4>
                    {authorTitle && <p className="text-gray-400">{authorTitle}</p>}
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;
