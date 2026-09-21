/* WAZI Civic — Core Type Definitions */

export type AppState =
  | 'HOME_IDLE'
  | 'HOME_LISTENING'
  | 'HOME_SPEAKING'
  | 'HOME_THINKING'
  | 'CAMERA_ACTIVE'
  | 'WORKSPACE_SEARCHING'
  | 'WORKSPACE_RESULTS'
  | 'WORKSPACE_CHECKING'
  | 'WORKSPACE_ROUTING'
  | 'DRAFT_EDITING'
  | 'DRAFT_REVIEWING'
  | 'CASE_BROWSING'
  | 'CASE_VIEWING'
  | 'ERROR'
  | 'OFFLINE';

export type WaziState =
  | 'resting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'waiting_permission'
  | 'companion'
  | 'attention'
  | 'error';

export type EvidenceState =
  | 'VERIFIED'
  | 'CORROBORATED'
  | 'REPORTED'
  | 'CONFLICTING'
  | 'UNKNOWN';

export interface ComparisonDimension {
  id: string;
  dimension: string;
  record: string;
  reality: string;
  state: EvidenceState;
  notes?: string;
}

export interface SourceCitation {
  id: number;
  name: string;
  url?: string;
  published: string;
  retrieved: string;
  authority: string;
  excerpt?: string;
}

export interface ExtractedClue {
  id: string;
  field: string;
  label: string;
  value: string;
  confidence?: number;
}

export interface EscalationOption {
  body: string;
  role: string;
  contact: string;
  statutoryBasis: string;
}

export interface InstitutionalRoute {
  agency: string;
  department: string;
  role: string;
  verifiedEmail: string;
  verifiedPortal: string;
  phone?: string;
  address: string;
  procedureName: string;
  statutoryTimeline: string;
  lastVerified: string;
  sourceReference: string;
  escalation?: EscalationOption;
}

export type DraftFormat =
  | 'email'
  | 'letter'
  | 'foi'
  | 'complaint'
  | 'whatsapp'
  | 'brief';

export interface CivicDraft {
  id: string;
  format: DraftFormat;
  title: string;
  recipient: string;
  recipientRoute: string;
  subject: string;
  body: string;
  attachments: string[];
  tone: 'firm' | 'neutral' | 'conciliatory';
  length: 'concise' | 'standard' | 'detailed';
  generatedAt: string;
}

export interface DisclosureSettings {
  includeName: boolean;
  userName: string;
  includeContact: boolean;
  userContact: string;
  includeApproxLocation: boolean;
  location: string;
  includePreciseGps: boolean;
  gpsCoords?: string;
  stripExif: boolean;
  redactFaces: boolean;
}

export interface CivicCase {
  id: string;
  title: string;
  claim: string;
  summary: string;
  jurisdiction: string;
  status: 'active' | 'resolved' | 'submitted' | 'draft';
  evidenceState: EvidenceState;
  dimensions: ComparisonDimension[];
  sources: SourceCitation[];
  clues: ExtractedClue[];
  route?: InstitutionalRoute;
  drafts: CivicDraft[];
  disclosure: DisclosureSettings;
  imageUri?: string;
  adversarialNotes?: string;
  isCheckAgainRun?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptItem {
  id: string;
  speaker: 'wazi' | 'user';
  text: string;
  timestamp: number;
  isPartial?: boolean;
}

export interface SearchStep {
  id: string;
  title: string;
  source: string;
  status: 'pending' | 'searching' | 'found' | 'conflict' | 'empty';
  detail?: string;
}
