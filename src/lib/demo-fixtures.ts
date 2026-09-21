/* WAZI Civic — Flagship Demo Fixtures & Hand-Verified Country Pack Records */

import type { CivicCase, InstitutionalRoute, SourceCitation } from './types';

export const FLAGSHIP_INSTITUTIONAL_ROUTE: InstitutionalRoute = {
  agency: 'National Primary Health Care Development Agency (NPHCDA)',
  department: 'Department of Primary Health Care Systems & Infrastructure',
  role: 'Executive Director & Head of Procurement Oversight',
  verifiedEmail: 'procurement.oversight@nphcda.gov.ng',
  verifiedPortal: 'https://nphcda.gov.ng/citizen-feedback-portal',
  phone: '+234 9 291 4268',
  address: 'Plot 681/682 Port-Harcourt Crescent, Off Gimbiya Street, Area 11, Garki, Abuja, FCT',
  procedureName: 'Statutory FOI Inquiry & Public Infrastructure Non-Delivery Report',
  statutoryTimeline: '7 working days under Section 4 of the Freedom of Information Act 2011',
  lastVerified: '18 September 2026 (Verified via Official Gazette & Portal Registry)',
  sourceReference: 'Federal Ministry of Health & Social Welfare Institutional Directory 2026',
  escalation: {
    body: 'Independent Corrupt Practices and Other Related Offences Commission (ICPC)',
    role: 'Constituency & Executive Project Tracking Initiative (CEPTI)',
    contact: 'tracking@icpc.gov.ng | Toll-Free: 0800-2255-4272',
    statutoryBasis: 'Section 22(3), Corrupt Practices and Other Related Offences Act 2000'
  }
};

export const FLAGSHIP_SOURCES: SourceCitation[] = [
  {
    id: 1,
    name: 'National Open Contracting Portal (NOCOPO) / Bureau of Public Procurement',
    published: '2023-11-14',
    retrieved: '2026-09-18',
    authority: 'Primary Public Authority',
    url: 'https://nocopo.bpp.gov.ng/contracts/NPHCDA-2023-LOT14',
    excerpt: 'Contract Ref: NPHCDA/2023/LOT-14. Description: Turnkey Rehabilitation and Equipping of Akute Model Primary Health Centre. Final Reported Status: 100% Completed & Handed Over.'
  },
  {
    id: 2,
    name: 'Open Treasury Portal (Office of the Accountant-General of the Federation)',
    published: '2024-02-28',
    retrieved: '2026-09-19',
    authority: 'Financial Disbursement Record',
    url: 'https://opentreasury.gov.ng/mandates/20240228-44102',
    excerpt: 'Payment Voucher OTP-20240228-44102. Beneficiary: Apex Global Allied Works Ltd. Amount: NGN 38,250,000 (Final 85% release following Certificate of Practical Completion).'
  },
  {
    id: 3,
    name: 'Field Evidence: Geotagged Site & Signboard Inspection Photograph',
    published: '2026-09-20',
    retrieved: '2026-09-20',
    authority: 'Dated Community Observation',
    excerpt: 'High-resolution capture of official project board with matching Lot ID. Structural state: roofless masonry carcass, missing window casements, zero medical equipment on premises.'
  },
  {
    id: 4,
    name: 'Ogun State Primary Health Care Development Board Joint Facility Audit',
    published: '2025-08-11',
    retrieved: '2026-09-15',
    authority: 'Independent State Verification',
    url: 'https://oghealth.gov.ng/reports/audit-q2-2025.pdf',
    excerpt: 'Facility ID OG-IF-019 listed among 7 capital interventions where federal contractor departed prior to roofing and electrification.'
  }
];

export const FLAGSHIP_CASE: CivicCase = {
  id: 'case-phc-akute-2026',
  title: 'Akute Model Primary Health Centre Non-Delivery',
  claim: 'This health centre was completed and commissioned as contracted',
  summary: 'Official procurement and Open Treasury disbursement records assert 100% project completion and ₦38.25M final payout in February 2024. Dated field evidence documents an abandoned, unroofed brick shell with no medical services.',
  jurisdiction: 'Nigeria (Federal / Ogun State)',
  status: 'active',
  evidenceState: 'CONFLICTING',
  dimensions: [
    {
      id: 'dim-status',
      dimension: 'Project Status',
      record: '100% Completed, inspected, and handed over (March 2024)',
      reality: 'Uncompleted masonry shell, no roof, no windows, site abandoned',
      state: 'CONFLICTING',
      notes: 'Direct contradiction between official hand-over certificate and physical structure'
    },
    {
      id: 'dim-budget',
      dimension: 'Allocated Budget',
      record: '₦45,000,000 under FGN Special Intervention Fund',
      reality: 'On-site value visible estimated at less than 30% of total contract',
      state: 'REPORTED',
      notes: 'Allocation confirmed via BPP records; valuation in field requires formal quantity survey'
    },
    {
      id: 'dim-payment',
      dimension: 'Disbursed Payment',
      record: '₦38,250,000 disbursed (Payment Voucher OTP-20240228-44102)',
      reality: 'No medical equipment, generator, or solar cold-chain delivered to site',
      state: 'REPORTED',
      notes: 'Treasury payment confirmed; physical equipment listed in Bill of Quantities absent'
    },
    {
      id: 'dim-contractor',
      dimension: 'Assigned Contractor',
      record: 'Apex Global Allied Works Ltd (RC-1489201)',
      reality: 'Signboard matches contractor name; site unmanned since late 2023',
      state: 'CORROBORATED',
      notes: 'Identity of contractor matches across signboard and public treasury filings'
    },
    {
      id: 'dim-service',
      dimension: 'Community Public Service',
      record: 'Officially recorded as operational for 12,000 ward residents',
      reality: 'Facility shuttered; residents travel 14km to neighbouring LGA for maternal care',
      state: 'CONFLICTING',
      notes: 'Lived reality confirms zero healthcare delivery on site'
    }
  ],
  sources: FLAGSHIP_SOURCES,
  clues: [
    { id: 'c1', field: 'project_name', label: 'Project Name', value: 'Model Primary Health Care Centre (Akute)', confidence: 0.98 },
    { id: 'c2', field: 'tender_ref', label: 'Tender Ref', value: 'NPHCDA/2023/LOT-14', confidence: 0.95 },
    { id: 'c3', field: 'agency', label: 'Agency', value: 'National Primary Health Care Dev Agency', confidence: 0.96 },
    { id: 'c4', field: 'contractor', label: 'Contractor', value: 'Apex Global Allied Works Ltd', confidence: 0.92 },
    { id: 'c5', field: 'status_claimed', label: 'Claimed Status', value: '100% Completed & Handed Over', confidence: 0.90 },
    { id: 'c6', field: 'visual_condition', label: 'Field Condition', value: 'Unroofed brick carcass, overgrown weeds, no equipment', confidence: 0.94 },
    { id: 'c7', field: 'location', label: 'Location', value: 'Akute / Ifo LGA, Ogun State, Nigeria', confidence: 0.95 }
  ],
  route: FLAGSHIP_INSTITUTIONAL_ROUTE,
  drafts: [],
  disclosure: {
    includeName: false,
    userName: '',
    includeContact: false,
    userContact: '',
    includeApproxLocation: true,
    location: 'Akute Ward, Ifo LGA, Ogun State',
    includePreciseGps: false,
    gpsCoords: '6.6914° N, 3.3721° E',
    stripExif: true,
    redactFaces: true
  },
  adversarialNotes: 'Adversarial Check Again performed: Queried NOCOPO for subsequent Phase 2 awards (none found). Evaluated whether a duplicate facility exists in adjoining sub-ward (cadastral plot coordinates verified). Finding holds: Confirmed discrepancy between financial completion certification and physical state.',
  isCheckAgainRun: true,
  createdAt: '2026-09-20T10:14:00Z',
  updatedAt: '2026-09-20T10:35:00Z'
};

export const INITIAL_SAVED_CASES: CivicCase[] = [
  FLAGSHIP_CASE,
  {
    id: 'case-water-ward2-2026',
    title: 'Ward 2 Solar Powered Borehole Project',
    claim: 'Solar borehole installation was fully completed with solar power connected',
    summary: 'Water borehole drilling and water tank tower were erected. However, solar inverter panels were not installed, leaving pump inoperable on national grid outage.',
    jurisdiction: 'Nigeria (Ogun State / Local Government)',
    status: 'draft',
    evidenceState: 'CORROBORATED',
    dimensions: [
      {
        id: 'dim-1',
        dimension: 'Borehole Drilling',
        record: 'Drilled to 85m depth with 5000L overhead reservoir',
        reality: 'Tank tower and overhead reservoir fully installed',
        state: 'VERIFIED'
      },
      {
        id: 'dim-2',
        dimension: 'Solar Electrification',
        record: '4x 300W monocrystalline solar panels with hybrid inverter',
        reality: 'Mounting brackets empty; no solar panels on site',
        state: 'CONFLICTING'
      }
    ],
    sources: [
      {
        id: 1,
        name: 'State Rural Water Supply Agency (RUWASSA) Project Bulletin',
        published: '2025-10-02',
        retrieved: '2026-09-12',
        authority: 'State Agency'
      }
    ],
    clues: [
      { id: 'w1', field: 'project', label: 'Project', value: 'Ward 2 Solar Borehole' },
      { id: 'w2', field: 'location', label: 'Location', value: 'Ifo Ward 2' }
    ],
    drafts: [],
    disclosure: {
      includeName: true,
      userName: 'Concerned Community Resident',
      includeContact: false,
      userContact: '',
      includeApproxLocation: true,
      location: 'Ward 2',
      includePreciseGps: false,
      stripExif: true,
      redactFaces: true
    },
    createdAt: '2026-09-12T14:20:00Z',
    updatedAt: '2026-09-14T09:10:00Z'
  }
];
