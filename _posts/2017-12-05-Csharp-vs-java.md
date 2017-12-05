---
layout: post
title: "C#语法及特性与Java异同点"
date: 2017-12-05
excerpt: "Java v.s C#."
tags: [C#]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---
# 命名规范
## java
Java命名规范是以数字、字母、下划线、$符号组成，数字不能作为开头。命名约定使用Camel风格，即首个单词首字母小写，其他之后单词大写。
## C\#
c\#命名可以是字母、下划线，数字和@符号组成，数字不能放在首位，@可以放在首位，但是不推荐作为常用字符。命名约定为Pascal风格，即每个单词首字母大写。
# C\#独有特性
# 访问修饰符
在c\# 中，默认的访问修饰符是`private`，同时还有`internal`访问修饰符，表示修饰对象只能被有继承关系的类访问到， `protected internal`表示