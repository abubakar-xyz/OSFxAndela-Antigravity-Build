/* WAZI Civic — Live Captions & Expanding Conversation Display */

import React, { useEffect, useRef, useState } from 'react';
import type { TranscriptItem } from '../../lib/types';
import { Sparkles, User, Bot, Volume2 } from 'lucide-react';

const QUICK_PROMPTS = [
  "They said this health centre was completed, but look at what's here.",
  "Wetin be my rights to check public project records?",
  "This road contract — how much dem budget, and wetin happen?",
  "How can I submit an official FOI request without exposing my address?"
];

interface TranscriptProps {
  items: TranscriptItem[];
  waziCaption?: string;
  isThinking?: boolean;
  isSpeaking?: boolean;
  onQuickPrompt?: (prompt: string) => void;
}

export const Transcript: React.FC<TranscriptProps> = ({
  items,
  waziCaption,
  isThinking = false,
  isSpeaking = false,
  onQuickPrompt
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [items, waziCaption, isThinking, isSpeaking]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % QUICK_PROMPTS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const hasMessages = items.length > 0;

  return (
    <div
      className="transcript-container"
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        flex: 1,
        minHeight: '80px',
        maxHeight: hasMessages ? '340px' : '180px',
        position: 'relative'
      }}
    >
      {/* Scrollable message thread */}
      <div
        ref={scrollRef}
        className="transcript-scroll-area"
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '4px var(--space-3) 8px',
          scrollBehavior: 'smooth'
        }}
      >
        {!hasMessages ? (
          /* Empty / Initial state */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '8px 12px',
              animation: 'fade-in 0.3s ease-out'
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--weight-medium)',
                color: '#FFFFFF',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '400px'
              }}
            >
              {isThinking ? (
                <span style={{ color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="var(--luminous-teal)" /> Thinking and checking civic records...
                </span>
              ) : (
                waziCaption || "What would you like to understand, or show me?"
              )}
            </div>

            {onQuickPrompt && (
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => onQuickPrompt(QUICK_PROMPTS[promptIndex])}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--midnight-ink-80)',
                    border: '1px solid var(--midnight-ink-70)',
                    color: 'var(--luminous-teal)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--weight-semibold)',
                    cursor: 'pointer',
                    transition: 'all var(--duration-fast)',
                    maxWidth: '360px',
                    textAlign: 'left'
                  }}
                >
                  <Sparkles size={14} style={{ flexShrink: 0 }} />
                  <span key={promptIndex} style={{ animation: 'fade-in 0.3s ease-out' }}>
                    "{QUICK_PROMPTS[promptIndex]}"
                  </span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Real Expanding Message Thread */
          <>
            {items.map((item) => {
              const isUser = item.speaker === 'user';
              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    width: '100%',
                    animation: 'fade-in 0.2s ease-out'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                      maxWidth: '88%',
                      flexDirection: isUser ? 'row-reverse' : 'row'
                    }}
                  >
                    {/* Speaker Avatar Icon */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                        background: isUser
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'rgba(22, 198, 177, 0.25)',
                        color: isUser ? '#FFFFFF' : 'var(--luminous-teal)'
                      }}
                    >
                      {isUser ? <User size={13} /> : <Bot size={13} />}
                    </div>

                    {/* Speech Bubble */}
                    <div
                      style={{
                        padding: '9px 13px',
                        borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: isUser
                          ? 'var(--midnight-ink-80)'
                          : '#0A2634',
                        border: isUser
                          ? '1px solid var(--midnight-ink-70)'
                          : '1px solid rgba(22, 198, 177, 0.35)',
                        color: '#FFFFFF',
                        fontSize: 'var(--text-sm)',
                        lineHeight: 1.5,
                        wordBreak: 'break-word',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                      }}
                    >
                      {item.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Live Streaming Speech or Active Caption if currently speaking/answering */}
            {waziCaption && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '6px',
                  maxWidth: '88%',
                  alignSelf: 'flex-start',
                  animation: 'fade-in 0.2s ease-out'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    background: 'rgba(22, 198, 177, 0.25)',
                    color: 'var(--luminous-teal)'
                  }}
                >
                  <Volume2 size={13} />
                </div>
                <div
                  style={{
                    padding: '9px 13px',
                    borderRadius: '14px 14px 14px 2px',
                    background: '#0A2634',
                    border: '1px solid rgba(22, 198, 177, 0.4)',
                    color: '#FFFFFF',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)'
                  }}
                >
                  {waziCaption}
                </div>
              </div>
            )}

            {/* Thinking / Verifying Indicator */}
            {isThinking && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--midnight-ink-80)',
                  border: '1px solid rgba(22, 198, 177, 0.3)',
                  color: 'var(--luminous-teal)',
                  fontSize: 'var(--text-xs)',
                  alignSelf: 'flex-start',
                  marginTop: '4px'
                }}
              >
                <Sparkles size={14} className="spin" />
                <span>WAZI is analyzing civic records...</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
