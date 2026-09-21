/* WAZI Civic — Tone & Length Segmented Controls */

import React from 'react';

interface ToneControlProps {
  tone: 'firm' | 'neutral' | 'conciliatory';
  length: 'concise' | 'standard' | 'detailed';
  onChangeTone: (tone: 'firm' | 'neutral' | 'conciliatory') => void;
  onChangeLength: (length: 'concise' | 'standard' | 'detailed') => void;
}

export const ToneControl: React.FC<ToneControlProps> = ({
  tone,
  length,
  onChangeTone,
  onChangeLength
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        margin: 'var(--space-2) 0 var(--space-4)'
      }}
    >
      {/* Tone Segmented Control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontWeight: 'var(--weight-medium)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
          Tone
        </span>
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid var(--midnight-ink-70)'
          }}
        >
          {(['neutral', 'firm', 'conciliatory'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTone(t)}
              style={{
                padding: '4px 12px',
                border: 'none',
                borderRight: t !== 'conciliatory' ? '1px solid var(--midnight-ink-70)' : 'none',
                background: tone === t ? 'var(--midnight-ink-70)' : 'transparent',
                color: tone === t ? 'var(--warm-paper)' : 'var(--neutral-40)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all var(--duration-fast)',
                boxShadow: 'none'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Length Segmented Control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontWeight: 'var(--weight-medium)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
          Length
        </span>
        <div
          style={{
            display: 'inline-flex',
            border: '1px solid var(--midnight-ink-70)'
          }}
        >
          {(['concise', 'standard', 'detailed'] as const).map((l) => (
            <button
              key={l}
              onClick={() => onChangeLength(l)}
              style={{
                padding: '4px 12px',
                border: 'none',
                borderRight: l !== 'detailed' ? '1px solid var(--midnight-ink-70)' : 'none',
                background: length === l ? 'var(--midnight-ink-70)' : 'transparent',
                color: length === l ? 'var(--warm-paper)' : 'var(--neutral-40)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'all var(--duration-fast)',
                boxShadow: 'none'
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
