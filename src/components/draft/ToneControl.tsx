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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontWeight: 'var(--weight-medium)' }}>
          Document Tone:
        </span>
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--warm-paper-90)',
            padding: '2px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--warm-paper-80)'
          }}
        >
          {(['neutral', 'firm', 'conciliatory'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTone(t)}
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: tone === t ? 'var(--neutral-100)' : 'transparent',
                color: tone === t ? 'var(--neutral-10)' : 'var(--neutral-40)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--duration-fast)',
                boxShadow: tone === t ? 'var(--shadow-xs)' : 'none'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Length Segmented Control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontWeight: 'var(--weight-medium)' }}>
          Document Length:
        </span>
        <div
          style={{
            display: 'inline-flex',
            background: 'var(--warm-paper-90)',
            padding: '2px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--warm-paper-80)'
          }}
        >
          {(['concise', 'standard', 'detailed'] as const).map((l) => (
            <button
              key={l}
              onClick={() => onChangeLength(l)}
              style={{
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: length === l ? 'var(--neutral-100)' : 'transparent',
                color: length === l ? 'var(--neutral-10)' : 'var(--neutral-40)',
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--weight-semibold)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all var(--duration-fast)',
                boxShadow: length === l ? 'var(--shadow-xs)' : 'none'
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
