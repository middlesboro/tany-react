import React from 'react';
import { render, screen } from '@testing-library/react';
import QuantityChangeNotification from './QuantityChangeNotification';

describe('QuantityChangeNotification', () => {
  test('renders nothing when changes is null or empty', () => {
    const { container } = render(<QuantityChangeNotification changes={null} />);
    expect(container).toBeEmptyDOMElement();

    const { container: containerEmpty } = render(<QuantityChangeNotification changes={[]} />);
    expect(containerEmpty).toBeEmptyDOMElement();
  });

  test('renders removal message correctly', () => {
    const changes = [{
      productId: '1',
      productName: 'Test Product',
      currentQuantity: 0,
      requestedQuantity: 2
    }];

    render(<QuantityChangeNotification changes={changes} />);

    expect(screen.getByText(/Produkt/)).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/bol odstránený z košíka, pretože nie je na sklade/)).toBeInTheDocument();
  });

  test('renders adjustment message correctly', () => {
    const changes = [{
      productId: '1',
      productName: 'Adjusted Product',
      currentQuantity: 5,
      requestedQuantity: 10
    }];

    render(<QuantityChangeNotification changes={changes} />);

    expect(screen.getByText(/Množstvo produktu/)).toBeInTheDocument();
    expect(screen.getByText('Adjusted Product')).toBeInTheDocument();
    expect(screen.getByText('5 ks')).toBeInTheDocument();
    expect(screen.getByText(/pretože požadované množstvo \(10 ks\) nie je na sklade/)).toBeInTheDocument();
  });

  test('renders multiple changes', () => {
    const changes = [
      {
        productId: '1',
        productName: 'Removed Product',
        currentQuantity: 0,
        requestedQuantity: 2
      },
      {
        productId: '2',
        productName: 'Adjusted Product',
        currentQuantity: 5,
        requestedQuantity: 10
      }
    ];

    render(<QuantityChangeNotification changes={changes} />);

    expect(screen.getByText('Removed Product')).toBeInTheDocument();
    expect(screen.getByText('Adjusted Product')).toBeInTheDocument();
  });
});
