---
title: Putting a Price on Taste
date: 2026-07-24 22:00
translated: true
---

# Putting a Price on Taste

This week I had an agent make roughly the same small change in two codebases. One is a project I've groomed to my own compulsive standards; the other is a legacy project I inherited. The first took a dozen or so tool calls. In the second, the agent churned through nearly a hundred — grep, file reads, LSP jumps, over and over — its context stuffed with glue code irrelevant to the task, and it still nearly edited the wrong place.

I checked the usage. Almost a 10x difference. Same model, same task — the entire spread came from the code itself.

That's when it hit me: for the first time, taste in code has a price.

## Taste Used to Lose the Argument

Before this, what did defending code quality run on? Aesthetics. Professional pride. A warning that "this will be painful to maintain." The trouble is that code quality is hard to measure in clear, short-term costs.

The maintainer's frustration, the new hire's three-month ramp-up, the extra half hour in every review — these costs are all invisible, folded into salaries, absent from any financial statement. The shit mountain's greatest talisman is that it costs nothing — on paper, anyway. So when the deadline arrives, refactoring goes last. People argued about taste for decades and almost never won.

[Last time](./zeroth-world-customs.md) I wrote that worse than a price you can't pay is no price at all. Taste in code is exactly that kind of thing: it's not that nobody was willing to pay for it — it was simply never priced.

## The Agent Is Taste's Meter

Code now has a new kind of reader, and this reader bills by usage.

Every step an agent takes through a shit mountain burns money. When the names are a mess, it can't guess locations from semantics; it has to brute-force with grep, and every probe pours garbage into the context. When the layering is muddy, it needs ten files to build a mental model, eight of them glue. When side effects fly everywhere, local reasoning breaks down, and it has to load half the project into its head. Every extra jump, every irrelevant snippet, converts into the same three things: token bills, latency, error rate.

And agents tolerate shit mountains worse than people do. A human survives on tacit knowledge — three years in a project and you know where the mines are; you can route around bad code from memory. An agent starts every session with amnesia. It is the eternal new hire, and the only thing it can lean on is code that explains itself. To a veteran, a shit mountain is an annoyance. To the eternal new hire, it's a disaster.

So technical debt has changed identity. It used to be a moral problem, repaid in guilt — and guilt can be deferred. Now it's a financial problem, settled on every call, and not a cent of it can be dodged.

## The People Shouting ALL IN AI Are Still Piling Code Onto the Shit Mountain

Here's the irony. Plenty of companies shout ALL IN AI, figure Agent First means buying seats, wiring up APIs, and rolling out workflows — then keep piling code onto the same old shit mountain.

The most practical Agent First design is actually the most old-school engineering taste: clear layering, less glue, restrained abstraction, names that speak plainly. Elegant code is low-entropy, compressible — it fits into an agent's head with minimal context. A shit mountain is high-entropy; no amount of squeezing gets it in.

In the metaphor from [The Zeroth World Starts With My Bill](./zeroth-world-from-my-bill.md): giving your agent the most expensive model while feeding it a shit mountain means paying dollar exchange rates for Zimbabwean-dollar output. The model's money is spent on archaeology over your bad code.

## The Agent's Taste Is a Middle Way

That said, the taste agents recognize isn't quite the textbook's.

What it punishes is the two extremes. On one end, the shit mountain: entropy too high. On the other, over-engineering: too many layers of indirection. Stacks of thin wrappers, dependency-injection magic, reflection — to humans these may count as "design patterns"; to an agent, every layer of indirection is one more tool call, and static analysis loses the trail halfway through. Agents sometimes prefer slightly dumb code: inlined, moderately repetitive, explicit over clever.

So what it rewards is precisely the restrained kind of taste: abstract what should be abstracted, and resist the rest. That's a stricter standard than "write elegant code" — the over-engineers used to hide behind "elegance," and now the meter is ticking in both directions.

## After the Pricing

I can't quite decide whether this counts as taste's victory or its demotion.

Something that lost to deadlines for decades got its verdict overturned overnight by a bill. A win, yes — but it won by conceding that aesthetics doesn't get a vote and money does. Craftsmanship couldn't save code quality. A billing system did.

Still, by the last post's standard, this is a happy ending. Taste has finally moved from the world without prices into the world with them. Getting a price tag, in this era, already counts as gentle treatment.

This industry argued about taste for fifty years. In the end, what priced it was a reader who charges by the token.
