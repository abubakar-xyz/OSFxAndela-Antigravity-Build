/* WAZI Civic — Editable Clue Chips Component */

import React, { useState } from 'react';
import type { ExtractedClue } from '../../lib/types';
import { Edit2, Check } from 'lucide-react';

interface ClueChipsProps {
  clues: ExtractedClue[];
  onUpdateClue: (updated: ExtractedClue) => void;
  dark?: boolean;
}

export const ClueChips: React.FC<ClueChipsProps> = ({
  clues,
  onUpdateClue,
  dark = false
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleStartEdit = (clue: ExtractedClue) => {
    setEditingId(clue.id);
    setTempValue(clue.value);
  };

  const handleSave = (clue: ExtractedClue) => {
    onUpdateClue({ ...clue, value: tempValue.trim() || clue.value });
    setEditingId(null);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: 'var(--space-2) 0' }}>
      {clues.map((clue) => {
        const isEditing = editingId === clue.id;

        return (
          <div
            key={clue.id}
            className={`clue-chip ${dark ? 'clue-chip--dark' : ''}`}
            style={{
              padding: isEditing ? '2px 8px' : '4px 10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="clue-chip__label">{clue.label}:</span>

            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="text"
                  value={tempValue}
                  autoFocus
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave(clue)}
                  style={{
                    background: dark ? 'var(--midnight-ink-90)' : 'var(--neutral-100)',
                    color: dark ? 'var(--warm-paper)' : 'var(--neutral-10)',
                    border: '1px solid var(--luminous-teal)',
                    borderRadius: '4px',
                    fontSize: 'var(--text-xs)',
                    padding: '2px 4px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleSave(clue)}
                  style={{
                    background: 'var(--luminous-teal)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--midnight-ink)'
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <span
                onClick={() => handleStartEdit(clue)}
                title="Tap to edit clue"
                style={{
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span className="clue-chip__val">{clue.value}</span>
                <Edit2 size={11} style={{ opacity: 0.5 }} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
