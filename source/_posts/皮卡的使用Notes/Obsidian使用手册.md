---
title: Obsidian使用手册
date: 2025-01-21 19:25
categories:
  - 皮卡的使用Notes
tags:
  - Obsidian
share: true
---
### 快捷键 
可在设置中设置自定义快捷键

以下是我的设置：

- 编辑模式与预览模式的切换：「Ctrl + E」
- 插入代码块：「Ctrl + M」
- 插入表格：「Ctrl + T」
- 插入链接：「Ctrl + K」
- 文字高亮：「Ctrl + H」
- 文字加粗：「Ctrl + B」
- 增加笔记属性：「Ctrl + N」
- 打开命令面板：「Ctrl + P」

### 插件

- Image Context Menus：支持复制图片、打开图片所在文件夹
- Image auto upload Plugin：将正文中本地图片上传图床
- Clear Unuse Images：定期清理附件库中未被引用的图片
- Mouserwheel Image Zoom：通过鼠标滚轮调节图片大小
- Auto Link Title：处理粘贴在文档上的链接
- Advanced Tables：表格插件

### 本地图片存放
本地图片会默认存在附件目录根目录中，可在设置中指定附件文件夹
![[Pasted image 20250121201742.png|500]]

### 图片上传图床
图床是一个专门用来存储和管理图片的服务器

将一张图片上传服务器上，将获得一个专属的图片链接，通过这个链接可以在 Obsidian 中引用显示该图片

有了图床后：
1. **图片不用管理**。图床中的图片是不管理的，随时用图、随时传图。
2. **迁移方便**。万一以后你不想用 Ob 了。直接带走 md 文件就行了，图片显示完全不受影响。
3. **加快笔记同步速度**。因为原来占空间的图片不用在本地保存，整个 Obsidian 笔记仓库的大小急剧缩小，自然同步速度就加快

详细操作方式可查看：[Site Unreachable](https://zhuanlan.zhihu.com/p/689603478)
PicGo腾讯云COS配置可查看：[对象存储 使用 PicGo+Typora+COS 搭建图床服务-实践教程-文档中心-腾讯云](https://cloud.tencent.cn/document/product/436/74373)


###  模版
可在设置中开启模版Template，指定模版存放的文件夹
![[Pasted image 20250121201910.png|500]]
点击左侧插入模版使用
![[Pasted image 20250121202040.png|400]]