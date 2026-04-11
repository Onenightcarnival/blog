---
title: 为什么我很少用框架
date: 2026-04-11 18:00
---

# 为什么我很少用框架

做 LLM 应用这两年，LangChain、LangGraph、CrewAI、Dify 这些东西我基本都没碰过。不管是做 agent 还是 workflow，我就 instructor 加 OpenAI SDK 打天下。

这不是偶然。我自己做过框架——之前在大厂主导设计过 Python 版类 Spring 框架——所以很清楚框架能帮你做什么、不能帮你做什么。框架的价值在于统一那些真正有共性的东西。而 LLM 应用里那些看起来很唬人的概念，拆开看既不复杂，也不通用。

## 那些概念都只是函数组合

记忆？维护一个列表，把历史对话塞进去，下次调用带上。

RAG？调用前查一下相关信息，塞进上下文。

ReAct？让模型先想再选工具，调完把结果喂回去继续。

Agent？LLM + 工具调用 + 一个循环。

每一个拆开看都是几个函数的事。它们在论文里有名字，是因为学术界需要给范式命名。写到业务代码里，就是列表操作、一次查询、一个 while。

但"agent 框架"听起来比"LLM 函数库"高大上太多了。对投资人讲故事、对市场做包装，"我们做了一个 agent 编排平台"比"我们封装了几个 API 调用"性感得多。很多框架的复杂性不是技术驱动的，是叙事驱动的。

## 没有统一做法

框架的预设是这些概念有最佳实践可以抽象。但实际上每个场景都不一样。

客服场景的"记忆"是最近 10 轮对话。代码助手的"记忆"是整个项目的文件树。分析助手的"记忆"是中间计算结果。三种东西名字一样，实现完全不同。

法律场景的"RAG"要精确匹配条款编号。技术文档的"RAG"要语义相似度。客服知识库的"RAG"要意图分类后定向查找。你没法写一个通用 Retriever 覆盖这三种。

Agent 什么时候该停？有的一轮就完事，有的要迭代到收敛，有的要人审批。终止条件是 agent 最关键的设计决策，也恰恰是最不可能通用化的部分。

就像"人"没有模板——你不能定义一套通用人类行为框架然后靠配参数生成不同的人。agent 也一样，每个 agent 的灵魂是它独特的业务逻辑，不是框架提供的骨架。

## instructor 打天下

看几个场景用 instructor 做是什么样。

**客服意图路由**——模型判断意图，代码分发处理：

```python
class CustomerIntent(BaseModel):
    category: Literal["退款", "物流", "投诉", "咨询"] = Field(
        description="客户消息的意图分类"
    )
    urgency: Literal["高", "中", "低"] = Field(
        description="基于上述 category 和消息语气判断紧急程度"
    )
    extracted_order_id: Optional[str] = Field(
        description="消息中提到的订单号（如有）"
    )
```

意图识别、紧急程度判断、实体提取，一个模型搞定。拿到结果之后 if/else 分发到不同处理函数。这就是所谓的"意图路由 agent"。

**投研分析**——从研报里提取结构化信息：

```python
class ResearchExtraction(BaseModel):
    ticker: str = Field(description="股票代码")
    revenue_growth: Optional[float] = Field(
        description="营收同比增长率，原文未提及则为 null"
    )
    risk_factors: list[str] = Field(
        description="报告中提及的主要风险因素",
        max_length=5
    )
    bull_case: str = Field(
        description="基于上述信息总结看多逻辑"
    )
    bear_case: str = Field(
        description="基于上述信息总结看空逻辑"
    )
```

字段顺序就是推理路径——先提取事实，再给判断。这就是所谓的"声明式思维链"，不需要在 prompt 里写"请先做 A 再做 B"。

**带工具的 agent**——需要循环的场景：

```python
class Step(BaseModel):
    thinking: str = Field(description="分析当前状态，决定下一步")
    action: Literal["query_db", "call_api", "finish"] = Field(
        description="基于上述 thinking 选择动作"
    )
    action_input: str = Field(description="动作的输入")

async def run(task: str):
    history = [{"role": "user", "content": task}]
    for _ in range(10):
        step = await instructor_call(history, Step)
        if step.action == "finish":
            return step.action_input
        result = await tools[step.action](step.action_input)
        history.extend([
            {"role": "assistant", "content": step.model_dump_json()},
            {"role": "user", "content": f"结果：{result}"}
        ])
```

`thinking` 在前 `action` 在后，模型先想再选。工具选择是类型约束不是自然语言祈祷。循环就是个 for，退出就是 `"finish"`。这就是全部的 agent 了。

三个场景，没有 Chain、Graph、Node、Edge、Crew、Role、Canvas。就是 Pydantic 模型加普通 Python 代码。

## 框架解决的是谁的问题

不知道怎么组织 LLM 代码的人。框架给你一个现成的结构，告诉你代码往哪放，这对新手有价值，对快速跑通 demo 有价值。

但如果你清楚那些概念背后就是函数组合，而且每个场景的组合方式都不一样——框架那层抽象就是纯开销。你得学它的概念体系，受它的架构约束，出了问题还得穿透它的抽象层去定位。

真到了需要复杂编排的时候——超过 10 步的工作流、持久化状态、分布式执行——该用的是 Temporal、Prefect 这种通用编排工具，不是 LLM 专属框架。

最简单的能跑的方案就是最好的方案。不是因为简单有什么美德，是因为你以后要改它、调试它、教别人理解它。每多一层抽象，这些事都变难一点。
