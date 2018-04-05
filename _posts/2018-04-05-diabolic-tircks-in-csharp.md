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

