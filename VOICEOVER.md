# WAZI — Demo Voiceover Script

**Primary script: ~3 minutes.** Written to be read aloud — short sentences, natural
pauses. `*(beat)*` means stop for about a second and let the screen carry it.

Every feature named below exists in the build. Nothing here is aspirational.

---

## OPEN — the problem, before you show anything

> A woman walks past the health centre her ward has been waiting three years for.
> The signboard says: **completed and commissioned.**
> The building has no roof.
>
> *(beat)*
>
> Everything she'd need to do something about that is already public. The contract is
> on the procurement portal. The payment is on the treasury portal. The law that gives
> her the right to ask is the Freedom of Information Act — and it gives the agency seven
> working days to answer her.
>
> None of it is reachable from where she's standing. It's in English, in PDFs, behind
> acronyms, addressed to an "Accounting Officer" nobody has ever named for her.
>
> So the roof stays off.
>
> **This is WAZI.** It's the distance between those two facts.

---

## 1 — THE HOME SCREEN

> This is the whole interface. One character, one button, one text field.
>
> Top left — **Privacy Protected.** That's not a badge, it's a control. Tap it and it
> tells you exactly what's being held on the device and what isn't.
>
> Top right — the language pill. Right now it reads **en-NG**. Watch what happens to it.
>
> *(beat)*
>
> And the orb in the middle is WAZI. She breathes, she blinks, she tracks your cursor.
> When she speaks, her mouth is driven by the actual audio leaving your speakers —
> we measure both the loudness and the vowel energy in real time, because a hard "s"
> makes noise but barely moves a jaw, and an "ah" opens it wide.
>
> That's a small thing. It's also the difference between a character and a loading
> spinner with a face.

---

## 2 — STARTING THE CONVERSATION

> One tap.
>
> No account. No onboarding. No "please select your language."
>
> *(beat)*
>
> And she speaks first. She opens the conversation, because the person holding this
> phone may never have used a civic tool before and shouldn't have to guess what to say.

---

## 3 — THE PART THAT MATTERS MOST

> Here we ask her something in Nigerian Pidgin — *"Abeg, wetin be dis FOI ting I dey
> hear people talk about?"*
>
> *(beat — let the answer play)*
>
> She answers in Pidgin.
>
> And look at the top right. The pill just changed to **Nigerian Pidgin**.
>
> *(beat)*
>
> Nobody selected that. There's no language setting in this app. She heard the dialect,
> matched it, and then told the interface what she'd heard so the interface could follow
> her. If you switch language halfway through a sentence, she switches with you and
> never mentions it.
>
> I want to be clear about why this is the most important decision in the product.
>
> A language menu assumes you can read the menu. For the person this is built for —
> a market trader who speaks Pidgin and reads very little English — a language menu
> is a locked door with the key on the other side. Detecting it instead of asking for
> it is what makes this usable at all.
>
> *(beat)*
>
> And notice what she *didn't* do. She explained. She didn't launch an investigation,
> didn't open a dashboard, didn't ask for a reference number. Most people's first civic
> question isn't a scandal — it's "what does this word mean, and does it apply to me?"
> That's the conversation this is designed for.

---

## 4 — WHEN THERE IS SOMETHING SPECIFIC

> Now the real thing. *"The health centre for my area — dem talk say e don complete,
> but e no get roof at all."*
>
> *(beat)*
>
> Watch the screen.
>
> *(beat — let the board open)*
>
> Nobody pressed a button.
>
> WAZI decided that what was just said had earned an investigation, and she opened the
> evidence board herself. That's a function call from the model into the interface.
>
> Why it matters: the version of this codebase we started with decided when to open that
> board by matching English keywords in the transcript. Which means it worked in English,
> for phrasings somebody had thought of in advance. Moving the decision to the model that
> already understood the sentence is what makes this work in Yoruba, or Swahili, or
> Hausa, without translating a single line of the interface.

---

## 5 — SHOWING IT SOMETHING

> If seeing the place would settle it, she asks for a photo — and opens the camera
> herself.
>
> *(beat)*
>
> And before that image goes anywhere, the app reads its raw bytes on the phone. It
> finds the EXIF block, and it tells you what it found: **GPS coordinates. Camera
> hardware. Timestamp.** Then it strips them and re-encodes.
>
> You watch it happen. We didn't want a privacy promise — we wanted a privacy receipt.
>
> *(beat)*
>
> Then the image goes to Gemini vision, which pulls the structured clues off the
> signboard: project name, tender reference, implementing agency, contractor, claimed
> status.
>
> And it's instructed — hard — never to invent a reference code, a contractor or an
> agency that isn't visible in the frame. Show it an ordinary photo with no signboard
> and it says so, rather than inventing a project.

---

## 6 — THE EVIDENCE BOARD

> This is the heart of it.
>
> First, the retrieval. Five named steps, each with a named source — the federal and
> Ogun State directory, the National Open Contracting Portal, the Open Treasury Portal,
> the dated field photograph, and then the synthesis.
>
> We show the search happening because trust is a process, not a conclusion. You should
> be able to see where every fact came from.
>
> *(beat)*
>
> Then the board itself.
>
> **Responsible authority identified** — the agency, and the verified desk it answers at.
>
> **Claim examined** — the exact assertion being tested, with the date it was checked.
>
> **Evidence state: CONFLICTING.**
>
> *(beat)*
>
> That word is doing careful work. We don't use confidence percentages anywhere in this
> product. "Eighty-seven percent confident" implies a precision nobody actually has, and
> a non-technical reader will round it up to "true." So every claim gets a category
> instead — verified, corroborated, reported, conflicting, or unknown.
>
> And then the comparison. **Official public record** on the left. **Observed field
> reality** on the right. Five dimensions, tested one at a time.
>
> The record says one hundred percent completed, inspected and handed over, March 2024.
> The ground says an uncompleted masonry shell, no roof, no windows, site abandoned.
>
> *(beat)*
>
> The two columns never merge. WAZI never says anyone stole anything. She shows you the
> gap, dated and sourced, and then shows you the lawful way to make someone account
> for it. That's a hard constraint in her instructions, not a matter of tone.

---

## 7 — ARGUING WITH ITSELF

> Then this: **Check Again.**
>
> WAZI goes back and tries to break her own finding. She looks for the innocent
> explanation — a later variation order, a phase-two contract, a boundary reassignment,
> a debarred contractor, satellite coordinates that don't match.
>
> *(beat)*
>
> If the finding survives that, it's worth sending. If it doesn't, it should never have
> left the phone.
>
> We built the adversarial pass because the failure mode we were most afraid of isn't a
> tool that misses corruption. It's a tool that sends a citizen to confront an
> institution over a discrepancy with a perfectly boring explanation.

---

## 8 — THE DRAFT STUDIO

> And here's where most accountability tools stop, and this one doesn't.
>
> A dashboard tells you where the money went. It doesn't help you do anything about it.
>
> *(beat)*
>
> Four formats — a Freedom of Information request, a service complaint, an inquiry
> letter, or a WhatsApp brief for organising neighbours.
>
> Tone: neutral, firm, or conciliatory. Length: concise, standard, or detailed. Because
> a retired headmaster and a twenty-two-year-old organiser should not be made to sound
> identical.
>
> *(beat)*
>
> Then the **verified institutional route.** Not "contact the ministry." The named
> agency. The named officer — Executive Director and Head of Procurement Oversight. The
> verified email. And the clock: **seven working days, under Section 4 of the Freedom of
> Information Act, 2011.**
>
> And the escalation route, pre-loaded, for the day those seven days lapse — the
> Independent Corrupt Practices Commission, with its tracking address and toll-free line.
>
> *(beat)*
>
> That statute, that deadline, that officer — none of it comes from the model. It comes
> from a hand-verified country pack that ships with the app. The model handles language.
> The pack handles fact. A language model should never be improvising a legal deadline
> in front of someone who's about to rely on it.
>
> *(beat)*
>
> Below that, the document itself, on a letterhead, fully editable.
>
> And **Privacy and Disclosure** — where she decides what this letter says about her.
> She can withhold her name, her contact, her precise location, and sign as a concerned
> community resident. Because the moment you name a contractor and a ward while standing
> in front of the building, you've exposed yourself. A transparency tool that hands
> someone evidence and no protection has handed them a liability.

---

## 9 — SENDING IT

> Copy the text. Print it. Download it. Open it in an email app, pre-addressed. Or save
> it to the case file.
>
> *(beat)*
>
> But nothing sends automatically. Nothing ever leaves this phone without her tapping
> the button herself, on a screen where she can read every word first.

---

## 10 — THE SHAPE OF THE WHOLE THING

> And that bar along the top follows her everywhere — voice and chat, evidence board,
> draft studio, saved cases. With a live dot when WAZI is listening, and a count of the
> cases she's saved offline.
>
> Because this isn't four tools. It's one conversation that happens to have four views.
>
> *(beat)*
>
> The whole thing runs as a single process on a single port. One command. It works from
> a phone on the same network with no configuration, and if the connection drops in a
> lift or a tunnel, the session is held open for twenty seconds so she can come back to
> the same conversation instead of starting her case over.
>
> That's not a nice-to-have. That's the connection our users actually have.

---

## CLOSE

> Accountability doesn't usually fail at the investigation. It fails at the first step
> — where the person who can see the problem has no way to put it in writing, in the
> right language, to the right desk, inside the window the law gives them.
>
> *(beat)*
>
> WAZI turns that first step into a conversation anyone can have.
>
> Open. Clear. Out in the daylight.

---
---

# SHORT CUT — ~60 seconds

> A woman walks past a health centre. The signboard says *completed*. The building has
> no roof. Everything she'd need is already public — and none of it is reachable from
> where she's standing.
>
> This is WAZI.
>
> She asks what a Freedom of Information request is — in Pidgin. WAZI answers in Pidgin,
> and the language pill updates itself. Nobody selected a language. There is no language
> setting. She heard it.
>
> Then: a clinic the records call finished, with no roof. Watch — nobody pressed a
> button. WAZI opened the evidence board herself.
>
> Official record, ground truth, side by side. Never merged. She doesn't accuse anyone
> — she shows the gap, dated and sourced. Then she argues against her own finding,
> hunting for the innocent explanation.
>
> And it ends with an instrument, not an insight: an FOI request, citing the statute,
> addressed to a named officer, seven-day clock running, escalation route pre-loaded.
>
> She reviews it. She decides. Nothing leaves her phone without her.

---
---

# DELIVERY NOTES

- **Pace it slow.** The instinct under time pressure is to rush. The two moments that
  win this — the language pill changing, and the board opening unprompted — only land
  if you stop talking and let them happen.
- **Say "nobody pressed a button" out loud.** A judge watching a screen recording will
  not otherwise notice that the navigation was not manual. It is the single most
  impressive thing in the video and it is completely invisible unless narrated.
- **Don't read the letter aloud.** Let the camera hold on it. Name the statute and the
  deadline, and move on.
- **If you only have 60 seconds,** cut sections 1, 5, 7 and 10 and keep the short cut
  above. Never cut section 3.
