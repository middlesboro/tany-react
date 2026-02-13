import React, { useId } from 'react';

const StarRating = ({ rating, size = "w-4 h-4", onClick, interactive = false }) => {
  const baseId = useId();

  return (
    <div className="flex text-tany-yellow">
      {[...Array(5)].map((_, i) => {
        const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));
        // We use a unique ID for the gradient based on useId + index to ensure uniqueness per instance and star.
        const gradientId = `${baseId}-grad-${i}`;

        const isFull = fillPercentage >= 100;
        const isEmpty = fillPercentage <= 0;

        return (
          <svg
            key={i}
            onClick={() => interactive && onClick && onClick(i + 1)}
            className={`${size} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${isEmpty ? 'text-gray-300' : ''}`}
            viewBox="0 0 24 24"
            fill={isFull ? "currentColor" : (isEmpty ? "currentColor" : `url(#${gradientId})`)}
          >
            {!isFull && !isEmpty && (
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${fillPercentage}%`} stopColor="#F7B900" />
                        <stop offset={`${fillPercentage}%`} stopColor="#d1d5db" />
                    </linearGradient>
                </defs>
            )}
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
