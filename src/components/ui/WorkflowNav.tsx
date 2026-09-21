/* WAZI Civic — Seamless Workflow Navigation Bar */

import React from 'react';
import { Mic, Search, FileEdit, FolderArchive } from 'lucide-react';

export type WorkflowView = 'home' | 'evidence' | 'draft' | 'cases';

interface WorkflowNavProps {
  currentView: WorkflowView;
  onNavigate: (view: WorkflowView) => void;
  isLiveActive?: boolean;
  savedCasesCount?: number;
}

export const WorkflowNav: React.FC<WorkflowNavProps> = ({
  currentView,
  onNavigate,
  isLiveActive = false,
  savedCasesCount = 0
}) => {
  const tabs = [
    {
      id: 'home' as WorkflowView,
      label: 'Voice & Chat',
      icon: <Mic size={14} />,
      badge: isLiveActive ? (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--luminous-teal)',
            boxShadow: '0 0 6px var(--luminous-teal)',
            display: 'inline-block'
          }}
        />
      ) : null
    },
    {
      id: 'evidence' as WorkflowView,
      label: 'Evidence Board',
      icon: <Search size={14} />,
      badge: null
    },
    {
      id: 'draft' as WorkflowView,
      label: 'Draft Studio',
      icon: <FileEdit size={14} />,
      badge: null
    },
    {
      id: 'cases' as WorkflowView,
      label: 'Saved Cases',
      icon: <FolderArchive size={14} />,
      badge: savedCasesCount > 0 ? (
        <span
          style={{
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '10px',
            background: currentView === 'cases' ? 'var(--midnight-ink)' : 'var(--midnight-ink-70)',
            color: currentView === 'cases' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          {savedCasesCount}
        </span>
      ) : null
    }
  ];

  return (
    <nav
      className="workflow-nav-strip"
      aria-label="Civic Workspaces"
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px 10px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        zIndex: 15
      }}
    >
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            role="tab"
            aria-selected={isActive}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '20px',
              border: isActive ? '1px solid var(--luminous-teal)' : '1px solid var(--midnight-ink-70)',
              background: isActive
                ? 'var(--luminous-teal)'
                : 'var(--midnight-ink-80)',
              color: isActive ? 'var(--midnight-ink)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.18s ease-out',
              boxShadow: isActive ? '0 2px 10px rgba(22, 198, 177, 0.3)' : 'none',
              flexShrink: 0
            }}
          >
            <span
              style={{
                color: isActive ? 'var(--midnight-ink)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.badge}
          </button>
        );
      })}
    </nav>
  );
};
