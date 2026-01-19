import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

const mockFilterParameters = [
  {
    id: 1,
    name: 'Brand',
    values: [
      { id: 101, name: 'Nike' },
      { id: 102, name: 'Adidas' }
    ]
  },
  {
    id: 2,
    name: 'Color',
    values: [
      { id: 201, name: 'Red' },
      { id: 202, name: 'Blue' }
    ]
  }
];

const mockOnFilterChange = jest.fn();

describe('CategoryFilter', () => {
  test('renders filter parameters and expands sections', () => {
    render(
      <CategoryFilter
        filterParameters={mockFilterParameters}
        selectedFilters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    // Verify headers are present
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();

    // Verify content is initially hidden (collapsed by default)
    expect(screen.queryByText('Nike')).not.toBeInTheDocument();
    expect(screen.queryByText('Red')).not.toBeInTheDocument();

    // Click to expand 'Brand'
    fireEvent.click(screen.getByText('Brand'));

    // Verify 'Brand' content is now visible
    expect(screen.getByText('Nike')).toBeInTheDocument();
    expect(screen.getByText('Adidas')).toBeInTheDocument();

    // Verify 'Color' is still hidden
    expect(screen.queryByText('Red')).not.toBeInTheDocument();

    // Click to expand 'Color'
    fireEvent.click(screen.getByText('Color'));

    // Verify 'Color' content is now visible
    expect(screen.getByText('Red')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();

    // Click 'Brand' again to collapse
    fireEvent.click(screen.getByText('Brand'));

    // Verify 'Brand' content is hidden
    expect(screen.queryByText('Nike')).not.toBeInTheDocument();
  });
});
