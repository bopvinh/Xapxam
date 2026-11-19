import React, { useEffect, useRef } from 'react';

interface CinematicVictoryProps {
  videoSource: string;
  onComplete: () => void;
}

export const CinematicVictory: React.FC<CinematicVictoryProps> = ({ videoSource, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play prevented, trigger complete directly to not block
        onComplete();
      });
    }
  }, [onComplete]);

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
    </div>
  );
};

export default CinematicVictory;
