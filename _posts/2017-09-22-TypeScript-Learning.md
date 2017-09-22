---
layout: post
title: "TypeScript学习笔记"
date: 2017-09-22
excerpt: "TypeScript study"
tags: [TypeScript, ES6]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# TpyeScript学习笔记一
`TpyeScript`是`Microsoft`和`Google`联合推出的强类型的脚本语言。
`TypeScript`有以下的优点：
* 良好的支持`ES6`规范
* 强大的IDE支持，由于是强类型语言，IDE可以更加精准的进行变量类型检查，自动全局修改变量名，同时也是`Angular 2`前端框架的开发语言。

## String类的特性

### 多行字符串
在`JavaScript`中，如果我们想要分多行写一个字符串的话：

```
var str = "aaa" +
          "bbb" +
          "ccc";
console.log(str);
//output: aaabbbcc
```

在`TypeScript`中可以使用`符号（键盘1左边的键）来给字符串赋值，其中可以随意换行。

```
var str = `aaa
           bbb
           ccc`;
console.log(str);
//output:aaabbbccc
```

### 字符串模板
在`TypeScript`中，可以通过字符串模板来在一个字符串中调用变量和方法：

```
var myName = "user3301";
var getName = function() {
    return "3301user";
}

console.log(`hello ${myName} ${getName()}`)
//output: hello user3301 3301user
```

需要注意的是字符串模板只能在1键左边的符号中使用。