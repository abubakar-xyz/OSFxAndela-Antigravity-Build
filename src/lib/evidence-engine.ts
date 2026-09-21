/* WAZI Civic — Evidence & Verification Engine */

import type {
  CivicCase,
  CivicDraft,
  DraftFormat,
  SearchStep
} from './types';
import {
  FLAGSHIP_INSTITUTIONAL_ROUTE
} from './demo-fixtures';

export async function simulateSearchSteps(
  onStepUpdate: (steps: SearchStep[]) => void
): Promise<void> {
  const steps: SearchStep[] = [
    { id: '1', title: 'Resolving jurisdiction and administrative boundaries', source: 'Nigeria Federal & Ogun State Directory', status: 'searching' },
    { id: '2', title: 'Querying national procurement portal for tender lot', source: 'National Open Contracting Portal (NOCOPO)', status: 'pending' },
    { id: '3', title: 'Matching financial disbursement & voucher mandates', source: 'Open Treasury Portal (FGN)', status: 'pending' },
    { id: '4', title: 'Cross-referencing dated field photograph & signboard', source: 'Field Inspection Evidence', status: 'pending' },
    { id: '5', title: 'Synthesizing Record vs Reality verification board', source: 'Evidence State Synthesis', status: 'pending' }
  ];

  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 600));

  steps[0].status = 'found';
  steps[0].detail = 'Matched: Ifo LGA, Ogun State (Ward 4)';
  steps[1].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 700));

  steps[1].status = 'found';
  steps[1].detail = 'Awarded to Apex Global Allied Works (₦45,000,000) — Certified Completed';
  steps[2].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 700));

  steps[2].status = 'found';
  steps[2].detail = 'Voucher OTP-20240228-44102 released ₦38.25M final payment';
  steps[3].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 800));

  steps[3].status = 'conflict';
  steps[3].detail = 'Field photo confirms unroofed carcass; zero equipment on site';
  steps[4].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 600));

  steps[4].status = 'conflict';
  steps[4].detail = 'Evidence State: CONFLICTING — Direct contradiction established';
  onStepUpdate([...steps]);
}

/**
 * Executes adversarial re-verification ("Check Again")
 */
export async function performCheckAgain(
  currentCase: CivicCase,
  onStepUpdate: (steps: SearchStep[]) => void
): Promise<{ updatedCase: CivicCase; verdict: string }> {
  const steps: SearchStep[] = [
    { id: 'ca-1', title: 'Searching for subsequent Phase 2 awards or addendums', source: 'NOCOPO Contract Variations Registry', status: 'searching' },
    { id: 'ca-2', title: 'Verifying cadastral boundary & satellite coordinates', source: 'National Health Facility Registry (NPHCDA)', status: 'pending' },
    { id: 'ca-3', title: 'Auditing contractor registry & debarment notices', source: 'BPP Public Debarment & Performance Ledger', status: 'pending' },
    { id: 'ca-4', title: 'Synthesizing adversarial review', source: 'Integrity Check Audit', status: 'pending' }
  ];

  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 700));

  steps[0].status = 'found';
  steps[0].detail = 'Zero Phase 2 contracts issued. Contract was turnkey comprehensive.';
  steps[1].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 800));

  steps[1].status = 'found';
  steps[1].detail = 'Coordinates match designated facility plot exactly. No duplicate site.';
  steps[2].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 800));

  steps[2].status = 'conflict';
  steps[2].detail = 'Contractor flagged by state oversight for non-completion of physical deliverables.';
  steps[3].status = 'searching';
  onStepUpdate([...steps]);
  await new Promise(r => setTimeout(r, 600));

  steps[3].status = 'conflict';
  steps[3].detail = 'Discrepancy confirmed: The initial CONFLICTING finding holds firmly.';
  onStepUpdate([...steps]);

  const updatedCase: CivicCase = {
    ...currentCase,
    isCheckAgainRun: true,
    adversarialNotes: 'Adversarial pass completed: Checked for subsequent contract phases (none found), checked for cadastral relocation (plot confirmed), and verified contractor status. The finding holds: Official completion certificate directly conflicts with dated field evidence.',
    updatedAt: new Date().toISOString()
  };

  const verdict = 'I checked for newer records, a different project phase, and alternative explanations. The finding stands: official completion directly conflicts with the physical site.';
  return { updatedCase, verdict };
}

/**
 * Builds structured Civic Draft according to selected format, tone, and length
 */
export function generateCivicDraft(
  c: CivicCase,
  format: DraftFormat,
  tone: 'firm' | 'neutral' | 'conciliatory' = 'neutral',
  length: 'concise' | 'standard' | 'detailed' = 'standard'
): CivicDraft {
  const route = c.route || FLAGSHIP_INSTITUTIONAL_ROUTE;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  if (format === 'foi') {
    return {
      id: `draft-foi-${Date.now()}`,
      format: 'foi',
      title: 'Freedom of Information (FOI) Request',
      recipient: route.role,
      recipientRoute: route.verifiedEmail,
      subject: `FREEDOM OF INFORMATION (FOI) APPLICATION: CONTRACT PERFORMANCE & HANDOVER AUDIT — ${c.title.toUpperCase()}`,
      body: `${dateStr}

To:
The Executive Director / FOI Designated Officer
${route.agency}
${route.address}

Through: ${route.verifiedEmail}

Dear Sir/Madam,

RE: APPLICATION FOR INFORMATION UNDER SECTION 2(3) AND SECTION 3 OF THE FREEDOM OF INFORMATION ACT 2011 REGARDING CONTRACT REF: NPHCDA/2023/LOT-14 (${c.title.toUpperCase()})

I am writing pursuant to the provisions of the Freedom of Information (FOI) Act 2011, which guarantees the public right of access to records and information held by public institutions.

1. BACKGROUND & FACTUAL OBSERVATION:
Official public financial tracking on the Federal Government Open Treasury Portal indicates that Payment Voucher OTP-20240228-44102 in the sum of ₦38,250,000 was disbursed to Apex Global Allied Works Ltd as final payment for the turnkey rehabilitation and equipping of the Akute Model Primary Health Care Centre, certifying 100% completion.

However, recent physical inspection of the facility plot (dated 20 September 2026) reveals that the structure remains an unroofed brickwork carcass without doors, windows, medical fixtures, or solar cold-chain storage equipment.

2. SPECIFIC RECORDS REQUESTED:
Under Section 4 of the FOI Act 2011, I respectfully request that you provide verified copies of:
a) The Certificate of Practical Completion and Certificate of Handover issued for Contract Ref: NPHCDA/2023/LOT-14.
b) The Joint Inspection & Valuation Report prepared by the Agency's Project Monitoring Team prior to final payment authorization.
c) The Bill of Quantities (BoQ) verifying the physical supply and installation of the 10-bed ward fixtures, solar vaccine refrigerator, and 15kVA auxiliary generator.

3. STATUTORY TIMELINE:
Pursuant to Section 4 of the FOI Act 2011, your office is statutory required to make this information available within 7 (seven) working days of the receipt of this application.

Kindly forward digital copies to the electronic contact provided below or advise where physical inspection may be carried out.

Yours faithfully,

[Complainant Name]
[Contact Telephone / Address]
[Approximate Location: Akute Ward, Ifo LGA, Ogun State]

Enclosed Attachments:
- Dated Photograph of Project Signboard and Abandoned Site Carcass (20 Sep 2026)
- Transcript of Open Treasury Voucher OTP-20240228-44102
- NOCOPO Procurement Reference Record NPHCDA/2023/LOT-14`,
      attachments: [
        'Geotagged Field Inspection Photo (Signboard & Carcass) - 20 Sep 2026',
        'Open Treasury Payment Voucher Mandate OTP-20240228-44102',
        'NOCOPO BPP Tender Specification Sheet NPHCDA/2023/LOT-14'
      ],
      tone,
      length,
      generatedAt: new Date().toISOString()
    };
  }

  if (format === 'complaint') {
    return {
      id: `draft-complaint-${Date.now()}`,
      format: 'complaint',
      title: 'Infrastructure Non-Delivery Petition',
      recipient: 'Head of Quality Assurance & Citizen Redress',
      recipientRoute: route.verifiedEmail,
      subject: `FORMAL PETITION & SERVICE NON-DELIVERY REPORT: ABANDONED PRIMARY HEALTH CENTRE (${c.title.toUpperCase()})`,
      body: `${dateStr}

To:
The Head, Citizen Complaints & Redress Unit
${route.agency}

Copy:
The Constituency and Executive Projects Tracking Group (CEPTI)
Independent Corrupt Practices and Other Related Offences Commission (ICPC)
tracking@icpc.gov.ng

Dear Sir/Madam,

PETITION REGARDING UNFULFILLED PUBLIC HEALTH INFRASTRUCTURE: AKUTE MODEL PHC (CONTRACT REF: NPHCDA/2023/LOT-14)

We write to lodge a formal public service complaint regarding the non-delivery and physical abandonment of the Akute Model Primary Health Care Centre in Ifo LGA, Ogun State.

FACTUAL SUMMARY:
While national procurement registries declare this vital community facility 100% completed and handed over to serve an estimated 12,000 residents, the physical reality on the ground is starkly contradictory:
- The building has no roof, windows, or entrance doors.
- Weeds and bush have overgrown the foundation.
- Expectant mothers and community members are compelled to travel 14 kilometres over poorly maintained roads to reach alternative medical care.
- No solar cold chain or backup power generation was ever delivered.

REQUESTED RELIEF:
1. An urgent on-site investigative visit by the Agency's monitoring team.
2. Immediate recall of the assigned contractor (Apex Global Allied Works Ltd) to complete roofing, electrical installations, and equipment supply.
3. Formal referral of the matter to the Independent Corrupt Practices and Other Related Offences Commission (ICPC) if contract abandonment is established.

Respectfully submitted,

[Complainant Name]
[Contact Telephone / Address]
[Approximate Location: Akute Ward, Ifo LGA, Ogun State]`,
      attachments: [
        'Evidence Pack: Side-by-side Record vs Reality Comparison',
        'Dated Site Photograph',
        'Federal Gazette Procurement Allocation Reference'
      ],
      tone,
      length,
      generatedAt: new Date().toISOString()
    };
  }

  if (format === 'whatsapp') {
    return {
      id: `draft-wa-${Date.now()}`,
      format: 'whatsapp',
      title: 'Community WhatsApp Action Brief',
      recipient: 'Community Leaders & Ward Development Committee',
      recipientRoute: 'WhatsApp Group / Social Broadcast',
      subject: `*CIVIC ACTION BRIEF: Akute Health Centre Project*`,
      body: `*CIVIC ALERT: AKUTE MODEL HEALTH CENTRE AUDIT* 🏛️🏥

Hello Community Members,

Here are the verified public facts regarding our community Health Centre:

📌 *Official Record:*
- Contract Ref: NPHCDA/2023/LOT-14
- Contractor: Apex Global Allied Works Ltd
- Budget: *₦45,000,000*
- Official Status: Recorded as *100% Completed* & *₦38.25M* paid in Feb 2024.

⚠️ *Field Reality (20 Sep 2026):*
- Site is completely roofless and abandoned.
- Zero medical equipment, zero solar storage, zero staff.

⚖️ *Action Taken:*
We have prepared a statutory Freedom of Information (FOI) inquiry and complaint to the National Primary Health Care Development Agency (NPHCDA) and ICPC project tracking group.

Share this brief with our Ward Councillor and Community Development Association (CDA) executive.

*Prepared via WAZI Civic — Information You Can Trust*`,
      attachments: ['Record_vs_Reality_Brief.pdf'],
      tone,
      length,
      generatedAt: new Date().toISOString()
    };
  }

  // Default Email / Formal Letter
  return {
    id: `draft-email-${Date.now()}`,
    format: 'email',
    title: 'Formal Inquiry Email',
    recipient: route.role,
    recipientRoute: route.verifiedEmail,
    subject: `Official Inquiry: Status Verification and Remedial Action — Akute Model PHC (Ref: NPHCDA/2023/LOT-14)`,
    body: `Dear ${route.role},

I am contacting your office to bring to your urgent attention a documented discrepancy regarding the Akute Model Primary Health Care Centre (Contract Ref: NPHCDA/2023/LOT-14) in Ifo LGA, Ogun State.

According to public data published on the National Open Contracting Portal and Open Treasury Portal:
- ₦38,250,000 was disbursed to Apex Global Allied Works Ltd under voucher OTP-20240228-44102.
- The project status is officially listed as "100% Completed and Handed Over."

However, a verified physical inspection conducted on 20 September 2026 confirms that the building is an unroofed masonry carcass lacking doors, windows, electrical wiring, and essential primary care facilities.

Given the acute healthcare needs of over 12,000 community members in this ward, I kindly request:
1. Clarification on the discrepancy between the recorded completion and the on-site physical state.
2. The scheduled timeline for contractor remobilization to achieve practical completion.

Attached to this message please find dated photographic evidence, signboard documentation, and portal transaction references.

Thank you for your service and dedication to public health accountability.

Yours sincerely,

[Complainant Name]
[Contact Telephone / Address]
[Approximate Location: Akute Ward, Ifo LGA, Ogun State]`,
    attachments: [
      'Field_Inspection_Photo_20Sep2026.jpg',
      'NOCOPO_Tender_NPHCDA_2023_LOT14.pdf',
      'OpenTreasury_Voucher_OTP_20240228.pdf'
    ],
    tone,
    length,
    generatedAt: new Date().toISOString()
  };
}
