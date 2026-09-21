/* WAZI Civic — Master Application & State Controller */

import React, { useState, useEffect } from 'react';
import type {
  CivicCase,
  ExtractedClue,
  SearchStep,
  TranscriptItem,
  WaziState
} from './lib/types';
import {
  FLAGSHIP_CASE,
  INITIAL_SAVED_CASES
} from './lib/demo-fixtures';
import {
  loadSavedCases,
  saveSingleCase,
  loadSettings,
  saveSettings
} from './lib/storage';
import type { AppSettings } from './lib/storage';
import { sounds, speakWazi } from './lib/audio-speech';
import { geminiClient } from './lib/gemini-client';
import {
  simulateSearchSteps,
  performCheckAgain
} from './lib/evidence-engine';
import { useLiveAudio } from './hooks/useLiveAudio';

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
import { Settings as SettingsIcon, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  
  // Live Audio Hook
  const { 
    waziState: liveWaziState, 
    micLevel, 
    speakerLevel, 
    isConnected,
    error: liveAudioError,
    connect, 
    disconnect, 
    sendTextPrompt 
  } = useLiveAudio(
    undefined,
    settings.voiceName,
    settings.language
  );

  // Navigation & View States
  const [currentView, setCurrentView] = useState<'home' | 'evidence' | 'draft' | 'cases'>('home');
  const [waziState, setWaziState] = useState<WaziState>('resting');
  const [waziStatusText, setWaziStatusText] = useState<string>('WAZI');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [ttsViseme, setTtsViseme] = useState<number>(0);
  const [captionText, setCaptionText] = useState<string>("What would you like to understand, or show me?");

  // Conversation & Case State
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: 'init',
      speaker: 'wazi',
      text: "Hello. I'm WAZI. What would you like to understand, or show me?",
      timestamp: Date.now()
    }
  ]);

  const [activeCase, setActiveCase] = useState<CivicCase>(FLAGSHIP_CASE);
  const [savedCases, setSavedCases] = useState<CivicCase[]>([]);

  // Modals & Panels
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Evidence Verification State
  const [isSearching, setIsSearching] = useState(false);
  const [searchSteps, setSearchSteps] = useState<SearchStep[]>([]);
  const [isCheckingAgain, setIsCheckingAgain] = useState(false);

  // Initialize data and sounds on mount
  useEffect(() => {
    const loaded = loadSavedCases();
    setSavedCases(loaded);
    sounds.setEnabled(settings.soundEnabled);
    if (settings.apiKey) geminiClient.setApiKey(settings.apiKey);

    // Initial gentle ready chime after launch
    const timer = setTimeout(() => {
      sounds.playReady();
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    if (liveAudioError) {
      showToast(liveAudioError);
      setIsListening(false);
      setWaziState('error'); // Use explicitly added error state
    }
  }, [liveAudioError]);

  // Sync Live Audio state to UI character state
  useEffect(() => {
    if (isConnected) {
      setWaziState(liveWaziState);
    }
  }, [isConnected, liveWaziState]);

  // Connection Toast
  useEffect(() => {
    if (isConnected) {
      showToast("Live Session Connected");
    }
  }, [isConnected]);

  // Hardware Back Button (Mobile) Resilience
  useEffect(() => {
    const handlePopState = () => {
      if (currentView !== 'home') {
        setCurrentView('home');
      }
    };
    if (currentView !== 'home') {
      window.history.pushState({ view: currentView }, '', '');
    }
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  // Speak a message with WAZI animation and sound
  const speakAsWazi = (text: string, onDone?: () => void) => {
    setCaptionText(text);
    setWaziState('speaking');
    setTranscripts(prev => [...prev, { id: `wazi-${Date.now()}`, speaker: 'wazi', text, timestamp: Date.now() }]);

    speakWazi(
      text,
      () => setWaziState('speaking'),
      () => {
        setWaziState('resting');
        setTtsViseme(0);
        onDone?.();
      },
      () => {
        // Pseudo-random viseme energy on syllable boundaries
        setTtsViseme(0.3 + Math.random() * 0.7);
        setTimeout(() => setTtsViseme(0), 100);
      }
    );
  };

  // User input handling (voice or text)
  const handleUserQuery = async (queryText: string) => {
    if (!queryText.trim()) return;

    setTranscripts(prev => [
      ...prev,
      { id: `user-${Date.now()}`, speaker: 'user', text: queryText, timestamp: Date.now() }
    ]);

    setIsListening(false);
    setIsThinking(true);
    setWaziState('thinking');

    // Route to Gemini Live session if connected
    if (isConnected) {
      sendTextPrompt(queryText);
      setIsThinking(false);
      return;
    }

    // If query matches the health centre issue, trigger the flagship demonstration
    const lower = queryText.toLowerCase();
    if (lower.includes('health centre') || lower.includes('completed') || lower.includes('look at') || lower.includes('what is here')) {
      setIsThinking(false);
      speakAsWazi(
        "I can examine that health centre right away. Show me the signboard or site photo so I can extract the project references.",
        () => {
          setIsCameraOpen(true);
        }
      );
      return;
    }

    // General civic response (REST fallback)
    const response = await geminiClient.respondToUser(queryText);
    setIsThinking(false);
    speakAsWazi(response);
  };

  // Start / Stop Live Audio WebSocket
  const toggleListening = async () => {
    if (isConnected) {
      disconnect();
      setIsListening(false);
      sounds.playActionComplete();
    } else {
      sounds.playListeningStart();
      await connect();
      setIsListening(true);
    }
  };

  // Trigger Evidence Verification after photo/signboard capture
  const handleConfirmClues = async (clues: ExtractedClue[], imageUri?: string) => {
    setCurrentView('evidence');
    setWaziState('companion');
    setWaziStatusText('Verifying');
    setIsSearching(true);

    const updatedCase: CivicCase = {
      ...FLAGSHIP_CASE,
      clues,
      imageUri: imageUri || FLAGSHIP_CASE.imageUri
    };
    setActiveCase(updatedCase);

    await simulateSearchSteps((steps) => setSearchSteps(steps));

    setIsSearching(false);
    sounds.playEvidenceFound();
    setWaziStatusText('Evidence Ready');

    speakAsWazi(
      "The official procurement records claim this health centre was completed, but your field evidence shows an unroofed shell. That is a direct discrepancy."
    );
  };

  // Check Again adversarial pass
  const handleCheckAgain = async () => {
    setIsCheckingAgain(true);
    setWaziState('companion');
    setWaziStatusText('Auditing');

    const { updatedCase, verdict } = await performCheckAgain(activeCase, (steps) => setSearchSteps(steps));
    setActiveCase(updatedCase);
    setIsCheckingAgain(false);
    sounds.playEvidenceFound();
    setWaziStatusText('Finding Holds');
    speakAsWazi(verdict);
  };

  const handleSaveCase = (c: CivicCase) => {
    const updated = saveSingleCase(c);
    setSavedCases(updated);
    setActiveCase(c);
    sounds.playActionComplete();
  };

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
        {/* Top Header Bar (Only visible on Home screen; Workspaces have dedicated headers) */}
        {currentView === 'home' && (
          <header className="top-nav-bar">
            <PrivacyShield isMicActive={isListening} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              {/* Replace LanguagePill with a button to open modal, or just make LanguagePill trigger the modal */}
              <button
                onClick={() => setIsLanguageModalOpen(true)}
                style={{
                  background: 'var(--midnight-ink-80)',
                  border: '1px solid var(--midnight-ink-70)',
                  borderRadius: '20px',
                  padding: '6px 12px',
                  color: 'var(--warm-paper)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {settings.language}
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
            {/* WAZI Character Stage */}
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
                speakerLevel={Math.max(speakerLevel, ttsViseme)}
                onClick={() => speakAsWazi("I'm listening. Speak or show me what is happening.")}
              />

              {/* Live Captions & Suggestions */}
              <Transcript
                items={transcripts}
                waziCaption={isListening ? "WAZI is listening..." : captionText}
                isThinking={isThinking}
                onQuickPrompt={handleUserQuery}
              />
            </div>

            {/* Interaction Controls: Big Talk Button + Text / Camera Bar */}
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
              <TalkButton
                isListening={isListening}
                onToggle={toggleListening}
              />

              <TextInput
                onSend={handleUserQuery}
                onOpenCamera={() => setIsCameraOpen(true)}
                disabled={isListening}
              />
            </div>

            {/* Expandable Action Dock */}
            <ActionDock
              onCheckSomething={() => setIsCameraOpen(true)}
              onReportIssue={() => {
                showToast('Opening issue reporting evidence intake');
                setIsCameraOpen(true);
              }}
              onUnderstandPolicy={() => {
                handleUserQuery('What are my rights to inspect public health facility contracts?');
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
          onClose={() => setIsCameraOpen(false)}
          onConfirmClues={handleConfirmClues}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          settings={settings}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateSettings={(updated) => {
            setSettings(updated);
            sounds.setEnabled(updated.soundEnabled);
            showToast('Settings saved');
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
          onClose={() => setIsLanguageModalOpen(false)}
          onSelectLanguage={(lang) => {
            const updated = saveSettings({ ...settings, language: lang });
            setSettings(updated);
            showToast(`Language set to ${lang}`);
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
