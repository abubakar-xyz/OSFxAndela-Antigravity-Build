/* WAZI Civic — Language Selector Pill */

import React, { useState } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguagePillProps {
  currentLang: string;
  onSelectLanguage: (langCode: string) => void;
}

export const LanguagePill: React.FC<LanguagePillProps> = ({
  currentLang,
  onSelectLanguage
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'YO', name: 'Yorùbá' },
    { code: 'HA', name: 'Hausa' },
    { code: 'IG', name: 'Asụsụ Igbo' },
    { code: 'SW', name: 'Kiswahili' },
    { code: 'FR', name: 'Français' }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change language"
        title="Select language"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--midnight-ink-80)',
          border: '1px solid var(--midnight-ink-70)',
          color: 'var(--warm-paper)',
          fontSize: 'var(--text-2xs)',
          fontWeight: 'var(--weight-semibold)',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        <Globe size={13} color="var(--luminous-teal)" />
        <span>{currentLang}</span>
        <ChevronDown size={11} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 110 }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              width: '140px',
              background: 'var(--midnight-ink-90)',
              border: '1px solid var(--midnight-ink-70)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '4px',
              zIndex: 120,
              animation: 'fade-in 0.15s ease-out'
            }}
          >
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  onSelectLanguage(l.code);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-xs)',
                  background: currentLang === l.code ? 'var(--midnight-ink-80)' : 'transparent',
                  border: 'none',
                  color: currentLang === l.code ? 'var(--luminous-teal)' : 'var(--warm-paper)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-medium)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{l.name}</span>
                {currentLang === l.code && <Check size={12} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
