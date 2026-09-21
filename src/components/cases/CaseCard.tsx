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
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--midnight-ink-70)',
        borderLeft: '4px solid var(--luminous-teal)',
        backgroundColor: 'var(--midnight-ink-80)',
        paddingLeft: 'var(--space-2)',
        marginBottom: 'var(--space-3)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
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
              color: civicCase.status === 'submitted' ? 'var(--verified-green)' : 'var(--text-muted)'
            }}
          >
            {civicCase.status}
          </span>
        </div>

        <h3
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-semibold)',
            color: '#FFFFFF',
            margin: 'var(--space-2) 0 4px'
          }}
        >
          {civicCase.title}
        </h3>

        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
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
            borderTop: '1px solid var(--midnight-ink-70)',
            fontSize: 'var(--text-2xs)',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <MapPin size={11} color="var(--luminous-teal)" /> {civicCase.jurisdiction}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: 'var(--luminous-teal)', fontWeight: 'var(--weight-semibold)' }}>
            Review Case <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
};
