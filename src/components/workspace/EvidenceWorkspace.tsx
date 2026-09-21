/* WAZI Civic — Evidence Workspace View */

import React from 'react';
import type { CivicCase, SearchStep, WaziState } from '../../lib/types';
import { WaziCompanion } from '../wazi/WaziCompanion';
import { SearchProgress } from './SearchProgress';
import { RecordVsReality } from './RecordVsReality';
import { ArrowLeft, Building2 } from 'lucide-react';

interface EvidenceWorkspaceProps {
  civicCase: CivicCase;
  isSearching: boolean;
  searchSteps: SearchStep[];
  isCheckingAgain: boolean;
  waziState: WaziState;
  waziStatusText?: string;
  onReturnHome: () => void;
  onCheckAgain: () => void;
  onTakeAction: () => void;
  onOpenDraftStudio: () => void;
  onOpenSavedCases: () => void;
}

export const EvidenceWorkspace: React.FC<EvidenceWorkspaceProps> = ({
  civicCase,
  isSearching,
  searchSteps,
  isCheckingAgain,
  waziState,
  waziStatusText,
  onReturnHome,
  onCheckAgain,
  onTakeAction,
  onOpenDraftStudio: _onOpenDraftStudio,
  onOpenSavedCases: _onOpenSavedCases
}) => {
  return (
    <div
      className="workspace-panel"
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
      {/* Workspace Header Bar */}
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
          statusText={waziStatusText || (isSearching ? 'Searching...' : 'Evidence Ready')}
          onClick={onReturnHome}
        />
      </div>

      {/* Main Content Area */}
      {isSearching ? (
        <div style={{ animation: 'fade-in 0.3s ease-out' }}>
          <div style={{ textAlign: 'center', margin: 'var(--space-4) 0' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)' }}>
              Verifying Civic Record
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', marginTop: '2px' }}>
              Querying gazetted federal registries & matching dated field evidence
            </p>
          </div>

          <SearchProgress steps={searchSteps} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Institutional Routing Quick Card if action initiated */}
          {civicCase.route && (
            <div
              style={{
                background: 'var(--midnight-ink-80)',
                border: '1px solid var(--midnight-ink-70)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <Building2 size={20} color="var(--luminous-teal)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Responsible Authority Identified
                </div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {civicCase.route.agency}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Verified contact: {civicCase.route.verifiedEmail}
                </div>
              </div>
            </div>
          )}

          {/* Record vs Reality Comparison Board */}
          <RecordVsReality
            civicCase={civicCase}
            onCheckAgain={onCheckAgain}
            onTakeAction={onTakeAction}
            isCheckingAgain={isCheckingAgain}
          />
        </div>
      )}
    </div>
  );
};
