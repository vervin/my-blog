---
title: Promise and Async
date: 2018-07-30 19:45:53
categories:
- 深入JavaScript
- ES6
tags:
- ES6
- 异步
---

## Promise

### Eg1
```
var a = 1
function aa(resolve, reject){
if(a == 1){
    resolve("123")
}else{
    reject("456")
}
}

new Promise(aa).then(function(val){
    console.log(val)   //123
})
```
<!--more-->

### Eg2
```
let state=1;
function step1(resolve,reject){
    console.log('1.开始-洗菜做饭');
    if(state==1){
        resolve('洗菜做饭--完成');
    }else{
        reject('洗菜做饭--出错');
    }
}
function step2(resolve,reject){
    console.log('2.开始-坐下来吃饭');
    if(state==1){
        resolve('坐下来吃饭--完成');
    }else{
        reject('坐下来吃饭--出错');
    }
}
function step3(resolve,reject){
    console.log('3.开始-收拾桌子洗完');
     if(state==1){
        resolve('收拾桌子洗完--完成');
    }else{
        reject('收拾桌子洗完--出错');
    }
}

new Promise(step1).then(function(val){
    console.log(val)
    return new Promise(step2)
})
.then(function(val){
    console.log(val)
    return new Promise(step3)

})
.then(function(val){
    console.log(val)
    return val
})
```
## async

> async是异步的简写，而await可以堪称async wait的简写。明白了两个单词，就很好理解了async是声明一个方法是异步的，await是等待异步方法完成。注意的是await必须在async方法中才可以使用因为await访问本身就会造成程序停止堵塞，所以必须在异步方法中才可以使用。

### async的作用？

```
async function testAsync(){
    return 'Hello';
}
const result = testAsync();
console.log(result);  //Promise { 'Hello' }
```

### await在等什么？

> await一般在等待async方法执行完毕，但是其实await等待的只是一个表达式，这个表达式在官方文档里说的是Promise对象，可是它也可以接受普通值。

```
function getSomething(){
    return 'something';
}
async function testAsync(){
    return 'Hello async';
}
async function test(){
    const v1=await getSomething();
    const v2=await testAsync();
    console.log(v1,v2);
}
test();
```

### async/await同时使用

```
function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}
async function test() {
    const v = await takeLongTime();
    console.log(v);
}
test();
```