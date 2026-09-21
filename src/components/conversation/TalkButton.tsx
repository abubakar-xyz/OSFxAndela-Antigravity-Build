/* WAZI Civic — Primary Talk Button */

import React from 'react';
import { Mic, Square } from 'lucide-react';
import { VoiceRings } from './VoiceRings';

interface TalkButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const TalkButton: React.FC<TalkButtonProps> = ({
  isListening,
  onToggle,
  disabled = false
}) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <VoiceRings active={isListening} size={120} />

      <button
        onClick={onToggle}
        disabled={disabled}
        className={`talk-button ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Hold or tap to speak to WAZI'}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: isListening
            ? 'var(--sun-amber)'
            : 'linear-gradient(135deg, var(--luminous-teal-light) 0%, var(--luminous-teal) 60%, var(--luminous-teal-dim) 100%)',
          color: 'var(--midnight-ink)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          boxShadow: isListening
            ? '0 0 28px rgba(244, 185, 66, 0.55)'
            : '0 8px 24px rgba(22, 198, 177, 0.35)',
          transform: isListening ? 'scale(1.05)' : 'scale(1)',
          transition: 'all var(--duration-fast) var(--ease-spring)',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {isListening ? (
          <Square size={28} strokeWidth={2.5} fill="var(--midnight-ink)" />
        ) : (
          <Mic size={30} strokeWidth={2.2} />
        )}
        <span
          style={{
            fontSize: '9px',
            fontWeight: 'var(--weight-bold)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginTop: '-1px'
          }}
        >
          {isListening ? 'Stop' : 'Talk'}
        </span>
      </button>
    </div>
  );
};
