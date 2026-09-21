/* WAZI Civic — Saved Cases Workspace View */

import React from 'react';
import type { CivicCase, WaziState } from '../../lib/types';
import { CaseCard } from './CaseCard';
import { WaziCompanion } from '../wazi/WaziCompanion';
import { ArrowLeft, FolderOpen } from 'lucide-react';

interface CaseListProps {
  cases: CivicCase[];
  waziState: WaziState;
  onSelectCase: (c: CivicCase) => void;
  onReturnHome: () => void;
  onOpenEvidence: () => void;
  onOpenDraftStudio: () => void;
}

export const CaseList: React.FC<CaseListProps> = ({
  cases,
  waziState,
  onSelectCase,
  onReturnHome,
  onOpenEvidence: _onOpenEvidence,
  onOpenDraftStudio: _onOpenDraftStudio
}) => {
  return (
    <div
      className="workspace-panel cases-panel"
      style={{
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--midnight-ink)',
        color: 'var(--text-primary)',
        padding: '0 var(--space-4) calc(var(--safe-bottom) + var(--space-8))',
        animation: 'slide-up var(--duration-normal) var(--ease-out)',
        boxSizing: 'border-box'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'calc(var(--safe-top) + var(--space-2)) 0 var(--space-3)',
          borderBottom: '1px solid var(--midnight-ink-70)',
          marginBottom: 'var(--space-3)'
        }}
      >
        <button
          onClick={onReturnHome}
          className="btn btn--sm btn--ghost"
          style={{ paddingLeft: '2px', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to WAZI</span>
        </button>

        <WaziCompanion
          state={waziState}
          statusText="Saved Cases"
          onClick={onReturnHome}
        />
      </div>

      <div style={{ margin: 'var(--space-2) 0 var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: '#FFFFFF' }}>
          Your Civic Cases & Evidence
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Locally saved evidence dossiers, official records, and generated documents
        </p>
      </div>

      {cases.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            background: 'var(--midnight-ink-80)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--midnight-ink-70)'
          }}
        >
          <FolderOpen size={40} color="var(--text-muted)" style={{ margin: '0 auto var(--space-2)' }} />
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: '#FFFFFF' }}>No saved cases yet</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '260px', margin: '4px auto 0' }}>
            Show WAZI a project signboard or ask about a civic issue to generate your first verified case.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              civicCase={c}
              onSelect={onSelectCase}
            />
          ))}
        </div>
      )}
    </div>
  );
};
