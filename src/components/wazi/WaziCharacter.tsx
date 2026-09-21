/* WAZI Civic — Alive 2D SVG Character with Micro-Behaviors
   States: resting, listening, thinking, speaking, waiting_permission, attention, error
   Inspired by SABI SabiHead: blink, gaze drift, RMS pulse, head tilt
*/

import React, { useEffect, useRef } from 'react';
import type { WaziState } from '../../lib/types';

interface WaziCharacterProps {
  state: WaziState;
  size?: number;
  micLevel?: number;
  speakerLevel?: number;
  onClick?: () => void;
  className?: string;
}

export const WaziCharacter: React.FC<WaziCharacterProps> = ({
  state = 'resting',
  size = 140,
  micLevel = 0,
  speakerLevel = 0,
  onClick,
  className = ''
}) => {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isThinking = state === 'thinking';
  const isWaiting = state === 'waiting_permission';
  const isAttention = state === 'attention';
  const isError = state === 'error';
  const isResting = state === 'resting';

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = React.useState(false);
  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Periodic Random Blink (every 3-7 seconds) ───
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 4000; // 3-7s
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 180); // Blink duration
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const resetMouse = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // RMS-driven dynamic scale for the core orb
  const coreScale = isSpeaking
    ? 1 + speakerLevel * 1.5  // Pulse with voice amplitude
    : isListening
    ? 1 + micLevel * 0.8      // Softer breathing with mic
    : 1;

  // Head tilt: subtle rotation based on state. Nodding when speaking.
  const headTilt = isSpeaking 
    ? 1.5 + Math.sin(Date.now() / 150) * (speakerLevel * 2) 
    : isListening ? -1 
    : isThinking ? 2 : 0;
  
  // Mouth opening mapped to speakerLevel
  const mouthOpenAmount = isSpeaking ? speakerLevel * 100 : 0;

  // Eye animation: gaze drift when idle, mouse tracking when active
  const eyeTransform = isResting
    ? undefined // CSS animation handles it
    : `translateZ(60px) translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`;

  const eyeAnimation = isResting
    ? 'wazi-gaze-drift 8s infinite ease-in-out'
    : 'none';

  return (
    <div
      className={`wazi-character-container ${state} ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetMouse}
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
        perspective: '1000px',
        transition: 'transform var(--duration-normal) var(--ease-spring)',
        animation: isError ? 'wazi-error-shake 0.5s ease-in-out' : 'none'
      }}
    >
      {/* 3D Container with Parallax Tilt + Head Tilt */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateY(${mousePos.x * 20}deg) rotateX(${-mousePos.y * 20}deg) rotate(${headTilt}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          animation: isSpeaking
            ? 'wazi-speaking 0.6s infinite ease-in-out'
            : isListening
            ? 'none'
            : 'wazi-breathe 4s infinite ease-in-out'
        }}
      >
        {/* Core Glowing Orb — RMS-driven pulse */}
        <div
          style={{
            position: 'absolute',
            inset: '10%',
            borderRadius: '50%',
            background: isError
              ? 'radial-gradient(circle at 30% 30%, #F4B942 0%, #D4872E 40%, #8B4513 80%)'
              : 'radial-gradient(circle at 30% 30%, #8DF5E7 0%, #16C6B1 40%, #0B7A6E 80%)',
            boxShadow: isError
              ? '0 0 40px rgba(244, 185, 66, 0.6), 0 0 80px rgba(244, 185, 66, 0.3)'
              : isWaiting || isAttention
              ? 'var(--wazi-glow-amber)'
              : 'var(--wazi-glow)',
            transform: `translateZ(-10px) scale(${coreScale})`,
            transition: isSpeaking || isListening ? 'transform 0.08s ease-out' : 'all 0.4s ease'
          }}
        />

        {/* Outer Glass Shell (Depth and Refraction) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            transform: 'translateZ(20px)',
            boxShadow: 'inset -10px -10px 20px rgba(0,0,0,0.1)'
          }}
        />

        {/* Ambient Heart Pulse — Driven by real audio signals */}
        <div
          style={{
            position: 'absolute',
            inset: '30%',
            borderRadius: '50%',
            background: isError ? '#F4B942' : isWaiting || isAttention ? 'var(--sun-amber)' : 'var(--warm-paper)',
            filter: 'blur(12px)',
            transform: `translateZ(40px) scale(${coreScale})`,
            opacity: 0.6 + (isSpeaking ? speakerLevel : micLevel),
            transition: isSpeaking || isListening ? 'all 0.08s ease-out' : 'all 0.4s ease',
            animation: isListening ? 'wazi-listening-breathe 2s infinite ease-in-out' : 'none'
          }}
        />

        {/* "Eyes" / Focus Points — Blink + Gaze Drift + Mouse Tracking */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '30%',
            width: '12%',
            height: isBlinking ? '3%' : '12%',
            borderRadius: '50%',
            background: isError ? '#FFF3CD' : '#FFF',
            boxShadow: isError ? '0 0 10px #F4B942' : '0 0 10px #FFF',
            transform: eyeTransform,
            animation: eyeAnimation,
            transition: 'height 0.08s ease-out, transform 0.1s linear'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '30%',
            width: '12%',
            height: isBlinking ? '3%' : '12%',
            borderRadius: '50%',
            background: isError ? '#FFF3CD' : '#FFF',
            boxShadow: isError ? '0 0 10px #F4B942' : '0 0 10px #FFF',
            transform: eyeTransform,
            animation: eyeAnimation,
            transition: 'height 0.08s ease-out, transform 0.1s linear'
          }}
        />

        {/* ─── Articulated Lips & Oral Cavity ─── */}
        <div
          style={{
            position: 'absolute',
            top: '65%',
            left: '50%',
            transform: `translateX(-50%) translateZ(65px) ${eyeTransform ? eyeTransform.replace('translateZ(60px)', '') : ''}`,
            width: '24%',
            height: '10%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.1s linear'
          }}
        >
          {/* Inner Cavity (Amber Luminescence) */}
          <div
            style={{
              position: 'absolute',
              width: `${100 + mouthOpenAmount * 0.2}%`,
              height: `${10 + mouthOpenAmount}%`,
              background: 'radial-gradient(circle at top, var(--sun-amber), #8B4513)',
              borderRadius: '20px',
              boxShadow: `0 0 ${10 + mouthOpenAmount * 0.5}px var(--wazi-glow-amber)`,
              opacity: isSpeaking ? Math.min(1, 0.4 + speakerLevel) : 0,
              transition: 'height 0.05s ease-out, opacity 0.05s ease-out, width 0.05s ease-out',
              zIndex: 1
            }}
          />
          
          {/* Upper Lip */}
          <div
            style={{
              position: 'absolute',
              top: `-${mouthOpenAmount * 0.4}%`,
              width: '100%',
              height: '4px',
              background: isError ? '#F4B942' : 'var(--warm-paper)',
              borderRadius: '10px',
              transition: 'top 0.05s ease-out',
              zIndex: 2
            }}
          />

          {/* Lower Lip */}
          <div
            style={{
              position: 'absolute',
              bottom: `-${mouthOpenAmount * 0.4}%`,
              width: '90%',
              height: '4px',
              background: isError ? '#F4B942' : 'var(--warm-paper)',
              borderRadius: '10px',
              transition: 'bottom 0.05s ease-out',
              zIndex: 2
            }}
          />
        </div>

        {/* Thinking Orbit Particles */}
        {isThinking && (
          <div
            style={{
              position: 'absolute',
              inset: '-10%',
              animation: 'wazi-thinking-orbit 3s linear infinite',
              pointerEvents: 'none',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--sun-amber)',
                boxShadow: '0 0 10px var(--sun-amber)',
                transform: 'translateZ(30px)'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
