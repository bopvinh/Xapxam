import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { GameBoard } from '../../src/components/GameBoard';
import { GuessResult } from '../../src/game/types';

describe('GameBoard Component', () => {
  it('renders maxGuesses empty rows by default', () => {
    const { container } = render(
      <GameBoard guesses={[]} currentGuess="" maxGuesses={6} />
    );

    const rows = container.querySelectorAll('.board-row');
    expect(rows.length).toBe(6);

    const cells = container.querySelectorAll('.board-cell');
    expect(cells.length).toBe(30); // 6 * 5
  });

  it('displays current typed guess in the active row', () => {
    render(<GameBoard guesses={[]} currentGuess="REACT" maxGuesses={6} />);

    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText('E')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('displays submitted guess evaluations with correct classes', () => {
    const mockGuesses: GuessResult[] = [
      {
        word: 'GUESS',
        evaluation: [
          { letter: 'G', state: 'correct' },
          { letter: 'U', state: 'present' },
          { letter: 'E', state: 'absent' },
          { letter: 'S', state: 'absent' },
          { letter: 'S', state: 'absent' },
        ],
      },
    ];

    const { container } = render(
      <GameBoard guesses={mockGuesses} currentGuess="WORD" maxGuesses={6} />
    );

    const submittedCells = container.querySelectorAll('.board-cell.submitted');
    expect(submittedCells.length).toBe(5);

    expect(submittedCells[0]).toHaveClass('correct');
    expect(submittedCells[1]).toHaveClass('present');
    expect(submittedCells[2]).toHaveClass('absent');
  });

  it('renders accessibility symbols when colorBlindMode is enabled', () => {
    const mockGuesses: GuessResult[] = [
      {
        word: 'WORDS',
        evaluation: [
          { letter: 'W', state: 'correct' },
          { letter: 'O', state: 'present' },
          { letter: 'R', state: 'absent' },
          { letter: 'D', state: 'absent' },
          { letter: 'S', state: 'absent' },
        ],
      },
    ];

    render(
      <GameBoard
        guesses={mockGuesses}
        currentGuess=""
        colorBlindMode={true}
      />
    );

    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('✦')).toBeInTheDocument();
  });



  it('applies shake-row class to invalid row index', () => {
    const { container } = render(
      <GameBoard
        guesses={[]}
        currentGuess="INVALID"
        invalidRowIndex={0}
      />
    );

    const firstRow = container.querySelectorAll('.board-row')[0];
    expect(firstRow).toHaveClass('shake-row');
  });
});
