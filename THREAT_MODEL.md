# WAZI Civic — Threat Model & Safety Boundaries (THREAT_MODEL.md)

## 1. Scope & System Boundary
WAZI Civic handles sensitive community observations, photographs of public works, public procurement discrepancies, and official grievance communications.

## 2. Identified Threats & Mitigations

| Threat | Risk Level | Mitigation Strategy |
|--------|------------|---------------------|
| **Device & Location Fingerprinting** | High | Automatic EXIF stripping via Canvas re-encoding. Users can choose approximate location over exact coordinates. |
| **Whistleblower Exposure** | High | Active disclosure review sheet allowing users to withhold personal names and phone numbers. Documents can be signed as "Concerned Community Resident". |
| **Hallucinatory Corruption Allegations** | High | System policy strictly prohibits accusing individuals of fraud from a discrepancy alone. Output restricted to verified factual records vs. field observations. |
| **Unverified Contact Scraping** | Medium | All institutional contact emails and portals are verified against official gazettes and directories. No dynamic scraping of personal email addresses. |
| **Emergency Case Misuse** | High | WAZI explicitly declares it is not an emergency first responder. Immediate hotlines are presented for urgent safety concerns. |
| **Man-in-the-Middle on Evidence** | Medium | Strict client-side hashing and local storage of evidence records. No remote third-party evidence custody. |

## 3. Human Approval Gate
No external submission, email sending, or document export occurs without explicit human preview and confirmation.
