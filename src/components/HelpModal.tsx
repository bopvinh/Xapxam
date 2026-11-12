import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content help-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How To Play Word++</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p className="intro">
            Welcome to <strong>WORD++: The Ultimate Word Challenge</strong>! Solve the secret five-letter word in six attempts.
          </p>

          <h3>Color-Coded Feedback</h3>
          <div className="color-example-list">
            <div className="color-example">
              <span className="tile-example correct">W</span>
              <div>
                <strong>Green:</strong> The letter is in the word and in the correct spot.
              </div>
            </div>
            <div className="color-example">
              <span className="tile-example present">O</span>
              <div>
                <strong>Yellow:</strong> The letter is in the word but in the wrong spot.
              </div>
            </div>
            <div className="color-example">
              <span className="tile-example absent">R</span>
              <div>
                <strong>Dark Gray:</strong> The letter does not appear in the secret word (or extra occurrences have been excluded).
              </div>
            </div>
          </div>

          <h3 className="section-title">Game Modes</h3>
          <div className="modes-desc">
            <div className="mode-desc-item">
              <strong>Classic Mode:</strong> Solve one random secret word at your own pace.
            </div>
            <div className="mode-desc-item">
              <strong>Daily Challenge:</strong> Everyone gets the exact same word today. Keep your daily streak alive!
            </div>
            <div className="mode-desc-item">
              <strong>Multiplayer Party:</strong> 2 to 4 players. Play in rounds where one player hosts and writes a Secret Word, and other players compete to solve it. Fewer tries = fewer points. Lowest score wins!
            </div>
            <div className="mode-desc-item">
              <strong>Fast Mode:</strong> Race against other players to find the word first. The first to solve it ends the round and gets 1 point!
            </div>
            <div className="mode-desc-item">
              <strong>Timed Mode:</strong> Submit guesses before the 60 or 90-second countdown runs out. Expired turns consume an attempt!
            </div>
            <div className="mode-desc-item">
              <strong>Team Mode:</strong> Divide into teams and collaborate to solve the word, sharing attempts and scores.
            </div>
          </div>

          <h3 className="section-title">Double-Letter Rules</h3>
          <p className="rules-note">
            Word++ handles repeated letters with extreme accuracy. If you guess <strong>LEVEL</strong> and the secret word is <strong>APPLE</strong>:
            <br />
            - The second <strong>E</strong> is marked green or yellow (if matched).
            <br />
            - Extra unmatchable copies of a letter will remain dark gray, signaling that the word has no additional copies of that letter.
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Let's Play!</button>
        </div>
      </div>
    </div>
  );
};
