import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryEdit from './CategoryEdit';
import * as categoryAdminService from '../services/categoryAdminService';
import * as filterParameterAdminService from '../services/filterParameterAdminService';

// Mock the services
vi.mock('../services/categoryAdminService');
vi.mock('../services/filterParameterAdminService');

// Mock ReactQuill to avoid issues in JSDOM
vi.mock('react-quill-new', () => {
  return {
    __esModule: true,
    default: ({ onChange }) => <textarea onChange={(e) => onChange(e.target.value)} data-testid="quill-editor" />,
  };
});

// Mock MultiSearchSelect
vi.mock('../components/MultiSearchSelect', () => ({
  default: ({ onChange, value, label }) => (
    <select
      multiple
      data-testid={`multi-select-${label}`}
      value={value.map(String)}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value, 10));
        onChange(selected);
      }}
    >
      <option value="1">Param1</option>
      <option value="2">Param2</option>
    </select>
  )
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('CategoryEdit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    categoryAdminService.getCategories.mockResolvedValue({ content: [] });
    filterParameterAdminService.getFilterParameters.mockResolvedValue({
      content: [
        { id: 1, name: 'Param1' },
        { id: 2, name: 'Param2' }
      ]
    });
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

  test('renders active and visible checkboxes and handles change', async () => {
    await act(async () => {
      renderWithRouter(<CategoryEdit />);
    });

    const activeCheckbox = screen.getByLabelText(/Active/i);
    const visibleCheckbox = screen.getByLabelText(/Visible/i);

    expect(activeCheckbox).toBeInTheDocument();
    expect(activeCheckbox).toBeChecked(); // Default is true

    expect(visibleCheckbox).toBeInTheDocument();
    expect(visibleCheckbox).toBeChecked(); // Default is true

    fireEvent.click(activeCheckbox);
    expect(activeCheckbox).not.toBeChecked();

    fireEvent.click(visibleCheckbox);
    expect(visibleCheckbox).not.toBeChecked();
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
        title: 'Test Cat',
        active: true,
        visible: true
      }));
    });
  });

  test('submits un-checked active and visible values', async () => {
    let container;
    await act(async () => {
      const result = renderWithRouter(<CategoryEdit />);
      container = result.container;
    });

    const activeCheckbox = screen.getByLabelText(/Active/i);
    const visibleCheckbox = screen.getByLabelText(/Visible/i);

    fireEvent.click(activeCheckbox);
    fireEvent.click(visibleCheckbox);

    const titleInput = container.querySelector('input[name="title"]');
    fireEvent.change(titleInput, { target: { value: 'Test Cat 2' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(categoryAdminService.createCategory).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Cat 2',
        active: false,
        visible: false
      }));
    });
  });

  test('should include filter parameters when saving', async () => {
    let container;
    await act(async () => {
      const result = renderWithRouter(<CategoryEdit />);
      container = result.container;
    });

    const select = screen.getByTestId('multi-select-Filter Parameters');
    fireEvent.change(select, { target: { value: ['1'] } }); // Simulator for select change logic in mock is tricky, standard select works with array of strings if multiple

    // Since mock implementation of MultiSearchSelect uses manual onChange triggering from event,
    // we need to simulate valid DOM event structure for multiple select
    // However, react-testing-library fireEvent.change on select multiple requires options to be selected
    const option1 = select.querySelector('option[value="1"]');
    option1.selected = true;
    fireEvent.change(select);

    const titleInput = container.querySelector('input[name="title"]');
    fireEvent.change(titleInput, { target: { value: 'Cat with Params' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(categoryAdminService.createCategory).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Cat with Params',
        filterParameters: [{ id: 1 }]
      }));
    });
  });

  test('should include excluded filter parameters when saving', async () => {
    let container;
    await act(async () => {
      const result = renderWithRouter(<CategoryEdit />);
      container = result.container;
    });

    const select = screen.getByTestId('multi-select-Excluded Filter Parameters');
    fireEvent.change(select, { target: { value: ['2'] } });

    const option2 = select.querySelector('option[value="2"]');
    option2.selected = true;
    fireEvent.change(select);

    const titleInput = container.querySelector('input[name="title"]');
    fireEvent.change(titleInput, { target: { value: 'Cat with Excluded Params' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(categoryAdminService.createCategory).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Cat with Excluded Params',
        excludedFilterParameters: [{ id: 2 }]
      }));
    });
  });
});
