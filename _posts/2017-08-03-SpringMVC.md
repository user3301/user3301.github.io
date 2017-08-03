---
layout: post
title: "SpringMVC详解"
date: 2017-08-03
excerpt: "Understanding Spring MVC."
tags: [Java, Springmvc]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# Spring MVC
## 什么是Spring MVC
Spring MVC是Spring框架的一个模块，所以Spring MVC 和Spring无需通过中间整合层进行整合。
## Spring MVC框架原理
![图片来自网络](http://ww1.sinaimg.cn/large/6b1abb29gy1fi68tndjzlj20ih0e776c.jpg)

执行步骤：
1. 前端发起请求到前端控制器（DispatcherServlet）
2. 前端控制器请求`HandlerMapping`查找`Handler`，其中配置可以通过`xml`或注解方式
3. 处理器映射器`HandlerMapping`向前端控制器返回`Handler`
4. 前端控制器调用处理器适配器去执行`Handler`
5. 处理器适配器（HandlerAdapter）去执行`Handler`
6. `Handler`执行完成给适配器返回`ModelAndView`
7. 处理器适配器向前端控制器放回`ModelAndView`， `ModelAndView`是`SpringMVC`框架的一个底层对象，包括`Model`和`View`
8. 前端控制器请求视图解析器去进行试图解析,根据逻辑视图名解析成真正的视图（jsp）
9. 视图解析器向前端控制器返回`View`
10. 全段控制器进行视图渲染， 即将模型数据填充到`request`域
11. 前端控制器向用户相应结果

## 组件功能分析

### 前端控制器 `DispatcherServlet` （无需程序员开发）
作用： 接收请求，相应结果，相当于转发器,中央处理器</br>
有了`DispatcherServlet`减少了其他组件之间的耦合度

###  处理器映射器 `HandlerMapping` （无需程序员开发）
作用： 根据请求的`url`查找`Handler`

### 处理器 `Handler` （需要程序员开发)

### 处理器适配器 `HandlerAdapter`
作用： 按照特定的规则（`HandlerMapping`要求的规则）去执行`Handler`， 注意： 编写`Handler`时按照`HandlerAdapter`要求编写，这样适配器才能正确执行`Handler`

### 视图解析器 `View resolver` （无需程序员开发）
作用： 进行视图解析，根据逻辑视图名解析成真正的视图（View）

### 视图 `View` （需要程序员开发jsp页面）
`View`是一个接口，实现类支持不同的`View`类型（jsp，freemarker，pdf）

## 入门程序案例
### 需求

### 前端控制器配置

### 处理器映射器配置

### 处理器适配器配置
