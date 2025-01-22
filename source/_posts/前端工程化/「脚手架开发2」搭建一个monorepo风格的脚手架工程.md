---
title: 「脚手架开发2」搭建一个monorepo风格的脚手架工程
date: 2025-01-20 19:32:00
categories:
  - 前端工程化
tags:
  - 脚手架
share: 
hidden: true
---

# 一、前言

上节中我们简单了解到了脚手架中的一些技术实现以及能够使用到的包，本节我们来详细讲讲为什么要使用monorepo以及如何搭建一个monorepo风格的脚手架

# 二、monorepo架构的优点

monorepo 是多个包在同一个git仓库中管理的方式，每个包都有自己的package.json文件，可以进行单独发包，主流的开源包基本都是用 monorepo 的形式管理的，使用monorepo的好处是显而易见的

一个脚手架项目中会包含多个包，），如果为每一个包都要单独创建一个git仓库的话，这些 git 仓库每个都要单独来一套编译、lint、发包等工程化的工具和配置，重复很多次，并且包越多仓库越多并且难以管理

工程化部分重复还不是最大的问题，最大的问题有下面三个

1.  首先是包互相依赖的问题，如果A依赖于B，B的代码更新之后需要重新发包，A这边也需要重新下载才能够使用到B的最新代码；确实，我们还有npm link可以使用来简化上面这个问题，但是包越多，npm link重复的越多，并且你还要根据包之间的依赖关系去link。这样一想，是不是头都大了
2.  其次是当你需要在每个包里执行命令的时候，需要分别进入到不同的目录中多次。最关键的是有一些包需要根据依赖关系来确定执行命令的先后顺序
3.  最后是版本更新的问题，在需要更新版本时，要手动更新所有包的版本，如果这个包更新了，那么依赖它的包也要手动更新发个新版本才行，这也是一件麻烦的事情并且手动更新包的版本容易出错

于是我们选择pnpm workspace + changeset方式来搭建一个monorepo风格的脚手架工程，这种方式可以很好的解决上面的问题

# 三、搭建一个monorepo风格的工程

首先我们先来了解一下管理monorepo的工具，下图是*Sacha Greif*对2024年的前端生态的一个调查统计<https://2024.stateofjs.com/zh-Hans/>
中monorepo管理工具的使用度部分
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/7cb409cd5de842aab0312b19f2383b3b~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=CtPdbjnP0%2FniH%2BnKVxHOi3kvnXg%3D)

可以看出，虽然*monorepos*尚未成为网络开发生态系统的主流，但对于那些勇于探索这一新领域的人来说，pnpm 似乎是当之无愧的领跑者

所以接下来这里我们使用pnpm来搭建monorepo风格的脚手架工程，搭配changeset来管理版本。

## 3.1 pnpm workspace 初始化项目

首先我们先使用*pnpm workspace*来初始化项目

我们先创建一个项目文件夹，我这里叫做*pika-cli*，然后进入该文件夹下执行
**pnpm init**命令来初始化项目，命令执行成功后，会在该文件夹下生成一个*package.json*文件

    mkdir pika-cli

    cd pika-cli

    pnpm init

如果你没有安装pnpm的话就需要先安装一下

    npm install -g pnpm

**pnpm** 是使用 **workspace** (工作空间) 来搭建一个 **monorepo** 风格的工程

所以*pnpm init*命令之后，我们需要在 *pika-cli* 文件夹中创建 *pnpm-workspace.yaml* 工作空间配置文件，并在该文件中添加如下配置代码，这样package文件夹下的

    packages: 
     - 'packages/*' 
     - 'examples/*'

配置后，声明了 *packages* 文件夹中子工程是同属一个工作空间的，工作空间中的子工程编译打包的产物都可以被其它子工程引用

接下来我们在项目文件夹中再创建一个*cli*文件夹和*create*文件夹，两个文件夹中的子工程会都被单独发包，*cli*包是我们脚手架工程的命令包，其中包含了所有命令，而*create*包中实现的则是其中的一个*create*命令

我们分别进入两文件夹下*pnpm init*初始化项目，创建出*package.json*文件

## 3.2 以域包形式管理包

我们将使用域包的形式来管理我们脚手架工程下的包，域包，一般是以@开头的，如`@babel/xxx`和`@alilc/xxx`，这种命名方式允许开发者在一个命名空间下组织和管理多个相关的包，而不用担心包名冲突的问题。我们可以在npm官网上注册/登录账号来创建我们自己的域

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/fc96f3ce19684997bf804e324e801fe2~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=oRBckG%2BruxatMuY3XYT%2BhOjiwu8%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/bb11fc2081544da198647871ee194186~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=lqRYXz5l6TFL5DeVrcpGX7sbE5Q%3D)

通过以上步骤创建了一个名叫*pika-cli*的域，那么让我们将我们脚手架工程中的包重新命名为该域包格式规范的吧（无视截图中版本，因为图是后续截的～，刚初始化后的版本为1.0.0）

注意需要将publishConfig配置修改为access：public，因为域包默认是私有的，如果你希望社区能够贡献代码或者使用你的包，那么将域包设置为公共的可以降低使用门槛

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/149b1c6ee0cc4eaebc3d7a8c082f13b1~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=tXuiOVF4SkltN34Cb8bh%2BnXzgm0%3D)

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/166768076b3b4c1eb7eb2cf7a8fb3148~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=Av1hd4YNsfnsVjTojJwVSWNhB98%3D)

### 3.3 为cli包添加create包依赖

接着在脚手架工程（*pika-cli*）的终端中执行命令，为*cli*包添加*create*包为依赖

    pnpm --filter cli add @pika-cli/create --workspace

*--filter* 指定在哪个包下执行 *add* 命令

加上 *--workspace* 就是从本地查找

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4ee2abdda75d441c930d7382f2eed436~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=Rqy55%2BB9D%2FmZcmGW5P%2F5tCfoIfc%3D)
我们成功为*cli*包添加了一个工作空间*workspace*下的*create*包为依赖，并且由于添加的方式是软链接，当我们更新*create*包中代码时，*cli*的*node\_modules*中*create*也会同步更新，由此实现的效果与npm link类似

## 3.4 使用typescript

typescript已经逐渐成为了开发的趋势，我们也引入typescript来进行开发

加上*w*才可以在根目录进行安装

    pnpm add typescript @types/node -w --save-dev

在*cli*包下创建*tsconfig.json*文件

    pnpm --filter cli exec npx tsc --init

该文件是是*typeScript*编译器的配置文件，它定义了如何编译*typeScript*代码，我们来修改该文件

```js
// tsconfig.json
{
  "compilerOptions": {
    // 指定编译后的js文件输出目录
    "outDir": "dist",
    // 指定要包含的类型声明文件
    "types": [ "node" ],
    // 指定ECMAScript目标版本
    "target": "es2016", 
    // 指定模块系统
    "module": "NodeNext", 
    // 指定模块解析策略。NodeNext意味着使用最新的Node.js模块解析策略
    "moduleResolution": "NodeNext",
    // 是否生成.d.ts声明文件
    "declaration": true,
    // 是否允许默认导入命名导出
    "esModuleInterop": true,
    // 强制文件名的大小写一致
    "forceConsistentCasingInFileNames": true,
    // 启用所有TypeScript的严格类型检查选项
    "strict": true,
    // 跳过库的类型检查
    "skipLibCheck": true,
    // 为每个输出的.js文件生成一个对应的.map文件
    "sourceMap": true
  }
}

```

修改*package.json*文件

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/13e387534c36442ca231915a66928547~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=0Wkadaq2nObVlkQZ26HjUVjz1sI%3D)

也使用同样的方式来修改*create*包

## 3.5 cli包与create包

在*create*包下创建*src/index.ts*文件

```ts
// src/index.ts
async function create() {
    console.log('create 命令执行中...')    
}

export default create;

```

编译一下

    pnpm --filter create exec npx tsc

*dist*文件下就会产生三个文件，分别是类型声明文件*index.d.ts*、被编译后的*index.ts*产生的*index.js*、*soucemap*映射文件

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/810229bc917e4542b528de15edca283d~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=AFEfycERHvO6IHPxPKfT3U8I%2Bqo%3D)

再在cli包下也创建src/index.ts文件，在该文件中引入create包的create命令并且注册

```ts
#!/usr/bin/env node
import create from '@pika-cli/create';
import { Command } from 'commander';

const program = new Command();

// 创建create命令
program.command('create')
    .description('创建项目')
    .action(async () => {
        create();
    });

program.parse();

```

安装一下commander包

    pnpm --filter cli add commander

最后再修改一下两个包*package.json*文件中的version版本为*0.0.1*

## 3.6 声明一个自己脚手架的命令

假如我们运行 *vue create myapp* 命令来创建一个 **Vue** 工程。

如果我们没有运行 *npm install -g vue-cli*安装 vue-cli 脚手架，在命令行窗口中直接运行 *vue create myapp*，会报错，报错如下图所示：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/db5804044107407685e7900e2acc12dd~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=UXl%2BGSZg6s9mfWUuckTZu3qhcsI%3D)

可见 `vue` 不是系统命令， `vue` 只是 vue-cli 脚手架声明的一个命令

那么如何给自己的脚手架声明一个命令呢？关键点在于package.json文件中的bin字段。一般我们都会为脚手架项目创建一个cli包，在该包的package.json中声明该脚手架的命令

    {
      "name": "@pika-cli/cli",
      "version": "0.0.1",
      "description": "",
      "main": "./src/index.js",
      "scripts": {
        "test": "echo "Error: no test specified" && exit 1"
      },
      "author": "",
      "license": "ISC",
      "bin":{
        "pika-cli": "./dist/index.js"
      }
    }

这样我们就声明了一个叫做*pika-cli*的命令，*dist/index.js*文件就是我们使用pika-cli命令之后会运行的文件，也是经过编译之后的 *src/index.ts*的输出文件

至此，我们monorepo的基本结构就搭建完成了，接下来我们来讲讲如何使用changeset来进行版本管理

## 四、changeset

接下来我们就要发包了，来做一下准备工作

我们使用changeset来进行版本管理，changeset 就是一次改动的集合，可能一次改动会涉及到多个 package，多个包的版本更新，这合起来叫做一个 changeset

changeset 管理版本号是遵循 semver 规范的：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/3535eaad345c435ba32e01f637c1a748~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=HXH0fn1ZY5m3uM8RBAmaEsjMeUg%3D)

所以首先在根目录安装和初始化changeset一下

    pnpm add --save-dev -w @changesets/cli prettier-plugin-organize-imports prettier-plugin-packagejson

    npx changeset init

会出现一个.changeset目录
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/c53b0a84548e4287bc6ad2e52b270bda~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=YOCTqVEKD%2FaS4hQNBbE3X8KytqY%3D)

接着我们再登录一下npm和切换npm源，注意发包需要将切换为npm的公共源

    npm adduser
    npm config set registry https://registry.npmjs.org/

*npm adduser*命令会让你输入npm用户名、密码以及邮箱，如果用户名或者密码忘记就到*npm*官网登录页面[www.npmjs.com/](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2F "https://www.npmjs.com/")进行密码找回，填入邮箱后会收到一封邮件，上面有关于用户名以及修改密码的信息

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/8aff3933801a4bb686e73cc1ab040a28~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=0tvcDVu5%2BpDt78DxnJbJpqb1Jj8%3D)

由于changeset 会基于上次的 commit 来判断变更，所以我们初始化git仓库，再创建一个commit

    git init
    git add .
    git commit -m "脚手架项目初始化"

然后我们再修改一下需要发布的cli包和create包，比如加一行空格，然后执行*npx changeset add*来操作需要更新版本的包以及设定包的更新版本

    npx changeset add

使用空格来选择需要更新版本的包，可以对选择了的包更新*major*、*minor*或者*patch*版本

这时你就会发现在 .changeset 下多了一个临时文件记录着这次变更的信息：
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/6ff82c42095b4c9881ad931a33a5e987~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAg5be35bC-5Za1:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMTQ5Nzk4MjM0NjQ2Nzk2NSJ9&rk3s=f64ab15b&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1737977246&x-orig-sign=3i%2B1aGcEyC8ckOZ6GeqMoMgWS6s%3D)

再执行*npx changeset version*命令来更新包的版本

    npx changeset version

接下来更新版本之后的包下将会生成一个CHANGELOG.md 文件，里面记录着该次的版本变更信息

最后执行*npx changeset publish*命令来将包发布

    npx changeset publish

## 五、结语

本节讲述了为什么脚手架工程要使用monorepo风格，以及如何使用pnpm workspace + changeset来搭建和管理一个monorepo风格的脚手架

对于前端工程化和开发脚手架，笔者也还在还在摸索和实践的阶段，有什么错误的地方请读者多多见谅。关于之后开发的的详细步骤也会记录下来陆续发出
