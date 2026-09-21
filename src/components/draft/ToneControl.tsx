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
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--weight-medium)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
          Tone
        </span>
        <div
          style={{
            display: 'inline-flex',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            border: '1px solid var(--midnight-ink-70)'
          }}
        >
          {(['neutral', 'firm', 'conciliatory'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTone(t)}
              style={{
                padding: '5px 12px',
                border: 'none',
                borderRight: t !== 'conciliatory' ? '1px solid var(--midnight-ink-70)' : 'none',
                background: tone === t ? 'var(--luminous-teal)' : 'var(--midnight-ink-80)',
                color: tone === t ? 'var(--midnight-ink)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                fontWeight: tone === t ? 'var(--weight-bold)' : 'var(--weight-medium)',
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
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 'var(--weight-medium)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)' }}>
          Length
        </span>
        <div
          style={{
            display: 'inline-flex',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            border: '1px solid var(--midnight-ink-70)'
          }}
        >
          {(['concise', 'standard', 'detailed'] as const).map((l) => (
            <button
              key={l}
              onClick={() => onChangeLength(l)}
              style={{
                padding: '5px 12px',
                border: 'none',
                borderRight: l !== 'detailed' ? '1px solid var(--midnight-ink-70)' : 'none',
                background: length === l ? 'var(--luminous-teal)' : 'var(--midnight-ink-80)',
                color: length === l ? 'var(--midnight-ink)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-2xs)',
                fontWeight: length === l ? 'var(--weight-bold)' : 'var(--weight-medium)',
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
