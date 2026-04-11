---
title: "Assembly → C → SQL → React → … Prompt?"
date: 2026-04-11 14:00
translated: true
---

# Assembly → C → SQL → React → … Prompt?

There's a recurring plot in software engineering history: the shift from imperative to declarative.

Assembly to C, jQuery to React, Makefile to Terraform — each time it's the same move: offloading the burden of "how to do it" onto the system so developers only need to say "what I want." The old paradigm never disappears — it just retreats to corners that demand fine-grained control.

Prompt engineering is walking the same path.

## The Problem with Natural Language Prompts

Most people write prompts like this: you write a big paragraph in natural language telling the model "please analyze the sentiment of this text, return positive, negative, or neutral, along with a confidence score and reasoning process."

The problems with this are the same class of problems from the assembly era and the jQuery era: control flow relies on natural language understanding rather than hard constraints, the output contract is your wish rather than the machine's promise, and the entire prompt is neither composable nor independently testable.

Your prompt says "return a sentiment field," your code waits to parse an `emotion` field — this kind of mismatch only blows up at runtime.

## Code as Prompt

Try a different approach. Use a Pydantic model directly as your prompt:

```python
class SentimentAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"] = Field(
        description="Sentiment polarity of the text"
    )
    confidence: float = Field(
        description="Confidence score for the sentiment judgment",
        ge=0.0, le=1.0
    )
    reasoning: str = Field(
        description="Reasoning process behind the sentiment judgment, "
                    "citing specific evidence from the source text"
    )
```

A single Pydantic model does three things at once:

**Type annotations are the constraint layer.** `Literal["positive", "negative", "neutral"]` isn't a suggestion — it's a hard constraint. Any output not in these three values gets rejected outright.

**Field descriptions are the semantic layer.** Each field's description tells the LLM what to fill in. Semantic specification and structural constraints live in the same place — no more "description says return a number, type says str" misalignment.

**Validators are the invariant layer.** `ge=0.0, le=1.0` defines the value range; `field_validator` defines more complex business rules.

One definition, three enforcement points. The crack between prompt and code disappears because they become the same thing.

Why Pydantic and not dataclass? Because dataclass doesn't do runtime validation. LLM output is inherently untrustworthy — without runtime validation you're just pushing the defensive responsibility one layer back. Plus Pydantic v2 natively supports `model_json_schema()`, and the exported JSON Schema happens to be the structured output format accepted by major LLM APIs.

## Schema as Workflow

There's an even more interesting layer here.

LLMs generate token by token. In structured output mode, they fill values field by field in definition order, and later fields can "see" all preceding fields' content.

So field ordering isn't just about data structure organization — it simultaneously defines the LLM's reasoning path.

```python
class DocumentAnalysis(BaseModel):
    main_topic: str = Field(
        description="The core topic discussed in the document, "
                    "summarized in one sentence"
    )
    key_claims: list[str] = Field(
        description="Key claims made in the document, "
                    "ranked by importance in descending order"
    )
    evidence_quality: Literal["strong", "moderate", "weak"] = Field(
        description="Based on the above key_claims, "
                    "assess the quality of supporting evidence"
    )
    conclusion: str = Field(
        description="Synthesizing main_topic, key_claims, "
                    "and evidence_quality, provide an overall "
                    "assessment of this document"
    )
```

Look at the wording in the descriptions: "Based on the above key_claims," "Synthesizing main_topic, key_claims, and evidence_quality" — later fields explicitly reference earlier ones. This isn't a natural language version of Chain-of-Thought. This is chain-of-thought implemented through structure.

The anti-pattern is cramming multiple tasks into one field:

```python
# Don't do this
class BadAnalysis(BaseModel):
    result: str = Field(
        description="Analyze the text's sentiment, extract product names "
                    "mentioned in it, and provide a priority judgment"
    )
```

One field doing three jobs — same logic as writing a 300-line function. Split it:

```python
class GoodAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"] = Field(
        description="Sentiment polarity of the text"
    )
    products: list[str] = Field(
        description="Product names mentioned in the text"
    )
    priority: Literal["high", "medium", "low"] = Field(
        description="Processing priority based on the above sentiment"
    )
```

One task per field. Single responsibility at the field level.

## Three Ordering Principles

Three rules of thumb for field ordering:

**Observations first, judgments in the middle, conclusions last.** Extract facts first, then analyze, then synthesize. Same way humans do analysis — look at the data before making calls.

**Dependencies before dependents.** If field B references field A, A must come first. This isn't a suggestion — it's a physical constraint of LLM token-by-token generation.

**Group by kind.** Data extraction fields together, judgment fields together. Avoid making the LLM context-switch between "extracting facts" and "making judgments."

## Not a Silver Bullet

When shouldn't you use declarative? The criterion is actually simple: can the output be enumerated, and is the structure stable?

Structured data extraction, intent classification, form parsing — bounded output, stable structure, declarative dominates. Creative writing, free conversation, brainstorming — open output, unknown structure, forcing a schema only suppresses the model's capabilities.

There's another easily overlooked boundary: model capability. Too much nesting, too many fields, too complex constraints — the model might not be able to generate compliant content. A Pydantic model's complexity shouldn't exceed the target model's capability ceiling.

At the end of the day, the shift from imperative to declarative isn't anything new. It's just that this time, what's being abstracted away isn't register allocation or DOM diffing — it's the reasoning path itself.
