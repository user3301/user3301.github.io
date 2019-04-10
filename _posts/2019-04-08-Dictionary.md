---
layout: post
title: "Dictionary(Hashmap)"
date: 2019-04-08
excerpt: "Common patterns used to algorithm problems related to dictionary"
tags: [algorithms, leetcode, data structure]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

`Dictionary` in C# is very close to hashmap in Java. There are some notable differences that:

### Adding/Getting items
Java's HashMap has the put and get methods for setting/getting items
```
myMap.put(key, value)
MyObject value = myMap.get(key)
```
C#'s Dictionary uses [] indexing for setting/getting items
```
myDictionary[key] = value
MyObject value = myDictionary[key]
```
### null keys
Java's HashMap allows null keys
.NET's Dictionary throws an ArgumentNullException if you try to add a null key

### Adding a duplicate key
Java's HashMap will replace the existing value with the new one.
.NET's Dictionary will replace the existing value with the new one if you use [] indexing. If you use the Add method, it will instead throw an ArgumentException.
### Attempting to get a non-existent key
Java's HashMap will return null.
.NET's Dictionary will throw a KeyNotFoundException. You can use the TryGetValue method instead of the [] indexing to avoid this:
```
MyObject value = null;
if (!myDictionary.TryGetValue(key, out value)) { /* key doesn't exist */ }
```
Dictionary's has a ContainsKey method that can help deal with the previous two problems.

## Find Duplicate in list/array

Related Question:

[217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/)