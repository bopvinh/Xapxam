import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { VictoryReveal } from './VictoryReveal';
import { LetterEvaluation } from '../game/types';

afterEach(cleanup);

const allCorrect: LetterEvaluation[] = 'STARE'.split('').map((letter) => ({ letter, state: 'correct' }));

function renderReveal(overrides: Partial<Parameters<typeof VictoryReveal>[0]> = {}) {
  return render(
    <VictoryReveal
      won
      finalGuess="STARE"
      finalEvals={allCorrect}
      mode="DAILY"
      attemptsUsed={2}
      streak={1}
      winRate={100}
      onPlayAgain={() => {}}
      onMeaning={() => {}}
      {...overrides}
    />
  );
}

describe('VictoryReveal', () => {
  it('renders nothing when won=false', () => {
    const { container } = renderReveal({ won: false });
    expect(container.firstChild).toBeNull();
  });

  it('shows the solved word as five tiles with the correct state', () => {
    renderReveal();
    const tiles = document.querySelectorAll('.aaa-word-tile');
    expect(tiles).toHaveLength(5);
    expect(tiles[0]).toHaveTextContent('S');
    expect(tiles[4]).toHaveTextContent('E');
    tiles.forEach((t) => expect(t).toHaveClass('correct'));
  });

  it('shows a diamond medal tier for a 2-attempt solve', () => {
    renderReveal({ attemptsUsed: 2 });
    expect(screen.getByText('PERFECT', { selector: '.aaa-medal-text' })).toBeInTheDocument();
    expect(screen.getByText('💎')).toBeInTheDocument();
    expect(screen.getByText('2/6 GUESSES')).toBeInTheDocument();
  });

  it('falls back to gold/silver tiers for slower solves', () => {
    renderReveal({ attemptsUsed: 4 });
    expect(screen.getByText('MASTERFUL', { selector: '.aaa-medal-text' })).toBeInTheDocument();
    cleanup();
    renderReveal({ attemptsUsed: 6 });
    expect(screen.getByText('SKILLED', { selector: '.aaa-medal-text' })).toBeInTheDocument();
  });

  it('renders streak and win-rate stats', () => {
    renderReveal({ streak: 5, winRate: 80 });
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('exposes PLAY AGAIN and MEANING actions', () => {
    renderReveal();
    expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show word meaning' })).toBeInTheDocument();
  });

  it('announces the reveal politely to screen readers', () => {
    renderReveal();
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
