---
layout: post
title: "十二要素应用"
date: 2017-11-14
excerpt: "12 Factor App."
tags: [Microservice]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# 十二要素应用
在当今的软件开发中，软件经常的被当做一种叫做“web app”的服务，或者叫做“softare-as-a-serivce（SaaS）”. 其中本文讲的12要素应用就是关于这种web app开发的方法，其具有：
* 使用`declarative format`进行自动化配置以便于新的开发人员加入项目。
* 与底层的操作系统有着清晰的关联关系，从而提供不同执行环境的可移植最大化（maximum portability）。
* 适合当今的云平台开发，避免了服务器和系统的大量配置作业(obviating the need for servers and systems administration)。
* 最小化开饭环境和产品的差异，促成持续集成来最大化敏捷度。
* 能够在不作出巨大的工具，架构和开发时间的改变情况下扩大程序规模。

`12要素开发`可以应用于任何的编程语言实现的app，同时也适用于各种后端开发的组合（例如database,queue, memory cache等）。

## 1 Codebase 代码库
> One codebase tracked in revision control, many deploys
“一份基准代码，多份部署”



