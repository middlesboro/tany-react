import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImageSlider from './ImageSlider';

// Mock timer for auto-play test
jest.useFakeTimers();

const slides = [
  { url: 'img1.jpg', link: 'link1' },
  { url: 'img2.jpg', link: 'link2' },
  { url: 'img3.jpg', link: 'link3' },
];

describe('ImageSlider', () => {
  test('renders nothing if slides are empty', () => {
    const { container } = render(<ImageSlider slides={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders first slide initially', () => {
    render(<ImageSlider slides={slides} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img1.jpg');
  });

  test('navigates to next slide on next button click', () => {
    render(<ImageSlider slides={slides} />);
    const nextBtn = screen.getByText('❯'); // Using the char used in component
    fireEvent.click(nextBtn);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img2.jpg');
  });

  test('navigates to previous slide on prev button click', () => {
    render(<ImageSlider slides={slides} />);
    const prevBtn = screen.getByText('❮'); // Using the char used in component
    fireEvent.click(prevBtn);
    // Should go to last slide (loop)
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img3.jpg');
  });

  test('navigates to specific slide on dot click', () => {
    render(<ImageSlider slides={slides} />);
    const dots = screen.getAllByText('•'); // Using the char used in component
    fireEvent.click(dots[1]);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img2.jpg');
  });

  test('auto-plays slides', () => {
    render(<ImageSlider slides={slides} />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img2.jpg');
  });
});
