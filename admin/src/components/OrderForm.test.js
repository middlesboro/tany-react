import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderForm from './OrderForm';

describe('OrderForm', () => {
  const mockOrder = {
    id: 1,
    status: 'CREATED',
    statusHistory: [
      { status: 'CREATED', changeDate: '2023-10-25T10:30:00Z' }
    ],
    createDate: '2023-10-25T10:30:00Z',
    items: [],
    invoiceAddress: { street: '', city: '', zip: '' },
    deliveryAddress: { street: '', city: '', zip: '' }
  };
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  test('renders dates in Slovak format', () => {
    render(
      <OrderForm
        order={mockOrder}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
      />
    );

    // We check for Slovak date format: d. M. yyyy
    // 25. 10. 2023
    // We use a loose regex to allow for potential subtle space differences or time parts
    // but ensuring the structure is correct.
    const slovakDateRegex = /25\.\s*10\.\s*2023/;

    // Check Status History
    // The date is rendered as text inside a list item
    const historyText = screen.getByText(slovakDateRegex);
    expect(historyText).toBeInTheDocument();

    // Check Create Date
    // Since label is not associated in the component, we find by display value
    const createDateInput = screen.getByDisplayValue(slovakDateRegex);
    expect(createDateInput).toBeInTheDocument();
  });
});
