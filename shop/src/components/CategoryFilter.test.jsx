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
  // Helper to change window width
  const setWindowWidth = (width) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    // Trigger resize event if component listens to it (ours doesn't but good practice)
    window.dispatchEvent(new Event('resize'));
  };

  test('renders translated filter names and values', () => {
    // Default width usually large in JSDOM, but let's set it explicitly to desktop
    setWindowWidth(1024);

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

  test('is open by default on desktop', () => {
    setWindowWidth(1024); // Desktop width

    render(
      <CategoryFilter
        filterParameters={mockFilters}
        selectedFilters={{}}
        onFilterChange={() => {}}
      />
    );

    // Should see filter content immediately (e.g. "Značka", "Dostupnosť")
    expect(screen.getByText('Značka')).toBeInTheDocument();

    // Check if the minus sign is visible (indicating open)
    expect(screen.getByText('−')).toBeInTheDocument();
  });

  test('is collapsed by default on mobile', () => {
    setWindowWidth(500); // Mobile width

    render(
      <CategoryFilter
        filterParameters={mockFilters}
        selectedFilters={{}}
        onFilterChange={() => {}}
      />
    );

    // Should NOT see filter content immediately
    expect(screen.queryByText('Značka')).not.toBeInTheDocument();

    // Check if the plus sign is visible (indicating collapsed)
    expect(screen.getByText('+')).toBeInTheDocument();

    // Can toggle open
    fireEvent.click(screen.getByText('Filter'));

    // Now it should be visible
    expect(screen.getByText('Značka')).toBeInTheDocument();
    expect(screen.getByText('−')).toBeInTheDocument();
  });
});
