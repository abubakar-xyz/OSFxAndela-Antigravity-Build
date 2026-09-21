/* WAZI Civic — Search Progress Animation Steps */

import React from 'react';
import type { SearchStep } from '../../lib/types';
import { CheckCircle2, AlertCircle, Loader2, Circle } from 'lucide-react';

interface SearchProgressProps {
  steps: SearchStep[];
}

export const SearchProgress: React.FC<SearchProgressProps> = ({ steps }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        background: 'var(--neutral-100)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--warm-paper-80)',
        boxShadow: 'var(--shadow-sm)',
        margin: 'var(--space-3) 0'
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)',
          color: 'var(--neutral-40)',
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-wider)'
        }}
      >
        Verified Source Retrieval Steps
      </div>

      {steps.map((step) => {
        const isSearching = step.status === 'searching';
        const isFound = step.status === 'found';
        const isConflict = step.status === 'conflict';
        const isPending = step.status === 'pending';

        return (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: '6px 0',
              borderBottom: '1px solid var(--warm-paper-90)',
              animation: 'fade-in 0.3s ease-out'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              {isSearching && (
                <Loader2 size={18} className="spin" style={{ color: 'var(--luminous-teal)' }} />
              )}
              {isFound && (
                <CheckCircle2 size={18} style={{ color: 'var(--verified-green)' }} />
              )}
              {isConflict && (
                <AlertCircle size={18} style={{ color: 'var(--conflicting-coral)' }} />
              )}
              {isPending && (
                <Circle size={18} style={{ color: 'var(--neutral-80)' }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: isSearching ? 'var(--weight-semibold)' : 'var(--weight-medium)',
                  color: isPending ? 'var(--neutral-60)' : 'var(--neutral-10)'
                }}
              >
                {step.title}
              </div>

              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--neutral-60)',
                  marginTop: '1px'
                }}
              >
                {step.source}
              </div>

              {step.detail && (
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: isConflict ? 'var(--conflicting-coral)' : 'var(--neutral-20)',
                    fontWeight: isConflict ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                    marginTop: '3px',
                    padding: '2px 6px',
                    background: isConflict ? 'var(--conflicting-coral-bg)' : 'var(--warm-paper-95)',
                    borderRadius: 'var(--radius-xs)',
                    display: 'inline-block'
                  }}
                >
                  {step.detail}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
