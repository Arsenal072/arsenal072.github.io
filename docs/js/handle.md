##### **函数柯里化？实现 sum(1)(2)(3) 返回结果是1,2,3之和**

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
for(let i=0,i<arr.length-1,i++){
	for(let j=0, j<arr.length-1,j++){
		if(arr[j]>arr[j+1]){
            let temp = arr[j]
            arr[j+1] = arr[j]
            arr[i] = temp
        }
	}
}
//
arr.sort((a,b)=>{a-b})

```

#### 深拷贝与浅拷贝

**深拷贝与浅拷贝的概念只存在于引用类型**

- slice()、concat、Array.from()只能实现一维数组的深拷贝

  arr1 = arr2深拷贝

```js
var arr1 = [1, 2], arr2 = arr1.slice();
console.log(arr1); //[1, 2]
console.log(arr2); //[1, 2]

arr2[0] = 3; //修改arr2
console.log(arr1); //[1, 2]
console.log(arr2); //[3, 2]

```

- Object.assign()

```js
var obj1 = {x: 1, y: 2}, obj2 = Object.assign({}, obj1);
console.log(obj1) //{x: 1, y: 2}
console.log(obj2) //{x: 1, y: 2}

obj2.x = 2; //修改obj2.x
console.log(obj1) //{x: 1, y: 2}
console.log(obj2) //{x: 2, y: 2}

```

- JSON.parse(JSON.stringify(obj))

**不能深拷贝含有undefined、function、symbol值的对象**，不过`JSON.parse(JSON.stringify(obj))`简单粗暴，已经满足90%的使用场景了。

**数组拷贝**

```js
//concat、Array.from() 、slice()只能实现一维数组的深拷贝
var arr1 = [1, 2], arr2 = arr1.slice();
console.log(arr1); //[1, 2]
console.log(arr2); //[1, 2]

arr2[0] = 3; //修改arr2
console.log(arr1); //[1, 2]
console.log(arr2); //[3, 2]

```

**对象的拷贝**

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

**循环引用**

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

**防抖** input模糊搜索、resize

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

**节流**  scroll、mouseover

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