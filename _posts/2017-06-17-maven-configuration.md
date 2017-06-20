---
layout: post
title: "Maven工程搭建及配置"
date: 2017-06-17
excerpt: "Guide to configuring Maven."
tags: [Java, Maven]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
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
![maven setup](http://ww1.sinaimg.cn/large/6b1abb29gy1fgrp6fu1y3j20cg00waa3.jpg)
之后在命令行输入`mvn --version`可以来检测安装是否成功，结果如下，则证明maven已经安装到本机:
![success](http://ww1.sinaimg.cn/large/6b1abb29gy1fgrpai53lxj20hm02hmxp.jpg)

##指定本地仓库
在使用`Maven`自动构建工程时，`Maven`会将工程中的jar包依赖下载到本地仓库，其运行顺序为先
检测所依赖是否在本地仓库中已经存在，如果不存在将会到`Apache`的中央仓库下载（需要网络连接），
其仓库`repsository`的默认路径为`${user.home}/.m2/repository`，用户可以通过修改`Maven`文件夹中的
`conf`文件夹下的`settings.xml`文件中的`localRepository`标签来修改本地仓库路径，建议将本地仓库建立
在本机不会被删除的路径中：

```
<!-- localRepository
   | The path to the local repository maven will use to store artifacts.
   |
   | Default: ${user.home}/.m2/repository
  <localRepository>/path/to/local/repo</localRepository>
  -->
  <localRepository>D:/Java/maven/repository</localRepository>
```

以上配置将会在本机的`D`盘下的`/Java/Maven/repository`中下载工程依赖文件。
## 项目构建文件配置`pom.xml`
`Maven`项目的配置信息保存在项目文件夹下的`pom.xml`配置文件中，其格式为：

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>

	<groupId>com.github.user3301.hello</groupId>
	<artifactId>hello-first</artifactId>
	<version>SNAPSHOT0.0.1</version>

</project>
```

其中

```
<groupId>com.github.user3301.hello</groupId>
<artifactId>hello-first</artifactId>
<version>SNAPSHOT0.0.1</version>
```

以上属性是工程坐标，`groupId`表示项目名称，`artifactId`表示项目的模块名称（命名建议使用`项目名-模块名`的格式）,`version`表示
这个项目的版本名称。</br>
## 依赖添加
在`Maven`项目中添加一个jar包依赖是用过在`pom.xml`配置文件中添加`<dependency>`标签实现的，例如想要在工程中添加`Junit`类包：

```
<dependencies>

		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>4.10</version>
			<scope>test</scope>
		</dependency>

	</dependencies>
```

依赖是通过依赖文件的坐标来锁定的，当依赖引入后`Maven`会首先去本地仓库寻找，如果本地仓库中不存在，maven会去中央仓库下载到本地仓库并引入工程。 其中`<scope>`标签表示此依赖的作用域。
## 代码创建和测试创建
* 源代码在`maven`工程中的`/src/main/java`中
* 源代码的资源文件放置在`src/main/resource`中
* 测试代码放在`src/test/java`中
* 测试代码的资源文件放在`src/test/resource`中
## `Maven`工程的运行
* `mvn compile` ->表示运行工程（会在工程目录中生成一个`target`文件夹）
* `mvn clean` -> 表示运行清理操作（会默认把`target`文件夹中的数据清理）
* `mvn clean compile` -> 表示运行清理后运行
* `mvn clean test` -> 表示清理后测试
* `mvn clean package` -> 表示运行和打包
* `mvn clean install` -> 表示清理和安装，会将打包安装到本地仓库，以便其他的项目可以调用
* `mvn clean deploy` -> 运行清理和发布， 发布到私有服务器中， 企业工程中一般会给整个工程建立一个私有仓库，所有的开发者开发各自的模块，当发布到私有服务器中其他开发者可以方便引用，当用户调用一个依赖时，其运行调用的顺序为`本地仓库->私服->中央仓库`
* `mvn archetype:generate` -> 在所在的路径下自动完成基本maven工程的骨架
## `Maven`在团队开发中的便捷之处
在团队开发中，不同的个体或者团队会承包不同的逻辑业务，当整合业务或者合并代码时，如果不同业务之间的jar包依赖不同或者版本不同，尤其是在不同业务层之间方法调用时候如果没有工程管理会使工作变得更加复杂，下面举一个简单的例子来说明`Maven`在工程管理上的便捷之处：
* 假设A团队在一个web项目中开发`service`层逻辑，由于`Maven`项目是以模块`Artifact`来分类的，所以在`service`模块中有一方法假设为`helloWorld`:

```
package com.github.user3301.service;

/**
 * Created by User3301 on 6/18/2017.
 */
public class HelloWorld {

    public void helloWorld() {
        System.out.println("Hello World!");
    }
}
```

`pom.xml`配置文件如下：

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.github.user3301</groupId>
    <artifactId>hello-first</artifactId>
    <version>1.0-SNAPSHOT</version>
</project>
```

当开发`view`层的开发人员想要调用此方法时，只需要让`service`层的开发人员打包发布代码（deploy）到私服上面，`view`层开发人员通过在`pom.xml`中添加其坐标就能完成导入：

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.github.user3301</groupId>
    <artifactId>hello-second</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>com.github.user3301</groupId>
            <artifactId>hello-first</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency></dependencies>
</project>
```

通过添加<dependency>能够找到以发布的`service`层所有业务逻辑，所以在`view`模块中我们可以成功调用`helloWorld`方法：

```
package com.github.user3301.view;

import com.github.user3301.service.HelloWorld;

/**
 * Created by user3301 on 6/18/2017.
 */
public class HelloWorldView {

    public static void main(String[] args) {
        HelloWorld helloWorld = new HelloWorld();
    }
}
```

这个简单的小例子看出`Maven`在工程管理上的便捷之处。
