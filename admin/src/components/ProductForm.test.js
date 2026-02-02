import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from './ProductForm';

// Mock ReactQuill as it might require DOM APIs not fully supported or to simplify
jest.mock('react-quill-new', () => ({ value, onChange }) => (
  <textarea data-testid="quill-editor" value={value} onChange={(e) => onChange(e.target.value)} />
));

// Mock sub-components if needed, but let's try with real ones first for integration-like test.
// If SearchSelect is complex, we might mock it. Let's assume it works.
// However, SearchSelect uses DOM event listeners which should work in JSDOM.

describe('ProductForm', () => {
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleSaveAndStay = jest.fn();

  const defaultProps = {
    activeTab: 'main',
    setActiveTab: jest.fn(),
    product: {
      title: 'Test Product',
      categoryIds: [],
      defaultCategoryId: '',
      brandId: '',
      supplierId: '',
      active: true,
      externalStock: false
    },
    brands: [{ id: 'b1', name: 'Brand 1' }],
    suppliers: [{ id: 's1', name: 'Supplier 1' }],
    categories: [
      { id: 'c1', name: 'Category 1' },
      { id: 'c2', name: 'Category 2' }
    ],
    filterParameters: [],
    filterParameterValues: [],
    productLabels: [],
    handleChange: mockHandleChange,
    handleSubmit: mockHandleSubmit,
    handleSaveAndStay: mockHandleSaveAndStay
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Default Category select input', () => {
    render(<ProductForm {...defaultProps} />);

    // Check if label exists
    expect(screen.getByText('Default Category')).toBeInTheDocument();

    // Check if the placeholder is there (SearchSelect uses input with placeholder)
    expect(screen.getByPlaceholderText('Search for a default category...')).toBeInTheDocument();
  });

  test('calls handleChange when Default Category is selected', () => {
    render(<ProductForm {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search for a default category...');

    // Simulate user typing to open dropdown (SearchSelect logic)
    fireEvent.change(input, { target: { value: 'Cat' } });
    fireEvent.focus(input);

    // Should see options
    const option = screen.getByText('Category 1');
    fireEvent.click(option);

    // Expect handleChange to be called
    expect(mockHandleChange).toHaveBeenCalledWith({
      target: {
        name: 'defaultCategoryId',
        value: 'c1'
      }
    });
  });

  test('renders with existing defaultCategoryId value', () => {
     const propsWithValue = {
         ...defaultProps,
         product: {
             ...defaultProps.product,
             defaultCategoryId: 'c2'
         }
     };

     render(<ProductForm {...propsWithValue} />);

     // SearchSelect should display the name corresponding to the ID
     // However, SearchSelect uses useEffect to update searchTerm based on value.
     // So the input value should be 'Category 2'

     const input = screen.getByPlaceholderText('Search for a default category...');
     expect(input.value).toBe('Category 2');
  });
});
