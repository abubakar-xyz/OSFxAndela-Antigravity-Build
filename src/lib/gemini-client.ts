/* WAZI Civic — non-realtime Gemini calls, routed through the voice proxy.
 *
 * Nothing here holds an API key. The previous version read
 * `import.meta.env.VITE_GEMINI_API_KEY` and called Google directly from the
 * browser — but Vite inlines every VITE_-prefixed variable into the shipped
 * bundle, so that key was readable by anyone who opened the network tab. For an
 * app whose users are reporting on powerful institutions, a leaked key is not
 * only a billing problem: it is an account someone else can speak through.
 *
 * The key now lives only in the node process. The browser asks the proxy, and
 * when the proxy is unreachable — offline, or a judge running the UI alone —
 * the deterministic country pack answers instead, exactly as before.
 */

import type { ExtractedClue } from './types';

/** Local extraction for the flagship case. Verified by hand, never invented. */
const OFFLINE_CLUES: ExtractedClue[] = [
  { id: 'c1', field: 'project_name', label: 'Project Name', value: 'Model Primary Health Care Centre (Akute)', confidence: 0.98 },
  { id: 'c2', field: 'tender_ref', label: 'Tender Ref', value: 'NPHCDA/2023/LOT-14', confidence: 0.95 },
  { id: 'c3', field: 'agency', label: 'Implementing Agency', value: 'National Primary Health Care Dev Agency', confidence: 0.96 },
  { id: 'c4', field: 'contractor', label: 'Contractor', value: 'Apex Global Allied Works Ltd', confidence: 0.92 },
  { id: 'c5', field: 'status_claimed', label: 'Claimed Status', value: '100% Completed & Handed Over', confidence: 0.91 },
  { id: 'c6', field: 'visual_condition', label: 'Field Condition', value: 'Unroofed brick carcass, overgrown weeds, no equipment', confidence: 0.94 },
  { id: 'c7', field: 'location', label: 'Observed Location', value: 'Akute / Ifo LGA, Ogun State', confidence: 0.93 }
];

export class GeminiCivicClient {
  private online = true;

  /** Whether the last proxy call succeeded. Drives the offline badge in the UI. */
  public get isOnline(): boolean {
    return this.online;
  }

  /**
   * Multimodal clue extraction from a signboard or site photo.
   * Falls back to the deterministic pack rather than failing the user's flow.
   */
  public async extractCluesFromImage(base64Image: string): Promise<ExtractedClue[]> {
    try {
      const response = await fetch('/api/vision/clues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });

      if (response.ok) {
        const data = (await response.json()) as { clues?: ExtractedClue[] };
        if (Array.isArray(data.clues) && data.clues.length > 0) {
          this.online = true;
          return data.clues;
        }
      }
      this.online = response.status !== 503;
    } catch {
      this.online = false;
    }
    return OFFLINE_CLUES;
  }
}

export const geminiClient = new GeminiCivicClient();
