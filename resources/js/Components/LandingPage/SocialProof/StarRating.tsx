import React from "react";

interface StarRatingProps {
    rating: number;
    className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    className = "flex text-yellow-400 mb-4",
}) => {
    const stars = Array.from({ length: 5 }, (_, index) => (
        <i
            key={index}
            className={`fas fa-star ${
                index < rating ? "text-yellow-400" : "text-gray-600"
            }`}
        />
    ));

    return <div className={className}>{stars}</div>;
};

export default StarRating;
