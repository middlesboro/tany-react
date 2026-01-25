import React from 'react';
import { render } from '@testing-library/react';
import StarRating from './StarRating';

describe('StarRating Component', () => {
  test('renders 5 stars', () => {
    const { container } = render(<StarRating rating={5} />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBe(5);
  });

  test('renders full stars correctly', () => {
    const { container } = render(<StarRating rating={5} />);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).not.toHaveClass('text-gray-300');
    });
  });

  test('renders empty stars correctly', () => {
    const { container } = render(<StarRating rating={0} />);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach(svg => {
      expect(svg).toHaveClass('text-gray-300');
    });
  });

  test('renders partial stars correctly', () => {
    const { container } = render(<StarRating rating={3.5} />);
    const svgs = container.querySelectorAll('svg');

    // First 3 full (indices 0, 1, 2)
    for(let i=0; i<3; i++) {
        expect(svgs[i]).not.toHaveClass('text-gray-300');
    }

    // 4th star (index 3) should be partial
    const partialStar = svgs[3];
    // We expect the fill to refer to a gradient URL
    const fill = partialStar.getAttribute('fill');
    expect(fill).toMatch(/^url\(#.+\)$/);

    // 5th star (index 4) should be empty
    expect(svgs[4]).toHaveClass('text-gray-300');
  });
});
