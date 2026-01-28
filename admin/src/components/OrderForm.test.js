import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderForm from './OrderForm';

// Mock OrderCreateItems to avoid service calls and complex interactions in this test
jest.mock('./OrderCreateItems', () => () => <div data-testid="order-create-items">OrderCreateItems Mock</div>);

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
    deliveryAddress: { street: '', city: '', zip: '' },
    priceBreakDown: { items: [], totalPrice: 0, totalPriceWithoutVat: 0, totalPriceVatValue: 0 }
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

    const slovakDateRegex = /25\.\s*10\.\s*2023/;
    const historyText = screen.getByText(slovakDateRegex);
    expect(historyText).toBeInTheDocument();

    // We can't easily find the input by value if it's disabled and localized sometimes,
    // but we can check if the value is present in the document
    const createDateInput = screen.getByDisplayValue(slovakDateRegex);
    expect(createDateInput).toBeInTheDocument();
  });

  test('renders customer info fields instead of customerId', () => {
    const orderWithCustomer = {
      ...mockOrder,
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890'
    };

    render(
      <OrderForm
        order={orderWithCustomer}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.queryByText('Customer ID')).not.toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });

  test('renders create mode fields correctly', () => {
    const createOrder = {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      items: [],
      cartDiscountIds: []
    };

    render(
      <OrderForm
        order={createOrder}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
        isCreateMode={true}
        cartDiscounts={[{ id: 'd1', title: 'Discount 1' }]}
      />
    );

    // Check for First Name / Last Name instead of Customer Name
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.queryByText('Customer Name')).not.toBeInTheDocument();

    // Check for Discounts
    expect(screen.getByText('Discounts')).toBeInTheDocument();
    expect(screen.getByText('Discount 1')).toBeInTheDocument();

    // Check for Products section (replaced Price Breakdown)
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.queryByText('Price Breakdown')).not.toBeInTheDocument();
    expect(screen.getByTestId('order-create-items')).toBeInTheDocument();

    // Check for Pickup Point ID
    expect(screen.getByText('Pickup Point ID')).toBeInTheDocument();
  });

  test('renders tracking link when carrierOrderStateLink is present', () => {
    const orderWithLink = {
      ...mockOrder,
      carrierOrderStateLink: 'https://tracking.example.com/123'
    };

    render(
      <OrderForm
        order={orderWithLink}
        handleChange={mockHandleChange}
        handleSubmit={mockHandleSubmit}
      />
    );

    const link = screen.getByText('Track Package');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://tracking.example.com/123');
  });
});
