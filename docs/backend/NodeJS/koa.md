---
title: Koa 与 Express
date: 2018-08-31 15:53:53
categories:
- KOA
tags:
- NodeJS框架
---

## Hello World!

```
// express
const app = require("express")();
app.use((req,res,next)=>{
    res.status(200).send("<h1>Hello</h1>")
})
app.listen(3000)
```
<!--more-->
```
// koa
const Koa  = require('koa');
const app = new Koa();
app.use(ctx=>{
    ctx.response.body = ctx
})
app.listen(3000)
```

## 启动方式

> koa采用了new Koa()的方式，而express采用传统的函数形式.

```
// koa
const Emitter = require('events');
module.exports = class Application extends Emitter {
...
}
// express
exports = module.exports = createApplication;
function createApplication() {
...
}
```


##中间件的处理

```
// express
const app = require("express")();
app.use((req,res,next)=>{
    console.log("first");
    next();
});
app.use((req,res,next)=>{
    console.log("second");
    next();
});
app.use((req,res,next)=>{
    console.log("third");
    res.status(200).send("<h1>headers ...</h1>");
});
app.listen(3001);
```

```
// koa
const Koa = require('koa');
const app = new Koa();
app.use((ctx,next) => {
   ctx.body = 'Hello Koa-1';
   next();
 });
 app.use((ctx,next) => {
   ctx.body = 'Hello Koa-2';
   next();
 });
 app.use((ctx,next) => {
   ctx.body = 'Hello Koa-3';
   next();
 });
app.listen(3000);
```


> 上面介绍了koa的next()的功能，这里的next()需要同步调用，千万不要采用异步调用，不要写成下面的形式，这样相当于未调用next()

```
app.use((ctx,next) => {
   ctx.body = 'Hello Koa-2';
   setTimeout(()=>next(),3000);
   //next();
});
```

> 虽然上面分析了二者的使用逻辑不一样，但是由于koa在入参处给出了context，而该结构体包含了我们返回请求的所有信息，所以我们仍然可以写出下面的代码：

```
const Koa = require('koa');
const app = new Koa();

app.use((ctx)=>{
    const res = ctx.res;
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8','Accept-Language':'zh-CN,zh;q=0.8,en;q=0.6'});
    res.end('<h1>标题</h1>');
});

// response
 app.use(ctx => {
   ctx.body = 'Hello Koa';
 });
app.listen(3000);
```

> 这样的逻辑就和express很类似了，原理也一样。这样写以后，前端的请求得到的结果就是&lt;h1&gt;标题&lt;/h1&gt;，而后续的app.use实际并没有得到执行。

## 分路由处理


```
// express
const app = require("express")();
app.use("/first", (req, res, next) => {
    console.log("first");
    res.status(200).send("<h1>headers-first ...</h1>");
});
app.use("/second", (req, res, next) => {
    console.log("second");
    res.status(200).send("<h1>headers-second ...</h1>");
});
app.use("/third", (req, res, next) => {
    console.log("third");
    res.status(200).send("<h1>headers-third ...</h1>");
});
app.listen(3001);
```

```
// koa
const Koa = require('koa');
const app = new Koa();
app.use("/",ctx => {
   ctx.body = 'Hello Koa';
 });
app.listen(3000);

```

> 这么写会报错，因为koa本身并不支持按路由相应，如果需要这么做，可以通过引入第三方包实现。在koajs中有一个简单的router包。 
具体写法如下：

```
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', function (ctx, next) {
    ctx.body="Hello Koa";
})
router.get('/todo',(ctx,next)=>{
    ctx.body="Todo page"
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000,()=>{
  console.log('starting at port 3000');
});
```


```
//多层路由

const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();

//子路由1
let home = new Router();
home.get('/home', async(ctx)=>{
    ctx.body="Hello /home/home/";
});
home.get('/todo',async(ctx)=>{
    ctx.body="Hello /home/todo/";
});
//子路由2 
let page = new Router();
page.get('/home', async(ctx)=>{
    ctx.body="Hello /page/home/";
});
page.get('/todo',async(ctx)=>{
    ctx.body="Hello /page/todo/";
});
//父级路由
let router = new Router();
router.use('/home',home.routes(),home.allowedMethods());
router.use('/page',page.routes(),page.allowedMethods());

app.use(router.routes()).use(router.allowedMethods());
app.listen(3000,()=>{
  console.log('starting at port 3000');
});

```

## 异步的实现
 
> 初衷是打印请求处理耗时
```
// koa 
const Koa = require('koa');
const app = new Koa();
app.use((ctx,next) => {
   ctx.body = 'Hello Koa-1';
   let start = new Date();
   next().then(()=>{
        console.log("time cost:",new Date()-start);
   });
 });
 app.use((ctx,next) => {
   ctx.body = 'Hello Koa-2';
   next();
 });
 app.use((ctx,next) => {
   ctx.body = 'Hello Koa-3';
   next();
 });
app.listen(3000);
```
> 由于koa采用了promise的方式处理中间件，next()实际上返回的是一个promise对象，所以可以用上面简单的方式记录处理耗时。如果在es7下，可以采用更简单的写法：
```
//es7 koa

const Koa = require('koa');
const app = new Koa();
app.use(async (ctx,next) => {
   ctx.body = 'Hello Koa-1';
   let start = new Date();
   await next();
   console.log("time cost:",new Date()-start);
 });
 app.use(async (ctx,next) => {
   ctx.body = 'Hello Koa-2';
   //这里用了一个定时器表示实际的操作耗时
   await new Promise((resolve,reject)=>setTimeout(()=>{next();resolve();},3000));
 });
 app.use((ctx,next) => {
   ctx.body = 'Hello Koa-3';
   next();
 });
app.listen(3000);

```
>这样只需要在入口放置一个中间件即可完成耗时记录。


>由于express并没有使用promise而是采用了回调的方式处理中间件，所以无法采用上面这样便利的方式获取耗时。即便是对next()进行封装，也无济于事，因为必须保证后续的next()全部都被封装才能得到正确的结果。 


```
let time = null;
.use('/', (req, res, next) => {
      time = Date.now();
      next()
    })
    .use('/eg', bidRequest)
    .use('/', (req, res, next) => {
      console.log(`time cost[${req.baseUrl}] : `, Date.now() - time, 'ms');
    })
```


## 总结

koa和express的区别还是比较大的，koa的内容很少，就是对nodejs本身的createServer函数做了简单的封装，没有做很多的延伸；而express主要是比koa多了router。二者的的代码思路还是很不一样的，不过实际使用中并不会有太大障碍。





