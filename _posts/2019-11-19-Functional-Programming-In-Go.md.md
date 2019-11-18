---
layout: post
title: "Functional Programming In Go"
date: 2019-11-05
excerpt: "Golang functional programming"
tags: [Golang, Functional Programming]
feature: http://ww1.sinaimg.cn/large/6b1abb29gy1fgryzol04kj21z41b84df.jpg
comments: true
---

# Functional Programming in Go

In programming world, there are basically two types of functions: `Pure Functions` and `Higher-Order Functions`. 

#### `Pure Functions` (first order function)
Function only operate on the parameters; no side effects</br>
Predictable, easy to reason about</br>
eg:

```Go
var DB *sql.DB

func myHandler(w http.ResponseWriter, r *http.Request) {
    res, err := DB.Exec(...)
}
```

#### `Higher-Order Function`

A `Higher-Order Funciton` is a function that takes a function as an argument, or returns a function.</br>
eg:
```Go
func myHandler(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r*http.Request) {
        res, err := db.Exec(...)
        //...
    }
}
```

#### `Functor`
Functors are objects that can be treated as thought they are a function or function pointer.

## Example
Transforming a Slice

```Go
ints := []int{1,2,3,4,5,5,7}
results := make([]int, len(ints))

for i, elt := range ints {
    results[i] = DoSomething(elt)
}

func DoSomething(num int) int {
    return num + 100
}
```

We can transform above code with functors to abstract the `for-loop`:

```Go
ints := []int{1,2,3,4,5,6,7}
results := magical(ints).Map(DoSomething)
```

Which `magical()` makes a `Functor` that returns a `IntSliceFunctor`

- this functor is a Go struct that contains the data (i.e: slice)
- `Map` function that operates on the container

```Go
Map(fn func(int) int) IntSliceFunctor
```