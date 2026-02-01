import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryEdit from './CategoryEdit';
import * as categoryAdminService from '../services/categoryAdminService';

// Mock the service
jest.mock('../services/categoryAdminService');

// Mock ReactQuill to avoid issues in JSDOM
jest.mock('react-quill-new', () => {
  return {
    __esModule: true,
    default: ({ onChange }) => <textarea onChange={(e) => onChange(e.target.value)} data-testid="quill-editor" />,
  };
});

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CategoryEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    categoryAdminService.getCategories.mockResolvedValue({ content: [] });
  });

  test('renders defaultCategory checkbox and handles change', async () => {
    await act(async () => {
      renderWithRouter(<CategoryEdit />);
    });

    const checkbox = screen.getByLabelText(/Default Category/i);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('submits defaultCategory value', async () => {
    let container;
    await act(async () => {
      const result = renderWithRouter(<CategoryEdit />);
      container = result.container;
    });

    const checkbox = screen.getByLabelText(/Default Category/i);
    fireEvent.click(checkbox);

    const titleInput = container.querySelector('input[name="title"]');
    fireEvent.change(titleInput, { target: { value: 'Test Cat' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(categoryAdminService.createCategory).toHaveBeenCalledWith(expect.objectContaining({
        defaultCategory: true,
        title: 'Test Cat'
      }));
    });
  });
});
