/* WAZI Civic — Civic Draft Studio Workspace */

import React, { useState, useEffect } from 'react';
import type { CivicCase, CivicDraft, DraftFormat, DisclosureSettings, WaziState } from '../../lib/types';
import { generateCivicDraft } from '../../lib/evidence-engine';
import { applyDisclosureToDraft } from '../../lib/privacy';
import { FormatSelector } from './FormatSelector';
import { ToneControl } from './ToneControl';
import { DisclosureSheet } from './DisclosureSheet';
import { WaziCompanion } from '../wazi/WaziCompanion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Copy,
  Mail,
  Shield,
  CheckCircle2,
  AlertOctagon,
  Printer
} from 'lucide-react';

interface DraftStudioProps {
  civicCase: CivicCase;
  waziState: WaziState;
  onReturnHome: () => void;
  onOpenEvidence: () => void;
  onOpenSavedCases: () => void;
  onSaveCase: (updatedCase: CivicCase) => void;
  onShowToast: (msg: string) => void;
}

export const DraftStudio: React.FC<DraftStudioProps> = ({
  civicCase,
  waziState,
  onReturnHome,
  onOpenEvidence,
  onOpenSavedCases,
  onSaveCase,
  onShowToast
}) => {
  const [selectedFormat, setSelectedFormat] = useState<DraftFormat>('foi');
  const [tone, setTone] = useState<'firm' | 'neutral' | 'conciliatory'>('neutral');
  const [length, setLength] = useState<'concise' | 'standard' | 'detailed'>('standard');
  const [draft, setDraft] = useState<CivicDraft>(() =>
    generateCivicDraft(civicCase, 'foi', 'neutral', 'standard')
  );
  const [editableBody, setEditableBody] = useState<string>('');
  const [disclosureSettings, setDisclosureSettings] = useState<DisclosureSettings>(civicCase.disclosure);
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Re-generate base draft when format or tone changes
  useEffect(() => {
    const newDraft = generateCivicDraft(civicCase, selectedFormat, tone, length);
    setDraft(newDraft);
    const customized = applyDisclosureToDraft(newDraft.body, disclosureSettings);
    setEditableBody(customized);
  }, [selectedFormat, tone, length, civicCase]);

  // Update body when disclosure settings change
  const handleUpdateDisclosure = (newSettings: DisclosureSettings) => {
    setDisclosureSettings(newSettings);
    const customized = applyDisclosureToDraft(draft.body, newSettings);
    setEditableBody(customized);
    onShowToast('Privacy disclosure settings updated');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableBody);
    setIsCopied(true);
    onShowToast('Draft copied to clipboard');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrintPdf = () => {
    onShowToast('Preparing document print/PDF view...');
    window.print();
  };

  const handleOpenEmailClient = () => {
    const subject = encodeURIComponent(draft.subject);
    const body = encodeURIComponent(editableBody);
    const mailto = `mailto:${draft.recipientRoute}?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
    onShowToast('Opened email client with verified recipient');
  };

  const handleSimulatedSubmit = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const updated: CivicCase = {
      ...civicCase,
      status: 'submitted',
      disclosure: disclosureSettings,
      updatedAt: new Date().toISOString()
    };
    onSaveCase(updated);
    onShowToast('Case deliverable generated & saved locally');
  };

  const route = civicCase.route;

  return (
    <div
      className="workspace-panel draft-studio-panel"
      style={{
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--neutral-100)',
        color: 'var(--neutral-10)',
        padding: '0 var(--space-4) calc(var(--safe-bottom) + var(--space-8))',
        animation: 'slide-up var(--duration-normal) var(--ease-out)',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'calc(var(--safe-top) + var(--space-3)) 0 var(--space-3)',
          borderBottom: '1px solid var(--warm-paper-80)',
          marginBottom: 'var(--space-3)'
        }}
      >
        <button
          onClick={onReturnHome}
          className="btn btn--sm btn--ghost"
          style={{ paddingLeft: '2px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to WAZI</span>
        </button>

        <WaziCompanion
          state={waziState}
          statusText="Draft Studio"
          onClick={onReturnHome}
        />
      </div>

      {/* Tabs */}
      <div className="tab-strip" style={{ padding: '0 0 var(--space-3) 0' }}>
        <button className="tab-pill" onClick={onOpenEvidence}>
          Evidence Board
        </button>
        <button className="tab-pill active">
          Draft Studio
        </button>
        <button className="tab-pill" onClick={onOpenSavedCases}>
          Saved Cases
        </button>
      </div>

      {/* Format Selector Pills */}
      <div style={{ marginTop: 'var(--space-2)' }}>
        <FormatSelector
          selectedFormat={selectedFormat}
          onSelectFormat={setSelectedFormat}
        />
      </div>

      <ToneControl
        tone={tone}
        length={length}
        onChangeTone={setTone}
        onChangeLength={setLength}
      />

      {/* Recipient Verification Card */}
      {route && (
        <div
          style={{
            background: 'var(--warm-paper-95)',
            border: '1px solid var(--warm-paper-80)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            marginBottom: 'var(--space-4)',
            fontSize: 'var(--text-xs)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--neutral-60)', textTransform: 'uppercase' }}>
              Verified Institutional Route
            </span>
            <span style={{ color: 'var(--verified-green)', fontWeight: 'var(--weight-semibold)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              <CheckCircle2 size={13} /> {route.statutoryTimeline}
            </span>
          </div>

          <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', color: 'var(--neutral-10)', marginTop: '2px' }}>
            {route.agency}
          </div>

          <div style={{ color: 'var(--neutral-40)', marginTop: '2px' }}>
            Recipient: {route.role} &bull; <span style={{ fontFamily: 'var(--font-mono)' }}>{route.verifiedEmail}</span>
          </div>

          {/* Escalation Pathway if Agency Fails to Act */}
          {route.escalation && (
            <div
              style={{
                marginTop: 'var(--space-2)',
                paddingTop: 'var(--space-2)',
                borderTop: '1px dashed var(--warm-paper-80)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                color: 'var(--neutral-40)'
              }}
            >
              <AlertOctagon size={13} color="var(--reported-amber)" />
              <span>
                <strong>Escalation route:</strong> {route.escalation.body} ({route.escalation.contact})
              </span>
            </div>
          )}
        </div>
      )}

      {/* Document Review Banner & Privacy Toggle Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--warm-paper-90)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--space-2)'
        }}
      >
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-40)' }}>
          Review wording before dispatch or export
        </span>
        <button
          onClick={() => setIsDisclosureOpen(true)}
          className="btn btn--sm btn--secondary"
          style={{ fontSize: 'var(--text-2xs)', height: '28px', padding: '0 8px' }}
        >
          <Shield size={13} />
          <span>Privacy & Disclosure</span>
        </button>
      </div>

      {/* WYSIWYG Document Editor Surface */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--warm-paper-80)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--space-4)',
          position: 'relative'
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
          Subject: {draft.subject}
        </div>

        <textarea
          value={editableBody}
          onChange={(e) => setEditableBody(e.target.value)}
          rows={16}
          style={{
            width: '100%',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontFamily: selectedFormat === 'whatsapp' ? 'var(--font-primary)' : 'var(--font-primary)',
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--neutral-10)',
            background: 'transparent',
            boxSizing: 'border-box'
          }}
        />

        {/* Evidence Attachments Tagged */}
        {draft.attachments.length > 0 && (
          <div
            style={{
              marginTop: 'var(--space-3)',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--warm-paper-90)',
              fontSize: 'var(--text-xs)',
              color: 'var(--neutral-60)'
            }}
          >
            <strong>Attached Evidence Files:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
              {draft.attachments.map((att, i) => (
                <li key={i}>{att}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Strip: Copy, Print/PDF, Mail, Submit */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-5)'
        }}
      >
        <button
          onClick={handleCopy}
          className="btn btn--outline-dark"
        >
          <Copy size={16} />
          <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
        </button>

        <button
          onClick={handlePrintPdf}
          className="btn btn--outline-dark"
        >
          <Printer size={16} />
          <span>Print / PDF</span>
        </button>

        <button
          onClick={handleOpenEmailClient}
          className="btn btn--secondary"
        >
          <Mail size={16} />
          <span>Open Email App</span>
        </button>

        <button
          onClick={handleSimulatedSubmit}
          className="btn btn--primary"
        >
          <CheckCircle2 size={16} />
          <span>Save Deliverable</span>
        </button>
      </div>

      {/* Privacy Disclosure Bottom Sheet Modal */}
      <DisclosureSheet
        isOpen={isDisclosureOpen}
        settings={disclosureSettings}
        onClose={() => setIsDisclosureOpen(false)}
        onUpdateSettings={handleUpdateDisclosure}
      />
    </div>
  );
};
