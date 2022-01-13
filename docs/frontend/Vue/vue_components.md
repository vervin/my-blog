---
title: vue组件之间的通信
date: 2018-06-24 18:19:53
categories:
- Vue
tags:
- Vue
---

## vue 的组件

```
<div id="app">
   {{msg}}

   <button-counter></button-counter>
   <button-counter></button-counter>
   <button-counter></button-counter>
</div>
```

```
Vue.component('button-counter', {
    data(){
        return {
            count: 0
        }
    },
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

let app = new Vue({
    el:"#app",
    data:{
        msg: 'Hello Vue!'
    }
})
```

## vue 的 props - 父传子

```
<div id="app">
   {{msg}}

   <button-counter :count="count"></button-counter>
</div>

```

```
Vue.component('button-counter', {
    props: ['count'],
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})

let app = new Vue({
    el:"#app",
    data:{
        count:0
    }
})
```

## 局部注册

```
let componentA = {
    props: ['count'],
    template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
}

let app = new Vue({
    el:"#app",
    data:{
        count:0
    },
    components: {
        'button-counter': componentA
    }
})
```

## 子传父

> 父组件绑定自定义事件 “@hehe”， 子组件触发该事件 “\$emit('hehe')”

```
 <div id="app">
      <div :style="{fontSize: postFontSize + 'em'}">{{ msg }}</div>

      <button-counter
        @hehe="postFontSize += 0.1"
      ></button-counter>
</div>

```

```
     let componentA = {
        template:
          `<button v-on:click="$emit('hehe')">++</button>`
      };

      let app = new Vue({
        el: "#app",
        data: {
          msg: 'hello vue!',
          postFontSize:1
        },
        components: {
          "button-counter": componentA
        }
      });
```

## v-model

>  默认情况下，一个组件上的 v-model 会把 value 用作 prop 且把 input 用作 event。

```
let componentA = {
        template: `<div><input v-model="haha"/> {{haha}}</div>`,
        data() {
          return {
              haha: '123'
          };
        }
      };
```

```
let componentA = {
        template: `<div><input type="checkbox" value="jack" v-model="haha"/> {{haha}}</div>`,
        data() {
          return {
              haha: []
          };
        }
      };
```

> 总结： 
 
  把组件的v-model 当作一种父子传递数据的方式

  父组件传递prop给子组件，默认是value

  同时默认绑定了input事件， 我们可以在子组件中触发该事件传递数据给父组件