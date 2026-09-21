/* WAZI Civic — Disclosure & Privacy Review Sheet
   Implements Track 2 (Safety, Reporting & Protection) disclosure controls
*/

import React from 'react';
import type { DisclosureSettings } from '../../lib/types';
import { Shield, Lock, EyeOff, MapPin, User, Phone, X, Check } from 'lucide-react';

interface DisclosureSheetProps {
  isOpen: boolean;
  settings: DisclosureSettings;
  onClose: () => void;
  onUpdateSettings: (settings: DisclosureSettings) => void;
}

export const DisclosureSheet: React.FC<DisclosureSheetProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings
}) => {
  if (!isOpen) return null;

  const update = (patch: Partial<DisclosureSettings>) => {
    onUpdateSettings({ ...settings, ...patch });
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90dvh' }}
      >
        <div className="bottom-sheet__handle" />

        <div className="bottom-sheet__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Shield size={20} color="var(--luminous-teal-dim)" />
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)' }}>
              Disclosure & Privacy Control
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--neutral-40)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="bottom-sheet__body">
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', marginBottom: 'var(--space-4)' }}>
            You have full control over what information is revealed in civic letters, emails, or exported case briefs. Nothing is shared without your explicit consent.
          </p>

          {/* Safety Notice Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(244, 185, 66, 0.12)',
              border: '1px solid rgba(244, 185, 66, 0.35)',
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-primary)'
            }}
          >
            <Lock size={16} color="var(--sun-amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ lineHeight: 1.5 }}>
              <span style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--sun-amber)' }}>Protection First:</span> If reporting this discrepancy poses a personal or community risk, consider submitting anonymously or through a collective Community Development Association (CDA).
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* Identity disclosure */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--midnight-ink-70)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <User size={18} color="var(--luminous-teal)" />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Include Personal Name
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                    {settings.includeName ? 'Name appears on formal letter' : 'Anonymous: Signed as Concerned Community Resident'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.includeName}
                onChange={(e) => update({ includeName: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--luminous-teal)' }}
              />
            </div>

            {settings.includeName && (
              <input
                type="text"
                value={settings.userName}
                placeholder="Enter your full name or title..."
                onChange={(e) => update({ userName: e.target.value })}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--midnight-ink-60)',
                  backgroundColor: 'var(--midnight-ink-80)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  marginTop: '-4px',
                  outline: 'none'
                }}
              />
            )}

            {/* Contact disclosure */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--midnight-ink-70)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Phone size={18} color="var(--luminous-teal)" />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Include Phone / Email
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                    {settings.includeContact ? 'Agency can contact you with resolution' : 'Contact withheld for privacy'}
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.includeContact}
                onChange={(e) => update({ includeContact: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--luminous-teal)' }}
              />
            </div>

            {settings.includeContact && (
              <input
                type="text"
                value={settings.userContact}
                placeholder="Phone number or return email address..."
                onChange={(e) => update({ userContact: e.target.value })}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--midnight-ink-60)',
                  backgroundColor: 'var(--midnight-ink-80)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  marginTop: '-4px',
                  outline: 'none'
                }}
              />
            )}

            {/* Location precision */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--midnight-ink-70)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <MapPin size={18} color="var(--luminous-teal)" />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Approximate Location Only
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                    Shows ward & town; obscures exact personal home GPS
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.includeApproxLocation}
                onChange={(e) => update({ includeApproxLocation: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--luminous-teal)' }}
              />
            </div>

            {/* EXIF metadata auto-purging */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--midnight-ink-70)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <EyeOff size={18} color="var(--luminous-teal)" />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Strip EXIF Hardware Metadata
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                    Purges camera serials and device footprint from photos
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.stripExif}
                onChange={(e) => update({ stripExif: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: 'var(--luminous-teal)' }}
              />
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <button
              onClick={onClose}
              className="btn btn--primary btn--md"
              style={{ width: '100%' }}
            >
              <Check size={18} />
              <span>Apply Disclosure Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
