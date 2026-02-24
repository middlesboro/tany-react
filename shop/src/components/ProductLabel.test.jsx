/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';
import ProductLabel from './ProductLabel';

const mockLabel = {
  title: 'Test Label',
  color: '#fff',
  backgroundColor: '#000',
  position: 'TOP_LEFT',
};

test('renders small label by default', () => {
  render(<ProductLabel label={mockLabel} />);
  const label = screen.getByText('Test Label');
  expect(label).toHaveClass('text-[10px]');
  expect(label).toHaveClass('px-1.5');
  // Check default positioning for TOP_LEFT with isCard=true (default)
  expect(label).toHaveClass('top-2');
  expect(label).toHaveClass('md:top-12');
  expect(label).toHaveClass('left-2');
});

test('renders large label', () => {
  render(<ProductLabel label={mockLabel} size="large" />);
  const label = screen.getByText('Test Label');
  expect(label).toHaveClass('text-sm');
  expect(label).toHaveClass('px-3');
});

test('renders with correct position when isCard is false', () => {
  render(<ProductLabel label={mockLabel} isCard={false} />);
  const label = screen.getByText('Test Label');
  expect(label).toHaveClass('top-2');
  expect(label).toHaveClass('left-2');
  expect(label).not.toHaveClass('md:top-12');
});

test('renders other positions correctly', () => {
  const labelBottomRight = { ...mockLabel, position: 'BOTTOM_RIGHT' };
  render(<ProductLabel label={labelBottomRight} />);
  const label = screen.getByText('Test Label');
  expect(label).toHaveClass('bottom-2');
  expect(label).toHaveClass('right-2');
});
