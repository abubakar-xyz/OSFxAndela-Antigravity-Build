/* WAZI Civic — Draft Format Selector Pills */

import React from 'react';
import type { DraftFormat } from '../../lib/types';
import { FileText, Mail, MessageCircle, AlertTriangle } from 'lucide-react';

interface FormatSelectorProps {
  selectedFormat: DraftFormat;
  onSelectFormat: (format: DraftFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  selectedFormat,
  onSelectFormat
}) => {
  const formats: { id: DraftFormat; label: string; icon: React.ReactNode }[] = [
    { id: 'foi', label: 'FOI Request', icon: <FileText size={14} /> },
    { id: 'complaint', label: 'Service Complaint', icon: <AlertTriangle size={14} /> },
    { id: 'email', label: 'Inquiry Letter', icon: <Mail size={14} /> },
    { id: 'whatsapp', label: 'WhatsApp Brief', icon: <MessageCircle size={14} /> }
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)',
        scrollbarWidth: 'none',
        // A flex item defaults to `min-width: auto`, which refuses to shrink
        // below its content. Without these the row grows past the viewport and
        // pushes the whole page sideways on a narrow phone instead of
        // scrolling within itself.
        minWidth: 0,
        maxWidth: '100%',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {formats.map((fmt) => {
        const isActive = selectedFormat === fmt.id;
        return (
          <button
            key={fmt.id}
            onClick={() => onSelectFormat(fmt.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: isActive ? 'var(--luminous-teal)' : 'var(--midnight-ink-70)',
              backgroundColor: isActive ? 'var(--luminous-teal)' : 'var(--midnight-ink-80)',
              color: isActive ? 'var(--midnight-ink)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-2xs)',
              fontWeight: isActive ? 'var(--weight-bold)' : 'var(--weight-medium)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              transition: 'all var(--duration-fast)',
              boxShadow: isActive ? '0 2px 8px rgba(22, 198, 177, 0.25)' : 'none'
            }}
          >
            {fmt.icon}
            <span>{fmt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
