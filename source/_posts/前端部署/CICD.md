---
title: CICD
date: 2025-01-21
categories:
  - 前端工程化
tags: 
share: true
---


[前端 CI/CD 入门：使用 GitHub Actions 实现自动化部署 – 大厂面试每日一题](https://q.shanyue.tech/deploy/ci-intro)

<h3 id="c5PIc">一、CI / CD流程详解</h3>CI，Continuous Integration，持续集成：是一种软件开发实践，它要求开发人员频繁地将代码集成到共享仓库中。每次集成都通过自动化构建（包括编译、发布、自动化测试）来验证，从而尽早地发现集成错误


CD，Continuous Deployment，持续部署：是在持续集成的基础上，将软件的构建、测试和部署自动化，确保代码可以随时发布到生产环境

**<font style="color:#2F4BDA;">每当我们将前端代码更新并且PUSH到仓库后，CICD将会拉取仓库代码并自动部署到服务器</font>**

<h4 id="DB8fx">1.基础概念与术语：</h4>   
- Runner：用来执行CI/CD的构建服务器
- workflow/pipeline：CI/CD的工作流
+ job：任务，比如构建、测试和部署，每个workflow/pipeline由多个job组成
- 容器化技术：容器化技术是一种软件开发方法，它将应用程序及其依赖打包到一个独立的容器中，以便在不同的环境中一致地运行。容器化技术的核心思想是将应用程序及其运行环境封装在一起，确保应用程序在开发、测试和生产环境中具有一致的行为
- 镜像：在容器化技术中，镜像是一个只读的模版，包含了运行一个容器所需的所有内容，包括代码、运行时、系统工具、系统库等。镜像是容器运行的基础，通过镜像可以创建一个或多个容器实例

<h4 id="ZIhU3">2.部署流程</h4>
1. 构建镜像
2. 推送镜像到自建的镜像仓库
3. 将镜像仓库中的镜像拉取到部署服务器进行部署

<h3 id="hoego">二、通过CI进行前端安全质量保障</h3>需要在CI中介入以下流程：
- Install：依赖安装
- Lint：保障统一的代码风格
- Test：单元测试
- Preview：生成一个供测试人员进行检查的网址

下面是一个简单的Git Workflow场景：
* 每个人在功能分支进行新功能开发，分支名 `feature-*`。每一个功能分支将会有一个功能分支的测试环境地址，如 `<branch>.dev.shanyue.tech`
* 当功能分支测试完毕没有问题后，合并至主分支 master。在主分支将会部署到生产环境
* 当生产环境出现问题时，切除一条分支 hotfix-*，解决紧急 Bug
* 功能分支提交后（CI 阶段），进行 Build、Lint、Test、Preview 等，如未通过 CICD，则无法 Preview，更无法合并到生产环境分支进行上线
* 功能分支通过后（CI 阶段），合并到主分支，进行自动化部署
* 同时也可以将CI阶段提后至PR阶段

<h4 id="YhcOe">1.任务的并行与串行</h4>在 CI 中，互不干扰的任务并行执行，可以节省很大时间。如 Lint 和 Test 无任何交集，就可以并行执行

但是 Lint 和 Test 都需要依赖安装 (Install)，在依赖安装结束后再执行，此时就是串行的

而进行串行时，如果前一个任务失败，则下一个任务也无法继续

<h4 id="VxRsG">2.更多CI检查</h4>
- Quality：使用 SonarQube 检查代码质量
- Container：使用 trivy 扫描容器镜像安全风险
- End to End：使用 Playwright 进行 UI 自动化测试
- Bundle Chunk Size Limit：使用 size-limit 限制打包体积，打包体积过大则无法通过合并
- Performance：使用 lighthouse CI 为每次 PR 通过 Lighthouse 打分，如打分过低则无法通过合并

<h4 id="XpuLQ">3.与Git Hooks的不同</h4>它们的最大的区别在于一个是客户端检查，一个是服务端检查。而客户端检查是天生不可信任的

而针对 git hooks 而言，很容易通过 git commit --no-verify 而跳过

最重要的是，CI 还可对部署及其后的一系列操作进行检查，如端对端测试、性能测试以及容器扫描等

<h3 id="K4Y5Z">三、CI中的缓存</h3>
在开发环境中，当我们使用webpack5进行构建时，如果使用了filesystemcache，因为在磁盘中含有缓存（node_modules/.cache），二次构建往往比以此构建快速十几倍
而在CICD中，这些都失去了意义，因为CICD每次Job都相当于新建了一个目录，每次构建都相当于是首次构建
但是CI提供了一些缓存机制可以讲一些资源进行缓存

如果可以对node_modules进行缓存，有两个好处
- 假设没有新的package需要安装，则无需再次安装
- 假设存在新的package需要安装，仅仅会安装变动的package

在Github Actions中，可以通过Cache Action来进行缓存
- path：指定需要缓存的目录
- key：根据key进行缓存，如果存在相同的key，则为命中。在Github Actions中可以利用函数hashFiles针对文件计算其hash值

如果不想缓存node_modules，可以缓存npm/yarn/pnpm全局缓存目录
### 四、CI中的环境变量
CI作为与Git集成的工具，其中注入了诸多与Git相关的环境变量
![](img/posts/Pasted%20image%2020250125234044.png)
在Github Actions中，可以通过env设置环境变量
![](img/posts/Pasted%20image%2020250125234141.png)
不同的CI产品会在构建服务器中自动注入环境变量
而测试、构建等工具均会根据环境变量判断当前是否在CI环境中，如果在则执行更为严格的校验

#### 构建功能分支测试环境

从项目开发到上线，一般划分为三个环境
1. 本地环境：面向对象主要是开发者
2. 测试环境：本地业务迭代开发结束并交付给测试进行功能测试的环境，面向对象主要是测试人员
3. 生产环境：线上供用户使用的环境

我们在构建服务器中，可通过环境变量  `CI_COMMIT_REF_SLUG` 获取到当前仓库的当前分支，基于分支名称进行功能分支环境部署

1. 借用现有的CICD服务获取到当前分支信息
2. 借用Doker快速部署前端或者后端，根据分支信息启动不同的服务，根据Docker启动服务并配置标签
3. 根据容器的标签与当前Git分支对前端后端设置不同的域名

以下是一个基于github actions的分支部署的简单示例
```
# 为了试验，此处作为单独的 Workflow，在实际工作中可 Install -> Lint、Test -> Preview 串行检验
name: Preview
# 执行 CI 的时机: 当 git push 到 feature-* 分支时
on: 
	push: 
		branches: 
			- feature-*
# 执行所有的 jobs
jobs：
	preview：
		# 该 Job 在自建的 Runner 中执行 
		runs-on: self-hosted 
		environment:
			# 获取 CICD 中的变量: Context 
			name: preview/${{ github.ref_name }} 
			url: https://${{ github.ref_name }}.cra.shanyue.tech
		steps：
		# 切出代码，使用该 Action 将可以拉取最新代码 
			- uses: actions/checkout@v2 
			- name: Preview 
				- run: | 
				- cat preview.docker-compose.yaml | envsubst > 
				- docker-compose.yaml 
				- docker-compose up --build -d cra-preview-${COMMIT_REF_NAME}
				env：
				COMMIT_REF_NAME: ${{ github.ref_name }}
```


### 五、CICD工具
- Jenkins：开源免费，社区活跃，但是配置较复杂，需要自己搭建服务器
+ GitLab CI：与GitLab深度集成，配置简单，但是插件生态不如Jenkins
+ GitHub Actions：与GitHub深度集成，社区活跃，配置灵活