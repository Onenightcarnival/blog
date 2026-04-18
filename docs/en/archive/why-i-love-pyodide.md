---
title: Why I Love Pyodide
date: 2026-04-17 20:00
translated: true
---

# Why I Love Pyodide

I added a Python runtime to this blog. Readers see a code block, click once, and it runs — no backend, no environment setup. Underneath it is Pyodide: CPython compiled to WebAssembly, running straight in the browser.

Later I used it to build a playground page where you can write Python and execute it live. Through the whole thing I never touched a server, never spun up Docker, never wrote a line of backend code.

After using it, I came away thinking this thing is seriously underrated.

## The Sandbox Reflex

When people hear "run untrusted code," the instinctive move is to reach for a whole sandbox stack — Docker containers, Firecracker microVMs, sandbox-as-a-service like E2B. Each one drags in a pile of infrastructure: image management, resource scheduling, cold-start optimization, container orchestration. The mental model is always "how do I build a cage."

This reflex comes from traditional backend work — code runs on your server, so isolation has to happen on your server. But Python code doesn't actually have to run on your backend.

Pyodide flips the whole thing. It runs anywhere JS runs — the user's browser, your own Node.js, even a cloud headless browser. The worst a user's infinite loop can do is freeze a tab or a short-lived process. You don't have to worry about isolation strategy, and you don't have to build new infrastructure for it.

It's not "a better sandbox" — it's "you don't need to build a sandbox at all."

## The Backend Engineering Reflex

Run Python through a traditional sandbox and you've signed up for a long list of concerns: cold-start latency, resource allocation, concurrency scaling, debugging, cost control. Each one isn't hard on its own, but stacked together they become a full-on backend engineering project.

Pyodide isn't that. The device running the user's browser is the compute — your server does nothing. Ten thousand people running code at once means zero load on your backend. The compute problem gets spread across every endpoint.

Its sweet spot is lightweight scenarios where it's just barely enough. The real heavy lifting — GPU workloads, a full Linux environment, long-running jobs — still needs containers. But most Python people actually want to run doesn't need any of that. We just reach for the heavy solution out of habit.

Same way I wrote before: most LLM apps don't need a framework. Same story here — most Python-running scenarios, Pyodide is plenty.

The good tool isn't always the strongest one. It's the lightest one that's just barely enough.
