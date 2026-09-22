# WAZI — Demo Voiceover

---

## Full script (~3 minutes)

A woman walks past the health centre her ward has been waiting three years for. The signboard says: completed and commissioned. The building has no roof.

Everything she would need to do something about that is already public. The contract is on the procurement portal. The payment is on the treasury portal. The law that gives her the right to ask is the Freedom of Information Act, and it gives the agency seven working days to answer her.

None of it is reachable from where she is standing. It is in English, in PDFs, behind acronyms, addressed to an Accounting Officer nobody has ever named for her. So the roof stays off.

This is WAZI. It is the distance between those two facts.

This is the whole interface. One character, one button, one text field. Top left, Privacy Protected — that is not a badge, it is a control. Top right, the language pill. Right now it reads en-NG. Watch what happens to it.

The orb in the middle is WAZI. She breathes, she blinks, she tracks your cursor. When she speaks, her mouth is driven by the actual audio leaving your speakers. We measure both the loudness and the vowel energy, because a hard S makes noise but barely moves a jaw, and an "ah" opens it wide.

One tap. No account, no onboarding, no "please select your language."

And she speaks first. She opens the conversation, because the person holding this phone may never have used a civic tool before and should not have to guess what to say.

Here we ask her something in Nigerian Pidgin.

She answers in Pidgin. And look at the top right — the pill just changed to Nigerian Pidgin.

Nobody selected that. There is no language setting in this app. She heard the dialect, matched it, and told the interface what she heard so the interface could follow her. Switch language halfway through a sentence and she switches with you, and never mentions it.

This is the most important decision in the product. A language menu assumes you can read the menu. For the person this is built for, a market trader who speaks Pidgin and reads very little English, a language menu is a locked door with the key on the other side. Detecting it instead of asking for it is what makes this usable at all.

And notice what she did not do. She explained. She did not launch an investigation or ask for a reference number. Most people's first civic question is not a scandal. It is: what does this word mean, and does it apply to me?

Now the real thing. A health centre the records say was completed, with no roof on it.

Watch the screen.

Nobody pressed a button. WAZI decided that what was just said had earned an investigation, and opened the evidence board herself. That is a function call from the model into the interface.

The version of this codebase we started with decided when to open that board by matching English keywords. Which means it worked in English, for phrasings somebody had thought of in advance. Moving the decision to the model that already understood the sentence is what makes this work in Yoruba, or Swahili, or Hausa, without translating a single line of the interface.

If seeing the place would settle it, she asks for a photo, and opens the camera herself.

Before that image goes anywhere, the app reads its raw bytes on the phone. It finds the EXIF block and tells you what it found — GPS coordinates, camera hardware, timestamp — then strips them and re-encodes. You watch it happen. We did not want a privacy promise. We wanted a privacy receipt.

Then the image goes to Gemini vision, which pulls the structured clues off the signboard: project name, tender reference, implementing agency, contractor, claimed status. And it is instructed never to invent a reference code, a contractor or an agency that is not visible in the frame. Show it an ordinary photo with no signboard and it says so, rather than inventing a project.

This is the heart of it.

First the retrieval. Five named steps, each with a named source — the federal and Ogun State directory, the National Open Contracting Portal, the Open Treasury Portal, the dated field photograph, and then the synthesis. We show the search happening because trust is a process, not a conclusion.

Then the board itself. Responsible authority identified: the agency, and the verified desk it answers at. Claim examined: the exact assertion being tested, with the date it was checked. Evidence state: conflicting.

That word is doing careful work. We do not use confidence percentages anywhere in this product. Eighty-seven percent confident implies a precision nobody has, and a non-technical reader will round it up to true. So every claim gets a category instead — verified, corroborated, reported, conflicting, or unknown.

And then the comparison. Official public record on the left. Observed field reality on the right. Five dimensions, tested one at a time.

The record says one hundred percent completed, inspected and handed over, March 2024. The ground says an uncompleted masonry shell, no roof, no windows, site abandoned.

The two columns never merge. WAZI never says anyone stole anything. She shows you the gap, dated and sourced, then shows you the lawful way to make someone account for it.

Then this: Check Again.

WAZI goes back and tries to break her own finding. She looks for the innocent explanation — a later variation order, a phase two contract, a boundary reassignment, a debarred contractor, satellite coordinates that do not match.

If the finding survives that, it is worth sending. If it does not, it should never have left the phone. The failure we were most afraid of is not a tool that misses corruption. It is a tool that sends a citizen to confront an institution over a discrepancy with a perfectly boring explanation.

And here is where most accountability tools stop, and this one does not. A dashboard tells you where the money went. It does not help you do anything about it.

Four formats — a Freedom of Information request, a service complaint, an inquiry letter, or a WhatsApp brief for organising neighbours. Tone: neutral, firm, or conciliatory. Length: concise, standard, or detailed. Because a retired headmaster and a twenty-two-year-old organiser should not be made to sound identical.

Then the verified institutional route. Not "contact the ministry." The named agency. The named officer — Executive Director and Head of Procurement Oversight. The verified email. And the clock: seven working days, under Section 4 of the Freedom of Information Act, 2011. And the escalation route, pre-loaded, for the day those seven days lapse: the Independent Corrupt Practices Commission, with its tracking address and toll-free line.

That statute, that deadline, that officer — none of it comes from the model. It comes from a hand-verified country pack that ships with the app. The model handles language. The pack handles fact. A language model should never improvise a legal deadline in front of someone about to rely on it.

Below that, the document itself, on a letterhead, fully editable.

And Privacy and Disclosure, where she decides what this letter says about her. She can withhold her name, her contact, her precise location, and sign as a concerned community resident. Because the moment you name a contractor and a ward while standing in front of the building, you have exposed yourself. A transparency tool that hands someone evidence and no protection has handed them a liability.

Copy the text. Print it. Download it. Open it in an email app, pre-addressed. Or save it to the case file. But nothing sends automatically. Nothing leaves this phone without her tapping the button herself, on a screen where she can read every word first.

That bar along the top follows her everywhere — voice and chat, evidence board, draft studio, saved cases. With a live dot when WAZI is listening, and a count of the cases she has saved offline. Because this is not four tools. It is one conversation that happens to have four views.

The whole thing runs as a single process on a single port. One command. It works from a phone on the same network with no configuration, and if the connection drops in a lift or a tunnel, the session is held open so she can come back to the same conversation instead of starting her case over. That is not a nice-to-have. That is the connection our users actually have.

Accountability does not usually fail at the investigation. It fails at the first step, where the person who can see the problem has no way to put it in writing, in the right language, to the right desk, inside the window the law gives them.

WAZI turns that first step into a conversation anyone can have.

Open. Clear. Out in the daylight.

---

## Short script (~60 seconds)

A woman walks past a health centre. The signboard says completed. The building has no roof. Everything she would need is already public, and none of it is reachable from where she is standing.

This is WAZI.

She asks what a Freedom of Information request is, in Pidgin. WAZI answers in Pidgin, and the language pill updates itself. Nobody selected a language. There is no language setting. She heard it.

Then: a clinic the records call finished, with no roof. Watch — nobody pressed a button. WAZI opened the evidence board herself.

Official record, ground truth, side by side. Never merged. She does not accuse anyone. She shows the gap, dated and sourced. Then she argues against her own finding, hunting for the innocent explanation.

And it ends with an instrument, not an insight: a Freedom of Information request, citing the statute, addressed to a named officer, seven-day clock running, escalation route pre-loaded.

She reviews it. She decides. Nothing leaves her phone without her.
