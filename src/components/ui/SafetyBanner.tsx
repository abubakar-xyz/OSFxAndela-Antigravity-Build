/* WAZI Civic — safety triage banner.
 *
 * Raised by the model itself through the raise_safety_alert tool, so it fires on
 * a spoken sentence in any language rather than on an English keyword list.
 *
 * The numbers here are deterministic and local to the build, never model output:
 * an emergency line is the one thing in this app that must not be hallucinated.
 */

import React from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';

export interface SafetyAlert {
  kind: string;
  summary: string;
  guidance?: string;
}

interface EmergencyContact {
  label: string;
  number: string;
}

const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { label: 'Emergency (all services)', number: '112' },
  { label: 'Police', number: '199' },
  { label: 'NEMA disaster response', number: '0800 CALL NEMA' }
];

interface SafetyBannerProps {
  alert: SafetyAlert;
  onDismiss: () => void;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ alert, onDismiss }) => (
  <div
    role="alert"
    aria-live="assertive"
    style={{
      margin: '0 var(--space-4) var(--space-3)',
      padding: 'var(--space-4)',
      borderRadius: 'var(--radius-md, 14px)',
      background: 'rgba(244, 185, 66, 0.12)',
      border: '1px solid rgba(244, 185, 66, 0.55)',
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-start'
    }}
  >
    <AlertTriangle size={20} color="var(--sun-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />

    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--warm-paper)' }}>
        Your safety comes first
      </div>
      <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--warm-paper)', lineHeight: 1.45 }}>
        {alert.summary}
      </p>
      {alert.guidance && (
        <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--sun-amber)', lineHeight: 1.45 }}>
          {alert.guidance}
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 'var(--space-3)' }}>
        {EMERGENCY_CONTACTS.map((contact) => (
          <a
            key={contact.number}
            href={`tel:${contact.number.replace(/\s/g, '')}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '999px',
              background: 'var(--sun-amber)',
              color: 'var(--midnight-ink)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <Phone size={13} />
            {contact.label} · {contact.number}
          </a>
        ))}
      </div>

      <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'var(--stone-gray)' }}>
        WAZI is not an emergency service and cannot dispatch help.
      </p>
    </div>

    <button
      onClick={onDismiss}
      aria-label="Dismiss safety notice"
      style={{ background: 'transparent', border: 'none', color: 'var(--stone-gray)', cursor: 'pointer' }}
    >
      <X size={18} />
    </button>
  </div>
);
