/* WAZI Civic — Record vs Reality Deterministic Comparison Board */

import React from 'react';
import type { CivicCase } from '../../lib/types';
import {
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
  Calendar
} from 'lucide-react';

interface RecordVsRealityProps {
  civicCase: CivicCase;
  onCheckAgain: () => void;
  onTakeAction: () => void;
  isCheckingAgain?: boolean;
}

export const RecordVsReality: React.FC<RecordVsRealityProps> = ({
  civicCase,
  onCheckAgain,
  onTakeAction,
  isCheckingAgain = false
}) => {
  const isConflicting = civicCase.evidenceState === 'CONFLICTING';
  const isVerified = civicCase.evidenceState === 'VERIFIED';
  const isCorroborated = civicCase.evidenceState === 'CORROBORATED';

  return (
    <div
      className="record-vs-reality-board"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        animation: 'fade-in 0.4s ease-out'
      }}
    >
      {/* Header & Claim */}
      <div
        style={{
          background: 'var(--midnight-ink-80)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          border: '1px solid var(--midnight-ink-70)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-bold)',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-wider)'
          }}
        >
          Claim Examined
        </div>
        <h2
          style={{
            fontSize: 'var(--text-md)',
            fontWeight: 'var(--weight-semibold)',
            color: '#FFFFFF',
            marginTop: '4px'
          }}
        >
          "{civicCase.claim}"
        </h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            marginTop: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Building size={13} color="var(--luminous-teal)" /> {civicCase.jurisdiction}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={13} color="var(--luminous-teal)" /> Checked: 20 Sep 2026
          </span>
        </div>
      </div>

      {/* Primary Evidence State Banner */}
      <div
        className={`evidence-state-badge evidence-state-badge--${civicCase.evidenceState.toLowerCase()}`}
        style={{
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        {isConflicting && <AlertTriangle size={24} style={{ flexShrink: 0 }} />}
        {isVerified && <ShieldCheck size={24} style={{ flexShrink: 0 }} />}
        {isCorroborated && <ShieldCheck size={24} style={{ flexShrink: 0 }} />}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 'var(--text-md)' }}>
            EVIDENCE STATE: {civicCase.evidenceState}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-regular)',
              textTransform: 'none',
              letterSpacing: 'normal',
              marginTop: '2px',
              opacity: 0.95
            }}
          >
            {isConflicting
              ? 'Authoritative public procurement records directly conflict with dated field inspection evidence.'
              : 'Public records and reported data have been matched.'}
          </div>
        </div>
      </div>

      {/* Comparison Dimensions Grid */}
      <div
        className="card"
        style={{
          background: 'var(--midnight-ink-80)',
          border: '1px solid var(--midnight-ink-70)'
        }}
      >
        <div
          className="card__header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--midnight-ink-70)'
          }}
        >
          <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', color: '#FFFFFF' }}>
            Official Record vs. Physical Reality
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {civicCase.dimensions.length} Dimensions Tested
          </div>
        </div>

        <div className="card__body" style={{ padding: 'var(--space-4)' }}>
          {civicCase.dimensions.map((dim) => (
            <div key={dim.id} className="comparison-row" style={{ borderBottom: '1px solid var(--midnight-ink-70)' }}>
              <div className="comparison-row__dimension">
                <span style={{ color: 'var(--text-secondary)' }}>{dim.dimension}</span>
                <span className={`evidence-chip evidence-chip--${dim.state.toLowerCase()}`}>
                  {dim.state}
                </span>
              </div>

              <div className="comparison-grid">
                <div className="comparison-box">
                  <div className="comparison-box__label">Official Public Record</div>
                  <div className="comparison-box__content">{dim.record}</div>
                </div>

                <div
                  className="comparison-box"
                  style={{
                    backgroundColor: dim.state === 'CONFLICTING' ? 'rgba(236, 112, 103, 0.12)' : 'var(--midnight-ink-90)',
                    borderColor: dim.state === 'CONFLICTING' ? 'rgba(236, 112, 103, 0.35)' : 'var(--midnight-ink-70)'
                  }}
                >
                  <div className="comparison-box__label">Observed Field Reality</div>
                  <div className="comparison-box__content">{dim.reality}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adversarial Check Again Banner (if already run) */}
      {civicCase.isCheckAgainRun && civicCase.adversarialNotes && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--midnight-ink-80)',
            border: '1px solid var(--midnight-ink-70)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            lineHeight: 'var(--leading-relaxed)'
          }}
        >
          <span style={{ fontWeight: 'var(--weight-bold)', color: '#FFFFFF' }}>
            Adversarial Audit:
          </span>{' '}
          {civicCase.adversarialNotes}
        </div>
      )}

      {/* Sources Registry Block */}
      <div className="card" style={{ background: 'var(--midnight-ink-80)', border: '1px solid var(--midnight-ink-70)' }}>
        <div className="card__header" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: '#FFFFFF', borderBottom: '1px solid var(--midnight-ink-70)' }}>
          Traceable Sources & Grounded Provenance
        </div>
        <div className="card__body" style={{ padding: 'var(--space-4)' }}>
          {civicCase.sources.map((src) => (
            <div key={src.id} className="source-citation">
              <span className="source-citation__number">[{src.id}]</span>
              <div className="source-citation__body">
                <div className="source-citation__name">{src.name}</div>
                {src.excerpt && (
                  <div style={{ color: 'var(--text-secondary)', marginTop: '2px', fontStyle: 'italic' }}>
                    "{src.excerpt}"
                  </div>
                )}
                <div className="source-citation__dates">
                  Published: {src.published} | Retrieved: {src.retrieved} | Tier: {src.authority}
                </div>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      color: 'var(--luminous-teal)',
                      textDecoration: 'none',
                      marginTop: '4px',
                      fontSize: 'var(--text-2xs)'
                    }}
                  >
                    View Official Reference <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Bar at Bottom of Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-2)'
        }}
      >
        <button
          onClick={onCheckAgain}
          disabled={isCheckingAgain}
          className="btn btn--secondary"
          style={{ width: '100%' }}
        >
          <RefreshCw size={16} className={isCheckingAgain ? 'spin' : ''} />
          <span>{isCheckingAgain ? 'Auditing...' : 'Check Again'}</span>
        </button>

        <button
          onClick={onTakeAction}
          className="btn btn--primary"
          style={{ width: '100%' }}
        >
          <span>Take Action</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
