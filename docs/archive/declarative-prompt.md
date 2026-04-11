---
title: 汇编→C→SQL→React→……Prompt？
date: 2026-04-11 14:00
---

# 汇编→C→SQL→React→……Prompt？

软件工程史上有个反复出现的剧情：从命令式到声明式。

汇编到 C，jQuery 到 React，Makefile 到 Terraform——每次都在做同一件事：把"怎么做"的负担甩给系统，开发者只管说"要什么"。旧范式没有消失，只是退守到需要精细控制的角落。

Prompt 工程正在走同一条路。

## 自然语言 prompt 的问题

大多数人写 prompt 的方式是这样的：你用自然语言写一大段话，告诉模型"请分析这段文本的情感倾向，返回 positive、negative 或 neutral，同时给出置信度评分和推理过程"。

这段话的问题和汇编时代、jQuery 时代的问题是同一类：控制流靠自然语言理解而不是硬约束，输出契约是你的愿望而不是机器的承诺，整段 prompt 不可组合也没法单独测试。

你的 prompt 说"返回一个 sentiment 字段"，你的代码等着解析 `emotion` 字段——这种不一致只在运行时炸给你看。

## Code as Prompt

换个思路。把 Pydantic 模型直接当 prompt 用：

```python
class SentimentAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"] = Field(
        description="文本的情感倾向"
    )
    confidence: float = Field(
        description="情感判断的置信度",
        ge=0.0, le=1.0
    )
    reasoning: str = Field(
        description="得出该情感判断的推理过程，引用原文中的具体证据"
    )
```

一个 Pydantic 模型同时干了三件事：

**类型注解是约束层。** `Literal["positive", "negative", "neutral"]` 不是建议，是硬约束。不在这三个值里的输出直接被拒。

**Field description 是语义层。** 每个字段的 description 告诉 LLM 这个字段该填什么。语义说明和结构约束放在同一处，不会出现"description 说返回数字，类型却是 str"的错位。

**Validator 是不变量层。** `ge=0.0, le=1.0` 定义值域，`field_validator` 定义更复杂的业务规则。

一次定义，三处生效。prompt 和代码之间的那条裂缝消失了，因为它们变成了同一个东西。

为什么是 Pydantic 不是 dataclass？因为 dataclass 不做运行时验证。LLM 的输出天生不可信，没有运行时验证等于把防守责任往后推了一层。而且 Pydantic v2 原生支持 `model_json_schema()`，导出的 JSON Schema 刚好是主流 LLM API 接受的结构化输出格式。

## Schema as Workflow

这里还有一层更有意思的事。

LLM 逐 token 生成。结构化输出模式下，它按字段定义顺序逐个填值，后面的字段能"看到"前面所有字段的内容。

所以字段排列顺序不只是数据结构的组织方式——它同时定义了 LLM 的推理路径。

```python
class DocumentAnalysis(BaseModel):
    main_topic: str = Field(
        description="文档讨论的核心主题，用一句话概括"
    )
    key_claims: list[str] = Field(
        description="文档中提出的关键主张，按重要性降序排列"
    )
    evidence_quality: Literal["strong", "moderate", "weak"] = Field(
        description="基于上述 key_claims，评估论证证据的质量"
    )
    conclusion: str = Field(
        description="综合 main_topic、key_claims 和 evidence_quality，"
                    "给出对这篇文档的整体评价"
    )
```

注意看 description 里的措辞："基于上述 key_claims""综合 main_topic、key_claims 和 evidence_quality"——后面的字段显式引用前面的字段。这不是 Chain-of-Thought 的自然语言版本，这是用结构实现的思维链。

反面教材是把多个任务塞进一个字段：

```python
# 别这么干
class BadAnalysis(BaseModel):
    result: str = Field(
        description="分析文本的情感倾向，提取其中提到的产品名称，"
                    "并给出处理优先级判断"
    )
```

一个字段干三件事，跟写一个三百行的函数一个道理。拆开：

```python
class GoodAnalysis(BaseModel):
    sentiment: Literal["positive", "negative", "neutral"] = Field(
        description="文本的情感倾向"
    )
    products: list[str] = Field(
        description="文本中提及的产品名称"
    )
    priority: Literal["high", "medium", "low"] = Field(
        description="基于上述 sentiment 判断的处理优先级"
    )
```

每个字段一个任务，字段级的单一职责。

## 三条排列原则

字段怎么排，有三条经验：

**观察在前，判断在中，结论在后。** 事实提取先做，分析推理其次，综合输出最后。跟人做分析的思路一样——先看数据再下判断。

**依赖在前，被依赖在后。** 字段 B 引用了字段 A，A 就得排前面。这不是建议，是 LLM 逐 token 生成的物理约束。

**同类聚合。** 数据提取字段放一起，判断字段放一起。避免让 LLM 在"提取事实"和"做判断"之间来回切换。

## 不是银弹

什么时候不该用声明式？判断标准其实很简单：输出能不能穷举，结构稳不稳定。

结构化数据提取、意图分类、表单解析——输出有界、结构稳定，声明式碾压。创意写作、自由对话、头脑风暴——输出开放、结构未知，强行套 schema 只会压制模型的发挥。

还有一个容易忽略的边界：模型能力。嵌套太深、字段太多、约束太复杂，模型可能生成不出合规的内容。Pydantic 模型的复杂度不应该超过目标模型的能力上限。

说到底，从命令式到声明式不是什么新鲜事。只是这次被抽象掉的不是寄存器分配或 DOM diff，而是推理路径本身。
