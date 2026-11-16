import React from 'react';

interface RowReticleProps {
  activeRow: number;
}

/**
 * A kinetic HUD element that frames the active guessing row.
 * Uses CSS transitions for smooth vertical tracking.
 */
export const RowReticle: React.FC<RowReticleProps> = ({ activeRow }) => {
  return (
    <div 
      className="hud-row-reticle" 
      style={{ 
        transform: `translateY(${activeRow * 60}px)`,
        opacity: activeRow < 6 ? 1 : 0 
      }}
      aria-hidden="true"
    >
      <div className="reticle-corner tl" />
      <div className="reticle-corner tr" />
      <div className="reticle-corner bl" />
      <div className="reticle-corner br" />
      <div className="reticle-label">LOCKED_ON</div>
      <div className="reticle-scanline" />
    </div>
  );
};
