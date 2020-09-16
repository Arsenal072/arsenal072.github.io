#### new

- 创建一个新对象；
- 执行[[Prototype]]（也就是\_\_proto\_\_）链接，执行构造函数中的代码（为这个新对象添加属性）
- 将构造函数中的this赋给新对象；
- 如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象

```js
function People(name,age){
    this.name = name;
    this.age = age;
}
function create() { 
    //创建一个空对象
    let obj = new Object();
    //获取构造函数
    let Constructor = [].shift.call(arguments);
    //链接到原型
    obj.__proto__ = Constructor.prototype;
    //绑定this值
    let result = Constructor.apply(obj, arguments); //使用apply，将构造函数中的this指向新对象，这样新对象就可以访问构造函数中的属性和方法
    //返回新对象
    return typeof result === "object" ? result : obj; //如果返回值是一个对象就返回该对象，否则返回构造函数的一个实例对象
}
let p1 = create(People, 'Rose', 18)
console.log('p1.name',p1.name)
console.log('p1.age',p1.age)
```

#### call

- call改变了this的指向，指向到foo；如果不传入参数，默认指向为 window
- 调用了bar函数

```js
var foo ={
  value:1
}
function bar(){
  console.log(this.value)
}
bar.call(foo);//1
```



```js
Function.prototype.myCall = function(context) {
  //此处没有考虑context非object情况
  context.fn = this;
  let args = [];
  for (let i = 1, len = arguments.length; i < len; i++) {
    args.push(arguments[i]);
  }
  let result = context.fn(...args);
  delete context.fn;
  return result;
};
```

参考文章：https://github.com/mqyqingfeng/Blog/issues/11

#### apply

与call原理相似

```js
Function.prototype.myapply = function(context, arr) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }

  delete context.fn;
  return result;
};
```

#### bind

bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数

- 返回一个函数，绑定this，传递预置参数
- bind返回的函数可以作为构造函数使用。故作为构造函数时应使得this失效，但是传入的参数依然有效

```js
// mdn的实现
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
          return fToBind.apply(this instanceof fBound
                 ? this
                 : oThis,
                 // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    // 维护原型关系
    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    // 下行的代码使fBound.prototype是fNOP的实例,因此
    // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```

https://github.com/mqyqingfeng/Blog/issues/12

#### Object.create

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的\_\_proto\_\_

```js
function create(proto) {
  function F() {}
  F.prototype = proto;

  return new F();
}
```

#### 函数柯里化 实现 sum(1)(2)(3) 返回结果是1,2,3之和

函数柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

```js
function sum(a) {
    return function(b) {
        return function(c) {
            return a+b+c;
        }
    }
}
console.log(sum(1)(2)(3)); // 6
```

#### 扁平化

```js
arr.flat(Infinity)

function flatten(arr){
    var res = [];
    for(var i=0;i<arr.length;i++){
        if(Array.isArray(arr[i])){
            res = res.concat(flatten(arr[i]));
        }else{
            res.push(arr[i]);
        }
    }
    return res;
}
```

#### 伪数组转真数组

```js
//...解构赋值
function args(){
  console.log(arguments);
  let newArr = [...arguments];
  console.log(newArr);
}
args(1,2,3,23,2,42,34);

//Array.from
function args(){
  console.log(arguments);
  let newArr2 = Array.from(arguments);
  console.log(newArr2);
}
args(1,2,3,23,2,42,34);
```



```js
[1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]
解决方法：利用JS原型链，在Array对象上利用prototyp属性添加该方法。
Array.prototype.duplicator = function(){
  var g = this.length;
  for(var i=0;i<g;i++){
   Array.push(this[i]) ;
   }
}
```

#### **数组去重**

```js
//双重循环
Array.prototype.unique = function () {
  const newArray = [];
  let isRepeat;
  for (let i = 0; i < this.length; i++) {
    isRepeat = false;
    for (let j = i + 1; j < this.length; j++) {
      if (this[i] === this[j]) {
        isRepeat = true;
        break;
      }
    }
    if (!isRepeat) {
      newArray.push(this[i]);
    }
  }
  return newArray;
}

//Array.prototype.indexOf()
let arr = [1, 2, 3, 22, 233, 22, 2, 233, 'a', 3, 'b', 'a'];
Array.prototype.unique = function () {
  const newArray = [];
  this.forEach(item => {
    if (newArray.indexOf(item) === -1) {
      newArray.push(item);
    }
  });
  return newArray;
}

//Array.prototype.sort()
Array.prototype.unique = function () {
  const newArray = [];
  this.sort();
  for (let i = 0; i < this.length; i++) {
    if (this[i] !== this[i + 1]) {
      newArray.push(this[i]);
    }
  }
  return newArray;
}

//Array.prototype.includes()
Array.prototype.unique = function () {
  const newArray = [];
  this.forEach(item => {
    if (!newArray.includes(item)) {
      newArray.push(item);
    }
  });
  return newArray;
}

let arr = new Set([1,1,5,7,5])//[1,5,7]
```

#### **数组排序**

```js
//双重循环 冒泡
function bubbleSort(arr) {
  if (Array.isArray(arr)) {
    for (var i = arr.length - 1; i > 0; i--) {
      for (var j = 0; j < i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}
//插入排序
function insertSort(arr) {
  if (Array.isArray(arr)) {
    for (var i = 1; i < arr.length; i++) {
      var preIndex = i - 1;
      var current = arr[i]
      while (preIndex >= 0 && arr[preIndex] > c) {
        arr[preIndex + 1] = arr[preIndex];
        preIndex--;
      }
      arr[preIndex + 1] = current;
    }
    return arr;
  }
}
//快速排序
function quickSort(arr) {
  if (!Array.isArray(arr)) return;
  if (arr.length <= 1) return arr;
  var left = [], right = [];
  var num = Math.floor(arr.length / 2);
  var numValue = arr.splice(num, 1)[0];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > numValue) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  return [...quickSort(left), numValue, ...quickSort(right)]
}
arr.sort((a,b)=>{a-b})
```

#### 深拷贝与浅拷贝

深拷贝与浅拷贝的概念只存在于引用类型

##### 数组拷贝

```js
//concat、Array.from() 、slice()只能实现一维数组的深拷贝
var arr1 = [1, 2], arr2 = arr1.slice();
console.log(arr1); //[1, 2]
console.log(arr2); //[1, 2]

arr2[0] = 3; //修改arr2
console.log(arr1); //[1, 2]
console.log(arr2); //[3, 2]
```

##### 对象的拷贝

```js
//Object.assign()只能实现一维对象的深拷贝
var obj1 = {x: 1, y: 2}, obj2 = Object.assign({}, obj1);
console.log(obj1) //{x: 1, y: 2}
console.log(obj2) //{x: 1, y: 2}

obj2.x = 2; //修改obj2.x
console.log(obj1) //{x: 1, y: 2}
console.log(obj2) //{x: 2, y: 2}

//JSON.parse(JSON.stringify(obj1))不能深拷贝含有undefined、function、symbol值的对象
var obj1 = {
    x: 1,
    y: undefined,
    z: function add(z1, z2) {
        return z1 + z2
    },
    a: Symbol("foo")
};
var obj2 = JSON.parse(JSON.stringify(obj1));
console.log(obj1) //{x: 1, y: undefined, z: ƒ, a: Symbol(foo)}
console.log(JSON.stringify(obj1)); //{"x":1}
console.log(obj2) //{x: 1}
```

##### 深拷贝

###### 实现一

```js
//递归实现对象的深拷贝
function deepCopy(obj) {
    // 创建一个新对象
    let result = {}
    let keys = Object.keys(obj),
        key = null,
        temp = null;

    for (let i = 0; i < keys.length; i++) {
        key = keys[i];    
        temp = obj[key];
        // 如果字段的值也是一个对象则递归操作
        if (temp && typeof temp === 'object') {
            result[key] = deepCopy(temp);
        } else {
        // 否则直接赋值给新对象
            result[key] = temp;
        }
    }
    return result;
}

var obj1 = {
    x: {
        m: 1
    },
    y: undefined,
    z: function add(z1, z2) {
        return z1 + z2
    },
    a: Symbol("foo")
};

var obj2 = deepCopy(obj1);
obj2.x.m = 2;

console.log(obj1); //{x: {m: 1}, y: undefined, z: ƒ, a: Symbol(foo)}
console.log(obj2); //{x: {m: 2}, y: undefined, z: ƒ, a: Symbol(foo)}
```

###### 实现二

```js
function deepCopy(target) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        for (const key in target) {
            cloneTarget[key] = deepCopy(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
```

###### 循环引用

解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。

```js
//循环引用
function clone(target, map = new Map()) {
    if (typeof target != 'object') return target; 
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
        if(Object.prototype.hasOwnProperty.call(target, key)){
            if(typeof target[key] != 'object'){
                cloneTarget[key] = clone(target[key], map);
            }else{
                cloneTarget[key] = target[key]
            }
        }
    }
    return cloneTarget;
};
const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8],

};
target.target = target 
console.log('222',clone(target))
```

#### **防抖与节流**实现、使用场景

##### 防抖  input模糊搜索、resize

短时间内大量触发同一事件，只会执行一次函数

- 如果在200ms内没有再次触发滚动事件，那么就执行函数
- 如果在200ms内再次触发滚动事件，那么当前的计时取消，重新开始计时

```js
function debounce(fn,delay){
    let timer = null //借助闭包
    return function() {
        if(timer){
            clearTimeout(timer) //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
            timer = setTimeOut(fn,delay) 
        }else{
            timer = setTimeOut(fn,delay) // 进入该分支说明当前并没有在计时，那么就开始一个计时
        }
    }
}
```

##### 节流  scroll、mouseover

如果短时间内大量触发同一事件，那么**在函数执行一次之后，该函数在指定的时间期限内不再工作**，直至过了这段时间才重新生效。

```js
//当触发事件的时候，我们设置一个定时器，再次触发事件的时候，如果定时器存在，就不执行，直到delay时间后，定时器执行执行函数，并且清空定时器，这样就可以设置下个定时器。
function throttle(func, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}
//时间戳
function throttle(fn, delayTime){
  var _start = Date.now();
  return function () {
    var _now = Date.now(), context = this, args = arguments;
    if(_now - _start >= delayTime) {
      fn.apply(context, args);
      _start = Date.now();
    }
  }
}
```

#### for...of

for...of语句在[可迭代对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/iterable)（包括 [`Array`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Array)，[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Map)，[`Set`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)，[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/String)，[`TypedArray`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)，[arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) 对象等等）上创建一个迭代循环，调用自定义迭代钩子，并为每个不同属性的值执行语句，**可遍历不可枚举，不可用于对象**

```js
const array1 = ['a', 'b', 'c'];

for (const element of array1) {
  console.log(element);
}

(function() {
  for (let argument of arguments) {
    console.log(argument);
  }
})(1, 2, 3);
```

#### for...in

for...in语句以任意顺序遍历一个对象的除[Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)以外的[可枚举](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)属性，可用于数组和对象。

#### A instanceOf B

判断B.prototype属性是否在A对象的原型链上

```js
function instance_of(L, R) {
  //L 表示左表达式，R 表示右表达式
  var O = R.prototype; // 取 R 的显示原型
  L = L.__proto__; // 取 L 的隐式原型
  while (true) {
    if (L === null) return false;
    if (O === L)
      // 这里重点：当 O 严格等于 L 时，返回 true
      return true;
    L = L.__proto__;
  }
}
```

#### Object.is()

判断两个值是否是相同的值