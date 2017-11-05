---
layout: post
title: "Docker多容器App配置"
date: 2017-01-05
excerpt: "Docker setup."
tags: [Docker, Devops]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---
#Docker多容器App配置
![](http://ww1.sinaimg.cn/large/6b1abb29ly1fl5t2d1afij20q40lwabf.jpg)

Docker可以粗糙地理解为轻量级的虚拟机。（实际上不是虚拟机）

```
docker run + [image name]
```

指令用来运行镜像或者指令，比如在`ubuntu`上运行“hello world”，就可以直接写成：

```
docker run ubuntu echo hello world
```

当docker运行镜像image的时候，docker会先检查本地有没有此image，如果没有就会返回"unable to find image"。

```
docker images
```
docker image指令可以查询所有本地的镜像。在运行镜像后在容器中做出的所有改动都不会在docker stop指令终止后保存，如果要保存改动需要使用

```
docker commit [image no.] -m
```

此指令会生成一个新的镜像，同时保存修改的操作。
