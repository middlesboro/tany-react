import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterParameterForm from './FilterParameterForm';

// Mock MultiSearchSelect as it might use other dependencies
jest.mock('./MultiSearchSelect', () => () => <div data-testid="multi-search-select">MultiSearchSelect</div>);

// Mock services
jest.mock('../services/filterParameterValueAdminService', () => ({
    getFilterParameterValues: jest.fn().mockResolvedValue({ content: [] }),
    createFilterParameterValue: jest.fn(),
}));

describe('FilterParameterForm', () => {
    const mockHandleChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const mockFilterParameter = {
        name: 'Test Param',
        type: 'CHECKBOX',
        active: true,
        filterParameterValueIds: []
    };

    test('renders form fields', () => {
        render(
            <FilterParameterForm
                filterParameter={mockFilterParameter}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                isEdit={false}
            />
        );

        expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Active/i)).toBeInTheDocument();
        expect(screen.getByTestId('multi-search-select')).toBeInTheDocument();
    });

    test('does not show create new value button when isEdit is false', () => {
        render(
            <FilterParameterForm
                filterParameter={mockFilterParameter}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                isEdit={false}
            />
        );

        expect(screen.queryByText('+ Create New Value')).not.toBeInTheDocument();
        expect(screen.getByText('Save the parameter first to create new values.')).toBeInTheDocument();
    });

    test('shows create new value button when isEdit is true', () => {
        render(
            <FilterParameterForm
                filterParameter={mockFilterParameter}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                isEdit={true}
            />
        );

        expect(screen.getByText('+ Create New Value')).toBeInTheDocument();
        expect(screen.queryByText('Save the parameter first to create new values.')).not.toBeInTheDocument();
    });

    test('opens modal when create new value button is clicked', () => {
        render(
            <FilterParameterForm
                filterParameter={mockFilterParameter}
                handleChange={mockHandleChange}
                handleSubmit={mockHandleSubmit}
                isEdit={true}
            />
        );

        fireEvent.click(screen.getByText('+ Create New Value'));
        expect(screen.getByText('Create New Value')).toBeInTheDocument(); // Modal title
        expect(screen.getByPlaceholderText('Value Name')).toBeInTheDocument();
    });
});
