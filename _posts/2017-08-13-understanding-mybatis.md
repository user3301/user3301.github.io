---
layout: post
title: "Mybatis学习笔记"
date: 2017-08-13
excerpt: "Mybatis learning guide."
tags: [mybatis, orm, java]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# Mybatis基础
`Mybatis`是一款持久层框架

`Mybatis`拥有开发`dao`层的两种方法：
* 原始dao开发方式：编写dao接口和dao实现类
* `mybatis`的`mapper`接口（相当于dao接口），代理开发方法

## 原生态 `jdbc`程序中存在的问题总结


```
public static void main(String[] args) {
        //数据库连接
        Connection connection = null;
        //预编译的statement
        PreparedStatement preparedStatement = null;
        //结果集对象
        ResultSet resultSet = null;

        try{
            //加载数据库驱动
            Class.forName("com.mysql.jdbc.Driver");
            //通过驱动管理类获取数据库连接
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8", "root", "1234");
            //定义sql语句？表示占位符
            String sql = "select * from user where username = ?";
            //获取预处理statement
            preparedStatement = connection.prepareStatement(sql);
            //设置参数，第一个sql语句中参数的序号，第二个参数为设置的参数值
            preparedStatement.setString(1,"王五");
            //向数据库发送sql执行查询，查询出结果集
            resultSet = preparedStatement.executeQuery();
            //遍历查询结果集
            while(resultSet.next()) {
                System.out.println(resultSet.getString("id")+" "+resultSet.getString("username"));
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if(resultSet!=null) {
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(preparedStatement!=null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            if(connection!=null) {
                try {
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
   ```
    
    
* 数据库连接，使用时创建连接，不适用立即释放，对数据库进行频繁连接开启关闭，造成数据库资源狼粪，影响数据库性能。
 
  设想解决方案： 数据库连接池
 
 * 将sql语句硬编码到java代码中，如果sql语句修改，需要重新编译java代码，不利于系统维护。
 
 设想解决方案：将sql语句配置在xml配置文件中，即使sql变化，不需要对java代码进行重新编译。
 
 * 想preparedStatement中设置参数，对占位符号位置和涉资和参数值，硬编码在java代码中，不利于系统维护。
 
 * 从resultSet中遍历结果集数据时，存在硬编码，将获取表的字段进行硬编码，不利于系统维护。
 
  设想解决方案：将查询的结果集，自动映射成java对象。
   
##  `mybatis`框架架构
`mybatis`是一个持久层框架，是apache软件基金会的顶级项目。

`mybatis`让成勋元将主要经理放在sql上，通过`mybatis`提供的映射方式，自由灵活生成（半自动化，大部分需要程序员编写sql）满足需要sql语句。

`mybatis`可以将向`preparedStatement`输入参数自动进行输入映射，将查询结果集灵活映射成java对象。（输出映射）。


![](http://ww1.sinaimg.cn/large/6b1abb29gy1figobrds2ej20p20lb0v5.jpg)


## `mybatis` 入门程序

### 需求
根据用户id（主键）查询用户信息

根据用户名称模糊查询用户信息

添加用户

删除 用户

更新用户

### `mybatis` 依赖包

```
<dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.24</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.2.7</version>
        </dependency>
        <dependency>
            <groupId>asm</groupId>
            <artifactId>asm-commons</artifactId>
            <version>3.3.1</version>
        </dependency>
        <dependency>
            <groupId>cglib</groupId>
            <artifactId>cglib</artifactId>
            <version>3.2.5</version>
        </dependency>
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.1.1</version>
        </dependency>
        <dependency>
            <groupId>org.javassist</groupId>
            <artifactId>javassist</artifactId>
            <version>3.17.1-GA</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.7</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>2.0-rc1</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.0-rc1</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.5</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.5</version>
        </dependency>
    </dependencies>
    
   ```
   ### `SqlMapConfig.xml`配置
   配置mybatis的运行环境，数据源、事务等。
   
   ```
   <?xml version="1.0" encoding="UTF-8" ?>
   <!DOCTYPE configuration
   PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
   "http://mybatis.org/dtd/mybatis-3-config.dtd">
   <configuration>
   	<!-- 和spring整合后 environments配置将废除-->
   	<environments default="development">
   		<environment id="development">
   		<!-- 使用jdbc事务管理-->
   			<transactionManager type="JDBC" />
   		<!-- 数据库连接池-->
   			<dataSource type="POOLED">
   				<property name="driver" value="com.mysql.jdbc.Driver" />
   				<property name="url" value="jdbc:mysql://localhost:3306/mybatis?characterEncoding=utf-8" />
   				<property name="username" value="root" />
   				<property name="password" value="mysql" />
   			</dataSource>
   		</environment>
   	</environments>
   	
   </configuration>
   ```
   
   ### 需求： 根据用户id进行增删改查
   
   [案例代码](https://github.com/user3301/mybatis_learning)
   
 
  
