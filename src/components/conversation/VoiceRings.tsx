/* WAZI Civic — Audio Waveform Rings Visualization */

import React from 'react';

interface VoiceRingsProps {
  active: boolean;
  color?: string;
  size?: number;
}

export const VoiceRings: React.FC<VoiceRingsProps> = ({
  active,
  color = 'var(--luminous-teal)',
  size = 180
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
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `2px solid ${color}`,
            animation: 'voice-wave 2.2s infinite cubic-bezier(0.1, 0.7, 0.4, 1)',
            animationDelay: `${index * 0.7}s`,
            opacity: 0
          }}
        />
      ))}
    </div>
  );
};
