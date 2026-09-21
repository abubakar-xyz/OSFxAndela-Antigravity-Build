/* WAZI Civic — Audio Waveform Rings Visualization */

import React from 'react';

interface VoiceRingsProps {
  active: boolean;
  color?: string;
  size?: number;
}

export const VoiceRings: React.FC<VoiceRingsProps> = ({
  active,
  color = 'var(--sun-amber)',
  size = 68
}) => {
  if (!active) return null;

  return (
    <div
      className="voice-rings-container"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '-3px',
          borderRadius: '50%',
          border: `2px solid ${color}`,
          opacity: 0.6,
          animation: 'voice-contained-pulse 1.6s ease-in-out infinite'
        }}
      />
    </div>
  );
};
