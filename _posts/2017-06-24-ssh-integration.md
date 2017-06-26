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

1. 首先在`Action`层创建一个`UserAction`类:

```
package com.github.user3301.action;

import com.opensymphony.xwork2.ActionSupport;

/**
 * Created by user3301 on 6/26/2017.
 */
public class UserAction extends ActionSupport {

    @Override
    public String execute() throws Exception {
        return NONE;
    }
}
```

通常在创建`action`类之后，我们需要在`struts2.xml`配置文件中配置此`UserAction`：

```
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE struts PUBLIC
        "-//Apache Software Foundation//DTD Struts Configuration 2.3//EN"
        "http://struts.apache.org/dtds/struts-2.3.dtd">

<struts>
    <package name="demo1" extends="struts-default" namespace="/">
        <action name="userAction" class="com.github.user3301.action.UserAction"></action>
    </package>
</struts>
```

但是使用`Spring`来进行整合项目后，我们需要在`Spring`配置文件中配置`struts2`的`action`的创建：</br>
首先创建`Spring`核心配置文件并引入约束（之后进行数据库操作，里面配置好c3p0数据库连接池的配置） - `applicationContext.xml`:

```
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--c3p0 连接池配置-->
    <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="com.mysql.jdbc.Driver"></property>
        <property name="jdbcUrl" value="jdbc://mysql:///ssh_demo"></property>
        <property name="user" value="root"></property>
        <property name="password" value="1234"></property>
    </bean>
</beans>
```

之后配置`action`对象，其中action对象为多实例对象，所以`scope="prototype"`：

```
<!--配置action对象-->
    <bean id="userAction" class="com.github.user3301.action.UserAction" scope="prototype"></bean>
```

但是在使用`Spring`框架整合的时候，我们需要使用`Spring`来创建`action`对象，所以在`struts.xml`配置文件中我们不再需要指定`action`的class值了，否则会造成创建两个action对象：

```
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE struts PUBLIC
        "-//Apache Software Foundation//DTD Struts Configuration 2.3//EN"
        "http://struts.apache.org/dtds/struts-2.3.dtd">

<struts>
    <package name="demo1" extends="struts-default" namespace="/">
        <action name="userAction" class="userAction"></action>
    </package>
</struts>
```

以上的配置中`class=`是`userAction`的引用，其中引用的是`Spring`配置文件中的`bean id`的值，这种方法在运行时struts会去spring配置文件中找`id`为引用的值，这种方式需要引入依赖`struts2-spring-plugin.jar`实现。
