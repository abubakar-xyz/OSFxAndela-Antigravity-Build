import React from 'react';
import { Mail, CheckCircle2, AlertCircle, X, ExternalLink, Copy } from 'lucide-react';
import type { CivicDraft } from '../../lib/types';

interface EmailDispatchSheetProps {
  isOpen: boolean;
  draft: CivicDraft;
  editableBody: string;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const EmailDispatchSheet: React.FC<EmailDispatchSheetProps> = ({
  isOpen,
  draft,
  editableBody,
  onClose,
  onShowToast
}) => {
  if (!isOpen) return null;

  const handleLaunchMailApp = () => {
    const subject = encodeURIComponent(draft.subject);
    const body = encodeURIComponent(editableBody);
    const mailto = `mailto:${draft.recipientRoute}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
    onShowToast('Opened default mail application');
  };

  const handleCopyField = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} copied to clipboard`);
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90dvh', background: 'var(--obsidian)', color: 'var(--warm-paper)' }}
      >
        <div className="bottom-sheet__handle" style={{ background: 'var(--midnight-ink)' }} />

        <div className="bottom-sheet__header" style={{ borderBottom: '1px solid var(--midnight-ink)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Mail size={20} color="var(--luminous-teal)" />
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', margin: 0 }}>
              Dispatch Email
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--stone-gray)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="bottom-sheet__body" style={{ paddingBottom: 'var(--safe-bottom)' }}>
          <div style={{
            background: 'var(--midnight-ink-50)',
            border: '1px solid var(--midnight-ink)',
            borderRadius: '12px',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--luminous-teal)', marginBottom: '16px' }}>
              <CheckCircle2 size={16} />
              <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Recipient</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--stone-gray)', fontSize: '13px' }}>To:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--warm-paper)', wordBreak: 'break-all' }}>
                {draft.recipientRoute}
              </span>
              <button onClick={() => handleCopyField(draft.recipientRoute, 'Email address')} style={{ background: 'transparent', border: 'none', color: 'var(--luminous-teal)', cursor: 'pointer' }}>
                <Copy size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ color: 'var(--stone-gray)', fontSize: '13px' }}>Subject:</span>
              <span style={{ fontSize: '14px', color: 'var(--warm-paper)' }}>
                {draft.subject}
              </span>
              <button onClick={() => handleCopyField(draft.subject, 'Subject')} style={{ background: 'transparent', border: 'none', color: 'var(--luminous-teal)', cursor: 'pointer' }}>
                <Copy size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--stone-gray)', fontSize: '13px', paddingTop: '2px' }}>Body:</span>
              <div style={{ 
                maxHeight: '120px', 
                overflowY: 'auto', 
                fontSize: '13px', 
                color: 'var(--warm-paper-80)',
                background: 'var(--midnight-ink-80)',
                padding: '8px',
                borderRadius: '6px',
                whiteSpace: 'pre-wrap'
              }}>
                {editableBody}
              </div>
              <button onClick={() => handleCopyField(editableBody, 'Body')} style={{ background: 'transparent', border: 'none', color: 'var(--luminous-teal)', cursor: 'pointer' }}>
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div style={{
            background: 'rgba(244, 185, 66, 0.1)',
            border: '1px solid rgba(244, 185, 66, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            gap: '12px',
            marginBottom: 'var(--space-6)'
          }}>
            <AlertCircle size={18} color="#F4B942" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--warm-paper)', lineHeight: 1.5 }}>
              This will open your device's default mail application with the information pre-filled. Please review before sending.
            </span>
          </div>

          <button
            onClick={handleLaunchMailApp}
            style={{
              width: '100%',
              background: 'var(--luminous-teal)',
              color: 'var(--obsidian)',
              border: 'none',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            Launch Mail App
            <ExternalLink size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
