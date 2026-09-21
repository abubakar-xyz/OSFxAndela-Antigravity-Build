/* WAZI Civic — Privacy Shield & Transparency Panel */

import React, { useState } from 'react';
import { Shield, Lock, EyeOff, Database, Check, X } from 'lucide-react';

interface PrivacyShieldProps {
  isMicActive?: boolean;
}

export const PrivacyShield: React.FC<PrivacyShieldProps> = ({ isMicActive = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="View privacy and data security details"
        title="Privacy & Data Protection Status"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--midnight-ink-80)',
          border: '1px solid var(--midnight-ink-70)',
          color: 'var(--warm-paper)',
          fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--weight-semibold)',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          position: 'relative'
        }}
      >
        <Shield size={14} color="var(--luminous-teal)" />
        <span>Privacy Protected</span>
        {isMicActive && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--luminous-teal)',
              animation: 'pulse-dot 1s infinite ease-in-out'
            }}
          />
        )}
      </button>

      {isOpen && (
        <div className="bottom-sheet-backdrop" onClick={() => setIsOpen(false)}>
          <div
            className="bottom-sheet"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '85dvh' }}
          >
            <div className="bottom-sheet__handle" />

            <div className="bottom-sheet__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Shield size={20} color="var(--luminous-teal-dim)" />
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)' }}>
                  Data Sovereignty & Reporting Safety
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--neutral-40)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="bottom-sheet__body">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  fontSize: 'var(--text-xs)',
                  lineHeight: 'var(--leading-relaxed)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    background: 'var(--neutral-100)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--warm-paper-80)'
                  }}
                >
                  <EyeOff size={18} color="var(--luminous-teal-dim)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--neutral-10)' }}>
                      EXIF & Camera Hardware Stripping
                    </div>
                    <div style={{ color: 'var(--neutral-40)', marginTop: '2px' }}>
                      Photographs are sanitized locally using canvas processing before analysis. GPS coordinates and camera serial numbers are purged.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    background: 'var(--neutral-100)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--warm-paper-80)'
                  }}
                >
                  <Lock size={18} color="var(--verified-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--neutral-10)' }}>
                      No Raw Audio Recording Retention
                    </div>
                    <div style={{ color: 'var(--neutral-40)', marginTop: '2px' }}>
                      Speech is transcribed in real-time. No raw voice recordings are stored or retained on remote servers.
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    background: 'var(--neutral-100)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--warm-paper-80)'
                  }}
                >
                  <Database size={18} color="var(--corroborated-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 'var(--weight-bold)', color: 'var(--neutral-10)' }}>
                      Client-Side Case Storage
                    </div>
                    <div style={{ color: 'var(--neutral-40)', marginTop: '2px' }}>
                      Your cases, drafts, and evidence dossiers remain stored on your own device in private browser storage.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-5)' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn btn--primary btn--md"
                  style={{ width: '100%' }}
                >
                  <Check size={16} />
                  <span>I Understand</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
