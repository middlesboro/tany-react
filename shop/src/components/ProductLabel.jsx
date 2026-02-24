import React from 'react';

const ProductLabel = ({ label, size = 'small', isCard = true }) => {
  if (!label) return null;

  const { title, color, backgroundColor, position } = label;

  const positionClasses = {
    'TOP_LEFT': isCard ? 'top-2 md:top-12 left-2' : 'top-2 left-2',
    'TOP_RIGHT': 'top-2 right-2',
    'BOTTOM_LEFT': 'bottom-2 left-2',
    'BOTTOM_RIGHT': 'bottom-2 right-2',
  };

  const sizeClasses = {
    'small': 'text-[10px] px-1.5 py-0.5',
    'large': 'text-sm px-3 py-1',
  };

  const style = {
    color: color,
    backgroundColor: backgroundColor,
  };

  return (
    <span
      className={`absolute ${positionClasses[position] || 'top-2 left-2'} ${sizeClasses[size]} leading-tight font-bold z-10 rounded shadow-sm`}
      style={style}
    >
      {title}
    </span>
  );
};

export default ProductLabel;
