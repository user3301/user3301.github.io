---
layout: post
title: "使用Nexus搭建Maven本地仓库"
date: 2017-06-20
excerpt: "Create private repository using Nexus."
tags: [Java, Maven]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgrys0itmrj20hi0hiwes.jpg
comments: true
---
# What is Nexus?
`Nexus`是Sonatype公司出品的一款仓库管理器，它能够简化用户管理`Maven`依赖仓库的jar包，包括中央仓库和私人仓库的配置，还有私服的搭建。 官方下载地址：[Download](https://www.sonatype.com/download-oss-sonatype)，其中包括付费版与免费版，基本上简单的私服搭建免费版will do the job。</br>
# 为什么要搭建私服？
在做项目的过程中往往会依赖一些中央仓库中没有的依赖，比如你的工程需要一个朋友开发的工具类，这时候如果你想让这个工具类分享给开发团队来使用就可以上传到私服上面，然后通过给这个工具类jar包添加`<groupId>`等属性方便他人引用。`Nexus`正是这样一款能够大大简化私服仓库的管理工具，闲言碎语不要讲，下面来说下安装`Nexus`的流程及启动和访问流程。
* 下载好官方的安装包后我们可以通过根目录下的`bin->jsw`目录里面的不同操作系统版本文件夹（根据自己本机的型号选择）中的`install-nexus.bat`和`start-nexus.bat`文件来安装和开启`nexus`：</br>
![directory](http://ww1.sinaimg.cn/large/6b1abb29gy1fgrtulr1bmj207003tjrh.jpg)</br>
开启之后我们还能够在`Services`里关闭nexus，貌似windows系统下nexus是开机启动的。</br>
![services](http://ww1.sinaimg.cn/large/6b1abb29gy1fgrtykbohnj20ma0geju5.jpg)</br>
在确定了`Nexus`安装成功并开启状态后，我们可以通过在浏览器中输入`http://localhost:8081/nexus`管理页面，右上角`Login`点击可以登陆，默认的用户名和密码为`admin`和`admin123`:</br>
![](http://ww1.sinaimg.cn/large/6b1abb29gy1fgru3hdb9dj21hj0pkq7c.jpg)</br>
登陆后我们就可以通过点击左边栏中的`repository`来进行依赖管理了，例如现在有一个名为`user3301.jar`的三方工具包中央仓库中不存在，我们可以上传到nexus的`3rd party`依赖仓库中，然后通过在工程中添加`<repository>`属性来获得依赖，具体操作如下：</br>
* 上传依赖包：</br>
![](http://ww1.sinaimg.cn/large/6b1abb29gy1fgru8qaxjij20wf099wg8.jpg)</br>
首先选择`3rd party`的仓库，然后我们将所要上传的jar包upload到此仓库中；</br>
![](http://ww1.sinaimg.cn/large/6b1abb29gy1fgrudb8pfqj21az0gq76i.jpg)</br>
在填写好`<groupId>`和`<artifactId>`等信息后我们点击页面上的`add artifact`然后点击`upload
 artifact`就完成上传了。之后我们可以在`summary`中找到上传的私服仓库的地址：

 ```
 <repositories>
        <repository>
            <id>Nexus</id>
            <name>Nexus Repository</name>
            <url>http://localhost:8081/nexus/content/groups/public/</url>
            <releases><enabled>true</enabled></releases>
            <snapshots><enabled>true</enabled></snapshots>
        </repository>
    </repositories>
 ```

 将此仓库地址加入到工程的`pom.xml`中去，之后在添加依赖就能够完成三方jar包依赖了。
