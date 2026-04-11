---
title: "Writing Docs Finally Pays Off — For Yourself"
date: 2026-04-11 10:00
translated: true
---

# Writing Docs Finally Pays Off — For Yourself

Specification-Driven Development. The concept lived, died, and now it's back.

The cause of death was clear: writing specs took long enough to write the code twice over. You spend two hours on a doc whose beneficiary is the colleague who takes over three months later, or yourself six months down the line when all context has evaporated — but by then the doc is already out of sync with the code. Costs paid upfront, returns indefinitely deferred. The moment a deadline tightens, docs are the first thing cut, and nobody sheds a tear.

The math didn't work, so SDD died. Dead for over a decade.

Then LLMs showed up.

## Docs Got a New Reader

Your type annotations, docstrings, and READMEs are now also context for AI coding assistants. A `query(q: str) -> Any` gives the AI approximately zero information, while `search_products(query: ProductQuery) -> SearchResult[Product]` lets it infer parameter structure, how to unpack return values, and how to handle exceptions. Same AI, same task — the quality of generated code differs wildly just because of type signature precision.

The point isn't "AI can read docs" — no kidding. The point is that the equation flipped: **the person writing the docs is now the immediate beneficiary.**

Writing docs used to be accumulating karma for others. Now it's boosting your own productivity. The math works out, so SDD lives again.

## Two Readers, One Standard

Docs now have two readers. Their needs mostly overlap, but the differences are subtle.

A function called `process_data` — a human colleague glances at the context and can roughly guess what it does. The AI takes it literally, and the generated code might be technically correct but semantically way off. Humans string together cross-module dependencies from memory; AI needs you to spell them out explicitly. "We don't use an ORM here, it's all raw SQL" — that sentence wouldn't appear in any doc, but write it in CLAUDE.md and the AI will never generate SQLAlchemy code for you again.

With two readers grading the paper, the bar for "good docs" just got higher. The old standard of "good enough for humans to read" can't cut it anymore.

## CLAUDE.md: Writing Down What's in Your Head

I use Claude Code myself. There's a CLAUDE.md in the project root with file structure conventions, naming standards, and writing style rules. In a traditional team, what would you call these things? Tacit knowledge. Living in senior engineers' heads, passed down to newcomers through oral tradition, lost every time someone leaves.

CLAUDE.md was forced into existence by AI collaboration, but it incidentally turns all that stuff living only in veterans' heads into black and white — what's written for AI, humans can read directly too.

What's even more interesting: you write "don't use emoji" in there, and the AI actually stops using them in generated content. That rule, through AI's execution, transforms from a description into a constraint. Docs are no longer just records — they're defining behavior. That's what a spec is supposed to look like.

SDD was proposed over a decade ago. It didn't catch on. The idea wasn't flawed — the math just didn't work. Now LLMs have restructured the payoff, the math works, and the path opens up.

This kind of thing happens all the time in tech history. It's not that it couldn't be done — it just wasn't worth it. Once it's worth it, renaissance naturally follows.
