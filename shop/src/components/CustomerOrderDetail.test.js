import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CustomerOrderDetail from './CustomerOrderDetail';
import { getOrder } from '../services/orderService';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../services/orderService');

describe('CustomerOrderDetail', () => {
    const mockOrder = {
        id: 1,
        orderIdentifier: '12345',
        status: 'NEW',
        paymentName: 'Card',
        carrierName: 'Balikovo',
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        priceBreakDown: {
            items: [
                { type: 'CARRIER', priceWithVat: 2.00, priceWithoutVat: 1.63, vatValue: 0.37, name: 'Balikovo' },
                { type: 'PRODUCT', priceWithVat: 10.00, quantity: 1 }
            ],
            totalPriceWithoutVat: 11.63,
            totalPrice: 12.00
        },
        items: [],
        statusHistory: [],
        invoiceAddress: { street: 'Main St', zip: '12345', city: 'City' },
        deliveryAddress: { street: 'Main St', zip: '12345', city: 'City' }
    };

    test('displays delivery price from priceBreakdown when deliveryPrice is missing', async () => {
        getOrder.mockResolvedValue(mockOrder);

        render(
            <BrowserRouter>
                <CustomerOrderDetail orderId="1" onBack={jest.fn()} />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Objednávka #12345')).toBeInTheDocument();
        });

        // We expect "2.00 €" to be displayed for delivery.
        // There might be multiple "2.00 €" on the page (e.g. if a product cost 2.00),
        // but here the carrier is 2.00.
        // We can be specific by looking for the container or surrounding text.
        // The component renders: <span className="text-gray-600">Doprava:</span> ... {price} €

        // Let's search for "Doprava:" and check the sibling or next text.
        // Or simply search for "2.00 €" since in this mock, product is 10.00.
        expect(screen.getByText('2.00 €')).toBeInTheDocument();
    });
});
