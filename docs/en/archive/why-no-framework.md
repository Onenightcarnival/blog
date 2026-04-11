---
title: Why I Rarely Use Frameworks
date: 2026-04-11 18:00
translated: true
---

# Why I Rarely Use Frameworks

In two years of building LLM applications, I've barely touched LangChain, LangGraph, CrewAI, or Dify. Whether it's agents or workflows, I just use instructor plus the OpenAI SDK and call it a day.

This isn't by accident. I've built frameworks myself — I once led the design of a Spring-like Python framework at a big tech company — so I know exactly what frameworks can and can't do for you. A framework's value lies in unifying things that genuinely share commonality. But those impressive-sounding concepts in LLM applications? Take them apart and they're neither complex nor generic.

## Those Concepts Are Just Function Composition

Memory? Maintain a list, stuff conversation history in, include it in the next call.

RAG? Look up relevant info before calling, stuff it into context.

ReAct? Have the model think first, then pick a tool, feed the result back and continue.

Agent? LLM + tool calls + a loop.

Each one, taken apart, is a matter of a few functions. They have names in papers because academia needs to name paradigms. Written into business code, they're list operations, a query, a while loop.

But "agent framework" sounds way sexier than "LLM function library." Pitching to investors, marketing to the public — "we built an agent orchestration platform" is infinitely more appealing than "we wrapped a few API calls." A lot of framework complexity isn't technology-driven; it's narrative-driven.

## No Universal Approach

Frameworks assume these concepts have best practices that can be abstracted. But in reality, every scenario is different.

Customer service "memory" is the last 10 conversation turns. A code assistant's "memory" is the entire project file tree. An analysis assistant's "memory" is intermediate computation results. Three things with the same name, completely different implementations.

Legal "RAG" needs exact clause number matching. Technical documentation "RAG" needs semantic similarity. Customer service knowledge base "RAG" needs intent classification followed by targeted lookup. You can't write one generic Retriever to cover all three.

When should an agent stop? Some finish in one round, some iterate until convergence, some require human approval. The termination condition is the most critical design decision for an agent, and it's precisely the part least amenable to generalization.

It's like "person" has no template — you can't define a universal human behavior framework and generate different people by tweaking parameters. Agents are the same: each agent's soul is its unique business logic, not the skeleton provided by a framework.

## Instructor All the Way

Here's what a few scenarios look like with instructor.

**Customer service intent routing** — model determines intent, code dispatches handling:

```python
class CustomerIntent(BaseModel):
    category: Literal["refund", "logistics", "complaint", "inquiry"] = Field(
        description="Intent classification of the customer message"
    )
    urgency: Literal["high", "medium", "low"] = Field(
        description="Urgency level based on the above category "
                    "and message tone"
    )
    extracted_order_id: Optional[str] = Field(
        description="Order ID mentioned in the message (if any)"
    )
```

Intent recognition, urgency assessment, entity extraction — one model handles it all. Take the result and if/else dispatch to different handler functions. That's your so-called "intent routing agent."

**Investment research** — extracting structured info from research reports:

```python
class ResearchExtraction(BaseModel):
    ticker: str = Field(description="Stock ticker symbol")
    revenue_growth: Optional[float] = Field(
        description="Year-over-year revenue growth rate, "
                    "null if not mentioned in the source"
    )
    risk_factors: list[str] = Field(
        description="Key risk factors mentioned in the report",
        max_length=5
    )
    bull_case: str = Field(
        description="Summarize the bull case based on the above info"
    )
    bear_case: str = Field(
        description="Summarize the bear case based on the above info"
    )
```

Field order is the reasoning path — extract facts first, then give judgments. That's your "declarative chain-of-thought," no need to write "please do A before B" in the prompt.

**Tool-using agent** — scenarios requiring a loop:

```python
class Step(BaseModel):
    thinking: str = Field(
        description="Analyze the current state, decide on next step"
    )
    action: Literal["query_db", "call_api", "finish"] = Field(
        description="Choose an action based on the above thinking"
    )
    action_input: str = Field(description="Input for the action")

async def run(task: str):
    history = [{"role": "user", "content": task}]
    for _ in range(10):
        step = await instructor_call(history, Step)
        if step.action == "finish":
            return step.action_input
        result = await tools[step.action](step.action_input)
        history.extend([
            {"role": "assistant", "content": step.model_dump_json()},
            {"role": "user", "content": f"Result: {result}"}
        ])
```

`thinking` before `action` — the model thinks first, then chooses. Tool selection is a type constraint, not a natural language prayer. The loop is just a for loop, exit is just `"finish"`. That's the entire agent.

Three scenarios, no Chain, Graph, Node, Edge, Crew, Role, or Canvas. Just Pydantic models plus plain Python code.

## Whose Problem Do Frameworks Solve?

People who don't know how to organize LLM code. A framework gives you a ready-made structure, tells you where to put your code — that has value for beginners and for quickly spinning up a demo.

But if you understand that those concepts are just function composition under the hood, and that every scenario composes differently — the framework layer is pure overhead. You have to learn its concept system, accept its architectural constraints, and when things go wrong, debug through its abstraction layers.

When you actually need complex orchestration — workflows with 10+ steps, persistent state, distributed execution — reach for general-purpose orchestration tools like Temporal or Prefect, not LLM-specific frameworks.

The simplest working solution is the best solution. Not because simplicity has some inherent virtue, but because you'll need to modify it, debug it, and teach others to understand it later. Every additional layer of abstraction makes all of that a little harder.
