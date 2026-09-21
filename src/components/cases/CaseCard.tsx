/* WAZI Civic — Case Card Component */

import React from 'react';
import type { CivicCase } from '../../lib/types';
import { ChevronRight, MapPin } from 'lucide-react';

interface CaseCardProps {
  civicCase: CivicCase;
  onSelect: (c: CivicCase) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ civicCase, onSelect }) => {

  return (
    <div
      onClick={() => onSelect(civicCase)}
      className="card"
      style={{
        cursor: 'pointer',
        transition: 'all var(--duration-fast)',
        border: 'none',
        borderLeft: '4px solid var(--midnight-ink-70)',
        borderBottom: '1px solid var(--warm-paper-80)',
        backgroundColor: 'transparent',
        paddingLeft: 'var(--space-2)',
        marginBottom: 'var(--space-3)'
      }}
    >
      <div className="card__body" style={{ padding: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
          <span className={`evidence-chip evidence-chip--${civicCase.evidenceState.toLowerCase()}`}>
            {civicCase.evidenceState}
          </span>
          <span
            style={{
              fontSize: 'var(--text-2xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'var(--weight-bold)',
              color: civicCase.status === 'submitted' ? 'var(--verified-green)' : 'var(--neutral-60)'
            }}
          >
            {civicCase.status}
          </span>
        </div>

        <h3
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--neutral-10)',
            margin: 'var(--space-2) 0 4px'
          }}
        >
          {civicCase.title}
        </h3>

        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--neutral-40)',
            lineHeight: 'var(--leading-normal)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {civicCase.summary}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-3)',
            paddingTop: 'var(--space-2)',
            borderTop: '1px solid var(--warm-paper-90)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--neutral-60)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <MapPin size={11} /> {civicCase.jurisdiction}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--luminous-teal-dim)', fontWeight: 'var(--weight-semibold)' }}>
            Review Case <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};
