# 小米AI Agent三轮技术面试完整题库

# 小米 AI Agent 三轮技术面试完整题库

## 面试感受

这岗位确实偏难，AI 工程 \+ Java 后端 \+ Harness 设计都要问。面试官要是揪着 LangGraph checkpoint 或 Harness 层设计深挖，答不出细节容易挂 —— 没亲手搭过就说学过，别硬编。基础（线程池 / Redis/MySQL）也不能放水，这是底线。整体节奏快，三轮下来挺耗神，扛住了基本就稳。自信讲你做过的东西，别被他绕进名词堆里。

# 一面

1. 自我介绍

2. 介绍你做过的最复杂的 AI Agent 或相关项目

3. Java 中线程池的 corePoolSize、maximumPoolSize、keepAliveTime、workQueue 各自作用，提交 10 个任务时完整执行流程是怎样的

4. Redis 常用的数据结构及典型使用场景，如何用 Redis 做分布式锁，如何解决锁过期但任务未执行完的问题

5. MySQL InnoDB 的 MVCC 原理，RR 隔离级别下如何避免幻读

6. 什么是 AI Agent，ReAct 范式（Thought\-Action\-Observation）的完整执行流程请描述

7. 意图识别在 Agent 系统中怎么做？用规则 / NLU 分类器和用 LLM Few\-Shot 分类各有什么优劣，如何防意图漂移

8. LangChain 的核心组件（Model/Prompt/Chain/Memory/Tool/Agent）分别解决什么问题

9. LangChain 的 AgentExecutor 执行 Tool Calling 的底层流程，max\_iterations 设多少合理，如何防止死循环

10. RAG 的基础流程，Naive RAG 有哪些缺陷，你们怎么做的 Chunk 切分策略和 Overlap 设置

11. 你平时通过哪些渠道跟进 AI 工程化前沿（论文 / 开源 / GitHub / 技术博客），最近印象最深的一篇讲什么

12. 如果公司要求你把单体 Agent 服务改造成支持千级 QPS 的生产级服务，你会关注哪些点（并发 / 状态隔离 / 熔断 / 灰度）

13. 手撕算法：LeetCode 200 Number of Islands—— 给你一个 '1'\(陆地\)'0'\(水\) 的二维网格，求岛屿个数

# 二面

1. 自我介绍

2. 结合你的 Agent 项目，讲整体架构分层（入口 / 意图 / 规划 / 执行 / 工具 / 记忆 / 观测）

3. LangGraph 相比 LangChain AgentExecutor 的优势，为什么说 LangGraph 更适合复杂多步 Agent

4. LangGraph 中 StateGraph 的 State 如何定义，Reducer 的作用是什么，多个节点并发写同一 State 字段怎么处理

5. LangGraph Checkpointer（checkpoint）持久化到 Redis 或 DB 的实现方式，中断后如何从指定节点恢复

6. 多 Agent 协作常见模式（Supervisor\-SubAgent / Pipeline / Parallel / Debate），你们项目用了哪种，为什么

7. Supervisor 模式下子 Agent 结果如何汇总合并（Reducer/Merge 策略），如何处理子 Agent 超时或返回异常

8. Agent Harness 工程层是什么，和直接用 LangGraph 比有哪些额外职责（限流 / 审计 / 降级 / 全链路 Trace）

9. Function Calling / Tool Use 的 JSON Schema 如何做参数校验，工具执行失败如何设计重试和降级策略

10. Agent 长会话上下文超限怎么处理 —— 摘要压缩、滑动窗口、向量记忆各自的适用场景

11. 如何设计 Human\-in\-the\-Loop（人工审核节点），哪些工具调用必须走审批，如何在 LangGraph 中实现 interrupt

12. 手撕算法：LeetCode 394 Decode String—— 字符串解码，如 3 \[a2 \[c\]\] = accc

13. RAG 中 Hybrid Search（向量 \+ 关键词）和 Rerank（重排）模型的作用，如何评估 RAG 回答质量

14. 简述 Agent 工作流（Workflow）与自主 Agent 决策的区别，什么场景用写死工作流而非让 LLM 自由规划

15. 手撕算法：LeetCode 146 LRU Cache—— 设计一个满足 LRU 淘汰策略的缓存，get 和 put 均为 O \(1\)

# 三面

1. 自我介绍

2. 项目中你们遇到最难解决的 Agent Bad Case 是什么，怎么定位、归因并最终修复的

3. 如果让你带 2\~3 人做 Agent 模块，你怎么拆分任务、定里程碑和 Code Review 标准

4. 当产品经理要求 Agent 支持一个模糊的新能力而工期很紧，你如何评估风险和给出技术方案

5. 你们项目中对 Agent 的观测性（Observability）怎么做的 ——Trace/Token 统计 / 工具成功率 / BadCase 回流

6. RAG 召回率低时你的排查和优化思路（Query Rewrite / HyDE / Multi\-Query / 扩大 Top\-K / Rerank）

7. Self\-RAG 或 Corrective RAG 的思路，如何让 Agent 自主判断检索结果是否相关并决定重检索

8. MCP（Model Context Protocol）了解吗，它与传统 Tool Calling 封装的本质区别

9. 说一个你近期自学的 AI 相关新技术（如新模型 / 新框架 / 新论文方向），你怎么快速判断是否值得引入项目

10. 你平时通过哪些渠道跟进 AI 工程化前沿

# HR 面

1. 自我介绍

2. 为什么想来小米做 AI Agent 方向，对小爱同学或小米 AI 生态有什么了解

3. 你期望的薪资范围，以及你基于什么考量提这个数

4. 你最不能接受的团队管理方式或工作环境是什么

5. 过去项目中跟同事或 PM 发生过意见分歧吗，怎么处理的

6. 未来 3 年你的职业规划，倾向深耕 AI 工程还是往架构 / TL 方向发展

7. 你还有什么想问我们的（团队规模 / 模型迭代频率 / Agent 落地场景等）

---

我可以把这份文档整理成**可直接复制的 Markdown 文件**，或者按一面 / 二面 / 三面 / HR 面拆分，每个题目补充标准面试参考答案，你需要吗？

> （注：部分内容可能由 AI 生成）
