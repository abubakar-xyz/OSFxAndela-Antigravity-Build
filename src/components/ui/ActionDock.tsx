/* WAZI Civic — Expandable Action Dock */

import React, { useState } from 'react';
import {
  ChevronUp,
  Search,
  AlertTriangle,
  BookOpen,
  FileText,
  FolderOpen,
  X
} from 'lucide-react';

interface ActionDockProps {
  onCheckSomething: () => void;
  onReportIssue: () => void;
  onUnderstandPolicy: () => void;
  onOpenDrafts: () => void;
  onOpenCases: () => void;
}

export const ActionDock: React.FC<ActionDockProps> = ({
  onCheckSomething,
  onReportIssue,
  onUnderstandPolicy,
  onOpenDrafts,
  onOpenCases
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'check',
      label: 'Check a project or claim',
      desc: 'Verify signboard, contract, or claim against public records',
      icon: <Search size={18} color="var(--luminous-teal)" />,
      onClick: () => {
        setIsOpen(false);
        onCheckSomething();
      }
    },
    {
      id: 'report',
      label: 'Report an issue safely',
      desc: 'Document non-delivery, safety issue, or service failure',
      icon: <AlertTriangle size={18} color="var(--reported-amber)" />,
      onClick: () => {
        setIsOpen(false);
        onReportIssue();
      }
    },
    {
      id: 'understand',
      label: 'Understand a service or policy',
      desc: 'Rights, procurement laws, healthcare guidelines in plain language',
      icon: <BookOpen size={18} color="var(--corroborated-blue)" />,
      onClick: () => {
        setIsOpen(false);
        onUnderstandPolicy();
      }
    },
    {
      id: 'drafts',
      label: 'Open my drafts',
      desc: 'Review prepared letters, FOI requests, and case briefs',
      icon: <FileText size={18} color="var(--verified-green)" />,
      onClick: () => {
        setIsOpen(false);
        onOpenDrafts();
      }
    },
    {
      id: 'cases',
      label: 'View saved cases',
      desc: 'Access offline-saved dossiers and evidence history',
      icon: <FolderOpen size={18} color="var(--warm-paper)" />,
      onClick: () => {
        setIsOpen(false);
        onOpenCases();
      }
    }
  ];

  return (
    <div className="action-dock-container">
      {/* Expanded Menu Panel */}
      {isOpen && (
        <div
          style={{
            background: 'var(--midnight-ink-90)',
            border: '1px solid var(--midnight-ink-70)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: 'var(--space-3)',
            marginBottom: 'var(--space-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            animation: 'fade-in 0.2s ease-out'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-2) var(--space-3)',
              borderBottom: '1px solid var(--midnight-ink-70)'
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-2xs)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Civic Workspaces
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          </div>

          {actions.map((act) => (
            <button
              key={act.id}
              onClick={act.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background var(--duration-fast)',
                width: '100%'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--midnight-ink-80)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--midnight-ink-80)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {act.icon}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: '#FFFFFF' }}>
                  {act.label}
                </div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', marginTop: '1px' }}>
                  {act.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          margin: '0 auto',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--midnight-ink-80)',
          border: '1px solid var(--midnight-ink-70)',
          color: '#FFFFFF',
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-semibold)',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-md)',
          transition: 'all var(--duration-fast)',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <span>Explore Actions & Workspaces</span>
        <ChevronUp
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--duration-fast)'
          }}
        />
      </button>
    </div>
  );
};
