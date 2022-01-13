---
title: Javascript设计模式之一工厂模式
date: 2018-02-15 19:16:53
categories:
- Javascript设计模式
tags:
- Javascript设计模式
---

> 设计模式这一系列文章是对JavaScript的总结和归纳

### 工厂模式（Factory）

* 定义：简单工厂模式是由一个方法来决定到底要创建哪个类的实例, 而这些实例通常都拥有相同的接口（属性和方法）。
* 举例：计算器（加、减、乘、除）、自行车售卖（山地、公路）、饮料机（咖啡、牛奶、水）、RPG中职业（战士、法师、射手）
<!--more-->

#### 简单工厂模式（Simple Factory）

* 又叫静态工厂方法，由一个工厂对象决定创建某一种产品对象类的实例。主要用来创建同一类对象。

```
function creatPop(type,text){
    //创建一个对象，并对对象拓展属性和方法
    var o=new Object();
    o.content =text;
    o.show=function(){
        //显示方法
        console.log('显示');
    };
    if(type === 'alert'){
        //警示框差异部分
        console.log('警示框差异部分');
    }
    if(type === 'prompt'){
        //提示框差异部分
        console.log('提示框差异部分');
    }
    if(type === 'confirm'){
        //确认框差异部分
        console.log('确认框差异部分');
    }
    return o;
}
//创建警示框
var userNameAlert=creatPop('alert','用户名只能是26个字母和数字');
console.log(userNameAlert.content);
userNameAlert.show();
```


#### 工厂方法模式(Factory Methods)

* 通过对产品类的抽象使其创建业务主要负责用于创建多类产品的实例

```
//安全模式创建的工厂类
var Factory =function(type,content){
    if(this instanceof Factory){
        var s=new this[type](content);
        return s;
    }else{
        return new Factory(type,content);
    }
};
//工厂原型中设置创建所有类型对象的基类
Factory.prototype={
    Java:function(content){
        this.content=content;
        this.name='java';
        (function(){
            console.log("执行成功"+content);
        })(content)
    },
    Javascript:function(content){
        this.content=content;
        this.name='Javascript'
    }
};

var data=[
    {type:'Javascript',countent:'Javascript 哪家强'},
    {type:'Java',countent:'Java 哪家强'}
    ];
var arr=[];
for(var i=0;i<data.length;i++){
    arr.push(Factory(data[i].type,data[i].countent));
}
console.log(arr);
```
#### 抽象工厂模式(Abstract Factory)

 * 通过对类的工厂抽象使其业务用于对产品簇的创建，而不负责创建某一类产品的实例


 ```
 var Car = function () {
};
Car.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getSpeed: function () {
        return new Error('抽象方法不能调用');
    }
};
//抽象工厂方法
var VehicleFactory = function (subType, superType) {
    //判断抽象工厂中是否有该抽象类
    if (typeof VehicleFactory[superType] === 'function') {
        //缓存类
        function F() {
        };
        //继承父类属性和方法
        F.prototype = new VehicleFactory[superType]();
        //将子类constructor指向子类
        subType.constructor = subType;
        //子类原型继承’父类‘
        subType.prototype = new F();
    } else {
        //不存在该抽象类抛出错误
        throw new Error('未创建该抽象类')
    }
};
//小汽车抽象类
VehicleFactory.Car = function () {
    this.type = 'Car';
};
VehicleFactory.Car.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getSpeed: function () {
        return new Error('抽象方法不能调用');
    }
};
//公交车抽象类
VehicleFactory.Bus = function () {
    this.type = 'Bus';
};
VehicleFactory.Bus.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getSpeed: function () {
        return new Error('抽象方法不能调用');
    }
};
//货车抽象类
VehicleFactory.Truck = function () {
    this.type = 'Truck';
};
VehicleFactory.Truck.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getSpeed: function () {
        return new Error('抽象方法不能调用');
    }
};
//宝马汽车子类
var BMW = function (price, speed) {
    this.price = price;
    this.speed = speed;
};
//抽象工厂实现对Car抽象类的继承
VehicleFactory(BMW, 'Car');
BMW.prototype.getPrice = function () {
    return this.price;
};
BMW.prototype.getSpeed = function () {
    return this.speed;
};

//兰博基尼汽车子类
var Lamborghini = function (price, speed) {
    this.price = price;
    this.speed = speed;
};
//抽象工厂实现对Car抽象类的继承
VehicleFactory(Lamborghini, 'Car');
Lamborghini.prototype.getPrice = function () {
    return this.price;
};
Lamborghini.prototype.getSpeed = function () {
    return this.speed;
};

//宇通汽车子类
var YUTONG = function (price, speed) {
    this.price = price;
    this.speed = speed;
};
//抽象工厂实现对Bus抽象类的继承
VehicleFactory(YUTONG, 'Bus');
YUTONG.prototype.getPrice = function () {
    return this.price;
};
YUTONG.prototype.getSpeed = function () {
    return this.speed;
};

//奔驰汽车子类
var BenzTruck = function (price, speed) {
    this.price = price;
    this.speed = speed;
};
//抽象工厂实现对Truck抽象类的继承
VehicleFactory(BenzTruck, 'Truck');
BenzTruck.prototype.getPrice = function () {
    return this.price;
};
BenzTruck.prototype.getSpeed = function () {
    return this.speed;
};
var truck = new BenzTruck(1000000,1000);
console.log(truck);
console.log(truck.getPrice());//1000000
console.log(truck.type);//Truck
```

### 什么时候使用工厂模式
* 对象的构建十分复杂
* 需要依赖具体环境创建不同实例
* 处理大量具有相同属性的小对象