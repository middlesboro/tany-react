import React from 'react';

const ProductLabel = ({ label }) => {
  if (!label) return null;

  const { title, color, backgroundColor, position } = label;

  const positionClasses = {
    'TOP_LEFT': 'top-2 left-2',
    'TOP_RIGHT': 'top-2 right-2',
    'BOTTOM_LEFT': 'bottom-2 left-2',
    'BOTTOM_RIGHT': 'bottom-2 right-2',
  };

  const style = {
    color: color,
    backgroundColor: backgroundColor,
  };

  return (
    <span
      className={`absolute ${positionClasses[position] || 'top-2 left-2'} text-xs font-bold px-2 py-1 z-10 rounded shadow-sm`}
      style={style}
    >
      {title}
    </span>
  );
};

export default ProductLabel;
