---
layout: post
title: "Fluent Interface-设计模式之链式API"
date: 2017-09-14
excerpt: "Fluent Interface"
tags: [Design Pattern]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# Fluent Interface - 设计模式之链式API
首先在`Wikipedia`中对于`Fluent Interface`的定义为：

> Fluent Interface
>> A fluent interface is normally implemented by using method cascading (concretely method chaining) to relay the instruction context of a subsequent call (but a fluent interface entails more than just method chaining [1]). Generally, the context is</br> 1.defined through the return value of a called method </br> 2. self-referential, where the new context is equivalent to the last context</br> 3. terminated through the return of a void context.

其中说到链式接口满足三个特点：
1. 通过被调的返回值定义
2. 自引用，新的上下文等于老的上下文
3. 返回空的上下文来终止

代码例子：

```
class Context
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Sex { get; set; }
    public string Address { get; set; }
}

class Customer
{
    private Context _context = new Context(); // Initializes the context

    // set the value for properties
    public Customer FirstName(string firstName)
    {
        _context.FirstName = firstName;
        return this;
    }

    public Customer LastName(string lastName)
    {
        _context.LastName = lastName;
        return this;
    }

    public Customer Sex(string sex)
    {
        _context.Sex = sex;
        return this;
    }

    public Customer Address(string address)
    {
        _context.Address = address;
        return this;
    }
```

有上面的代码可以看出，链式设计的类是通过调用方法来向类赋值的，而且在调用了方法后将返回一个本类的引用，所以返回后可以继续调用类的方法，那么就可以实现类似链式的操作：

```
Customer c1 = new Customer();
       // Using the method chaining to assign & print data with a single line
       c1.FirstName("vinod").LastName("srivastav").Sex("male").Address("bangalore").Print();
```

这种风格的设计被称为`Fluent Interface`。

[Unit Converter with Fluent Interface](https://github.com/user3301/Fluent_Interface_Converter)
