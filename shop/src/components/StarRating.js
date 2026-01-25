import React from 'react';

const StarRating = ({ rating, size = "w-4 h-4", onClick, interactive = false }) => {
  return (
    <div className="flex text-tany-yellow">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          onClick={() => interactive && onClick && onClick(i + 1)}
          className={`${size} ${i < rating ? 'fill-current' : 'text-gray-300 fill-current'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
