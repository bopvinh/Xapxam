import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { Keyboard } from './Keyboard';

afterEach(cleanup);

function renderKeyboard(overrides: Partial<Parameters<typeof Keyboard>[0]> = {}) {
  const props = {
    onChar: vi.fn(),
    onEnter: vi.fn(),
    onDelete: vi.fn(),
    letterStates: {},
    ...overrides,
  };
  const utils = render(<Keyboard {...props} />);
  return { ...utils, props };
}

function keyButton(label: string) {
  // Letter keys render their label text directly inside .key-label
  return screen.getByText(label, { selector: '.key-label' }).closest('button') as HTMLButtonElement;
}

describe('Keyboard', () => {
  it('renders all 26 letter keys plus ENTER and DEL', () => {
    renderKeyboard();
    for (const ch of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      expect(keyButton(ch)).toBeInTheDocument();
    }
    expect(screen.getByText('ENTER')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete')).toBeInTheDocument();
  });

  it('calls onChar with the uppercase letter when a letter key is clicked', () => {
    const { props } = renderKeyboard();
    fireEvent.click(keyButton('Q'));
    expect(props.onChar).toHaveBeenCalledWith('Q');
  });

  it('calls onEnter when ENTER is clicked and onDelete when DEL is clicked', () => {
    const { props } = renderKeyboard();
    fireEvent.click(screen.getByText('ENTER').closest('button')!);
    expect(props.onEnter).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByLabelText('Delete').closest('button')!);
    expect(props.onDelete).toHaveBeenCalledTimes(1);
  });

  it('applies the letter state class (correct/present/absent) to the matching key', () => {
    renderKeyboard({ letterStates: { A: 'correct', B: 'present', C: 'absent' } });
    expect(keyButton('A')).toHaveClass('correct');
    expect(keyButton('B')).toHaveClass('present');
    expect(keyButton('C')).toHaveClass('absent');
  });

  it('disables all keys when disabled=true and ignores clicks', () => {
    const { props } = renderKeyboard({ disabled: true });
    const q = keyButton('Q');
    expect(q).toBeDisabled();
    fireEvent.click(q);
    expect(props.onChar).not.toHaveBeenCalled();
  });

  it('renders absent-key particles only for absent letters', () => {
    const { container } = renderKeyboard({ letterStates: { C: 'absent', A: 'correct' } });
    const absentKey = keyButton('C');
    expect(absentKey.querySelectorAll('.key-particle').length).toBeGreaterThan(0);
    const correctKey = keyButton('A');
    expect(correctKey.querySelectorAll('.key-particle')).toHaveLength(0);
    expect(container.querySelector('.keyboard-container')).toBeInTheDocument();
  });
});
