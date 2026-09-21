/* WAZI Civic — Text Input & Attachment Controls */

import React, { useState } from 'react';
import { Camera, Send } from 'lucide-react';

interface TextInputProps {
  onSend: (text: string) => void;
  onOpenCamera: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  onSend,
  onOpenCamera,
  placeholder = "Type your question or show WAZI...",
  disabled = false
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        width: '100%',
        padding: '0 var(--space-4)',
        boxSizing: 'border-box'
      }}
    >
      <button
        type="button"
        onClick={onOpenCamera}
        disabled={disabled}
        aria-label="Open camera or show photo to WAZI"
        title="Show signboard or site photo"
        style={{
          width: '46px',
          height: '46px',
          borderRadius: 'var(--radius-full)',
          background: '#ffffff',
          border: '1px solid var(--warm-paper-80)',
          color: 'var(--luminous-teal-dim)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          flexShrink: 0,
          transition: 'all var(--duration-fast)',
          WebkitTapHighlightColor: 'transparent',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <Camera size={22} />
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid var(--warm-paper-80)',
          borderRadius: 'var(--radius-full)',
          padding: '0 4px 0 16px',
          height: '46px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--neutral-10)',
            fontSize: 'var(--text-sm)'
          }}
        />

        <button
          type="submit"
          disabled={!text.trim() || disabled}
          aria-label="Send message to WAZI"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: text.trim() ? 'var(--luminous-teal)' : 'transparent',
            border: 'none',
            color: text.trim() ? 'var(--midnight-ink)' : 'var(--neutral-60)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: text.trim() ? 'pointer' : 'default',
            transition: 'all var(--duration-fast)',
            flexShrink: 0
          }}
        >
          <Send size={18} style={{ transform: 'translateX(1px)' }} />
        </button>
      </div>
    </form>
  );
};
