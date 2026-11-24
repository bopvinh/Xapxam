import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { StreakEmber } from './StreakEmber';

afterEach(cleanup);

describe('StreakEmber', () => {
  it('hides itself when the streak is zero', () => {
    const { container } = render(<StreakEmber streak={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the streak count when a streak is active', () => {
    render(<StreakEmber streak={3} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('🔥')).toBeInTheDocument();
  });

  it('applies the flare class to sharpen the glow', () => {
    const { container } = render(<StreakEmber streak={5} flare />);
    const ember = container.firstChild as HTMLElement;
    expect(ember).toHaveClass('streak-ember--flame');
  });
});
