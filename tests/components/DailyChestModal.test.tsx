import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { DailyChestModal } from '../../src/components/DailyChestModal';

describe('DailyChestModal Component', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const storageMock = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => { store[key] = String(val); },
      clear: () => { store = {}; },
      removeItem: (key: string) => { delete store[key]; },
      length: 0,
      key: () => null
    };
    Object.defineProperty(window, 'localStorage', {
      value: storageMock,
      writable: true
    });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DailyChestModal
        isOpen={false}
        onClose={() => {}}
        onClaim={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders unclaimed chest modal when unopened today', () => {
    render(
      <DailyChestModal
        isOpen={true}
        onClose={() => {}}
        onClaim={() => {}}
      />
    );

    expect(screen.getByText('🎁 Daily Chest')).toBeInTheDocument();
    expect(screen.getByText(/Open Chest/i)).toBeInTheDocument();
  });

  it('claims reward, updates localStorage, and calls onClaim callback when clicked', () => {
    const handleClaim = vi.fn();

    render(
      <DailyChestModal
        isOpen={true}
        onClose={() => {}}
        onClaim={handleClaim}
      />
    );

    const openBtn = screen.getByText(/Open Chest/i);
    fireEvent.click(openBtn);

    expect(handleClaim).toHaveBeenCalledTimes(1);
    const reward = handleClaim.mock.calls[0][0];
    expect(reward.id).toBeDefined();
    expect(reward.label).toBeDefined();

    // Verify localStorage persistence
    const today = new Date().toISOString().split('T')[0];
    expect(localStorage.getItem('wordplusplus_daily_chest')).toBe(today);
  });

  it('shows claimed state if chest was already opened today', () => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('wordplusplus_daily_chest', today);

    render(
      <DailyChestModal
        isOpen={true}
        onClose={() => {}}
        onClaim={() => {}}
      />
    );

    expect(screen.getByText('Chest Claimed Today')).toBeInTheDocument();
  });
});
