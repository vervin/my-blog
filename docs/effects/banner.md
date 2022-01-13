---
title: 手写一个移动轮播
date: 2018-05-13 19:16:53
categories:
- Javascript特效
tags:
- Javascript特效
---
## 轮播是基础特效中较有代表性的一种
<!--more-->

```
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<meta name="copyright" content="谢尔铎Sheldon">
<meta name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="ie=edge">
<title>无缝滚动轮播图</title>
<style>
        *{
            margin:0;
            padding:0;
            list-style: none;
        }
    #box{
        width:16rem;
        height: 7.5rem;
        overflow: hidden;
        position: relative;
        margin:0 auto;
    }
    #box ul{
        width:96rem;
        height: 7.5rem;
        transform: translateX(-16rem);

    }
    #box ul li{
        width:16rem;
        height:7.5rem;
        float: left;
        font-size:2rem;
        color: #fff;
        line-height: 7.5rem;
        text-align: center;
    }
</style>
<script>
//用js监听屏幕的大小来改变根元素的font-size
    (function(win,doc){
        function change(){
            doc.documentElement.style.fontSize = doc.documentElement.clientWidth*20/320 +'px';
        }
        change();
        win.addEventListener('resize',change,false);
    })(window,document);
</script>
<script>
    document.addEventListener('DOMContentLoaded',function(){
        var oBox = document.getElementById('box');
        var oUl = document.querySelector('#box ul');
        var aLi = oUl.children;
        var iNow = 1;
        var x = -iNow*aLi[0].offsetWidth;
        //设置一个开关,是css运动结束后解锁
        var bReady = true;
        oUl.addEventListener('touchstart',function(ev){
            if(bReady==false){return;}
            bReady = false;
            oUl.style.transition = 'none';
            var disX = ev.targetTouches[0].pageX - x;
            var downX = ev.targetTouches[0].pageX;
            function fnMove(ev){
                x = ev.targetTouches[0].pageX - disX;
                oUl.style.transform = 'translate3d('+x+'px,0,0)';
            }
            function fnEnd(ev){
                var upX = ev.changedTouches[0].pageX;
                //判断是否移动距离大于50
                if(Math.abs(upX - downX)>50){
                    //左边移动
                    if(upX - downX<0){
                        iNow++;
                        if(iNow==aLi.length){iNow=aLi.length-1;}
                    }else{
                    //右边移动
                        iNow--;
                        if(iNow==-1){iNow=0;}
                    }
                }
                //储存此时ul的位置
                x = -iNow*aLi[0].offsetWidth;
                oUl.style.transform = 'translate3d('+x+'px,0,0)';
                oUl.style.transition = '200ms all ease';

                //监听li 当移动到两端的li时  瞬间移回
                function tEnd(){
                    if(iNow==5){
                        iNow=1;
                    }
                    if(iNow==0){iNow=4;}
                    oUl.style.transition = 'none'
                    x = -iNow*aLi[0].offsetWidth;
                    oUl.style.transform = 'translate3d('+x+'px,0,0)';
                    bReady = true;
                }
                oUl.addEventListener('transitionend',tEnd,false);
                //释放内存
                document.removeEventListener('touchend',fnEnd,false);
                document.removeEventListener('touchmove',fnMove,false);
            }

            document.addEventListener('touchmove',fnMove,false);
            document.addEventListener('touchend',fnEnd,false);
            //阻止默认事件
            ev.preventDefault();
        },false);
    },false);
</script>
</head>
<body>
<div id="box">
    <ul>
        <li style ="background:green">3</li>
        <li style="background: red;">0</li>
        <li style="background: yellow;">1</li>
        <li style="background: blue;">2</li>
        <li style ="background:green">3</li>
        <li style="background: red;">0</li>
    </ul>
</div>
</body>
</html>
```