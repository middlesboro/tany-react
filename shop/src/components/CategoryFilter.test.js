import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from './CategoryFilter';

const mockFilters = [
  {
    id: 'BRAND',
    name: 'Brand',
    type: 'BRAND',
    values: [{ id: '1', name: 'Nike' }]
  },
  {
    id: 'AVAILABILITY',
    name: 'Availability',
    type: 'AVAILABILITY',
    values: [
      { id: 'ON_STOCK', name: 'ON_STOCK' },
      { id: 'SOLD_OUT', name: 'SOLD_OUT' }
    ]
  },
  {
    id: 'COLOR',
    name: 'Color',
    type: 'OTHER',
    values: [{ id: 'RED', name: 'Red' }]
  }
];

describe('CategoryFilter', () => {
  test('renders translated filter names and values', () => {
    render(
      <CategoryFilter
        filterParameters={mockFilters}
        selectedFilters={{}}
        onFilterChange={() => {}}
      />
    );

    // Check translated titles
    const brandTitle = screen.getByText('Značka');
    expect(brandTitle).toBeInTheDocument();
    const availabilityTitle = screen.getByText('Dostupnosť');
    expect(availabilityTitle).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();

    // Expand Brand
    fireEvent.click(brandTitle);
    expect(screen.getByText('Nike')).toBeInTheDocument();

    // Expand Availability
    fireEvent.click(availabilityTitle);
    expect(screen.getByText('Skladom')).toBeInTheDocument();
    expect(screen.getByText('Vypredané')).toBeInTheDocument();
  });
});
