---
layout: post
title: "Nodejs学习笔记"
date: 2017-08-05
excerpt: "Nodejs learning guide."
tags: [Nodejs, JavaScript]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# Nodejs服务器搭建（1）
![](http://ww1.sinaimg.cn/large/6b1abb29gy1fi8qun9yqrj20bs07mjrl.jpg)

被一个从事20余年IT的大牛安利`Nodejs`作为服务器端将称为未来的主流，好奇之下看了下`Nodejs`的文档，经过短暂学习被它的简单的语法和没有像`java`作为服务器端的复杂性吸引，瞬间决定入坑。

## 类的导入
`Nodejs`中类的导入使用`require`方法，类似于`java`中的`import`，导入后就可以使用该类的方法:

```
//导入http类，导入的类建议用常量const接收，因为我们基本不会修改它
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
constr urlLib = require('url');
```

## 创建一个简单的服务器
建立一个服务器并在端口8080进行监听：

```
const http = require('http');

var server = http.createServer(function(request,resonse){
  });
  server.listen('8080');
```

其中在`createServer`中的回调函数包含类`request`和`response`，所以发送和接收来自8080端口的请求都可以在此回调函数中处理。例如我们通过访问`localhost:8080/1.html`，之后请求会发送`request`请求到服务器端，我们通过调用`console.log(request.url)`方法会获得：

```
/1.html
```

## `fs`类

`fs`类可以读取和写入文件：

```
const fs = require('fs');

var server = http.createServer(function(request,response) {
  //readFile(filepath, function(err,data){});
  fs.readFile('aaa.txt', function(err,data) {
    if(err) {
      console.log(err);
    }
    else {
      response.write(data);
    }
    response.end();
    });
  }).listen('8080');
```

当我们访问一个不存在的路径时， 假设`localhost:8080/aaa.txt`不在根目录下，`readFile`方法中的回调函数中的`err`将会在控制台输出：

```
[Command: node /Users/Stan/Desktop/Node4/server.js]
{ Error: ENOENT: no such file or directory, open 'asd.txt'
    at Error (native) errno: -2, code: 'ENOENT', syscall: 'open', path: 'asd.txt' }
```

当我们访问一个存在于根目录下的`www`文件夹下的`1.html`文件时， `1.html`中的内容会通过`response.write(data)`方法发送回页面:

`1.html`

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>index</title>
  </head>
  <body>
    welcome to Nodejs.
  </body>
</html>
```

访问`localhost:8080/www/1.html`后页面显示:

```
welcome to Nodejs.
```

其中需要注意的是`response.end()`方法一定要在`readFile`方法执行后执行，因为`readFile`为异步操作，读取文件操作耗时相对较多,如不为读取后执行`end()`方法会造成异常。

## `GET`请求的处理
因为`GET`请求是通过`url`传到后台，所以当数据以`GET`请求时我们可以处理url来获得其中的信息, 例如在前端一个表格以GET请求的形式发送到后台时：

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>index</title>
  </head>
  <body>
    <form action="http://localhost:8080/" method="get">
    username<input type="text" name="username" placeholder="username"></br>
    password<input type="password" name="password" placeholder="password"></br>
    <input type="button" value="submit">
  </form>
  </body>
</html>
```

![](http://ww1.sinaimg.cn/large/6b1abb29gy1fi8tk44k0bj205x01qaa3.jpg)

假设在username和password中分别输入user3301和1234,发送后会以`localhost:8080/?username=user3301&password=1234`发送到后台. 在后台可以通过request域接收数据：

```
const http=require('http');
const fs = require('fs');

var server = http.createServer(function(request,response) {

  var GET = {};
  if(request.url.indexOf('?')!=-1){
    //request.url = /?username=user3301&password=1234
    var arr1 = request.url.split('?');
    // arr1[0] = > '/'
    //arr2[1] = > 'username=user3301&password=1234'

    var arr2 = arr1[1].split('&');
    //arr2 = > ['username=user3301', 'password=1234'];

    for(var i=0; i<arr2.length;i++) {
      var arr3 = arr2[i].split('=');
      GET[arr3[0]] = arr3[1];
    }

    console.log(GET);
  }
else {
  console.log(GET);
}

});

server.listen('8080');
```

通过spilt方法可以将请求数据分成username和password，存入GET中 ：

```
{username: 'user3301', password: '1234'}
```

## `POST`请求的处理
