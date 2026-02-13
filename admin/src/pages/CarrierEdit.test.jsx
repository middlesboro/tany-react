import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CarrierEdit from './CarrierEdit';
import * as carrierAdminService from '../services/carrierAdminService';

// Mock the service
vi.mock('../services/carrierAdminService');

// Mock CarrierImageManager to avoid issues
vi.mock('../components/CarrierImageManager', () => ({
  default: () => <div>Mocked CarrierImageManager</div>
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CarrierEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('adds a price range with priceWithoutVat', async () => {
    renderWithRouter(<CarrierEdit />);

    const priceInput = screen.getByPlaceholderText('Price');
    const priceWithoutVatInput = screen.getByPlaceholderText('Price w/o VAT');
    const weightFromInput = screen.getByPlaceholderText('Weight From');
    const weightToInput = screen.getByPlaceholderText('Weight To');
    const addRangeButton = screen.getByText('Add Range');

    fireEvent.change(priceInput, { target: { value: '120' } });
    fireEvent.change(priceWithoutVatInput, { target: { value: '100' } });
    fireEvent.change(weightFromInput, { target: { value: '0' } });
    fireEvent.change(weightToInput, { target: { value: '5' } });

    fireEvent.click(addRangeButton);

    await waitFor(() => {
        expect(screen.getByText(/Price: 120, Price w\/o VAT: 100, Weight: 0 - 5/)).toBeInTheDocument();
    });
  });

  test('adds a price range with freeShippingThreshold', async () => {
    renderWithRouter(<CarrierEdit />);

    const priceInput = screen.getByPlaceholderText('Price');
    const priceWithoutVatInput = screen.getByPlaceholderText('Price w/o VAT');
    const weightFromInput = screen.getByPlaceholderText('Weight From');
    const weightToInput = screen.getByPlaceholderText('Weight To');
    const freeShippingThresholdInput = screen.getByPlaceholderText('Free Shipping Threshold');
    const addRangeButton = screen.getByText('Add Range');

    fireEvent.change(priceInput, { target: { value: '120' } });
    fireEvent.change(priceWithoutVatInput, { target: { value: '100' } });
    fireEvent.change(weightFromInput, { target: { value: '0' } });
    fireEvent.change(weightToInput, { target: { value: '5' } });
    fireEvent.change(freeShippingThresholdInput, { target: { value: '200' } });

    fireEvent.click(addRangeButton);

    await waitFor(() => {
        expect(screen.getByText(/Price: 120, Price w\/o VAT: 100, Weight: 0 - 5, Free Shipping Threshold: 200/)).toBeInTheDocument();
    });
  });
});
