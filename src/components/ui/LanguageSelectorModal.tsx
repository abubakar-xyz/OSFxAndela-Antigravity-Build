import React from 'react';
import { Search, Globe2, X, Check } from 'lucide-react';

export interface LanguageOption {
  code: string;
  name: string;
  category: 'Kenyan' | 'Pan-African' | 'International';
}

const LANGUAGES: LanguageOption[] = [
  // Kenyan / East African
  { code: 'en-KE', name: 'English (Kenya)', category: 'Kenyan' },
  { code: 'sw-KE', name: 'Swahili (Kenya)', category: 'Kenyan' },
  { code: 'kik-KE', name: 'Gikuyu', category: 'Kenyan' },
  { code: 'luo-KE', name: 'Dholuo', category: 'Kenyan' },
  { code: 'kal-KE', name: 'Kalenjin', category: 'Kenyan' },
  { code: 'kam-KE', name: 'Kamba', category: 'Kenyan' },
  // Pan-African
  { code: 'en-NG', name: 'English (Nigeria)', category: 'Pan-African' },
  { code: 'yo-NG', name: 'Yoruba', category: 'Pan-African' },
  { code: 'ha-NG', name: 'Hausa', category: 'Pan-African' },
  { code: 'ig-NG', name: 'Igbo', category: 'Pan-African' },
  { code: 'en-ZA', name: 'English (South Africa)', category: 'Pan-African' },
  { code: 'zu-ZA', name: 'isiZulu', category: 'Pan-African' },
  { code: 'xh-ZA', name: 'isiXhosa', category: 'Pan-African' },
  { code: 'am-ET', name: 'Amharic', category: 'Pan-African' },
  { code: 'fr-SN', name: 'French (Senegal)', category: 'Pan-African' },
  // International
  { code: 'en-US', name: 'English (US)', category: 'International' },
  { code: 'en-GB', name: 'English (UK)', category: 'International' },
  { code: 'fr-FR', name: 'French (France)', category: 'International' },
  { code: 'es-ES', name: 'Spanish', category: 'International' },
  { code: 'pt-BR', name: 'Portuguese', category: 'International' },
  { code: 'ar-SA', name: 'Arabic', category: 'International' },
  { code: 'hi-IN', name: 'Hindi', category: 'International' },
  { code: 'zh-CN', name: 'Mandarin (Simplified)', category: 'International' },
];

interface LanguageSelectorModalProps {
  isOpen: boolean;
  currentLang: string;
  /** What WAZI has actually heard so far, if anything. */
  detectedLanguage?: string | null;
  onClose: () => void;
  onSelectLanguage: (langCode: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  currentLang,
  detectedLanguage = null,
  onClose,
  onSelectLanguage
}) => {
  const [search, setSearch] = React.useState('');

  if (!isOpen) return null;

  const filtered = LANGUAGES.filter(l => l.name.toLowerCase().includes(search.toLowerCase()));
  const grouped = filtered.reduce((acc, lang) => {
    if (!acc[lang.category]) acc[lang.category] = [];
    acc[lang.category].push(lang);
    return acc;
  }, {} as Record<string, LanguageOption[]>);

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000, position: 'fixed', inset: 0, background: 'rgba(10, 11, 16, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div 
        className="modal-content" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '85vh',
          background: 'var(--obsidian)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderTop: '1px solid var(--midnight-ink)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--midnight-ink-70)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Globe2 size={20} color="var(--luminous-teal)" />
            <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>Language</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
            <X size={24} />
          </button>
        </div>
        
        <div style={{ padding: 'var(--space-4)', flex: 1, overflowY: 'auto' }}>
          {/* WAZI matches whoever is speaking. This list only sets where she
              starts before she has heard anyone — it is not a lock. */}
          <div
            style={{
              background: 'rgba(22, 198, 177, 0.10)',
              border: '1px solid rgba(22, 198, 177, 0.3)',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: 'var(--space-4)'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {detectedLanguage ? `WAZI is speaking ${detectedLanguage}` : 'WAZI follows your voice'}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              She listens to how you speak and answers in the same language, dialect and accent —
              including when you switch mid-sentence. You never have to set this. Choosing below only
              changes where she starts before she has heard you.
            </div>
          </div>

          <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
            <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input 
              type="text" 
              placeholder="Search starting languages…" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--midnight-ink-80)',
                border: '1px solid var(--midnight-ink-60)',
                borderRadius: '12px',
                padding: '10px 12px 10px 36px',
                color: 'var(--text-primary)',
                fontSize: '15px',
                outline: 'none'
              }}
            />
          </div>

          {['Kenyan', 'Pan-African', 'International'].map(category => (
            grouped[category] && grouped[category].length > 0 && (
              <div key={category} style={{ marginBottom: 'var(--space-5)' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>{category}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {grouped[category].map(lang => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onSelectLanguage(lang.code);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '12px 16px',
                          background: isSelected ? 'var(--midnight-ink-80)' : 'transparent',
                          border: isSelected ? '1px solid var(--luminous-teal-dim)' : '1px solid transparent',
                          borderRadius: '8px',
                          color: isSelected ? 'var(--luminous-teal)' : 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '16px', fontWeight: isSelected ? 600 : 400 }}>{lang.name}</span>
                        {isSelected && <Check size={18} color="var(--luminous-teal)" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};
