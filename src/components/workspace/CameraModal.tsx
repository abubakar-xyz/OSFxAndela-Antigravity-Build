/* WAZI Civic — Camera Intake & Photo Clue Extraction Modal */

import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X, ArrowRight } from 'lucide-react';
import type { ExtractedClue } from '../../lib/types';
import { stripExifAndCompressImage } from '../../lib/privacy';
import { geminiClient } from '../../lib/gemini-client';
import { ClueChips } from './ClueChips';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClues: (clues: ExtractedClue[], imageUri?: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onConfirmClues
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedClues, setExtractedClues] = useState<ExtractedClue[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const { dataUrl } = await stripExifAndCompressImage(file);
      setImagePreview(dataUrl);

      const clues = await geminiClient.extractCluesFromImage(dataUrl);
      setExtractedClues(clues);
    } catch (err) {
      console.error('Error processing upload:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadDemoSignboard = async () => {
    setIsProcessing(true);
    // Create high-res synthetic SVG rendering of the actual Akute PHC Project signboard
    const svgSignboard = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="380" viewBox="0 0 600 380">
      <rect width="600" height="380" fill="%23071820" rx="8"/>
      <rect x="15" y="15" width="570" height="350" fill="%23F7F3E8" stroke="%231E3A4A" stroke-width="4" rx="6"/>
      <rect x="25" y="25" width="550" height="60" fill="%23132D3C" rx="4"/>
      <text x="300" y="55" fill="%2316C6B1" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle">FEDERAL GOVERNMENT OF NIGERIA</text>
      <text x="300" y="75" fill="%23F7F3E8" font-family="sans-serif" font-size="13" text-anchor="middle">NATIONAL PRIMARY HEALTH CARE DEVELOPMENT AGENCY (NPHCDA)</text>
      <text x="40" y="125" fill="%231A1A1A" font-family="sans-serif" font-size="16" font-weight="bold">PROJECT: REHABILITATION & EQUIPPING OF MODEL PHC</text>
      <text x="40" y="160" fill="%232E2E2E" font-family="sans-serif" font-size="14">CONTRACT REF: NPHCDA/2023/LOT-14</text>
      <text x="40" y="195" fill="%232E2E2E" font-family="sans-serif" font-size="14">LOCATION: AKUTE WARD, IFO LGA, OGUN STATE</text>
      <text x="40" y="230" fill="%232E2E2E" font-family="sans-serif" font-size="14">CONTRACTOR: APEX GLOBAL ALLIED WORKS LTD (RC-1489201)</text>
      <text x="40" y="265" fill="%232E2E2E" font-family="sans-serif" font-size="14">CLIENT: DEPT OF PRIMARY HEALTH CARE SYSTEMS, GARKI ABUJA</text>
      <rect x="40" y="295" width="520" height="40" fill="%234BCB91" fill-opacity="0.2" stroke="%234BCB91" stroke-width="2" rx="4"/>
      <text x="300" y="320" fill="%230B7A6E" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">CLAIMED STATUS: 100% COMPLETED & COMMISSIONED</text>
    </svg>`;

    setImagePreview(svgSignboard);
    const clues = await geminiClient.extractCluesFromImage(svgSignboard);
    setExtractedClues(clues);
    setIsProcessing(false);
  };

  const handleConfirm = () => {
    onConfirmClues(extractedClues, imagePreview || undefined);
    onClose();
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
            <Camera size={20} color="var(--luminous-teal-dim)" />
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)' }}>
              Show WAZI: Signboard or Document
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--neutral-40)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="bottom-sheet__body">
          {/* Quick Demo Action */}
          <div
            style={{
              background: 'rgba(22, 198, 177, 0.08)',
              border: '1px solid rgba(22, 198, 177, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--neutral-10)' }}>
                Demo Flagship Case: Akute Health Centre
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-40)' }}>
                Test with real signboard and field evidence data
              </div>
            </div>
            <button
              onClick={handleLoadDemoSignboard}
              className="btn btn--sm btn--primary"
            >
              <Sparkles size={14} />
              <span>Load Signboard</span>
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
                border: '2px dashed var(--warm-paper-80)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8) var(--space-4)',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'var(--warm-paper-95)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              <Upload size={36} color="var(--neutral-60)" />
              <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-sm)' }}>
                Take photo or upload image
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--neutral-60)', maxWidth: '280px' }}>
                Signboard, tender notice, project site, receipt, or document. EXIF metadata will be automatically stripped.
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  maxHeight: '200px',
                  border: '1px solid var(--warm-paper-80)',
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setExtractedClues([]);
                  }}
                  className="btn btn--sm btn--ghost"
                >
                  Choose different image
                </button>
              </div>
            </div>
          )}

          {/* Extracted Clues Section */}
          {isProcessing ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0', color: 'var(--neutral-40)' }}>
              <div className="spin" style={{ display: 'inline-block', marginBottom: 'var(--space-2)' }}>
                <Sparkles size={24} color="var(--luminous-teal-dim)" />
              </div>
              <div style={{ fontSize: 'var(--text-sm)' }}>
                WAZI is observing visual clues and stripping EXIF data...
              </div>
            </div>
          ) : extractedClues.length > 0 ? (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-bold)',
                  color: 'var(--neutral-40)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wider)',
                  marginBottom: 'var(--space-1)'
                }}
              >
                Extracted Clues (Editable before search)
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
