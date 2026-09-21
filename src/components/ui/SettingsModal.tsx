/* WAZI Civic — Settings & Accessibility Panel */

import React, { useState } from 'react';
import { saveSettings } from '../../lib/storage';
import type { AppSettings } from '../../lib/storage';
import { Settings, Volume2, VolumeX, Wifi, Key, RotateCcw, X, Check } from 'lucide-react';
import { InteractiveVoiceRoller } from './InteractiveVoiceRoller';
import { INITIAL_SAVED_CASES } from '../../lib/demo-fixtures';
import { saveCases } from '../../lib/storage';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdateSettings: (s: AppSettings) => void;
  onResetCases: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onUpdateSettings,
  onResetCases
}) => {
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [lowData, setLowData] = useState(settings.lowDataMode);
  const [sound, setSound] = useState(settings.soundEnabled);
  const [voiceName, setVoiceName] = useState(settings.voiceName || 'Kore');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated = saveSettings({
      ...settings,
      apiKey: apiKey.trim() || undefined,
      lowDataMode: lowData,
      soundEnabled: sound,
      voiceName: voiceName
    });
    onUpdateSettings(updated);
    onClose();
  };

  const handleResetData = () => {
    if (window.confirm('Reset local cases to the default verified Akute Health Centre flagship case?')) {
      saveCases(INITIAL_SAVED_CASES);
      onResetCases();
      onClose();
    }
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '85dvh' }}
      >
        <div className="bottom-sheet__handle" />

        <div className="bottom-sheet__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Settings size={20} color="var(--luminous-teal-dim)" />
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)' }}>
              App Preferences & Connectivity
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <InteractiveVoiceRoller 
                currentVoiceId={voiceName} 
                onSelectVoice={setVoiceName} 
              />
            </div>

            {/* Low-data Mode */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3)',
                background: 'var(--neutral-100)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--warm-paper-80)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Wifi size={18} color="var(--neutral-40)" />
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    Low-Data & Bandwidth Saver
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--neutral-60)' }}>
                    Disables non-essential animations, media, and heavy scripts
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={lowData}
                onChange={(e) => setLowData(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--luminous-teal)' }}
              />
            </div>

            {/* Sound Effects */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 'var(--space-3)',
                background: 'var(--neutral-100)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--warm-paper-80)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {sound ? <Volume2 size={18} color="var(--neutral-40)" /> : <VolumeX size={18} color="var(--neutral-40)" />}
                <div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                    Crystal Sound Chimes
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--neutral-60)' }}>
                    Subtle audio feedback for ready, listening, and evidence found
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={sound}
                onChange={(e) => setSound(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--luminous-teal)' }}
              />
            </div>

            {/* Gemini API Key */}
            <div
              style={{
                padding: 'var(--space-3)',
                background: 'var(--neutral-100)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--warm-paper-80)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <Key size={16} color="var(--neutral-40)" />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
                  Gemini API Key (Optional)
                </span>
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... (Leave empty to use built-in offline engine)"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--warm-paper-80)',
                  fontSize: 'var(--text-xs)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--neutral-60)', marginTop: '4px' }}>
                WAZI is 100% operational offline with verified country records even without an API key.
              </div>
            </div>

            {/* Reset Demo Data */}
            <button
              onClick={handleResetData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                background: 'transparent',
                border: 'none',
                color: 'var(--neutral-40)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
                padding: 'var(--space-2) 0'
              }}
            >
              <RotateCcw size={14} />
              <span>Reset cases to flagship demo state</span>
            </button>
          </div>

          <div style={{ marginTop: 'var(--space-6)' }}>
            <button
              onClick={handleSave}
              className="btn btn--primary btn--md"
              style={{ width: '100%' }}
            >
              <Check size={16} />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
