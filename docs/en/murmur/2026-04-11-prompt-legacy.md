---
date: 2026-04-11 16:00
translated: true
---

Model output is unstable, so you add rules. New rules conflict with old rules, so you add more rules to specify priority. The prompt bloats from 200 tokens to 2000 tokens, and changing a single word could trigger a butterfly effect. Eventually nobody dares touch it, because nobody knows why each rule is there.

A 2000-token prompt is untouchable legacy code. And the root of this cycle isn't that the prompt is poorly written — it's that the direction is wrong: you're chasing determinism at the prompt layer, but prompts can't give you determinism.
