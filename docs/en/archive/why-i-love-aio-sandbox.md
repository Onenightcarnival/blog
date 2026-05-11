---
title: Why I Like AIO Sandbox So Much
date: 2026-05-10 21:05
translated: true
---

# Why I Like AIO Sandbox So Much

Running skills through Codex scheduled tasks has been a bit awkward lately.

Codex App runs on the local machine, so it is not a good idea to grant it everything. Full access means handing over local files, network access, and command execution. But with the default permissions, subagents often stop and ask whether they can access the network, run a command, or read a directory.

That is acceptable in a live conversation. Someone is sitting there, sees the prompt, clicks approve, and moves on. Scheduled tasks are different. They are supposed to run without anyone watching. If a task starts at midnight and gets stuck on a network permission prompt, nothing happens until the next morning.

There is another kind of issue too. The sandbox network configuration may differ from the host machine, and a crawler script that works locally may fail inside the sandbox. The agent can only report that the environment does not allow it, or that the network has a problem. The script has not changed. The skill has not changed. One small difference in the runtime environment is enough to break the whole thing.

Instead of relying on the sandbox built into an agent client, it makes more sense to pull the execution environment out into a separate place: something that can be configured, mounted with persistent volumes, and upgraded on its own schedule.

[AIO Sandbox](https://github.com/agent-infra/sandbox) is that kind of thing. It is a Docker container with Browser, Shell, File, MCP, and VSCode Server sharing the same filesystem. Agent clients connect to it through MCP and use its browser, terminal, and file tools.

It is not tied to a specific agent client.

## Built-in Sandboxes Are Good for Temporary Work

Built-in sandboxes are useful. Open Codex, ask a few questions, run a bit of code, check the result. For this kind of work, the built-in sandbox is convenient.

There is no setup, no container to start, no ports or mounts to think about. Permission prompts appear in the moment and can be handled in the moment. The sandbox is close to the current workspace, and generated files are easy to inspect. As a throwaway workspace, it works well.

Scheduled tasks and long-running skills are not throwaway workspaces.

Once a skill is attached to a scheduled task, it starts to look like a small pipeline. It needs to start at a fixed time, run unattended, and produce a stable output for a stable input. The painful part is not spending a little more time on setup. The painful part is when something works today and silently gets stuck tomorrow.

Built-in client sandboxes have two problems here.

First, permission prompts interrupt automation. If a subagent asks for network access, the task stops. In a conversation, that is a safety check. In an unattended task, it is a blocker.

Second, the client updates itself. Updates are good, but they can also change the built-in sandbox: network rules, default permissions, tool paths, system dependencies. The skill did not change, but the runtime environment did. Debugging this is annoying because the change happened inside the client.

A better split is: the agent client handles orchestration and reasoning, while the execution environment is fixed by the user.

## An Independent Sandbox Puts the Environment Back in User Hands

AIO Sandbox pulls the execution environment out of the client.

It is not an add-on hidden inside one agent client. It is a separate container. Its version can be pinned. Its configuration can be written down. Upgrades can happen when the user chooses. Network settings, proxies, DNS, ports, and volume mounts can all live in Docker configuration.

This matters a lot for long-running skills.

As written earlier in the post about skill portability, a skill's portability does not only depend on `SKILL.md`. It also depends on the model, the agent harness, and the runtime environment. Models change. Harnesses change. The runtime environment is the part that can be controlled most directly.

AIO Sandbox fixes that part. It cannot make every agent behave the same way, and it cannot guarantee that the model will make the same decision every time. But Python, Node, browsers, filesystem layout, and network configuration can at least become more stable.

That removes a lot of unnecessary randomness.

## Persistent Volumes Turn the Sandbox into a Workbench

Built-in sandboxes often belong to a single conversation. A file downloaded by one agent may not be visible to another agent. Cookies, cache, and intermediate files produced by one task may not survive until the next task.

With persistent volumes, AIO Sandbox feels different.

Files can stay in a fixed directory. Browser downloads, intermediate script outputs, project dependencies, and configuration files can all survive across tasks. The container can be deleted. The data does not have to be.

This is useful for multi-agent workflows. A file produced by Codex today can be read by another agent tomorrow. A page or cache captured through one agent's browser session can be processed from the same filesystem by another agent. The sandbox does not care who is on the other side. It just acts as a stable workbench.

That is the nice part of an external sandbox: agents go back to being tools, and the sandbox becomes the shared environment.

## It Is Also a Lighter Isolated Development Machine

This is not only about agents.

Before ChatGPT, traditional software development often needed an isolated Linux environment too. The most basic version was a separate physical machine. Permissions could be relaxed, the environment could be changed freely, and a broken setup would not affect the main machine.

But physical machines are heavy. They take space, need maintenance, require file syncing, and are painful to reinstall.

People later used virtual machines and Docker to avoid dealing with physical machines. The development environment stays away from the host machine, and a broken environment can be rebuilt.

AIO Sandbox is a Docker image. It starts quickly, rebuilds quickly, and makes directory mounting easy. When a clean Linux environment is needed, start a container. When project files or state need to stay around, mount a volume.

It is useful for human developers too: trying a dependency-heavy project, running a tool that should not be installed on the host, or validating a script that needs Linux. In the past, this often meant choosing between the host machine, a VM, and a plain container, then wiring things up manually. AIO Sandbox packages the common tools, so one container is enough to start working.

In the agent era, this becomes useful in one more way: the same lightweight development machine can be used by both people and models.

## Give the Model a Rebuildable Linux Computer

Computer use needs a machine that can show a screen, click a mouse, use a browser, and run a terminal.

Letting an agent do all of that directly on the host machine requires caution. The permissions are too broad. The risk is too high. If that "computer" is an independent container, the boundary is much clearer.

AIO Sandbox has a browser, a terminal, VSCode Server, and a filesystem. With persistent volumes, it becomes a Linux computer that can be used for a long time and rebuilt whenever needed.

The model can download files, run scripts, open pages, and edit projects inside it. If the container is broken, rebuild it. Anything worth keeping goes into the volume. The environment itself can be disposable, while data and state can be kept selectively.

With this setup, agents can be allowed to do more. The risk does not disappear, but it is kept inside a place that is easier to understand and easier to reset.

## Independence Is the Point

For temporary conversations, a built-in sandbox is already good enough. There is no need to start an independent container for every small experiment.

But the pain here is not temporary conversation. It is long-running skills, scheduled tasks, multi-agent reuse, and giving models a recoverable Linux environment.

For these uses, the execution environment should not follow the release cycle of a single client. Clients can update. Models can change. Agent tools can come and go. The sandbox should stay stable.

Putting Browser, Shell, File, MCP, and VSCode Server in one container is convenient. But the more important part is that AIO Sandbox separates the execution environment from the agent client.

Once the environment is independent, permissions, versions, files, network settings, and long-term state are much easier to control.
