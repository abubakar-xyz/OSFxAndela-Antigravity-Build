/* WAZI Civic — Live Captions & Conversation Display */

import React, { useEffect, useRef } from 'react';
import type { TranscriptItem } from '../../lib/types';
import { Sparkles } from 'lucide-react';

interface TranscriptProps {
  items: TranscriptItem[];
  waziCaption?: string;
  isThinking?: boolean;
  onQuickPrompt?: (prompt: string) => void;
}

export const Transcript: React.FC<TranscriptProps> = ({
  items,
  waziCaption,
  isThinking = false,
  onQuickPrompt
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items, waziCaption, isThinking]);

  const latestWaziItem = items.filter(i => i.speaker === 'wazi').slice(-1)[0];
  const activeCaption = waziCaption || (latestWaziItem ? latestWaziItem.text : "What would you like to understand, or show me?");

  return (
    <div
      ref={scrollRef}
      className="transcript-scroll-area"
      style={{
        width: '100%',
        maxHeight: '180px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 var(--space-4)',
        textAlign: 'center',
        scrollbarWidth: 'none'
      }}
    >
      {/* Active WAZI Live Caption */}
      <div
        style={{
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--weight-medium)',
          color: 'var(--warm-paper)',
          lineHeight: 'var(--leading-relaxed)',
          maxWidth: '380px',
          animation: 'fade-in 0.3s ease-out'
        }}
      >
        {isThinking ? (
          <span style={{ color: 'var(--sun-amber)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Thinking and checking civic records...
          </span>
        ) : (
          activeCaption
        )}
      </div>

      {/* Suggested Quick Question Pill if first launch / empty history */}
      {items.length <= 1 && onQuickPrompt && (
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button
            onClick={() => onQuickPrompt("They said this health centre was completed, but look at what is here.")}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(22, 198, 177, 0.12)',
              border: '1px solid rgba(22, 198, 177, 0.35)',
              color: 'var(--luminous-teal)',
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-medium)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast)',
              maxWidth: '340px',
              textAlign: 'left'
            }}
          >
            <Sparkles size={14} style={{ flexShrink: 0 }} />
            <span>"They said this health centre was completed, but look at what's here."</span>
          </button>
        </div>
      )}
    </div>
  );
};
