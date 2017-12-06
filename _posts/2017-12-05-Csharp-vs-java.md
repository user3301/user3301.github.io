---
layout: post
title: "C#语法及特性与Java异同点"
date: 2017-12-05
excerpt: "Java v.s C#."
tags: [C#]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---
# 命名规范
## java
Java命名规范是以数字、字母、下划线、$符号组成，数字不能作为开头。命名约定使用Camel风格，即首个单词首字母小写，其他之后单词大写。
## C\#
c\#命名可以是字母、下划线，数字和@符号组成，数字不能放在首位，@可以放在首位，但是不推荐作为常用字符。命名约定为Pascal风格，即每个单词首字母大写。
# C\#独有特性
## 访问修饰符
在c\# 中，默认的访问修饰符是`private`，同时还有`protected`访问修饰符，表示修饰对象只能被本类和子类访问，实例不能访问， `internal`访问修饰符表示内部访问，仅限于本项目访问，其他不能访问,实例可以访问。`proptected internal`表示内部保护访问，只限于项目本身或者子类访问，其他不能访问,实例不能访问。
## `var`关键字
在c\#中，var关键字相当于一个语法上的速记，表示任何可以从初始化的右边推断出的类型。其使用条件为：
* 只能用于本地变量，不能用于字段
* 只能在变量声明中包含初始化时使用
* 一旦编译器推断出类型，它就是固定且不能更改的
## `const`关键字
`const`关键字不是一个修饰符，是核心声明的一部分，必须直接放在类型的前面。`const`常量默认为静态的，不需要`static`关键字修饰。其使用条件为：
* 常量在声明中**必须初始化**
* 常量在声明后**不能改变**
## `readonly`关键字
`readonly`关键字跟`const`类似，一旦值被设定就不能改变。但是`readonly`关键字可以在下列任意位置设置它的值：
* 字段声明语句，如同`const`
* 类的任何构造函数，如果是`static`字段，初始化必须在`static`构造函数中完成。
* `const`字段的值必须在编译期决定，而`readonly`字段的值可以在运行期间决定。这种增加的自由行允许你在不同的构造函数中设置不同的值。
* 和`const`不同，`const`总是像静态的，而`readonly`字段： 可以是实例的字段（实例对象可以使用）,也可以是静态字段（readonly更像java中的final static(唯一区别是final static也需要声明时赋值),实例对象和类都可以使用。）
* `readonly`在内存中有存储位置。

## `ref`与`out`类型形参
引用参数(`ref`)使用时，在方法的声明和调用中都要使用`ref`修饰符。
实参必须是变量，在用作实参前必须被赋值。如果是引用变量，可以赋值为一个引用或者null值。
引用参数有以下特征：
* 不在栈中为形参分配新的内存
* 形参的名称相当于实参变量的别名，引用与实参相同的内存位置。（方法内部的改变会造成实际改变）

```
void MyMethod(ref int val)  //方法声明
{...}

int y = 1;

MyMethod(ref y); //方法调用
```
输出参数（`out`）用于从方法体把数据传出到调用代码，他们非常类似引用参数，使用要求如下：
* 必须在声明的调用中都使用修饰符。 输出参数的修饰符是out。
* 实参必须是变量，不能是其他表达式类型。
```
void MyMethod(out int val)
{
    ...
}

int y = 1;

MyMethod(out y)
```
