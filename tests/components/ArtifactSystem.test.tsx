import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { ArtifactSystem, ComboMultiplierBadge } from '../../src/components/ArtifactSystem';
import { PlayerInventory } from '../../src/game/artifacts';

describe('ArtifactSystem Component', () => {
  afterEach(() => {
    cleanup();
  });

  const mockInventory: PlayerInventory = {
    currency: 500,
    totalEarned: 1200,
    artifacts: {
      'vowel_magnet': { artifactId: 'vowel_magnet', level: 1, obtainedAt: Date.now() },
      'gold_ring': { artifactId: 'gold_ring', level: 1, obtainedAt: Date.now() },
    },
    equipped: {
      weapon: 'vowel_magnet',
      armor: null,
      utility: null,
      trinket: 'gold_ring',
    }
  };

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ArtifactSystem
        isOpen={false}
        inventory={mockInventory}
        onInventoryChange={() => {}}
        onClose={() => {}}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal header, currency, and tabs when isOpen is true', () => {
    render(
      <ArtifactSystem
        isOpen={true}
        inventory={mockInventory}
        onInventoryChange={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('heading', { name: /ARTIFACT SYSTEM/i })).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('EQUIP')).toBeInTheDocument();
    expect(screen.getByText('INVENTORY')).toBeInTheDocument();
    expect(screen.getByText('SHOP')).toBeInTheDocument();
    expect(screen.getByText('SYNERGIES')).toBeInTheDocument();
  });


  it('renders ComboMultiplierBadge when comboCount > 1', () => {
    const { container, rerender } = render(<ComboMultiplierBadge comboCount={1} multiplier={1.0} />);
    expect(container.firstChild).toBeNull();

    rerender(<ComboMultiplierBadge comboCount={3} multiplier={1.5} />);
    const badge = screen.getByTestId('combo-combustion-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('COMBO x3');
    expect(badge).toHaveTextContent('1.5x Multiplier');
  });

  it('allows tab switching between Equip, Inventory, Shop, and Synergies', () => {
    render(
      <ArtifactSystem
        isOpen={true}
        inventory={mockInventory}
        onInventoryChange={() => {}}
        onClose={() => {}}
      />
    );

    // Switch to Shop tab
    fireEvent.click(screen.getByText('SHOP'));
    expect(screen.getByText(/ARTIFACT SHOP/i)).toBeInTheDocument();

    // Switch to Synergies tab
    fireEvent.click(screen.getByText('SYNERGIES'));
    expect(screen.getByText(/Active Synergies/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();

    render(
      <ArtifactSystem
        isOpen={true}
        inventory={mockInventory}
        onInventoryChange={() => {}}
        onClose={handleClose}
      />
    );

    const closeBtn = screen.getByRole('button', { name: '✕' });
    fireEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
