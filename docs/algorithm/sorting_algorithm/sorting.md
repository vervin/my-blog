---
title: 优雅的 JavaScript 排序算法（ES6）
date: 2018-09-07 12:15:00
categories:
- Javascript算法
tags:
- Javascript算法
---

## 前言

![十大经典算法导图](./sorting/time.png)
<!--more-->


> 为何我们需要如此多的排序算法


* 归并排序适用于排序关联的列表（因为它不需要获得像数组一样可以访问任何下标的数据的特性）
* 堆排序非常适用于排序数组（并且被许多关系型数据库引擎用于内存中排序，或 polyphase merge sort ），它使用少量额外的空间，但是是非常可预测的（因为无论什么数据输入都是 O(n·log(n)) time），是数据库引擎中需要的排序算法。
* 快速排序具有出色的平均排序性能（比 n·log(n)) time 还要快），也有最坏情况的 O(n²)，它是大部分库的默认排序方式（如 JavaScript 的 array.sort() ），它的最坏情况是数据库引擎不用它的原因（即快速排序不是完美无缺的）。
* 当你的数据元素接近排序完成时，插入排序是好的选择。而如果你要向一个排序的数组/列表中加入几个元素的话，插入排序同样很适合。
* 甚至是最被人吐槽的、低级的冒泡算法也有适合它的地方：如果你有一个很小的待排序列表，而你可以忍受它的 O(n²) 效率时，它简短的代码将会很合适。


> We have many different ones because they satisfy different sorting use-cases. Some examples:

* Merge sort is useful for sorting linked lists.
  Polyphase merge sort is useful if the sort set can’t fit into RAM.
* Heapsort is very good for sorting arrays (and is used by many relational db engines for in-memory sorting, or for the memory part of polyphase merge sort). It uses little extra RAM and is very predictable, which is the sort of behavior you want in a db engine.
* Quicksort has excellent average-case behavior - and poor worst-case behavior - and is the default sort for most sorting library implementations.Its bad worst-case behavior is why it isn’t used for db engines.
* Insertion sort is good if you have a set that is almost sorted; it’s good if you have a sorted list that has a couple items added to it occasionally but then needs to be resorted.
* Even the much-ridiculed (including by me) Bubble sort algorithm has its use case: if you have a very small sort set so you can stand its O(n²) average case and don’t want a lot of code - as it’s by far the shortest sort algorithm by simple count of code - it can be used.

### swap 函数（ES5）

```
function swap(arr, indexA, indexB) {
  var temp;

  temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
}
```
### swap 函数（ES6）

```
function swap(arr, indexA, indexB) {
  [arr[indexA], arr[indexB]] = [arr[indexB], arr[indexA]];
}
```

## Bubble Sort 冒泡排序

### 简明解释

通过依次比较、交换相邻的元素大小（按照由小到大的顺序，如果符合这个顺序就不用交换）。

> 1 次这样的循环可以得到一个最大值，n - 1 次这样的循环可以排序完毕。

![冒泡排序图解](./sorting/bubble.gif)

### 基本实现

```
function bubbleSort(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        swap(arr, j, j + 1);
      }
    }
  }

  return arr;
}
```

### 缓存 pos
> 设置一标志性变量 pos,用于记录每趟排序中最后一次进行交换的位置。
> 由于 pos 位置之后的记录均已交换到位,故在进行下一趟排序时只要扫描到 pos 位置即可。

```
function bubbleSort2(arr) {
  let i = arr.length - 1;

  while (i > 0) {
    let pos = 0;

    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        pos = j;
        swap(arr, j, j + 1);
      }
    }
    i = pos;
  }

  return arr;
}

```

### 双向遍历

> 传统冒泡排序中每一趟排序操作只能找到一个最大值或最小值,
> 我们可以 在每趟排序中进行正向和反向两遍冒泡 ，
> 一次可以得到两个最终值（最大和最小） , 从而使外排序趟数几乎减少了一半。

```
function bubbleSort3(arr) {
  let start = 0;
  let end = arr.length - 1;

  while (start < end) {
    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
      }
    }
    end -= 1;
    for (let i = end; i > start; i--) {
      if (arr[i - 1] > arr[i]) {
        swap(arr, i - 1, i);
      }
    }
    start += 1;
  }

  return arr;
}

```

### 结合 2&3

```
function bubbleSort4(arr) {
  let start = 0;
  let end = arr.length - 1;

  while (start < end) {
    let endPos = 0;
    let startPos = 0;

    for (let i = start; i < end; i++) {
      if (arr[i] > arr[i + 1]) {
        endPos = i;
        swap(arr, i, i + 1);
      }
    }
    end = endPos;
    for (let i = end; i > start; i--) {
      if (arr[i - 1] > arr[i]) {
        startPos = i;
        swap(arr, i - 1, i);
      }
    }
    start = startPos;
  }

  return arr;
}
```

### 蚂蚁金服面试

> 对于冒泡排序来说，能不能传入第二个参数（参数为函数），来控制升序和降序？（联想一下 array.sort()）

```

function bubbleSort(arr, compareFunc) {
  for (let i = arr.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (compareFunc(arr[j], arr[j + 1]) > 0) {
        swap(arr, j, j + 1);
      }
    }
  }

  return arr;
}

// test
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(bubbleSort(arr, (a, b) => a - b));
console.log(bubbleSort(arr, (a, b) => b - a));
```

## Quick Sort 快速排序


### 简明解释

1. 从数列中挑出一个元素，称为”基准”（pivot），
2. 重新排序数列，所有比基准值小的元素摆放在基准前面，所有比基准值大的元素摆在基准后面（相同的数可以到任何一边）。在这个分区结束之后，该基准就处于数列的中间位置。这个称为分区（partition）操作。
3. 递归地（recursively）把小于基准值元素的子数列和大于基准值元素的子数列排序。

![快速排序图解](./sorting/quick.gif)
![快速排序图解](./sorting/quick.jpg)

### 基本实现
```
function quickSort(arr) {
  const pivot = arr[0];
  const left = [];
  const right = [];
  
  if (arr.length < 2) { return arr; }

  for (let i = 1, len = arr.length; i < len; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
  }

  return quickSort(left).concat([pivot], quickSort(right));
}

// test
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(quickSort(arr));
```

### 函数式编程

```
function quickSort2(arr) {
  const pivot = arr.shift();
  const left = [];
  const right = [];

  if (arr.length < 2) { return arr; }

  arr.forEach((element) => {
    element < pivot ? left.push(element) : right.push(element);
  });

  return quickSort2(left).concat([pivot], quickSort2(right));
}

// test
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(quickSort2(arr));
```

### in-place
```
function quickSort3(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivot = partition(arr, left, right);

    quickSort3(arr, left, pivot - 1);
    quickSort3(arr, pivot + 1, right);
  }
  return arr;
}

function partition (arr, left ,right) {
  let pivot = left; // 以第一个元素为 pivot

  for (let i = left + 1; i <= right; i++) {
    if (arr[i] < arr[left]) { 
      swap(arr, i, pivot);
      pivot += 1;
    }
  }
  swap(arr, left, pivot); //将 pivot 值移至中间
  
  return pivot;
}

// test
const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(quickSort3(arr));
```


### 关于 pivot 的选取

> const pivot = left + Math.ceil((right - left) * 0.5)

```
function quickSort4(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    // const pivot = left + Math.ceil((right - left) * 0.5);
    const pivot = Math.floor((right + left) / 2);
    const newPivot = partition(arr, pivot, left, right);

    quickSort4(arr, left, newPivot - 1);
    quickSort4(arr, newPivot + 1, right);
  }

  return arr;
}

function partition(arr, pivot, left, right) {
  const pivotValue = arr[pivot];
  let newPivot = left;

  swap(arr, pivot, right);
  for (let i = left; i < right; i++) {
    if (arr[i] < pivotValue) {
      swap(arr, i, newPivot);
      newPivot += 1;
    }
  }
  swap(arr, right, newPivot);

  return newPivot;
}

const arr = [91, 60, 96, 7, 35, 65, 10, 65, 9, 30, 20, 31, 77, 81, 24];
console.log(quickSort4(arr));
```
## 参考链接
[优雅的 JavaScript 排序算法（ES6）](https://www.rayjune.me/2018/03/22/elegant-javascript-sorting-algorithm-es6/)<br/> 
[js十大排序算法详解](https://www.cnblogs.com/liyongshuai/p/7197962.html)
