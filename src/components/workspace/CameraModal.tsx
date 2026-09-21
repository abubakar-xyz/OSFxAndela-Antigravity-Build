/* WAZI Civic — Camera Intake & Photo Clue Extraction Modal */

import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import type { ExtractedClue } from '../../lib/types';
import { stripExifAndCompressImage, type SanitizationReport } from '../../lib/privacy';
import { geminiClient } from '../../lib/gemini-client';
import { ClueChips } from './ClueChips';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClues: (clues: ExtractedClue[], imageUri?: string) => void;
  /** What WAZI asked to see, when she opened this herself mid-conversation. */
  prompt?: string | null;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onConfirmClues,
  prompt = null
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedClues, setExtractedClues] = useState<ExtractedClue[]>([]);
  const [sanitizationReport, setSanitizationReport] = useState<SanitizationReport | null>(null);
  const [sourceType, setSourceType] = useState<'upload' | 'demo' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setSourceType('upload');
    try {
      const report = await stripExifAndCompressImage(file);
      setSanitizationReport(report);
      setImagePreview(report.dataUrl);

      const clues = await geminiClient.extractCluesFromImage(report.dataUrl);
      setExtractedClues(clues);
    } catch (err) {
      console.error('Error processing upload:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadDemoSignboard = async () => {
    setIsProcessing(true);
    setSourceType('demo');
    // Create high-res synthetic SVG rendering of the actual Akute PHC Project signboard
    const rawSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <rect width="600" height="380" fill="#071820" rx="8"/>
      <rect x="15" y="15" width="570" height="350" fill="#F7F3E8" stroke="#1E3A4A" stroke-width="4" rx="6"/>
      <rect x="25" y="25" width="550" height="60" fill="#132D3C" rx="4"/>
      <text x="300" y="55" fill="#16C6B1" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">FEDERAL GOVERNMENT OF NIGERIA</text>
      <text x="300" y="75" fill="#F7F3E8" font-family="sans-serif" font-size="13" text-anchor="middle">NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY (NPHCDA)</text>
      <text x="40" y="125" fill="#1A1A1A" font-family="sans-serif" font-size="16" font-weight="bold">PROJECT: REHABILITATION &amp; EQUIPPING OF MODEL PHC</text>
      <text x="40" y="160" fill="#2E2E2E" font-family="sans-serif" font-size="14">CONTRACT REF: NPHCDA/2023/LOT-14</text>
      <text x="40" y="195" fill="#2E2E2E" font-family="sans-serif" font-size="14">LOCATION: AKUTE WARD, IFO LGA, OGUN STATE</text>
      <text x="40" y="230" fill="#2E2E2E" font-family="sans-serif" font-size="14">CONTRACTOR: APEX GLOBAL ALLIED WORKS LTD (RC-1489201)</text>
      <text x="40" y="265" fill="#2E2E2E" font-family="sans-serif" font-size="14">CLIENT: DEPT OF PRIMARY HEALTH CARE SYSTEMS, GARKI ABUJA</text>
      <rect x="40" y="295" width="520" height="40" fill="#4BCB91" fill-opacity="0.2" stroke="#4BCB91" stroke-width="2" rx="4"/>
      <text x="300" y="320" fill="#0B7A6E" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">CLAIMED STATUS: 100% COMPLETED &amp; COMMISSIONED</text>
    </svg>`;

    const svgSignboard = `data:image/svg+xml;base64,${btoa(rawSvg)}`;

    setImagePreview(svgSignboard);
    setSanitizationReport({
      dataUrl: svgSignboard,
      size: Math.round(rawSvg.length),
      originalSize: Math.round(rawSvg.length),
      exifDetected: false,
      tagsPurged: ['Clean synthetic SVG', 'Zero camera footprint'],
      dimensions: { width: 600, height: 380 }
    });

    const clues = await geminiClient.extractCluesFromImage(svgSignboard);
    setExtractedClues(clues);
    setIsProcessing(false);
  };

  const handleConfirm = () => {
    onConfirmClues(extractedClues, imagePreview || undefined);
    onClose();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bottom-sheet-backdrop" onClick={onClose}>
      <div
        className="bottom-sheet"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '92dvh' }}
      >
        <div className="bottom-sheet__handle" />

        <div className="bottom-sheet__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Camera size={20} color="var(--luminous-teal)" />
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
              {prompt ? `Show WAZI: ${prompt}` : 'Show WAZI: Signboard or Document'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="bottom-sheet__body">
          {/* Quick Demo Action */}
          <div
            style={{
              background: 'rgba(22, 198, 177, 0.10)',
              border: '1px solid rgba(22, 198, 177, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                Demo Flagship Case: Akute Health Centre
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Try synthetic signboard to preview extraction
              </div>
            </div>
            <button
              onClick={handleLoadDemoSignboard}
              className="btn btn--sm btn--primary"
            >
              <Sparkles size={14} />
              <span>Load Sample</span>
            </button>
          </div>

          {/* Upload or Camera Capture Box */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--midnight-ink-60)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8) var(--space-4)',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--midnight-ink-80)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)',
                transition: 'border-color 0.2s ease, background-color 0.2s ease'
              }}
            >
              <Upload size={36} color="var(--luminous-teal)" />
              <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                Take photo or upload image
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', maxWidth: '300px', lineHeight: 1.5 }}>
                Signboard, tender notice, project site, receipt, or photo. EXIF GPS coordinates &amp; camera hardware metadata will be stripped in your browser before upload.
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  maxHeight: '200px',
                  border: '1px solid var(--midnight-ink-70)',
                  backgroundColor: '#000',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img
                  src={imagePreview}
                  alt="Captured civic evidence"
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Verified EXIF Stripping Status Bar */}
              {sanitizationReport && (
                <div
                  style={{
                    marginTop: 'var(--space-3)',
                    background: 'rgba(22, 198, 177, 0.10)',
                    border: '1px solid rgba(22, 198, 177, 0.3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <ShieldCheck size={20} color="var(--luminous-teal)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                    <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--luminous-teal)' }}>
                      ✓ EXIF &amp; GPS Metadata Stripped (Canvas Sanitized)
                    </div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Payload: {formatBytes(sanitizationReport.originalSize)} → {formatBytes(sanitizationReport.size)} · Camera serial &amp; GPS location scrubbed
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                  {sourceType === 'demo' ? 'Sample Signboard' : 'Real Image Upload'}
                </span>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setExtractedClues([]);
                    setSanitizationReport(null);
                    setSourceType(null);
                  }}
                  className="btn btn--sm btn--ghost"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Choose different image
                </button>
              </div>
            </div>
          )}

          {/* Extracted Clues Section */}
          {isProcessing ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0', color: 'var(--text-secondary)' }}>
              <div className="spin" style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}>
                <Sparkles size={24} color="var(--luminous-teal)" />
              </div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                Observing visual clues with Gemini Vision...
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Reading signboards, physical structures, and tender codes
              </div>
            </div>
          ) : extractedClues.length > 0 ? (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-2)'
                }}
              >
                <div
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--weight-bold)',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-wider)'
                  }}
                >
                  Extracted Clues ({extractedClues.length}) · Tap to Edit
                </div>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--luminous-teal)', fontWeight: 'var(--weight-medium)' }}>
                  Verified by Vision
                </span>
              </div>

              <ClueChips
                clues={extractedClues}
                onUpdateClue={(updated) => {
                  setExtractedClues(clues => clues.map(c => c.id === updated.id ? updated : c));
                }}
              />

              <div style={{ marginTop: 'var(--space-5)' }}>
                <button
                  onClick={handleConfirm}
                  className="btn btn--primary btn--lg"
                  style={{ width: '100%' }}
                >
                  <span>Verify Against Official Records</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
