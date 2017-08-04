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

## `SpringMVC`环境搭建
* 所需要的`Jar`包依赖：

```
<dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/jstl/jstl -->
        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.springframework/spring-webmvc -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>3.0.4.RELEASE</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework/spring-tx -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>4.3.10.RELEASE</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/javax.servlet/servlet-api -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>3.0.4.RELEASE</version>
        </dependency>
    </dependencies>
```

### 前端控制器配置

```
<!--配置前端控制器-->
   <servlet>
       <servlet-name>springmvc</servlet-name>
       <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
       <!--contextConfigLocation配置springmvc加载的配置文件（配置处理器映射器，适配器等等）,如果不配置默认加载/WEB-INF/servlet下servlet.xml(springmvc-servlet.xml)-->
       <init-param>
           <param-name>contextConfigLocation</param-name>
           <param-value>classpath:springmvc.xml</param-value>
       </init-param>
   </servlet>
```

### 处理器映射器配置
```
<servlet-mapping>
       <servlet-name>springmvc</servlet-name>
       <!--第一种：*.action 访问以.action结尾 由DispatcherServlet进行解析
           第二种：/，访问的地址都由DispatchServlet进行解析，对于静态文件的解析需要配置不让DispatcherServlet进行解析
           使用此种方式可以实现RESTful风格的url
           第三种： /*， 这样配置不对，使用这种配置，最终要转发到一个jsp页面，仍然会由DispatcherServlet解析jsp地址，不能根据jsp页面找到handler，会报错
       -->
       <url-pattern>*.action</url-pattern>
   </servlet-mapping>
```

### 处理器适配器配置
在`resource`文件夹下创建`springmvc.xml`配置文件，在配置文件中配置`Handler`,`HandlerAdapter`和视图解析器：

```
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:aop="http://www.springframework.org/schema/aop" xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc" xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop-3.0.xsd
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-3.0.xsd
        http://www.springframework.org/schema/mvc
        http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-3.0.xsd">
    <!--配置Handler-->
    <bean name="/queryItems.action" class="com.github.user3301.springmvc.controller.ItemsController1"/>

<!--处理器映射器, 将bean的name作为url进行查找，需要在配置Handler时指定bean name（就是url）-->
    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>

    <!--处理器适配器, 所有的处理器适配器都实现了HandlerAdapter接口-->
    <bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
    <!--视图解析器 解析jsp视图-->
    <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver"/>
</beans>
```

创建好后需要在`web.xml`配置文件中的前端控制器中配置`contextConfigLocation`的引用。

## 创建`Handler` 对象

在工程的`controller`包下创建`ItemsController1`对象:

```
package com.github.user3301.springmvc.controller;

import com.github.user3301.springmvc.po.Item;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.Controller;

import java.util.ArrayList;
import java.util.List;

public class ItemsController1 implements Controller {

    public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
        //调用service查找数据库，例如查找多个item
        List<Item> list = new ArrayList<Item>();
        //向list中填充静态数据
        Item item_1 = new Item();
        item_1.setId(1);
        item_1.setName("power armor");

        Item item_2 = new Item();
        item_2.setId(2);
        item_2.setName("fallout 4");

        list.add(item_1);
        list.add(item_2);

        //返回ModelAndView
        ModelAndView modelAndView = new ModelAndView();
        //向ModelAndView对象中添加，相当于request中的setAttribut,在jsp页面中通过list取数据
        modelAndView.addObject("list",list);
        //指定视图
        modelAndView.setViewName("/WEB-INF/itemlist.jsp");

        return modelAndView;
    }
}
```

其中当`handleRequest`方法中写需求逻辑，比如调用`service`层查询持久层数据，之后通过建立实体类对象后通过`setter`方法填充数据，之后创建`ModelAndView`对象后将封装的结果或结果集`add`到此对象， 之后`setViewName`方法中传入需要转发到的视图页面url，视图页面就可以通过`jstl`标签获取结果。

## 视图中获取结果

假设后台将数据传到`intemlist.jsp`页面中，其中通过`jstl`标签获取传来的封装数据：


```
<%@ page contentType="text/html;charset=UTF-8;" language="java" pageEncoding="UTF-8" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html>
<head>
    <title>show items page</title>
</head>
<body>

<div>

    <tr>
        <td>name</td>
        <td>id</td>
    </tr>
    <c:forEach items="${list}" var="item">
    <tr>
        <td>${item.name}</td>
        <td>${item.id}</td>
    </tr>
    </c:forEach>
</div>

</body>
</html>
```

## 非注解的处理器映射器和处理器适配器

### 非注解映射器

1. `BeanNameUrlHandlerMapping`此映射器通过`Handler`的`name`属性作为`url`来映射处理器：

```
<bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
```

```
<!--配置Handler-->
    <bean name="/queryItems.action" class="com.github.user3301.springmvc.controller.ItemsController1"/>
```

配置后用户通过访问`localhost:port-number/queryItems.action` 访问此`Handler`。

2. `SimpleUrlHandlerMapping` 此映射器通过`prop`属性配置对应的`Handler`的`id`属性来形成映射：

```
<!--简单url映射-->
   <bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
       <property name="mappings">
           <props>
               <!--对itemsController1进行url映射，url为/queryItems.action-->
               <prop key="/queryItems1.action">itemsController1</prop>
           </props>
       </property>
   </bean>
```

与此同时，如果要与`itemsController1`形成映射，需要在配置`Handler`时给`itemsController1`添加`id`属性：

```
<bean id="itemsController1" name="/queryItems.action" class="com.github.user3301.springmvc.controller.ItemsController1"/>
```

之后映射配置完成，在配置文件中可以以上两种配置共存，例如我们把简单url映射配置中的 `<prop key="/queryItems1.action">`改为`<prop key="/queryItem2.action">`，用户可以通过`BeanNameUrlHandlerMapping`配置的url访问同时也能够通过`SimpleUrlHandlerMapping`中配置的url访问到同一个`Handler`.

### 非注解适配器
1. `SimpleControllerHandlerAdapter` 此适配器要求`Handler`对象实现`controller`接口和接口中的`handleRequest`方法：

```
public class ItemsController1 implements Controller {

    public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest, javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
        //调用service查找数据库，例如查找多个item
        List<Item> list = new ArrayList<Item>();
        //向list中填充静态数据
        Item item_1 = new Item();
        item_1.setId(1);
        item_1.setName("power armor");

        Item item_2 = new Item();
        item_2.setId(2);
        item_2.setName("fallout 4");

        list.add(item_1);
        list.add(item_2);

        //返回ModelAndView
        ModelAndView modelAndView = new ModelAndView();
        //向ModelAndView对象中添加，相当于request中的setAttribut,在jsp页面中通过list取数据
        modelAndView.addObject("list",list);
        //指定视图
        modelAndView.setViewName("/WEB-INF/itemlist.jsp");

        return modelAndView;
    }
}
```

2. `HttpRequestHandlerAdapter` 此适配器需要handler对象实现HttpRequestHandler接口:

`Handler`编写：

```
public class ItemsController0 implements HttpRequestHandler{
    public void handleRequest(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException {
        //调用service查找数据库，例如查找多个item
        List<Item> list = new ArrayList<Item>();
        //向list中填充静态数据
        Item item_1 = new Item();
        item_1.setId(1);
        item_1.setName("power armor");

        Item item_2 = new Item();
        item_2.setId(2);
        item_2.setName("fallout 4");

        list.add(item_1);
        list.add(item_2);

        //填充数据
        httpServletRequest.setAttribute("list",list);
        //发送到视图
        httpServletRequest.getRequestDispatcher("/WEB-INF/itemlist.jsp").forward(httpServletRequest,httpServletResponse);
    }
}
```

之后在`springmvc.xml`中配置访问url：

```
<!--配置Handler-->
    <bean id="itemsController0" class="com.github.user3301.springmvc.controller.ItemsController0"/>

    <!--简单url映射-->
        <bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
            <property name="mappings">
                <props>
                    <prop key="/queryItems0.action">ItemsController0</prop>
                </props>
            </property>
        </bean>
```

之后用户将会通过访问`localhost:port-number/queryItems0.action`访问此`Handler`

第二种方式可以实现通过`response`设置将相应数据设置成例如`JSON`等数据格式：

```
httpServletResponse.setCharacterEncoding("UTF-8");
       httpServletResponse.setContentType("application/json; charset=utf-8");
       httpServletResponse.getWriter().write("json");
```
