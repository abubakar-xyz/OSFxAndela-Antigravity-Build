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
| **API key disclosure** | High | The Gemini key is held only by the node proxy and never reaches the browser. It was previously exposed twice: inlined into the client bundle via a `VITE_`-prefixed variable, and committed to git in `.env`. Both are fixed; **the key present in commit `5a9c281` must be rotated.** |
| **Live audio in transit** | High | Microphone audio is raw PCM over a WebSocket. Deploy behind TLS so the socket is `wss://` — the client derives its scheme from the page, so serving the UI over HTTPS is sufficient. Audio is relayed, never written to disk by the proxy. |
| **Voice session hijacking / quota drain** | Medium | One Gemini session per browser socket, a ping/pong heartbeat that reaps sockets abandoned mid-conversation, and a client-side guard that refuses to send audio faster than realtime. |

## 3. Human Approval Gate
No external submission, email sending, or document export occurs without explicit human preview and confirmation.
