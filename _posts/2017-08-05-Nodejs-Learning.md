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
[所有的练习案例代码](https://github.com/user3301/NodeExpress)

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
`POST`请求应为不在url地址中传递，所以不能够使用解析url的办法来解析请求，`POST`请求是通过`request.on()`方法来持续接收`POST`请求(POST请求最大可以高达1G，所以为分段发送)：

```
//POST
var str = '';
//data数据 - 当有数据到达的时候就接收（很多次）
request.on('data', function(){
  str+=data;
});
//end数据 - 全部到达的时候执行（1次）
request.on('end', function(){
  var POST = querystring.parse(str);
  console.log(POST);
});
```

## 简单`Nodejs`服务器的编写
掌握以上知识后我们可以通过这些类中的方法来搭建一个简单的可以处理`POST`和`GET`请求的服务器：

```
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');

var server = http.createServer(function(request,response) {
  //GET
  var obj = urlLib.parse(request.url,true);

  var url = obj.pathname;
  const GET = obj.query;

  //POST
  var str = '';
  request.on('data', function(){
    str+=data;
  });
  request.on('end', function(){
    const POST = querystring.parse(str);
  });

if(url=='/user') {
  
}
else {
  var fileName = './www' + url;
  fs.readFile(fileName,function(err,data){
    if(err) {
      response.write('404');
    }
    else {
      response.write(data);
    }
    response.end();
  });
});
}


server.listen('8080');
```

## `querystring`类
`querystring`类是`Nodejs`中一个能够将`GET`请求中的参数以`JSON`格式解析出来的一个类：

```
const http = require('http');
const querystring = require('querystring');

var server = http.createServer(function(request, response) {
  var GET = {};
  if(request.url.indexOf('?')!=-1) {
    var arr = request.url.split('?');
    var url = arr[0];

    GET = querystring.parse(arr[1]);
  }
  else {
    var url = request.url;
  }

  console.log(url,GET);
  })
```

其中的`parse`方法能够将之前的arr[1] = 'username=user3301&password=1234'自动转换成`{username:user3301, password:1234}`的`JSON`格式。

## `url`类
`url`类能够把`url`解析成包含如下属性的一个`JSON`数组：
```
const urlLib = require('url');
var obj = urlLib.parse('http://www.baidu.com/index?a=12&b=5');
console.log(obj);
```

`OUTPUT:`
```
Url {
  protocol: 'http:',
  slashes: true,
  auth: null,
  host: 'www.baidu.com',
  port: null,
  hostname: 'www.baidu.com',
  hash: null,
  search: null,
  query: 'a=12&b=5',
  pathname: '/',
  path: '/',
  href: 'http://www.baidu.com/' }
```

其中如果在`parse`方法中直接输入一个`url`（如上）， 得到的结果中`query`属性为未解析的字符串，如果在方法中添加一个`true`属性，那么`query`将被解析为`JSON`格式：

```
var obj = urlLib.parse('http://www.baidu.com/index?a=12&b=5');
console.log(obj.query);
```

`OUTPUT`：

```
a:'12', b:'5'
```

## `POST`请求的处理
`POST`请求应为不在url地址中传递，所以不能够使用解析url的办法来解析请求，`POST`请求是通过`request.on()`方法来持续接收`POST`请求(POST请求最大可以高达1G，所以为分段发送)：

```
//POST
var str = '';
//data数据 - 当有数据到达的时候就接收（很多次）
request.on('data', function(){
  str+=data;
});
//end数据 - 全部到达的时候执行（1次）
request.on('end', function(){
  var POST = querystring.parse(str);
  console.log(POST);
});
```

## 简单`Nodejs`服务器的编写
掌握以上知识后我们可以通过这些类中的方法来搭建一个简单的可以处理`POST`和`GET`请求的服务器：

```
const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const urlLib = require('url');

var server = http.createServer(function(request,response) {
  //GET
  var obj = urlLib.parse(request.url,true);

  var url = obj.pathname;
  const GET = obj.query;

  //POST
  var str = '';
  request.on('data', function(){
    str+=data;
  });
  request.on('end', function(){
    const POST = querystring.parse(str);
  });

if(url=='/user') {

}
else {
  var fileName = './www' + url;
  fs.readFile(fileName,function(err,data){
    if(err) {
      response.write('404');
    }
    else {
      response.write(data);
    }
    response.end();
  });
});
}


server.listen('8080');
```

## 简单`Nodejs`作为后端程序的案例 - 用户的登陆与注册
掌握了以上的简单`GET`和`POST`请求的处理方法之后我们就能够使用`Nodejs`来完成一个简单的后台逻辑， 假设我们要接收前端的一个简单的用户注册账号和登陆的业务：
* 接口(注册业务)： `/user?act=reg&username=aaa&password=1234`， 之后返回给前台一个`JSON`对象，其中包含数据`{'okay':true/false, 'msg':'reason'}`
* 登陆业务： `/user?act=login&username=aaa&password=1234` 之后同样返回给前台一个`JSON`对象，其中包含数据`{'okay':true/false, 'msg':'reason'}`

`server.js`

```
const http=require('http');
const fs=require('fs');
const querystring=require('querystring');
const urlLib=require('url');

var users={};   //mockup database

var server=http.createServer(function (req, res){
  //parse request data
  var str='';
  req.on('data', function (data){
    str+=data;
  });
  req.on('end', function (){
    var obj=urlLib.parse(req.url, true);

    const url=obj.pathname;
    const GET=obj.query;
    const POST=querystring.parse(str);

    //distinguish request type: interface or file
    if(url=='/user'){   //interface
      switch(GET.act){
        case 'reg':
          //1.check if username exists
          if(users[GET.user]){
            res.write('{"ok": false, "msg": "username already exists"}');
          }else{
            //2.create username
            users[GET.user]=GET.pass;
            res.write('{"ok": true, "msg": "register success"}');
          }
          break;
        case 'login':
          //1.validate user
          if(users[GET.user]==null){
            res.write('{"ok": false, "msg": "user does not exist"}');
          //2.check password matching
          }else if(users[GET.user]!=GET.pass){
            res.write('{"ok": false, "msg": "username or password incorrect"}');
          }else{
            res.write('{"ok": true, "msg": "login success"}');
          }
          break;
        default:
          res.write('{"ok": false, "msg": "unknown action"}');
      }
      res.end();
    }else{              //file
      //read file
      var file_name='./www'+url;
      fs.readFile(file_name, function (err, data){
        if(err){
          res.write('404');
        }else{
          res.write(data);
        }
        res.end();
      });
    }
  });
});

server.listen(8080);
```

`Login.html`

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <script src="ajax.js" charset="utf-8"></script>
    <script type="text/javascript">
      window.onload=function (){
        var oTxtUser=document.getElementById('user');
        var oTxtPass=document.getElementById('pass');
        var oBtnReg=document.getElementById('reg_btn');
        var oBtnLogin=document.getElementById('login_btn');

        oBtnLogin.onclick=function (){
          ajax({
            url: '/user',
            data: {act: 'login', username: oTxtUser.value, password: oTxtPass.value},
            type: 'get',
            success: function (str){
              var json=eval('('+str+')');

              if(json.ok){
                alert('login success');
              }else{
                alert('login fail'+json.msg);
              }
            },
            error: function (){
              alert('error');
            }
          });
        };

        oBtnReg.onclick=function (){
          ajax({
            url: '/user',
            data: {act: 'reg', user: oTxtUser.value, pass: oTxtPass.value},
            type: 'get',
            success: function (str){
              var json=eval('('+str+')');

              if(json.ok){
                alert('register success');
              }else{
                alert('register fail'+json.msg);
              }
            },
            error: function (){
              alert('error');
            }
          });
        };
      };
    </script>
  </head>
  <body>
    username: <input type="text" id="user"><br>
    password: <input type="password" id="pass"><br>
    <input type="button" value="register" id="reg_btn">
    <input type="button" value="login" id="login_btn">
  </body>
</html>
```
