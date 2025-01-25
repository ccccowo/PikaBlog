---
title: AI Agent
date: 2025-01-23
categories:
  - 技术视野
tags:
  - Agent
share: true
---
[喜迎2025，AI Agent技术栈全解析！](https://mp.weixin.qq.com/s/z3zDRGLSP65aCVNKOF9DsA)

### Agent是什么
Agent：能够自主行动、执行任务，并与外部工具交互的LLM
Agent不仅仅是一个会聊天的大模型，他们更像具备一定自主性的智能体。他们需要管理自己的状态（对话历史和记忆）、调用各种工具，并且安全执行

### Agent技术栈的关键组成部分
![|400](img/posts/Pasted%20image%2020250125175141.png)
##### 模型服务：AI的大脑
- 核心：LLM
- 主要玩家
	- 闭源模型：OpenAI和Anthropic
	- 开源模型
	- 本地部署：vLLM成为生产级GPU服务的主流选择，而Ollama深受个人爱好者的喜爱
##### 存储：记忆的基石
![|400](img/posts/Pasted%20image%2020250125175127.png)
- 核心：持久化状态，如对话历史、记忆和外部数据
- 关键技术
	- 向量数据库：Chroma、Weaviate等用于存储agent的外部记忆，应对大容量数据
	- 传统数据库：Postgres通过pgvector扩展也开始支持向量搜索

##### 工具与库
![](img/posts/Pasted%20image%2020250125175401.png)
- 核心：使agent能够执行各种任务的工具或者函数
- 调用方式：通过LLM生成的结构化输出指定要调用的函数和参数
- 安全执行，使用沙箱（Modal和E2B）来确保工具执行的安全性
- 工具生态
	- 通用工具库：Composio等
	- 专用工具：Browerbase（网页浏览）、Exa（网页搜索）等
##### Agent框架：编排智能的指挥中心
![](img/posts/Pasted%20image%2020250125175657.png)
- 核心：负责编排LLM调用，管理agent状态
- 关键特性：
	- 状态管理：如何保存和加载agent状态，例如对话历史和记忆
	- 上下文窗口：如何将状态信息编译到LLM的上下文窗口中
	- 跨agent通信：如何实现多agent之间的协作
	- 内存管理：如何应对LLM有限的上下文窗口，管理长期记忆
	- 开源模型支持：如何让agent更好地利用开源模型