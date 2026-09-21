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
  onOpenEvidence,
  onOpenDraftStudio
}) => {
  return (
    <div
      className="workspace-panel cases-panel"
      style={{
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--warm-paper)',
        color: 'var(--neutral-10)',
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
          padding: 'calc(var(--safe-top) + var(--space-3)) 0 var(--space-3)',
          borderBottom: '1px solid var(--warm-paper-80)',
          marginBottom: 'var(--space-3)'
        }}
      >
        <button
          onClick={onReturnHome}
          className="btn btn--sm btn--ghost"
          style={{ paddingLeft: '2px' }}
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

      {/* Tabs */}
      <div className="tab-strip" style={{ padding: '0 0 var(--space-3) 0' }}>
        <button className="tab-pill" onClick={onOpenEvidence}>
          Evidence Board
        </button>
        <button className="tab-pill" onClick={onOpenDraftStudio}>
          Draft Studio
        </button>
        <button className="tab-pill active">
          Saved Cases ({cases.length})
        </button>
      </div>

      <div style={{ margin: 'var(--space-2) 0 var(--space-4)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>
          Your Civic Cases & Evidence
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', marginTop: '2px' }}>
          Locally saved evidence dossiers, official records, and generated documents
        </p>
      </div>

      {cases.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            background: 'var(--neutral-100)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--warm-paper-80)'
          }}
        >
          <FolderOpen size={40} color="var(--neutral-60)" style={{ margin: '0 auto var(--space-2)' }} />
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)' }}>No saved cases yet</h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', marginTop: '4px', maxWidth: '260px', margin: '4px auto 0' }}>
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
