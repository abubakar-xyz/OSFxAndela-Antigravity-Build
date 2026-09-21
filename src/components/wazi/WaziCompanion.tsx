/* WAZI Civic — Persistent Workspace Companion Variant */

import React from 'react';
import type { WaziState } from '../../lib/types';
import { WaziCharacter } from './WaziCharacter';

interface WaziCompanionProps {
  state: WaziState;
  statusText?: string;
  onClick: () => void;
}

export const WaziCompanion: React.FC<WaziCompanionProps> = ({
  state,
  statusText,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="wazi-companion-btn"
      aria-label="Talk to WAZI or expand conversation"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'rgba(7, 24, 32, 0.08)',
        border: '1px solid var(--warm-paper-80)',
        borderRadius: 'var(--radius-full)',
        padding: '3px 12px 3px 4px',
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <WaziCharacter state={state} size={36} />
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-semibold)',
          color: 'var(--neutral-20)',
          letterSpacing: 'var(--tracking-wide)'
        }}
      >
        {statusText || 'WAZI'}
      </span>
      <span
        style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: state === 'speaking' || state === 'listening' ? 'var(--luminous-teal)' : 'var(--verified-green)',
          animation: state === 'speaking' || state === 'listening' ? 'pulse-dot 1.2s infinite ease-in-out' : 'none'
        }}
      />
    </button>
  );
};
