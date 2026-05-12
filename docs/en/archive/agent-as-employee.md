---
title: A Stable Abstraction for Agents Might Just Be an Employee
date: 2026-05-12 22:00
translated: true
---

# A Stable Abstraction for Agents Might Just Be an Employee

The definition of agent has changed quickly over the past two years.

The earliest version was close to "an animal that can use tools." A model could call a few functions, run a loop, and people would call it an agent. That definition feels like Stone Age anthropology: humans are human because they can pick up a rock and crack open a fruit.

It is not wrong, but it is too thin. It says an agent can do things. It does not say who the agent is.

After skills appeared, the abstraction started to feel steadier to me. Add persistent sandboxes, long-term memory, and model tiers, and an agent no longer looks like an animal that can use tools. It starts to look like a complete employee.

## From Stone Age Tools to Human Resources

Once you look at an agent as an employee, many pieces suddenly line up.

- The system prompt is the job description. It says what this role does, who it reports to, what it should do, and what it should not touch.
- A skill is something this person knows how to do. Make slides, write SQL, crawl data, prepare financial reports. One skill is one line on the resume.
- The base model is like a candidate's seniority and ability level. Opus is closer to a senior expert, Haiku to a junior employee, and Sonnet sits somewhere in between. The role and the ability level need to match. Otherwise the cost is too high, or the work becomes error-prone.
- Long-term memory is the work history. What this person has done, what mistakes they have learned from, and what the client prefers can all be remembered and carried forward.
- An AIO Sandbox with a persistent volume is the employee's computer. Files, caches, configs, and half-finished projects all live there. A person can change jobs and get a different computer, but within this job, the machine is a stable working environment.

This abstraction is fuller than "a model that can use tools." It cares not only what an agent can do, but also what role it occupies, what skills it brings, and what history it carries.

## A Vague JD Can Waste Even a Strong Model

From a human resources angle, many agent failures are not purely model problems. They are problems with role definition and staffing.

The most common failure is an unclear JD. The system prompt leaves the role vague, does not spell out permission boundaries, and does not say what should be avoided. The model has to guess. When it guesses right, it looks experienced. When it guesses wrong, it may make decisions it should not make.

The second failure is a mismatch between ability and role. Asking Opus to run a daily format conversion is too expensive. Asking Haiku to handle a research task that needs long chains of reasoning is more likely to produce mistakes.

The third failure is a mismatch between resume and role. The agent has many skills installed, but none of them line up with the JD. Or the JD asks for data analysis, while the skill list is full of slide templates.

These problems do not show up as often in traditional software engineering, because functions and parameters are fixed. But an agent acts according to a role description, so the role description itself becomes an engineering problem.

Writing a prompt is no longer just writing a prompt. It is writing a JD.

## An Employee Needs Their Own Computer

For an employee to work steadily, they should have a computer they can keep using during the job.

That computer does not have to follow them for life. But within this job, it should be stable. Files need a fixed place. Dependencies need a fixed place. Half-finished projects need a fixed place. Otherwise every day feels like borrowing a temporary machine: the environment set up today has to be rebuilt tomorrow.

Early agents often looked like people without their own computers. They borrowed the user's terminal, or a built-in sandbox inside some client. Each conversation started a new environment, cleared it at the end, and began from scratch next time.

That works for temporary work, but it is hard to accumulate anything. A file downloaded today is gone tomorrow. An environment tuned today has to be tuned again tomorrow. Intermediate results produced today cannot be continued tomorrow.

Once an agent gets a sandbox with a persistent volume, the situation changes. It is like giving the agent a work computer that stays available during the job. The container can be rebuilt, but the files, caches, configs, and half-finished projects in the volume remain. Today's work can continue tomorrow.

The change looks small, but it turns "finish and leave" into "stay on the job." An agent that stays on the job can take on more complex tasks, work with other agents, and gradually build up the materials, scripts, configs, and unfinished work that belong to that role.

## A Skill Should Be Verifiable Like a Certificate

Technically, skill portability depends on details like how dependencies are locked, how the runtime is fixed, and how commands are reproduced.

From a human resources angle, the role of a skill becomes clearer. It starts as a line on the resume, but if it needs to move across agents and environments, it should be verifiable like a certificate.

The value of a certificate is that when someone changes companies or roles, others still know what they can do. A person who can make slides can make slides at any company. A good skill should behave similarly: attach it to different agents, run it in different frameworks, or pair it with different models, and the result should not drift too far.

A skill is not just an extension of a prompt. It is more like a portable asset on the resume. The person may change companies, JDs, or computers, but as long as the skill is there, the ability is still there.

That is why a skill should be written like an engineering project, not as a piece of documentation. It needs verifiable content. Otherwise it is hard for anyone else to trust that it really works.

## Once the Abstraction Settles

Seen this way, agent engineering is no longer only about calling tools or writing loops.

First define the role clearly. Then choose the right model, give it a stable working environment, and make skills verifiable and portable. These questions may look separate, but they all point back to the same thing: who is this agent, what is it responsible for, and what does it rely on to get the work done?

An agent is not just a model that can use tools. It has a role, skills, a working environment, and a history.

Once that is clear, the remaining work is not that different from managing a team.
