---
layout: post
title: "Maven工程搭建及配置"
date: 2017-06-11
excerpt: "Guide to configuring Maven."
tags: [Java, Maven]
comments: true
---
# Maven工程搭建及配置
## 安装
`Maven`为Apache软件基金会开发的一款**项目管理工具**:

>Maven是Apache公司的顶级项目，它包含了一个项目对象模型 (Project Object Model)，一组标准集合，一个项目**生命周期**(Project Lifecycle)，一个**依赖管理系统**(Dependency Management System)，和用来运行定义在生命周期**阶段**(phase)中**插件**(plugin)**目标**(goal)的逻辑。当你使用Maven的时候，你用一个明确定义的项目对象模型来描述你的项目，然后Maven可以应用横切的逻辑，这些逻辑来自一组共享的（或者自定义的）插件。

-来自百度百科</br>
首先使用Maven进行项目管理我们要在Apache官网下载其`.zip`文件并安装：[Download](https://maven.apache.org/download.cgi)，当下载好后我们可以安装到本机。
* `Windows`环境`Maven`安装：
1. 首先解压下载的`jar`包，之后将其中的`bin`文件夹路径配置到windows环境变量`PATH`中。
2. 添加环境变量后可以通过在command line中输入`mvn -v`来检查是否安装成功。
* `UNIX`环境`Maven`安装：
1. 首先将下载的`Maven`的jar包解压到本机
2. 部署`maven`到本机，首先在`Terminal`中配置maven路径：
```
export M2_HOME=your maven unpacked distribution
export PATH=$PATH:your maven upacked distribution/bin
```
![setup](https://github.com/user3301/user3301.github.io/blob/master/assets/img/maven_setup.png)</br>
之后在命令行输入`mvn --version`可以来检测安装是否成功，结果如下，则证明maven已经安装到本机：</br>
![success](assets/img/success.png)
