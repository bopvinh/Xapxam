import React, { useEffect, useRef, useState } from 'react';

interface CinematicVictoryProps {
  videoSource: string;
  onComplete: () => void;
}

export const CinematicVictory: React.FC<CinematicVictoryProps> = ({ videoSource, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play prevented, trigger complete directly to not block
        onComplete();
      });
    }
  }, [onComplete]);

  const handleSkip = () => {
    if (!skipped) {
      setSkipped(true);
      onComplete();
    }
  };

  return (
    <div
      data-testid="cinematic-victory-overlay"
      style={{
        position: 'fixed',
        zIndex: 10000,
        inset: 0,
        background: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay
        playsInline
        muted
        onEnded={onComplete}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          padding: '10px 24px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '999px',
          color: '#fff',
          fontWeight: 800,
          fontSize: '14px',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          zIndex: 10001,
          transition: 'background 0.2s',
        }}
      >
        SKIP INTRO ⏭
      </button>
    </div>
  );
};

export default CinematicVictory;
