import React from 'react';
import '../styles/first-round-guide.css';

export interface FirstRoundGuideStep {
  title: string;
  body: string;
  hint: string;
}

const STEPS: FirstRoundGuideStep[] = [
  {
    title: 'Step 1 — The active row',
    body: 'Every guess is a five-letter word. The active row below fills in as you tap letters on the keyboard.',
    hint: 'Tap a keyboard key and watch the row fill.',
  },
  {
    title: 'Step 2 — Clue colors',
    body: 'Each guess is graded into clues: green means the letter is in the word and in the right spot; yellow means it is in the word but the wrong spot; gray means it is not in the word at all.',
    hint: 'Watch the row turn green, yellow, and gray as you go.',
  },
  {
    title: 'Step 3 — Win or nearly win',
    body: 'Solve the word and the round glows with a win. One guess away? That is close — keep going, you are getting there!',
    hint: 'The round-over overlay shows your result when you finish.',
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

/**
 * First-round guide.
 *
 * A lightweight, non-blocking orientation overlay shown once per session on the
 * player's first Classic/Daily round. It mirrors the real board + keyboard so
 * the core loop (type -> color clues -> win/finish) is learned in context,
 * rather than through a static modal.
 *
 * Designed to be read at the player's own pace: Next/Previous arrows, dot
 * nav, and a Skip link. The final "Got it" dismisses it for the rest of the run.
 */
export const FirstRoundGuide: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [active, setActive] = React.useState(0);

  const goTo = (i: number) => setActive(Math.max(0, Math.min(STEPS.length - 1, i)));
  const next = () => goTo(active + 1);
  const prev = () => goTo(active - 1);
  const isLast = active === STEPS.length - 1;

  if (!isOpen) return null;

  return (
    <div className="frg-overlay" role="dialog" aria-label="First round guide">
      <div className="frg-panel">
        <div className="frg-head">
          <span className="frg-title">First Round Guide</span>
          <button
            type="button"
            className="frg-close"
            onClick={onClose}
            aria-label="Dismiss first round guide"
          >
            ×
          </button>
        </div>

        <div className="frg-step">
          <div className="frg-step-num">
            <span className="frg-step-index">{active + 1}</span>
            <span className="frg-step-track" />
          </div>
          <h3 className="frg-step-title">{STEPS[active].title}</h3>
          <p className="frg-step-body">{STEPS[active].body}</p>
          <p className="frg-step-hint">{STEPS[active].hint}</p>
        </div>

        <div className="frg-dots">
          {STEPS.map((_step, i) => (
            <button
              key={i}
              type="button"
              className={`frg-dot ${i === active ? 'frg-dot-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to step ${i + 1}`}
              aria-current={i === active ? 'step' : undefined}
            />
          ))}
        </div>

        <div className="frg-actions">
          {active > 0 && (
            <button type="button" className="frg-btn frg-btn-ghost" onClick={prev}>
              ← Back
            </button>
          )}
          {isLast ? (
            <button
              type="button"
              className="frg-btn frg-btn-primary"
              onClick={() => {
                onComplete?.();
                onClose();
              }}
            >
              Got it →
            </button>
          ) : (
            <button type="button" className="frg-btn frg-btn-primary" onClick={next}>
              Next →
            </button>
          )}
          <button type="button" className="frg-btn frg-btn-ghost" onClick={onClose}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
