import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ImageSlider from './ImageSlider';

// Mock timer for auto-play test
vi.useFakeTimers();

const slides = [
  { desktopUrl: 'img1.jpg', mobileUrl: 'mobile1.jpg', link: 'link1' },
  { desktopUrl: 'img2.jpg', mobileUrl: 'mobile2.jpg', link: 'link2' },
  { desktopUrl: 'img3.jpg', mobileUrl: 'mobile3.jpg', link: 'link3' },
];

describe('ImageSlider', () => {
  test('renders nothing if slides are empty', () => {
    const { container } = render(<ImageSlider slides={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders first slide with responsive images', () => {
    const { container } = render(<ImageSlider slides={slides} />);

    // Check for img tag (desktop fallback)
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img1.jpg');

    // Check for source tag (mobile)
    const source = container.querySelector('source');
    expect(source).toBeInTheDocument();
    expect(source).toHaveAttribute('srcSet', 'mobile1.jpg');
    expect(source).toHaveAttribute('media', '(max-width: 768px)');
  });

  test('navigates to next slide on next button click', () => {
    render(<ImageSlider slides={slides} />);
    const nextBtn = screen.getByText('❯');
    fireEvent.click(nextBtn);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img2.jpg');
  });

  test('navigates to previous slide on prev button click', () => {
    render(<ImageSlider slides={slides} />);
    const prevBtn = screen.getByText('❮');
    fireEvent.click(prevBtn);
    // Should go to last slide (loop)
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img3.jpg');
  });

  test('navigates to specific slide on dot click', () => {
    render(<ImageSlider slides={slides} />);
    const dots = screen.getAllByText('•');
    fireEvent.click(dots[1]);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img2.jpg');
  });

  test('auto-plays slides', () => {
    render(<ImageSlider slides={slides} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'img2.jpg');
  });
});
