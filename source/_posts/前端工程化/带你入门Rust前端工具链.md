---
title: 带你入门Rust前端工具链
date: 2025-01-20 19:28:00
categories:
  - 前端工程化
tags:
  - Rust
---

# 1. 前言

都说Rust是前端工具链的未来，为什么呢？因为使用Rust编写的工具是真的快

首先我们先来看看如今有哪些基于Rust来编写的前端工具链

# 2. 基于Rust的工具链

## 2.1 SWC

<https://swc.rs/>

你可以将SWC看成是使用Rust重写的Babel，一个将 ES6 转化为 ES5 的工具，但是SWC的速度远远高于Babel

SWC的官网是这样说的：“SWC在单线程上**比 Babel 快 20 倍**，在四核上**快 70 倍。**”

*SWC* 与 *Babel* 一样，将命令行工具、编译核心模块分化为两个包

*   `@swc/cli` 类似于 `@babel/cli`;
*   `@swc/core` 类似于 `@babel/core`;

并且SWC 与  Babel 一样，支持类似于 `.babelrc` 的配置文件：`.swcrc`，配置的格式为 JSON

## 2.2 Rspack

<https://rspack.dev/>

Rspack是字节开源的基于Rust开发的快速web构建工具，它的底层是基于*SWC*实现代码编译的， Rspack几乎完美兼容了webpack生态，它与webpack生态系统具有很强的兼容性，可以无缝替换webpack，并提供闪电般的构建速度

## 2.3 Oxc

<https://oxc.rs/>

Oxc是用Rust编写的JavaScript语言高性能工具集合，重点是构建JavaScript的基本编译器工具：*Parser*、*Linter*、*Resolver*、*Transformer*、*Minifier*、*Formatter*，并且有着极快的速度

## 2.4 Rolldown

<https://rolldown.rs/>

Rolldown是基于Rust开发的的JavaScript打包工具，可以看成一个范围更大的Rust版本的Rollup，并且最终将会整合到Vite中

而Rolldown的重点则是性能，将会尽力与Rollup API兼容，目标是在对用户影响最小的情况下，在Vite上切换到Rolldown

Rolldown 是基于字节跳动的 [**Oxc**](https://link.juejin.cn/?target=https%3A%2F%2Foxc-project.github.io) 工具集合构建的，它提供与 Rollup 兼容的应用程序接口和插件接口，但在范围内更类似于 esbuild，其内部架构也更接近于 esbuild 而不是 Rollup，代码块拆分逻辑最终可能会与 Rollup 的不同

## 2.5 Turbopack

<https://nextjs.org/docs/app/api-reference/turbopack>

Turbopack是一个针对JS和TS优化的增量捆绑器，由Vercel的webpack和Next.js的创建者用Rust编写

性能卓越的原因：

*   高度优化的机器代码
*   低级增量计算引擎

## 2.6 Deno

<https://deno.com/>

Deno使用Rust编写，是一个Javascript的运行时平台，Deno旨在解决Node.js中存在的一些问题和设计缺陷。Deno2与Node.js和npm向后兼容，允许无缝运行现有的Node应用

*   默认支持ES Modules
*   默认支持TS
*   尽可能兼容Web标准APIs
*   提供稳定的标准库

## 2.7 Tauri

基于Rust构建的桌面端应用，能够充分利用Rust提供的内存、线程和类型安全，基于Tauri构建的应用程序可以自动获得这些优势，在：小、快、安全三个方面，Tauri都优于Electron

## 2.8 未来的postcss

对CSS的编译同样也可以使用Rust去做，就像pstcss-rs这个库，性能方面肯定远超JS编写的postcss，目前处于建设阶段

# 3. Rust和WebAssembly

那么为什么使用Rust编写的工具普遍要比使用JS编写的工具快呢，首先让我们先了解一下WebAssembly

## 3.1 WebAssembly是什么

WebAssembly（wasm）是一种低级汇编语言，采用紧凑的二进制格式，其运行性能接近原生语言。WebAssembly可以在现代浏览器中运行，不仅提供了比传统JS更高的执行速度，还能更好地利用硬件资源，从而使Web应用程序能够在浏览器中运行更快、更流畅

简单来说：WebAssembly 能够把非 JavaScript 代码运行在浏览器中，这些代码可以是C、C++、Rust等等
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/9562c27bd60840e492f6c5b0bd1a9947~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977240&x-orig-sign=1lh6WZSAvpu5zFawdPbHT4qsAa0%3D)

## 3.2 WebAssembly的工作原理

**WebAssembly 为非JS语言提供了一种在网络平台上，以接近本地速度运行的方式**

我们应该如何来理解上面的话呢

首先我们可以将Web平台看成两个部分：

*   VM：用于运行Web应用代码，例如JS引擎运行JS代码
*   Web API：例如DOM、CSSOM、WebGL等

在以前，VM 只能加载 JS 运行，JS 可能足够满足我们的需求，但如今JS会有各种各样的原生性能的领域，比如3D 游戏、VR/AR、图片/视频编辑等，并且下载和解析体积比较大的JS是很困难的

随着 WebAssembly 的出现，上述提到的 VM 现在可以加载两种类型的代码执行：JavaScript 和 WebAssembly

虽然同样运行在浏览器中，但是 WebAssembly 不是用来替代 JavaScript 的，他们其实是相辅相成的

WebAssembly 会被编译进你的浏览器，在你的 CPU 上以接近原生的速度运行。你可以直接在 JavaScript 中将它们当作模块来用。也就是说，你可以通过 WebAssembly来充分利用编译代码的性能，同时保持 JavaScript 的灵活性

JavaScript 是高层次的语言，灵活且极具表现力，动态类型、不需要编译步骤，并且有强大的生态，非常易于编写 Web 应用。

WebAssembly 是一种低层次的汇编语言，使用一种紧凑的二进制格式，能够以近乎原生的性能运行，并提供了低层次的内存模型，是 C++、Rust 等语言的编译目标，使得这类语言编写的代码能够在 Web 上运行

## 3.3 Wasm为什么比JS快

在了解来什么是WebAssembly以及它的工作原理之后，让我们言归正传：为什么使用Rust编写的工具普遍要比使用JS编写的工具快呢？其实就是Wasm为什么在Web中比JS要快

下图是JS在Web中被解析执行的过程

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/929a449206f54c5699309446ed11bd2a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977240&x-orig-sign=yklxgtFkCHGkU5PjgUBMbEA4eyg%3D)

解析（parse）、编译+优化（compile + optimize）、重新优化（re-optimize）、执行（execute）、垃圾回收（garbage collection）

而下图是Wasm在Web中被解析执行的过程

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/17bf58ac14c046a5b9cd7db71337e925~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977240&x-orig-sign=7CyvmB714oQ4G5TYovN3GL0p1FU%3D)

解码（parse）、编译+优化（compile + optimize）、执行（execute）

因为Wasm的特性和它特殊的格式，在很多情况下，Wasm比JS要快，有下面几点原因

*   获取Wasm花费的时间更少，因为它比JS更紧凑，特有的二进制格式有效地减小了包的体积，进一步提升了浏览器的加载速度
*   编译和优化，因为Wasm更接近机器代码
*   不需要重新优化，因为Wasm内置了类型和其他信息，由此JS引擎不需要去推测它
*   执行通常需要更少的时间，因为Wasm的指令集更适合机器
*   由于内存是手动管理的，由此不需要垃圾收集

但是Wasm在操作 Dom上比 JS慢了不少，所以在 Wasm中建议不要有原生操作，主要慢在了与js交互的过程。所以请在涉及复杂、大量计算中再使用它

## 3.4 Rust为什么更适合编写WebAssembly

那么为什么是Rust，而不是其他语言呢？

因为Rust被认为是编写WebAssembly的一种理想语言，主要是因为它的设计特点使其与WebAssembly的目标和优势高度契合

*   内存安全：Rust是一门强调内存安全的系统编程语言。它通过引入所有权、借用和生命周期等概念，可以在编译时预防多种常见的内存错误，如空指针、数据竞争等。这在WebAssembly中非常有价值，因为WebAssembly应用程序会与浏览器的内存模型交互，需要确保安全性
*   零成本抽象：Rust提供了高级抽象（如高级数据结构、模式匹配等），而且这些抽象在编译时会被优化为高效的底层代码，这意味着你可以在不牺牲性能的前提下编写可维护且易于理解的代码
*   跨平台支持：Rust支持多个平台，并且可以将代码编译成多种目标架构的二进制文件。这使得使用Rust编写的WebAssembly代码可以在不同的浏览器和平台上运行，而无需太多适配工作
*   与WebAssembly集成：Rust拥有良好的WebAssembly支持，可以直接通过工具链将Rust代码编译成WebAssembly模块。这种集成使得将现有的Rust代码移植到WebAssembly变得相对容易

# 4. 使用Rust

Rust这么好，我们应该如何在浏览器环境或者Node.js环节中使用它来编写代码，提升速度呢，以下让我们简单来看几个工具

## 4.1 wasm-pack

该工具致力于构建和使用rust生成的Web Assembly，可以将rust代码编译成wasm模块，再通过js引入。能够在Node.js和浏览器环境运行

## 4.2 webpack支持wasm模块

webpack4中：使用wasm-module-webpack-plugin插件

webpack5中：内置了属性

## 4.3 napi-rs

这个库可以说是Rust前端工具链的基石，搭建了Node.js和Rust之间语言通信的桥梁

# 5. 结语

如今Rust已经是一门大火的，从内核操作系统一直写到前端，性能依旧很强的语言。笔者已经将学习Rust规划入了之后的学习计划中

总有人折腾着在找未来的路，在现在看来，Rust也许算是未来前端基建的路

参考：

*   [你知道WebAssembly吗？](https://juejin.cn/post/7194623444749647929?searchId=202308141805115660B59C21DBC21103E0 "https://juejin.cn/post/7194623444749647929?searchId=202308141805115660B59C21DBC21103E0")
*   [ 前端基建的未来？带你入门开发 Rust 前端工具链！ ](https://juejin.cn/post/727015299716543287)
