---
title: 懒加载和预加载
date: 2018-03-28 18:06:53
categories:
- Javascript性能
- Javascript特效
tags:
- Javascript性能
---

# 懒加载
## 什么是懒加载？
懒加载也就是延迟加载。
当访问一个页面的时候，先把img元素或是其他元素的背景图片路径替换成一张大小为1*1px图片的路径（这样就只需请求一次，俗称占位图），只有当图片出现在浏览器的可视区域内时，才设置图片正真的路径，让图片显示出来。这就是图片懒加载。

<!--more-->

## 为什么要使用懒加载？
很多页面，内容很丰富，页面很长，图片较多。比如说各种商城页面。这些页面图片数量多，而且比较大，少说百来K，多则上兆。要是页面载入就一次性加载完毕。估计大家都会等到黄花变成黄花菜了。

## 懒加载的原理是什么？

页面中的img元素，如果没有src属性，浏览器就不会发出请求去下载图片，只有通过javascript设置了图片路径，浏览器才会发送请求。
懒加载的原理就是先在页面中把所有的图片统一使用一张占位图进行占位，把正真的路径存在元素的“data-url”（这个名字起个自己认识好记的就行）属性里，要用的时候就取出来，再设置；

## 懒加载的实现步骤？

1. 首先，不要将图片地址放到src属性中，而是放到其它属性(data-original)中。
2. 页面加载完成后，根据scrollTop判断图片是否在用户的视野内，如果在，则将data-original属性中的值取出存放到src属性中。
3. 在滚动事件中重复判断图片是否进入视野，如果进入，则将data-original属性中的值取出存放到src属性中。

## 懒加载的优点是什么？

页面加载速度快、可以减轻服务器的压力、节约了流量,用户体验好

## 源码

```
        var viewHeight = document.documentElement.clientHeight // 可视区域的高度

        function lazyload() {
            // 获取所有要进行懒加载的图片
            var eles = document.querySelectorAll('img[data-original][lazyload]')
            Array.prototype.forEach.call(eles, function (item, index) {
                var rect
                if (item.dataset.original === '')
                    return
                rect = item.getBoundingClientRect()
                console.log(rect)
                // 图片一进入可视区，动态加载
                if (rect.bottom >= 0 && rect.top < viewHeight) {
                    !function () {
                        var img = new Image()
                        img.src = item.dataset.original
                        img.onload = function () {
                            item.src = img.src
                        }
                        item.removeAttribute('data-original')
                        item.removeAttribute('lazyload')
                    }()
                }
            })
        }
        // 首屏要人为的调用，否则刚进入页面不显示图片
        lazyload()

        document.addEventListener('scroll', lazyload)
```


# 预加载

## 什么是预加载？
提前加载图片，当用户需要查看时可直接从本地缓存中渲染
##为什么要使用预加载？

图片预先加载到浏览器中，访问者便可顺利地在你的网站上冲浪，并享受到极快的加载速度。这对图片画廊及图片占据很大比例的网站来说十分有利，它保证了图片快速、无缝地发布，也可帮助用户在浏览你网站内容时获得更好的用户体验。

## 实现预加载的方法有哪些？
方法一：用CSS和JavaScript实现预加载

```
function preloader() {  
    if (document.getElementById) {  
        document.getElementById("preload-01").style.background = "url(http://domain.tld/image-01.png) no-repeat -9999px -9999px";  
        document.getElementById("preload-02").style.background = "url(http://domain.tld/image-02.png) no-repeat -9999px -9999px";  
        document.getElementById("preload-03").style.background = "url(http://domain.tld/image-03.png) no-repeat -9999px -9999px";  
    }  
}  
function addLoadEvent(func) {  
    var oldonload = window.onload;  
    if (typeof window.onload != 'function') {  
        window.onload = func;  
    } else {  
        window.onload = function() {  
            if (oldonload) {  
                oldonload();  
            }  
            func();  
        }  
    }  
}  
addLoadEvent(preloader);
```
方法二：仅使用JavaScript实现预加载

```
<div class="hidden">  
    <script type="text/javascript">  
        <!--//--><![CDATA[//><!--  
            var images = new Array()  
            function preload() {  
                for (i = 0; i < preload.arguments.length; i++) {  
                    images[i] = new Image()  
                    images[i].src = preload.arguments[i]  
                }  
            }  
            preload(  
                "http://domain.tld/gallery/image-001.jpg",  
                "http://domain.tld/gallery/image-002.jpg",  
                "http://domain.tld/gallery/image-003.jpg"  
            )  
        //--><!]]>  
    </script>  
</div>
```


```
function preloader() {  
    if (document.images) {  
        var img1 = new Image();  
        var img2 = new Image();  
        var img3 = new Image();  
        img1.src = "http://domain.tld/path/to/image-001.gif";  
        img2.src = "http://domain.tld/path/to/image-002.gif";  
        img3.src = "http://domain.tld/path/to/image-003.gif";  
    }  
}  
function addLoadEvent(func) {  
    var oldonload = window.onload;  
    if (typeof window.onload != 'function') {  
        window.onload = func;  
    } else {  
        window.onload = function() {  
            if (oldonload) {  
                oldonload();  
            }  
            func();  
        }  
    }  
}  
addLoadEvent(preloader);
```
方法三：使用Ajax实现预加载

```
window.onload = function() {  
    setTimeout(function() {  
        // XHR to request a JS and a CSS  
        var xhr = new XMLHttpRequest();  
        xhr.open('GET', 'http://domain.tld/preload.js');  
        xhr.send('');  
        xhr = new XMLHttpRequest();  
        xhr.open('GET', 'http://domain.tld/preload.css');  
        xhr.send('');  
        // preload image  
        new Image().src = "http://domain.tld/preload.png";  
    }, 1000);  
};
```
```
window.onload = function() {  
  
    setTimeout(function() {  
  
        // reference to <head>  
        var head = document.getElementsByTagName('head')[0];  
  
        // a new CSS  
        var css = document.createElement('link');  
        css.type = "text/css";  
        css.rel  = "stylesheet";  
        css.href = "http://domain.tld/preload.css";  
  
        // a new JS  
        var js  = document.createElement("script");  
        js.type = "text/javascript";  
        js.src  = "http://domain.tld/preload.js";  
  
        // preload JS and CSS  
        head.appendChild(css);  
        head.appendChild(js);  
  
        // preload image  
        new Image().src = "http://domain.tld/preload.png";  
  
    }, 1000);  
  
};
```





