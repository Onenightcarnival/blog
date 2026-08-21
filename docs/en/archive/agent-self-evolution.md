---
title: If an Agent Grows Wrong, You Can Reinstall It
date: 2026-08-21 22:00
translated: true
---

# If an Agent Grows Wrong, You Can Reinstall It

DeepSeek Harness (dsh) shipped only a week ago, and I spent that week packaging a desktop version of it. Along the way I stepped on a landmine: I let the agent modify a dsh plugin on its own. The change took effect live, and everything looked fine. Then I quit dsh and started it again. The service threw an error and would not come up. By that point the agent was already gone — it had been running inside the very process that now refused to start. The fix involved no technical skill at all: reinstall.

Several design decisions in the desktop app trace back to that failed startup. Config changes go through the Electron shell, so everyday settings like MCP, skills, and context compaction all travel the deterministic path of a graphical interface. The preset plugins are limited to a handful that have been tested against the kernel, locked at build time. The agent does not touch its own harness.

With the project done, this is a good moment to write down the thinking behind it: when it comes to self-evolution, which layer I believe it should happen in.

## DeepSeek's answer: evolve the harness too

DeepSeek defines an agent as model + harness. Following that definition, their self-evolution scheme is thorough: everything outside the model is fair game. The cordis microkernel-plus-plugins architecture keeps the kernel as small as possible and turns every capability into a plugin; plugins can be installed, removed, replaced, and upgraded at runtime. In theory the agent can swap out its own parts while it runs.

The scheme is not unreasonable. The microkernel idea works the same way it does in operating systems: shrink the part that must stay frozen to a minimum and make everything else replaceable. The disagreement is not over whether there should be an immutable core — everyone agrees there should be. It is over two things: how large that core is drawn, and who performs the part-swapping — deterministic code, or the agent's own probabilistic reasoning.

My conclusion from practice: draw the core large and put the whole harness inside it; keep part-swapping out of the reasoning loop. Evolution belongs in the skill layer.

That failed startup explains why part-swapping cannot run through the reasoning loop. A change taking effect live is the most deceptive feedback there is. What the agent sees after the edit is the in-memory state: the process is still running, the modules already loaded are still loaded, and on that basis it concludes the change succeeded. What actually broke is the copy on disk, and that only surfaces at the next cold start. When the cold start fails, the agent is not there — it lived inside the process that will not come up. You cannot ask an agent inside a harness that will not start to fix that harness; a human has to clean up. The agent's modifications to its own harness are invisible to it precisely where it most needs to see the result.

But that is still not the main reason. The main reason is not that recovery is hard — quite the opposite, it is that recovery is too easy.

## Uninstall and reinstall: a privilege humans do not have

The biggest difference between an agent and a person is that an agent can be taken offline and redeployed. If a program breaks, you uninstall and reinstall, and ten minutes later a clean instance is standing there again.

A person cannot be uninstalled and reinstalled. Experiences, beliefs, and injuries all live in the same body. There is no snapshot, no export button; every path taken is irreversible. When a person grows wrong, no mechanism exists to roll them back to the version from three years ago. That is why humans are extremely cautious about irreversible experiments on themselves, and rightly so.

Agents carry none of that burden. Trial and error, growing wrong, tearing it down and starting over — the cost is one redeployment. This is the fundamental reason self-evolution makes sense for agents and not for people.

But the same privilege changes the question. Since reinstalling is always there as a fallback, "what if it breaks" is not the central problem of self-evolution — the answer is always reinstall. The central problem is a different one: after the reinstall, what is left?

Reinstalling is a destructive rollback. Everything in the program layer gets wiped. If the gains of evolution live in the harness — plugins swapped at runtime, kernel logic that was modified, execution loops that were tuned on the fly — then every break-and-reinstall cycle zeroes out the gains along with the failure. That kind of evolution is forever starting from scratch. Nothing accumulates.

Skills are different. A skill is a file, it is data, and it is separate from the program itself. dsh keeps its data and configuration under `~/.dsh` in the user's home directory, while the kernel is installed under `runtimes/<version>/`; if a new kernel fails to start, the app automatically falls back to the built-in one. The kernel can be reinstalled, upgraded, and rolled back over and over, and whatever is in `~/.dsh` stays put. Reinstalling Word does not delete your documents.

So the skill route is reliable, and "it is harder to break yourself" is only the surface of it. The real reason is that skills survive reinstalls. Put the gains of evolution in the layer that survives a reinstall, and reinstalling turns from disaster recovery into routine operation — if it breaks, throw it away, and throwing it away does not hurt, because what you have accumulated is not in the part being thrown out.

## Write evolution into the genes, not the flesh

Biological evolution runs on exactly this structure: the body is disposable, the genes get passed on. The muscle an animal builds, the tricks it learns, the injuries it suffers — all of that stays in its own body and dies with it. Only the genes reach the next generation. Evolution never happens in any single animal. An individual's job is to live once, try once, and then be kept or culled; what actually moves forward is the genes.

Mapped onto agents: the instance is the animal, disposable and rebuildable at any time; skills are the genes, surviving across instances. If an instance crashes and burns, kill it, and a new instance comes up with the same set of skills, carrying every capability the previous generation accumulated.

Harness self-modification is the other road: write the gains of evolution into the body of the instance and expect the next instance to inherit them directly — like expecting a giraffe that stretched its neck all its life to give birth to long-necked calves. That idea has a name in the history of biology, Lamarckism, and it was later shown not to be how evolution works: what you build through practice mostly does not make it into the genes. Biology did not take that road, and I see no need for agents to try it again.

The human predicament fits the same frame: in a person, state and substrate cannot be separated; there is no distinction between program and data. You cannot reinstall the body while keeping the memories, nor export the memories into a different body. So human evolution can only happen at the level of populations, one generation after another; a single person has no rollback. An agent is the first thing that can evolve as a single instance — provided the architecture keeps program and data apart.

Which brings the design problem of self-evolution down to one sentence: draw a clear line between what counts as program and what counts as data, then let evolution happen only in the data layer. The program layer stays in factory condition, reinstallable at any time. The data layer takes on all the accumulation and carries it through every reinstall.

The criterion for drawing that line is not complicated: whatever has to load at startup is program; whatever gets read only after the thing is running is data. A plugin is code the harness loads at startup, so if it breaks, startup fails — that makes it program, and it is the entire explanation for the incident at the top of this post. A skill is a file the harness reads on demand once it is running. Startup does not depend on it. If a skill is written badly, the worst case is one botched task; the service comes up as usual.

## Two limits

There are two places where this framework should not be taken too optimistically.

First, reinstalling rolls back the agent, not the world. Messages the agent sent, code it committed, production config it changed — none of that disappears when the instance is reinstalled. Data surviving a reinstall is a good thing, but state that has leaked into the world survives just the same, good and bad alike. So the safety of self-evolution covers only the agent's internals. None of the guardrails at the action layer can be dropped.

Second, the skill layer can also go bad slowly. Any single skill can be deleted at any time, but the process that accumulates skills can drift: bad habits get reinforced by one success after another, memory gets poisoned by injection, wrong lessons get written up as "best practices". Genes are not finished once they are collected; they still have to pass selection. So evolution in the data layer cannot be accumulation alone; there has to be culling too. Evals serve as the checkup, provenance records as the audit trail, and skills get reviewed periodically for which to keep and which to delete. If you do not know when it went bad, there is nothing to roll back to.

---

Try out changes inside an instance that can be discarded whole, and write what deserves to stay into the data layer that survives reinstalls — that is what I understand self-evolution to be. Here is where an agent is luckier than a person: every time it grows wrong, there is a way back. The entire job of designing a self-evolution mechanism is to not weld that way back shut with your own hands.
