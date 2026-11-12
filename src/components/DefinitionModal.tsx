import React, { useEffect, useState } from 'react';

interface DefinitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
}

interface WordMeaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

export const DefinitionModal: React.FC<DefinitionModalProps> = ({
  isOpen,
  onClose,
  word
}) => {
  const [meanings, setMeanings] = useState<WordMeaning[]>([]);
  const [phonetic, setPhonetic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !word) return;

    setLoading(true);
    setError('');
    setMeanings([]);
    setPhonetic('');

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Definition not found');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data[0]) {
          setPhonetic(data[0].phonetic || (data[0].phonetics?.[0]?.text ?? ''));
          setMeanings(data[0].meanings || []);
        }
      })
      .catch(() => {
        setError(`Could not retrieve online definition for "${word.toUpperCase()}".`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, word]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content definition-modal animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="def-title-group">
            <h2>{word.toUpperCase()}</h2>
            {phonetic && <span className="phonetic-tag">{phonetic}</span>}
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          {loading && <p className="def-loading">Looking up definition...</p>}
          {error && <p className="def-error">{error}</p>}

          {!loading && !error && meanings.length > 0 && (
            <div className="meanings-list">
              {meanings.map((m, idx) => (
                <div key={idx} className="meaning-block">
                  <span className="pos-badge">{m.partOfSpeech}</span>
                  <ol className="def-ol">
                    {m.definitions.slice(0, 3).map((d, dIdx) => (
                      <li key={dIdx} className="def-li">
                        <p className="def-text">{d.definition}</p>
                        {d.example && <p className="def-example">"{d.example}"</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
