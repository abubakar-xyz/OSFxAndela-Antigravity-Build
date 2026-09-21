import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Check } from 'lucide-react';
import { sounds } from '../../lib/audio-speech';

export interface VoicePersona {
  id: string;
  name: string;
  specialty: string;
  description: string;
  sampleAudio?: string; // Optional URL for sample audio
}

const PERSONAS: VoicePersona[] = [
  {
    id: 'Kore',
    name: 'Wazi (Standard)',
    specialty: 'Civic Guide',
    description: 'Warm, sharp-eyed, street-smart civic companion. Speaks with natural Nigerian English and Pidgin warmth.'
  },
  {
    id: 'Aoede',
    name: 'Nuru',
    specialty: 'Legal Analyst',
    description: 'Precise and structured. Focuses on policy, regulations, and formal documentation.'
  },
  {
    id: 'Puck',
    name: 'Chidi',
    specialty: 'Community Organizer',
    description: 'Energetic, empathetic, and action-oriented. Great for mobilizing community action.'
  }
];

interface InteractiveVoiceRollerProps {
  currentVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
}

export const InteractiveVoiceRoller: React.FC<InteractiveVoiceRollerProps> = ({
  currentVoiceId,
  onSelectVoice
}) => {
  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, PERSONAS.findIndex(p => p.id === currentVoiceId))
  );
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;
    container.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth;
    const newIndex = Math.round(container.scrollLeft / cardWidth);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < PERSONAS.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 var(--space-2)' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Collaborator Voice
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handlePrev} disabled={currentIndex === 0} style={{ background: 'var(--midnight-ink-80)', border: '1px solid var(--midnight-ink-60)', color: currentIndex === 0 ? 'var(--text-muted)' : 'var(--text-primary)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentIndex === 0 ? 'default' : 'pointer' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={handleNext} disabled={currentIndex === PERSONAS.length - 1} style={{ background: 'var(--midnight-ink-80)', border: '1px solid var(--midnight-ink-60)', color: currentIndex === PERSONAS.length - 1 ? 'var(--text-muted)' : 'var(--text-primary)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentIndex === PERSONAS.length - 1 ? 'default' : 'pointer' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          width: '100%'
        }}
        className="hide-scrollbar"
      >
        {PERSONAS.map(persona => (
          <div 
            key={persona.id}
            style={{
              flex: '0 0 100%',
              width: '100%',
              scrollSnapAlign: 'start',
              padding: '0 var(--space-2)'
            }}
          >
            <div style={{
              background: 'var(--midnight-ink-80)',
              border: `1px solid ${persona.id === currentVoiceId ? 'var(--luminous-teal)' : 'var(--midnight-ink-70)'}`,
              borderRadius: '16px',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-primary)' }}>{persona.name}</h3>
                  <span style={{ fontSize: '13px', color: 'var(--luminous-teal)' }}>{persona.specialty}</span>
                </div>
                <button 
                  onClick={() => {
                    // Simulate playing a sample
                    sounds.playReady(); 
                  }}
                  style={{
                    background: 'var(--midnight-ink-90)',
                    border: '1px solid var(--midnight-ink-60)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                  title="Play sample"
                >
                  <Play size={14} fill="currentColor" />
                </button>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {persona.description}
              </p>
              
              <button
                onClick={() => onSelectVoice(persona.id)}
                style={{
                  marginTop: 'var(--space-2)',
                  width: '100%',
                  padding: '10px',
                  background: persona.id === currentVoiceId ? 'var(--luminous-teal-20)' : 'transparent',
                  border: `1px solid ${persona.id === currentVoiceId ? 'var(--luminous-teal)' : 'var(--midnight-ink-60)'}`,
                  color: persona.id === currentVoiceId ? 'var(--luminous-teal)' : 'var(--text-primary)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {persona.id === currentVoiceId ? (
                  <>
                    <Check size={16} /> Active Persona
                  </>
                ) : (
                  'Switch to this Persona'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: 'var(--space-2)' }}>
        {PERSONAS.map((_, i) => (
          <div 
            key={i} 
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: i === currentIndex ? 'var(--luminous-teal)' : 'var(--midnight-ink-60)',
              transition: 'background 0.2s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};
