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

![](http://ww1.sinaimg.cn/large/6b1abb29gy1flhatlftlrj20cx09jmxi.jpg)

基准代码和app之间始终保持着一对一的关系：

* 如果一个app有着多个基准代码，那么他就是一个分布式系统而不是一个app。
* 多个app共享一个代码是违背12要素原则的，如果多个代码共享代码，着需要将共享的的代码加入到代码库中进而通过依赖管理来分配。

## Dependencies 依赖
> Explicitly declare and isolate dependencies.

12要素法则下的应用程序不会隐式依赖系统级的类库。依赖一定要通过依赖清单，确切的声明所有依赖。

## Config 配置
> Store config in the environment.

12要素法则要求代码和配置严格分离，其推荐奖应用的配置存储于环境变量中，环境变量可以非常方便的在不同的部署间做修改，却不用动一行代码。

## Backing service 后端服务
> Treat backign service as attached resources

12要素法则不会区别对待本地或者三方服务。在12要素法则中这两种都是附加资源，通过一个url或是其他存储在配置中的服务定位、服务证书来获取的数据。每一个不同的后端服务都是一份资源，例如一个mysql是一个资源，两个mysql被看做2个不同的资源，这些资源都视作附加资源，这些资源和他们附属的部署保持松耦合。部署同时可以按需加载或者卸载资源。此过程不需要修改代码。

![](http://ww1.sinaimg.cn/large/6b1abb29gy1flhdekc2j4j20qe0dhq3w.jpg)

## Build, release, run 构建，发布，运行
> Strictly separate build and run stages 严格分离构建和运行

12要素法则严格区分构建，发布和运行三个步骤。

![](http://ww1.sinaimg.cn/large/6b1abb29gy1flhdieu4usj20h3075glp.jpg)

## Processes 进程
> Execute the app as one or more stateless processes. 以一个或多个无状态进程运行应用

12要素应用的进程必须无状态且无共享。任何需要持久化的数据都要存储在后端服务内， 比如数据库。

## Port binding 端口绑定
> Export services via port binding. 通过端口绑定来提供服务

12要素应用完全子午加载而不依赖任何网络服务器可以创建一个面向网络的服务。互联网应用通过端口绑定来提供服务，并监听发送至该端口的请求。
另外端口绑定这种方式意味着一个应用可以成为另外一个应用的后端服务，调用方法将服务方提供的响应的url当做资源存入配置以备将来调用。

## Concurrency 并发
> Scale out via the process model. 通过进程模型进行扩展。

![](http://ww1.sinaimg.cn/large/6b1abb29gy1flhdxp3zhoj20ce0awaa9.jpg)

## Disposability 易处理
> Maximize robustness with fast startup and graceful shutdown. 快速启动和优雅终止可最大化健壮性

12要素应用的进程应该是易处理的，意思是可以瞬间开启或者停止。这有利于快速，弹性的伸缩应用，迅速部署变化的代码或者配置，稳健的部署应用。

同时进程一旦接受终止信号，就会优雅的终止。

进程还应当在面对突然死亡时保持健壮。







