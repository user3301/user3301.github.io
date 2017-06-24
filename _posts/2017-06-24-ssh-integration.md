---
layout: post
title: "SSH框架整合开发"
date: 2017-06-21
excerpt: "Spring+Struts2+Hibernate integration"
tags: [Java, Hibernate,Spring,struts2]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# SSH框架整合开发
基于`MVC`思想通过整合`Spring` + `Hibernate` + `struts2`实现javaweb项目。</br>


## `Spring`对于`Hibernate`的整合
* 在`Spring`框架中， 把`Hibernate`核心配置文件里面的数据库配置写在`Spring`配置文件中.
* 第一次访问时会建立`SessionFactory`对象，将其配置交给`Spring`
*
整合框架以`Spring framework`为中心，`Hibernate`作为持久层，`struts2`作为视图控制器。其中`Spring`框架中对`Hibernate`框架进行了封装（HibernateTemplate），其中常用的`API`有：

```
Serializable save(Object entity)
void update(Object entity)
void delete(Object entity)
<T> T get(Class<T> entityClass, Serializable id)
<T> T load(Class<T> entityClass, Serializable id)
List find(String queryString, Object...values)
```

## `Spring`框架对于`Struts2`的整合
* 把`struts2`中的`Action`对象的配置交给`Spring`框架进行管理：</br>

使用`ioC`机制配置创建`Action`对象

```
<bean id="Action1" CLASS="com.github.user3301.Actions.Action1" scope="prototype"/>
```
