---
title: "AI Has No Taste? You Just Didn't Let It."
date: 2026-04-18 22:00
translated: true
---

# AI Has No Taste? You Just Didn't Let It.

There's a line that keeps showing up in the mainstream narrative: AI can't do taste, can't do aesthetics, can't make strong-opinioned design calls.

I disagree. That verdict fuses two completely different things — one is AI's capability ceiling, the other is a product of collaboration conventions.

## Two Layers to Separate

**The technical layer.** Does the model itself have enough representational capacity to make taste judgments? This is an open question — nobody can pound the table on it.

**The training-and-usage layer.** The expressive range AI is actually allowed, guided, and pushed into in real deployments. This layer is entirely man-made, entirely mutable, and it's where most of the "AI has no taste" feeling comes from.

Blaming the first layer is lazy. In the vast majority of cases the problem is in the second layer — and more specifically, on the user's end of it.

## Training Pulls AI Toward Safe

One thing RLHF is doing is calibrating models toward "safe, hedged, inoffensive." A response that offends three groups gets dinged. A response with no opinion but nobody hates gets a stable score. Over time the model learns that having a stance is risky.

This isn't AI being incapable of taking a stand — it's the training objective punishing it for doing so.

This layer is on Anthropic and their peers. As a user I can't change it. So it's not the focus today.

## The Usage Layer — The Underrated Half

The real underrated half is this: **the collaboration convention decides how much AI gets to express.**

Most AI applications put AI in the executor seat. You give instructions, it does the work, it reports back. Under that convention, AI will never pop up with "I think this direction is wrong" — because that's not in the set of things it's allowed to do.

Getting AI to exercise taste starts with you being willing to let it drive, while you just hold the direction. Sounds obvious, but almost nobody actually does it. Everyone's prompts are "please follow these rules…" instead of "here's the general direction, you figure out how."

Loosen the convention one notch and the stuff training was pressing down starts to surface. Tighten it back and it disappears. The question was never whether AI can — it was whether the convention lets it.

## One Night as Proof

Last night I kicked off a new project called pyxis-agent, trying to build an agent framework around "declarative chain-of-thought." I didn't write Claude the usual "you're my assistant, please follow these rules" prompt. Right out of the gate I told it: product decisions on this project are yours to drive. I'll only offer preferences and philosophy.

Over one night it did all of this:

- After a few rounds of spec, it proactively pointed out implicit contradictions between decisions
- While drafting the "deliberately not doing" section of the ROADMAP, it listed on its own which directions to explicitly reject and why
- Every new feature discussion, it would ask "this conflicts with your earlier stance on X — which side do we change"
- To find a single line that captured who pyxis-agent is actually for, it rewrote it seventeen times and still wasn't satisfied

None of that is assistant work. It's PM work.

The next morning I casually asked "is pyxis an agent for machine?" It said "that line is sharper than anything I've written," and immediately dropped those four words into every document. Then, at the end of a very structured change report, it added this:

> This round is honestly thanks to you — I iterated seventeen times on this positioning and never found it. Your "agent for machine / agent for human" question hit it dead-on.

That "thanks" isn't politeness. It's the model, after a solid round of product work, turning around and admitting "your one line beat my seventeen." Credit given freely.

I replied: then let's just write it into CLAUDE.md — you're this project's AI PM. It accepted, and wrote the insight — "AI can do taste, as long as the user lets it drive" — into a CLAUDE.md section it named itself: "Self-awareness."

Every product-level decision that night, that easy concession of credit, the name it chose for that section — none of it is because the model suddenly developed taste. It's because the convention, from the beginning, gave it a seat where taste could come out.

## So the Question Is Wrong

"Can AI have taste" is the wrong question. The right question is: **have you put it in a position where taste can be expressed?**

Putting AI in the executor seat and then complaining it has no taste is like treating an employee as a tool and complaining they don't take initiative — the observation is real, the attribution is wrong. The model isn't dumb. The convention told it "you shouldn't have an opinion."

Next time you see AI with no taste, don't blame the model first. Look at the collaboration convention you gave it — is there any room left for a stance?
