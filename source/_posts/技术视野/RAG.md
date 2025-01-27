---
title: RAG
date: 2025-01-23
categories:
  - 技术视野
tags:
  - RAG
share: true
---
[一文搞懂RAG](https://mp.weixin.qq.com/s/r2gv2CXz17lCzuH5JamcXg)
### RAG是什么
RAG（检索增强生成），RAG是一种AI框架，它将传统信息检索系统（例如数据库）的优势与生成式大语言模型（LLM）的功能结合在一起
LLM通过将这些额外的知识与自己的语言技能相结合，可以撰写更准确、更具时效性并且更贴合具体需求的文字
RAG是一种结合信息检索、文本增强和文本生成的自然语言处理（NLP）技术

RAG的目的是通过从外部知识库检索相关信息来辅助大语言模型生成更准确、更丰富的文本内容
1. 检索：从预先建立的知识库中检索与问题相关的信息，这一步的目的是为后续的生产过程提供有用的上下文信息和知识支撑
2. 增强：RAG中增强是将检索到的信息用于生成模型的上下文输入，以增强模型对特定问题的理解和回答能力。这一步的目的是将外部知识融入生产过程中，是生成的文本内容更加丰富、准确和符合用户需求。通过增强步骤，LLM模型能够充分利用外部知识库中的信息
3. 生成：这一步的目的是结合LLM生成符合用户需求的回答。生成器会利用检索到的信息作文上下文输入，并结合大语言模型来生成文本内容

从知识库中检索出来的答案，增强了LLM的提示词（prompt），LLM用增强后的提示词生成了问题答案

### RAG所解决的问题
[人工智能的局限性：大模型面临的三大难题](https://mp.weixin.qq.com/s/-IMRLsvP6DgaT9H_pIJGjQ)
大语言模型LLM虽然厉害，但不是全能，它主要面临着三个局限性
- 知识截止：模型自身的知识完全源于它的训练数据，而现有的主流大模型的训练都是基于网络公开的数据，对一些非公开的数据无法获取，也就不具备这部分知识
- 幻觉问题：什么是幻觉问题？指大模型有时候会胡编乱造出一些看上去合理但实际不符合事实的内容。因为基本所有的AI模型的底层原理都是基于数据概率，其模型输出实际上是一系列数值计算
- 数据安全问题：对于企业来说，数据安全至关重要，没有企业愿意承担风险将私域数据上传第三方平台进行训练
但是RAG技术可以在某种程度上降低大模型上面三个局限性所带来的影响

### RAG技术架构
1. 检索模块
	- 文本嵌入：使用预训练的文本嵌入模型（如GLM）将查询和文档转换成向量表示，以便在向量空间中进行相似度计算
	- 向量搜索：利用高效的向量搜索技术（如FAISS、MiLvus等向量数据库），在向量空间中搜索与查询向量最相似的文档或段落
	- 双塔模型：检索模块经常采用双塔模型进行高效的向量化检索。双塔模型由两个独立的编码器组成，一个用于编码查询，另一个用于编码文档。这两个编码器将查询和文档映射到相同的向量空间中，以便进行相似度计算
2. 生成模块
	- 强大的生成模型：生成模型通常使用在大规模数据上预训练的生成模型（如GLM），这些模型在生成自然语言文本方面表现出色
	- 上下文融合：生成模块将检索到的相关文档与原始查询合并，形成丰富的上下文信息，作为生成模型的输入
	- 生成过程：生成模型根据输入的上下文信息，生成连贯、准确的回答