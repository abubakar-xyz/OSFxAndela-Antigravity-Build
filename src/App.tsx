/* WAZI Civic — Master Application & State Controller */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  CivicCase,
  ExtractedClue,
  SearchStep,
  TranscriptItem,
  WaziState
} from './lib/types';
import { FLAGSHIP_CASE, INITIAL_SAVED_CASES } from './lib/demo-fixtures';
import { loadSavedCases, saveSingleCase, loadSettings, saveSettings } from './lib/storage';
import type { AppSettings } from './lib/storage';
import { sounds } from './lib/audio-speech';
import { simulateSearchSteps, performCheckAgain } from './lib/evidence-engine';
import { useLiveAudio, type DetectedLanguage, type LiveTranscript } from './hooks/useLiveAudio';
import type { ToolCall } from './lib/live-protocol';

// UI & Presentation Components
import { WaziCharacter } from './components/wazi/WaziCharacter';
import { Transcript } from './components/conversation/Transcript';
import { TalkButton } from './components/conversation/TalkButton';
import { TextInput } from './components/conversation/TextInput';
import { ActionDock } from './components/ui/ActionDock';
import { PrivacyShield } from './components/ui/PrivacyShield';
import { SettingsModal } from './components/ui/SettingsModal';
import { LanguageSelectorModal } from './components/ui/LanguageSelectorModal';
import { CameraModal } from './components/workspace/CameraModal';
import { EvidenceWorkspace } from './components/workspace/EvidenceWorkspace';
import { DraftStudio } from './components/draft/DraftStudio';
import { CaseList } from './components/cases/CaseList';
import { SafetyBanner, type SafetyAlert } from './components/ui/SafetyBanner';
import { Settings as SettingsIcon, Sparkles } from 'lucide-react';

const MAX_TRANSCRIPT_ITEMS = 60;
const OPENING_LINE = "Hello. I'm WAZI. What would you like to understand, or show me?";

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Navigation & View States
  const [currentView, setCurrentView] = useState<'home' | 'evidence' | 'draft' | 'cases'>('home');
  const [waziStatusText, setWaziStatusText] = useState<string>('WAZI');

  // Conversation & Case State
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    { id: 'init', speaker: 'wazi', text: OPENING_LINE, timestamp: Date.now() }
  ]);
  const [activeCase, setActiveCase] = useState<CivicCase>(FLAGSHIP_CASE);
  const [savedCases, setSavedCases] = useState<CivicCase[]>([]);

  // Modals & Panels
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraPrompt, setCameraPrompt] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [safetyAlert, setSafetyAlert] = useState<SafetyAlert | null>(null);

  // Evidence Verification State
  const [isSearching, setIsSearching] = useState(false);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [isCheckingAgain, setIsCheckingAgain] = useState(false);

  // What WAZI has worked out the user is speaking. The language selector is no
  // longer an input to this — it is a readout of it.
  const [detectedLanguage, setDetectedLanguage] = useState<DetectedLanguage | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // ─────────────────────────────────────────── live transcript plumbing

  /**
   * Transcription arrives as a stream of fragments, not finished sentences. They
   * are accumulated into the open utterance for that speaker, and the other
   * speaker's open utterance is closed when someone else starts — which is what
   * a turn boundary actually is in a duplex conversation.
   */
  const appendTranscript = useCallback(({ role, text }: LiveTranscript) => {
    if (!text) return;
    const speaker: TranscriptItem['speaker'] = role === 'user' ? 'user' : 'wazi';

    setTranscripts((previous) => {
      const next = previous.map((item) =>
        item.isPartial && item.speaker !== speaker ? { ...item, isPartial: false } : item
      );
      const last = next[next.length - 1];

      if (last && last.speaker === speaker && last.isPartial) {
        next[next.length - 1] = { ...last, text: last.text + text, timestamp: Date.now() };
      } else {
        next.push({
          id: `${speaker}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          speaker,
          text,
          timestamp: Date.now(),
          isPartial: true
        });
      }
      return next.slice(-MAX_TRANSCRIPT_ITEMS);
    });

  }, []);

  // ─────────────────────────────────────────────── tool call handling

  const runSearchAndPresent = useCallback(
    async (nextCase: CivicCase) => {
      setActiveCase(nextCase);
      setCurrentView('evidence');
      setWaziStatusText('Verifying');
      setIsSearching(true);

      await simulateSearchSteps((steps) => setSearchSteps(steps));

      setIsSearching(false);
      sounds.playEvidenceFound();
      setWaziStatusText('Evidence Ready');
    },
    []
  );

  const liveRef = useRef<{ sendMoment: (m: 'evidence_ready') => void } | null>(null);

  /**
   * The model operating the interface. This is what replaced the keyword match
   * that used to decide when to leave voice mode — the model already understood
   * the sentence, in whatever language it was spoken, so the decision belongs
   * to it rather than to `text.includes('health centre')`.
   */
  const handleToolCall = useCallback(
    async (call: ToolCall): Promise<unknown> => {
      const args = call.args as Record<string, string | undefined>;

      switch (call.name) {
        case 'note_detected_language':
          // Handled by onLanguageDetected; acknowledged here so the model
          // knows the interface followed it.
          return { ok: true };

        case 'open_evidence_board': {
          const nextCase: CivicCase = {
            ...FLAGSHIP_CASE,
            title: args.title || FLAGSHIP_CASE.title,
            claim: args.claim || FLAGSHIP_CASE.claim,
            summary: args.observation || FLAGSHIP_CASE.summary,
            updatedAt: new Date().toISOString()
          };
          void runSearchAndPresent(nextCase).then(() => {
            // Let WAZI react to what is now on screen, in the user's language,
            // rather than reading out a hardcoded English sentence.
            liveRef.current?.sendMoment('evidence_ready');
          });
          return { ok: true, opened: 'evidence_board', title: nextCase.title };
        }

        case 'request_photo_evidence':
          setCameraPrompt(args.what_to_capture ?? null);
          setIsCameraOpen(true);
          return { ok: true, opened: 'camera' };

        case 'open_draft_studio':
          setCurrentView('draft');
          sounds.playReady();
          return { ok: true, opened: 'draft_studio', format: args.format ?? 'foi' };

        case 'raise_safety_alert':
          setSafetyAlert({
            kind: args.kind || 'other',
            summary: args.summary || 'WAZI flagged a safety concern.',
            guidance: args.immediate_guidance
          });
          sounds.playAttention();
          return { ok: true, surfaced: 'emergency_contacts' };

        default:
          return { ok: false, error: 'unknown_tool' };
      }
    },
    [runSearchAndPresent]
  );

  const handleLanguageDetected = useCallback(
    (lang: DetectedLanguage) => {
      setDetectedLanguage(lang);
      // Persist as the next session's hint. It is a memory of what was heard,
      // not a setting the user has to maintain.
      setSettings((current) => saveSettings({ ...current, language: lang.bcp47 || current.language }));
      if (lang.displayName) showToast(`Speaking ${lang.displayName}`);
    },
    [showToast]
  );

  // ─────────────────────────────────────────────────── the live session

  const {
    waziState: liveWaziState,
    micLevel,
    speakerLevel,
    isConnected,
    isMuted,
    modelLabel,
    error: liveAudioError,
    connect,
    disconnect,
    sendText,
    sendMoment,
    toggleMute
  } = useLiveAudio({
    voice: settings.voiceName,
    languageHint: settings.language,
    onTranscript: appendTranscript,
    onToolCall: handleToolCall,
    onLanguageDetected: handleLanguageDetected
  });

  liveRef.current = { sendMoment };

  // While a session is live, WAZI's own state is the truth. Outside one, the
  // workspace views drive it.
  const [idleState, setIdleState] = useState<WaziState>('resting');
  const waziState: WaziState = isConnected ? liveWaziState : idleState;

  // Initialize data and sounds on mount
  useEffect(() => {
    setSavedCases(loadSavedCases());
    sounds.setEnabled(settings.soundEnabled);
    const timer = setTimeout(() => sounds.playReady(), 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (liveAudioError) showToast(liveAudioError);
  }, [liveAudioError, showToast]);

  useEffect(() => {
    if (isConnected && modelLabel) showToast(`Live with WAZI · ${modelLabel}`);
  }, [isConnected, modelLabel, showToast]);

  // Hardware Back Button (Mobile) Resilience
  useEffect(() => {
    const handlePopState = () => {
      if (currentView !== 'home') setCurrentView('home');
    };
    if (currentView !== 'home') {
      window.history.pushState({ view: currentView }, '', '');
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  // ───────────────────────────────────────────────────────── handlers

  /** Screen-only narration. Verified text belongs on screen; the voice is the model's. */
  const showWaziLine = useCallback((text: string) => {
    setTranscripts((previous) =>
      [...previous, { id: `wazi-${Date.now()}`, speaker: 'wazi' as const, text, timestamp: Date.now() }]
        .slice(-MAX_TRANSCRIPT_ITEMS)
    );
  }, []);

  const handleUserQuery = useCallback(
    async (queryText: string) => {
      const text = queryText.trim();
      if (!text) return;

      setTranscripts((previous) =>
        [...previous, { id: `user-${Date.now()}`, speaker: 'user' as const, text, timestamp: Date.now() }]
          .slice(-MAX_TRANSCRIPT_ITEMS)
      );

      if (sendText(text)) return;

      // Not connected yet. Typing is a deliberate act, so open the session and
      // deliver the question rather than answering from a separate code path —
      // there is one WAZI, and it is the one in the live session.
      showWaziLine('One moment — bringing WAZI online…');
      setIdleState('thinking');
      await connect();
      const delivered = sendText(text);
      if (!delivered) {
        setIdleState('resting');
        showWaziLine(
          'I could not reach the voice service just now. Check that the WAZI server is running, then try again.'
        );
      }
    },
    [connect, sendText, showWaziLine]
  );

  const toggleListening = useCallback(async () => {
    if (isConnected) {
      disconnect();
      sounds.playActionComplete();
    } else {
      sounds.playListeningStart();
      await connect();
    }
  }, [connect, disconnect, isConnected]);

  const handleConfirmClues = useCallback(
    async (clues: ExtractedClue[], imageUri?: string) => {
      setCameraPrompt(null);
      setIdleState('companion');
      await runSearchAndPresent({
        ...activeCase,
        clues,
        imageUri: imageUri || activeCase.imageUri
      });

      if (isConnected) {
        sendMoment('evidence_ready');
      } else {
        showWaziLine(
          'The official record claims this project was completed. Your field evidence says otherwise — that is a direct discrepancy.'
        );
      }
    },
    [activeCase, isConnected, runSearchAndPresent, sendMoment, showWaziLine]
  );

  const handleCheckAgain = useCallback(async () => {
    setIsCheckingAgain(true);
    setIdleState('companion');
    setWaziStatusText('Auditing');

    const { updatedCase, verdict } = await performCheckAgain(activeCase, (steps) => setSearchSteps(steps));
    setActiveCase(updatedCase);
    setIsCheckingAgain(false);
    sounds.playEvidenceFound();
    setWaziStatusText('Finding Holds');
    showWaziLine(verdict);
  }, [activeCase, showWaziLine]);

  const handleSaveCase = useCallback((c: CivicCase) => {
    setSavedCases(saveSingleCase(c));
    setActiveCase(c);
    sounds.playActionComplete();
  }, []);

  // The caption is the newest thing WAZI said, taken from the transcript rather
  // than accumulated separately — a separate accumulator had no way to know a
  // turn had ended, so each new sentence was glued onto the previous one and
  // the caption grew into a run-on paragraph.
  const captionText = useMemo(() => {
    for (let i = transcripts.length - 1; i >= 0; i--) {
      if (transcripts[i].speaker === 'wazi') return transcripts[i].text;
    }
    return OPENING_LINE;
  }, [transcripts]);

  // The pill shows what WAZI is actually speaking, falling back to the stored
  // hint before anyone has said anything.
  const languageLabel = useMemo(
    () => detectedLanguage?.displayName || settings.language,
    [detectedLanguage, settings.language]
  );

  const isListening = isConnected && !isMuted;

  return (
    <div className={`app-viewport ${settings.lowDataMode ? 'low-data' : ''}`}>
      <main
        className={`mobile-shell ${
          currentView === 'evidence'
            ? 'workspace-mode'
            : currentView === 'draft'
            ? 'draft-mode'
            : currentView === 'cases'
            ? 'workspace-mode'
            : ''
        }`}
      >
        {currentView === 'home' && (
          <header className="top-nav-bar">
            <PrivacyShield isMicActive={isListening} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                aria-label={
                  detectedLanguage
                    ? `WAZI is speaking ${languageLabel}, detected automatically`
                    : `Language hint: ${languageLabel}`
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--midnight-ink-80)',
                  border: `1px solid ${detectedLanguage ? 'var(--luminous-teal)' : 'var(--midnight-ink-70)'}`,
                  borderRadius: '20px',
                  padding: '6px 12px',
                  color: 'var(--warm-paper)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {detectedLanguage && (
                  <span
                    aria-hidden
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--luminous-teal)',
                      boxShadow: '0 0 6px var(--luminous-teal)'
                    }}
                  />
                )}
                {languageLabel}
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                aria-label="App settings and preferences"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--midnight-ink-80)',
                  border: '1px solid var(--midnight-ink-70)',
                  color: 'var(--warm-paper)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <SettingsIcon size={16} />
              </button>
            </div>
          </header>
        )}

        {safetyAlert && <SafetyBanner alert={safetyAlert} onDismiss={() => setSafetyAlert(null)} />}

        {/* VIEW 1: HOME (The Companion) */}
        {currentView === 'home' && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-2) 0 calc(var(--safe-bottom) + 70px)',
              position: 'relative'
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-4)',
                width: '100%',
                padding: 'var(--space-4) 0'
              }}
            >
              <WaziCharacter
                state={waziState}
                size={160}
                micLevel={micLevel}
                speakerLevel={speakerLevel}
                onClick={() => {
                  if (!isConnected) void toggleListening();
                  else toggleMute();
                }}
              />

              <Transcript
                items={transcripts}
                waziCaption={
                  isConnected && waziState === 'listening' && !captionText
                    ? 'WAZI is listening…'
                    : captionText
                }
                isThinking={waziState === 'thinking'}
                onQuickPrompt={handleUserQuery}
              />
            </div>

            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-4)',
                zIndex: 10
              }}
            >
              <TalkButton isListening={isConnected} onToggle={toggleListening} />

              <TextInput
                onSend={handleUserQuery}
                onOpenCamera={() => setIsCameraOpen(true)}
                disabled={false}
              />
            </div>

            <ActionDock
              onCheckSomething={() => setIsCameraOpen(true)}
              onReportIssue={() => {
                showToast('Opening issue reporting evidence intake');
                setIsCameraOpen(true);
              }}
              onUnderstandPolicy={() => {
                void handleUserQuery('What are my rights to inspect public health facility contracts?');
              }}
              onOpenDrafts={() => setCurrentView('draft')}
              onOpenCases={() => setCurrentView('cases')}
            />
          </div>
        )}

        {/* VIEW 2: EVIDENCE WORKSPACE */}
        {currentView === 'evidence' && (
          <EvidenceWorkspace
            civicCase={activeCase}
            isSearching={isSearching}
            searchSteps={searchSteps}
            isCheckingAgain={isCheckingAgain}
            waziState={waziState}
            waziStatusText={waziStatusText}
            onReturnHome={() => setCurrentView('home')}
            onCheckAgain={handleCheckAgain}
            onTakeAction={() => {
              setCurrentView('draft');
              sounds.playReady();
            }}
            onOpenDraftStudio={() => setCurrentView('draft')}
            onOpenSavedCases={() => setCurrentView('cases')}
          />
        )}

        {/* VIEW 3: DRAFT STUDIO */}
        {currentView === 'draft' && (
          <DraftStudio
            civicCase={activeCase}
            waziState={waziState}
            onReturnHome={() => setCurrentView('home')}
            onOpenEvidence={() => setCurrentView('evidence')}
            onOpenSavedCases={() => setCurrentView('cases')}
            onSaveCase={handleSaveCase}
            onShowToast={showToast}
          />
        )}

        {/* VIEW 4: SAVED CASES */}
        {currentView === 'cases' && (
          <CaseList
            cases={savedCases}
            waziState={waziState}
            onSelectCase={(c) => {
              setActiveCase(c);
              setCurrentView('evidence');
              showToast(`Opened case: ${c.title}`);
            }}
            onReturnHome={() => setCurrentView('home')}
            onOpenEvidence={() => setCurrentView('evidence')}
            onOpenDraftStudio={() => setCurrentView('draft')}
          />
        )}

        {/* Modals & Toast */}
        <CameraModal
          isOpen={isCameraOpen}
          prompt={cameraPrompt}
          onClose={() => {
            setIsCameraOpen(false);
            setCameraPrompt(null);
          }}
          onConfirmClues={handleConfirmClues}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={(updated) => {
            setSettings(updated);
            sounds.setEnabled(updated.soundEnabled);
            showToast(
              updated.voiceName !== settings.voiceName && isConnected
                ? 'Voice changed — it takes effect on the next session'
                : 'Settings saved'
            );
          }}
          onResetCases={() => {
            setSavedCases(INITIAL_SAVED_CASES);
            setActiveCase(FLAGSHIP_CASE);
            showToast('Reset to flagship demo case');
          }}
        />

        <LanguageSelectorModal
          isOpen={isLanguageModalOpen}
          currentLang={settings.language}
          detectedLanguage={detectedLanguage?.displayName ?? null}
          onClose={() => setIsLanguageModalOpen(false)}
          onSelectLanguage={(lang) => {
            setSettings(saveSettings({ ...settings, language: lang }));
            showToast(`Starting hint set to ${lang} — WAZI still follows your voice`);
          }}
        />

        {toastMessage && (
          <div className="toast-container">
            <div className="toast">
              <Sparkles size={16} color="var(--luminous-teal)" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
