import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerForm from './CustomerForm';

describe('CustomerForm', () => {
  const mockCustomer = {
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    role: 'CUSTOMER',
    invoiceAddress: {
      street: 'Inv Street 1',
      city: 'Inv City',
      zip: '12345',
      country: 'Inv Country'
    },
    deliveryAddress: {
      street: 'Del Street 1',
      city: 'Del City',
      zip: '67890',
      country: 'Del Country'
    }
  };

  const mockHandleChange = vi.fn();
  const mockHandleSubmit = vi.fn(e => e.preventDefault());

  test('renders all customer fields', () => {
    render(
      <CustomerForm
        customer={mockCustomer}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
      />
    );

    // Basic info
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('john@example.com');

    // Role
    expect(screen.getByLabelText(/Role/i)).toHaveValue('CUSTOMER');

    // Invoice Address
    // Using getAllByLabelText because "Street" might appear twice (Invoice & Delivery)
    // Alternatively, look for headers or container
    const streets = screen.getAllByLabelText(/Street/i);
    expect(streets.length).toBeGreaterThanOrEqual(2);
    expect(streets[0]).toHaveValue('Inv Street 1');

    const cities = screen.getAllByLabelText(/City/i);
    expect(cities[0]).toHaveValue('Inv City');

    const zips = screen.getAllByLabelText(/Zip/i);
    expect(zips[0]).toHaveValue('12345');

    const countries = screen.getAllByLabelText(/Country/i);
    expect(countries[0]).toHaveValue('Inv Country');

    // Delivery Address
    expect(streets[1]).toHaveValue('Del Street 1');
    expect(cities[1]).toHaveValue('Del City');
    expect(zips[1]).toHaveValue('67890');
    expect(countries[1]).toHaveValue('Del Country');
  });

  test('calls handleChange on input change', () => {
    render(
      <CustomerForm
        customer={mockCustomer}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Jane' } });
    expect(mockHandleChange).toHaveBeenCalled();
  });

  test('renders ID when present', () => {
    const customerWithId = { ...mockCustomer, id: '123' };
    render(
      <CustomerForm
        customer={customerWithId}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
      />
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123')).toBeDisabled();
  });
});
