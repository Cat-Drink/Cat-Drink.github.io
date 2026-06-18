# 字节本地生活AI Agent（Golang）面试全题库

# 字节本地生活 AI Agent（Golang）面试全题库

## 面试感受

这面试真挺硬核的，尤其二三面 Harness \+ 多 Agent \+ Go 并发追问，别被唬住。面试官会区分 demo 选手和工程落地选手，回答时要结合生产痛点：超时、重试、checkpoint、成本、RAG 坏 case 优化，细节越具体越加分。
答不出不要编造，可以坦诚说明：“这块我了解不深，但我推测方向是 xxx，后续会主动补齐相关知识”，面试官比较认可坦诚 \+ 主动学习的态度。
手撕算法不要紧张，先口述完整思路，再写代码。整体如实讲解自身项目经历，放松表达即可。

---

# HR 面 8 道题

1. 自我介绍

2. 为什么想来字节做本地生活 AI Agent，你对这个赛道方向怎么看

3. 你最不能接受的公司 / 团队文化是什么

4. 你的期望薪资范围，当前 base、期权完整情况

5. 讲一个你和 PM / 上游团队需求冲突，最后成功推进落地的完整事例

6. 如果你的 Agent 项目上线后数据效果远不达预期，被上级质疑，你会怎么应对

7. 未来 2\-3 年你的深耕路线：偏向技术专家路线，还是团队带人管理路线

8. 你有什么想问面试官 / 团队的问题

---

# 一面 10 道题

1. 自我介绍

2. 介绍你做过最复杂的 AI 业务项目，重点拆解 Agent 相关模块、落地难点

3. Golang goroutine GMP 调度模型；对比操作系统线程；哪些场景会导致 goroutine 泄漏

4. Golang channel 无缓冲 / 有缓冲区别；channel close 后继续发送会 panic 吗；如何优雅退出 goroutine

5. 用户 query：“我找附近人均 50 左右好吃的川菜馆，最好能订座”，本地生活场景下如何做意图识别 \+ 槽位填充（Slot Filling）；方案选型：NER 分类 / 微调模型 / 原生 LLM 分别怎么落地

6. 使用 LLM 做意图识别时，如何设计 System Prompt 强制输出标准 JSON；模型乱输出、格式错乱怎么兜底处理

7. RAG 完整全链路流程；文档切片 chunk 大小、重叠窗口怎么选择；chunk 过大 / 过小分别会带来什么问题

8. 你使用过的向量数据库（Milvus/Chroma/Faiss）；相似度度量余弦相似度 / 内积的区别，适用场景

9. LangChain 和 LangGraph 核心差异；为什么 LangGraph 更适合多步 ReAct 类型 Agent

10. LangGraph 中 State / Node / Edge / Conditional Edge 各自解决什么核心问题；Checkpointer 组件作用

## 一面附加手撕算法

LeetCode 中等：有效括号匹配（栈实现），扩展实现最长有效括号长度（LC32）

---

# 二面 7 道核心技术题

1. 自我介绍

2. 详细讲解你项目中**多 Agent 协作架构**：Supervisor/Orchestrator\-SubAgent、Pipeline、Swarm 三种模式，你选择了哪一种，选型理由

3. 多 Agent 系统如何避免子 Agent 重复执行同一任务；如何保证业务最终一致性；任务幂等性怎么设计

4. Harness Engineering 定义；Agent Harness 层完整职责：调度、超时熔断、上下文注入、可观测埋点、错误隔离

5. LangGraph 如何实现 Human\-in\-the\-loop 人工介入；中断恢复 Checkpoint 机制；会话状态序列化存储介质选型

6. 多轮对话意图识别如何维护上下文；用户中途切换需求（例如 “算了我要找日料”）怎么识别、平滑切换意图

7. RAG 检索结果质量差的优化方案：Query Rewriting、HyDE、Multi\-Query、Cross\-Encoder 重排，讲你落地过的方案

## 二面附加手撕算法

给定字符串数组，找出所有字符串的最长公共前缀；两种实现思路：Trie 字典树 / 横向扫描，口述思路 \+ Golang 完整代码

---

# 三面 15 道深度工程题

1. 自我介绍

2. 项目中最难的 Agent 技术难点是什么，完整解决流程；如果重新设计，你会优化哪些地方

3. 本地生活场景 Agent 调用第三方 POI / 团购 / 订单接口，工具调用失败、返回异常脏数据如何处理；完整降级策略

4. 本地生活意图识别、RAG 问答效果完整评测体系：

    - 离线指标：Precision、Recall、EM 精确匹配、BLEU

    - 线上 AB 实验完整设计方案

5. 多 Agent 系统成本控制方案：模型路由（小模型路由分发、大模型负责复杂规划）、语义缓存 Semantic Cache、提前终止推理策略

6. 字节内部 Go AI 框架（Eino/CloudWeGo）了解；如果用 Golang 自研一套类 LangGraph Graph 编排引擎，核心结构如何设计

7. MCP \(Model Context Protocol\) / Tool/Skill 注册与版本管理机制；如何防止 Skill 描述漂移，导致 LLM 工具选择错误

8. Golang interface 底层结构 itab \+ data；nil interface 和 内部携带 nil 指针的 interface 是否相等，底层原理解释

9. Golang GC 调优实战；Agent 高并发 LLM 调用服务中，频繁分配大对象会造成什么负面影响；缓解优化方案

10. 跟进过的前沿论文 / 技术：ReAct、Tree of Thoughts、Self\-RAG、AutoGen，任选其一讲核心原理、落地收获

11. 学习新框架（LangGraph/Eino）的完整路径；如何从 Demo 原型推进到线上生产可用服务

12. 推动团队用 AI Agent 改造现有搜索 / 推荐链路，如何说服 TL、业务方；项目关键风险点、应对方案

13. Golang 手撕 LRU Cache，要求 Get/Put O \(1\) 时间复杂度，支持容量淘汰

14. GraphRAG 和 普通向量 RAG 区别；是否适配本地生活知识库，原因分析

15. Golang 高并发调用 LLM API 限流方案：令牌桶、滑动窗口；熔断降级机制，防止下游拖垮整体服务

## 三面延伸技术追问

1. Agent 服务间通信：gRPC vs HTTP 选型；Protobuf 对比 JSON 优缺点

2. Elasticsearch 在本地生活搜索场景落地；分词器 IK / 自定义分词；拼音检索、同义词检索实现

3. Kafka/RocketMQ 在 Agent 系统落地场景：异步任务、审计日志、工具调用事件流；如何保证消息不丢失

4. Prompt 工程优化实战：Few\-shot、CoT 思维链、输出格式约束；LLM 无视指令如何兜底处理

5. Agent 无限循环、规划逻辑混乱的防护方案：最大执行步数限制、循环检测、Reflection 反思节点

6. Redis 在 Agent 系统中的落地场景：缓存、分布式锁、会话状态存储、分布式限流（举例说明）

7. MySQL 事务 ACID 四大特性；MVCC 底层实现原理

8. Agentic RAG 和 Naive 普通 RAG 区别；什么业务场景必须使用 Agentic RAG

9. ReAct 范式（Thought\-Action\-Observation）完整流程；对比 Plan\-and\-Execute 规划执行模式，各自适用场景

---

我可以把这份文档整理成 **可直接复制的 Markdown 纯文本**，或者导出为 Word 结构化排版，你需要哪一种？

> （注：部分内容可能由 AI 生成）
