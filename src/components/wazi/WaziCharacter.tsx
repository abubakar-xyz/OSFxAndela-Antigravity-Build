/* WAZI Civic — Luminous 2D SVG Character
   States: resting, listening, thinking, speaking, waiting_permission, attention
*/

import React from 'react';
import type { WaziState } from '../../lib/types';

interface WaziCharacterProps {
  state: WaziState;
  size?: number;
  onClick?: () => void;
  className?: string;
}

export const WaziCharacter: React.FC<WaziCharacterProps> = ({
  state = 'resting',
  size = 140,
  onClick,
  className = ''
}) => {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isWaiting = state === 'waiting_permission';
  const isAttention = state === 'attention';

  return (
    <div
      className={`wazi-character-container ${state} ${className}`}
      onClick={onClick}
      role="img"
      aria-label={`WAZI civic companion is currently ${state}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--duration-normal) var(--ease-spring)'
      }}
    >
      {/* Outer Ambient Aura Glow */}
      <div
        className="ambient-glow"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: isWaiting || isAttention
            ? 'radial-gradient(circle, rgba(244, 185, 66, 0.45) 0%, rgba(244, 185, 66, 0) 70%)'
            : 'radial-gradient(circle, rgba(22, 198, 177, 0.40) 0%, rgba(22, 198, 177, 0) 70%)',
          filter: 'blur(16px)',
          animation: isWaiting || isAttention ? 'wazi-glow-pulse-amber 2.5s infinite ease-in-out' : 'wazi-glow-pulse 3.5s infinite ease-in-out',
          pointerEvents: 'none'
        }}
      />

      {/* Thinking Orbit Particles */}
      {isThinking && (
        <div
          className="particle-orbit"
          style={{
            position: 'absolute',
            width: size * 1.25,
            height: size * 1.25,
            animation: 'wazi-thinking-orbit 4s linear infinite',
            pointerEvents: 'none'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '50%',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--luminous-teal-light)',
              boxShadow: '0 0 10px var(--luminous-teal)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '20%',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--sun-amber)',
              boxShadow: '0 0 8px var(--sun-amber)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '40%',
              right: '2px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--warm-paper)',
              boxShadow: '0 0 8px var(--warm-paper)'
            }}
          />
        </div>
      )}

      {/* Main SVG Character Body */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: isSpeaking
            ? 'wazi-speaking 0.6s infinite ease-in-out'
            : isListening
            ? 'none'
            : 'wazi-breathe 4s infinite ease-in-out',
          transform: isListening ? 'scale(1.04) translateY(-2px)' : 'none',
          transition: 'all 0.4s var(--ease-out)'
        }}
      >
        <defs>
          {/* Internal Radial Gradient */}
          <radialGradient id="waziCoreGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#8DF5E7" />
            <stop offset="45%" stopColor="#16C6B1" />
            <stop offset="85%" stopColor="#0B7A6E" />
            <stop offset="100%" stopColor="#074B43" />
          </radialGradient>

          {/* Eye Glow Filter */}
          <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Warm Base Shading */}
          <linearGradient id="warmBaseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(244, 185, 66, 0.3)" />
            <stop offset="100%" stopColor="rgba(22, 198, 177, 0)" />
          </linearGradient>
        </defs>

        {/* Soft Shadow at base */}
        <ellipse cx="70" cy="126" rx="36" ry="7" fill="rgba(7, 24, 32, 0.45)" />

        {/* Waiting Permission Base Halo */}
        {isWaiting && (
          <ellipse
            cx="70"
            cy="120"
            rx="46"
            ry="10"
            fill="none"
            stroke="var(--sun-amber)"
            strokeWidth="2.5"
            strokeDasharray="5 5"
            style={{ animation: 'wazi-thinking-orbit 8s linear infinite' }}
          />
        )}

        {/* River-stone Organic Luminescent Body */}
        <path
          d="M70 20
             C104 20, 124 38, 124 72
             C124 104, 102 120, 70 120
             C38 120, 16 104, 16 72
             C16 38, 36 20, 70 20 Z"
          fill="url(#waziCoreGrad)"
        />

        {/* Internal Subtle Light Crescent */}
        <path
          d="M40 32
             C56 24, 84 24, 100 32
             C84 36, 56 36, 40 32 Z"
          fill="rgba(255, 255, 255, 0.45)"
          filter="url(#eyeGlow)"
        />

        {/* Subtle Ambient Heart Pulse Core */}
        <circle
          cx="70"
          cy="70"
          r={isSpeaking ? '30' : '24'}
          fill="url(#warmBaseGrad)"
          style={{ transition: 'r 0.3s var(--ease-out)' }}
        />

        {/* Eyes: Expressive Warm Luminous Points */}
        <g id="waziEyes">
          {/* Left Eye */}
          <circle
            cx={isThinking ? '54' : isListening ? '52' : '50'}
            cy={isThinking ? '62' : '60'}
            r={isListening ? '5.5' : isSpeaking ? '5' : '4'}
            fill="#FFFFFF"
            filter="url(#eyeGlow)"
          />
          <circle
            cx={isThinking ? '54' : isListening ? '52' : '50'}
            cy={isThinking ? '62' : '60'}
            r={isListening ? '2.5' : '2'}
            fill="#F4B942"
          />

          {/* Right Eye */}
          <circle
            cx={isThinking ? '86' : isListening ? '88' : '90'}
            cy={isThinking ? '62' : '60'}
            r={isListening ? '5.5' : isSpeaking ? '5' : '4'}
            fill="#FFFFFF"
            filter="url(#eyeGlow)"
          />
          <circle
            cx={isThinking ? '86' : isListening ? '88' : '90'}
            cy={isThinking ? '62' : '60'}
            r={isListening ? '2.5' : '2'}
            fill="#F4B942"
          />
        </g>
      </svg>
    </div>
  );
};
