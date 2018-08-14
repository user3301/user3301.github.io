---
layout: post
title: "C#奇技淫巧"
date: 2018-04-05
excerpt: "Diabolic tricks and wicked craft"
tags: [C#]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# C\# 编程奇技淫巧
长期更新， 记录工作中遇到的各种大神精妙的代码书写风格和设计模式。

## `partial` 方法让settings变量后期改变：

```
// Client 类constructor
 public Client(string baseUrl)
        {
            BaseUrl = baseUrl; 
    		_settings = new System.Lazy<Newtonsoft.Json.JsonSerializerSettings>(() => 
            {
                var settings = new Newtonsoft.Json.JsonSerializerSettings();
                UpdateJsonSerializerSettings(settings);
                return settings;
            });
    	}
    
 partial void UpdateJsonSerializerSettings(Newtonsoft.Json.JsonSerializerSettings settings);
```

## 使用`TrimEnd`方法来确保url正确性

```
var urlBuilder = new StringBuilder();
urlBuilder.Append(BaseUrl != null ? BaseUrl.TrimEnd('/') : "").Append("/api/TokenAuth/Authenticate");
```

## 拼接`querystring`

```
 var urlBuilder = new StringBuilder();
            urlBuilder.Append(_baseUrl != null ? _baseUrl.TrimEnd('/') : "").Append("/api/audiofiles?");
            urlBuilder.Append("filename=").Append(filename).Append("&");
            if (customerkey != null)
            {
                urlBuilder.Append("customerkey=").Append(customerkey).Append("&");
            }
            urlBuilder.Append("processmode=").Append(processmode == ProcessModeEnum.StoreandProcess ? 1 : 0).Append("&");
            urlBuilder.Append("deleteafterprocessing=").Append(deleteafterprocessing).Append("&");
            urlBuilder.Append("forceoverwrite=").Append(forceoverwrite).Append("&");
            urlBuilder.Length--; 
```

最后使用`Length--`来去除多余的`&`。

## null vs String.Empty vs ""
`null`表示string值为`no value`;</br>
`""`表示string值为`a blank string`;</br>
`String.Empty`值同样为`a blank string`;</br>
其中`""`和`String.Empty`的区别是什么呢？首先看下`String`类的源代码：
```
public sealed class String {
    //...
    public static readonly String Empty = "";
    //...
}
```
由此得知`String.Empty`是`String`类中的一个静态只读常量，当给`string`类型赋值时如果使用'""'则代表创建一个新string类型然后赋值，`String.Empty`则是将静态只读常量引用赋值给当前string.



