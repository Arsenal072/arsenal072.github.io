### Js篇

#### 数据类型

基本类型有：Boolean、Null、Undefined、Number、String、Symbol

**引用类型**有：Object、Array、Function

**Object.defineProperty**

```js
Object.defineProperty(obj, prop, descriptor)
obj：必需。目标对象
prop：必需。需定义或修改的属性的名字
descriptor：必需。目标属性所拥有的特性

Object.defineProperty(obj,"test",{
    configurable:true | false,
    enumerable:true | false,
    value:任意类型的值,
    writable:true | false
});
value属性对应的值,可以使任意类型的值，默认为undefined
writable属性的值是否可以被重写。设置为true可以被重写；设置为false，不能被重写。默认为false。
enumerable此属性是否可以被枚举（使用for...in或Object.keys()）。设置为true可以被枚举；设置为false，不能被枚举。默认为false
configurable:目标属性是否可以使用delete删除;目标属性是否可以再次设置特性
```

#### Js工作机制

语言分为解释型(Python、js)、编译型(C/C++、GO)。

- 解释型语言在每次执行时需要通过解释器对程序进行动态的解释和执行。
- 编译型语言在程序执行之前，需要经过编译器的编译过程，编译之后会直接保留机器能读懂的二进制文件，这样每次运行程序时，都可以直接运行改二进制文件，不需要重新编译。

<!-- ![](微信图片_20200608192127.png) -->
<img :src="$withBase('/images/微信图片_20200608192127.png')" alt="">

在解释语言的解释过程中，会对代码进行词法分析、语法分析，并生成抽象语法树(AST)，然后再基于抽象语法树生成字节码，最后再根据字节码来执行程序、输出结果。

##### V8是如何执行一段javascript代码的

<!-- ![](微信图片_20200608193034.png) -->
<img :src="$withBase('/images/微信图片_20200608193034.png')" alt="">

- ##### 将源代码转换为抽象语法树，并生成执行上下文。

高级语言是开发者可以理解的语言，但让编译器和解释器来理解就非常困难了，对于编译器和解释器来说，他们可以理解的就是AST。所以无论是使用解释型语言还是编译型语言，在编译过程中他们都会生成一个AST(代码的结构化表示)

AST是非常重要的一种数据结构，在很多项目中有着广泛的应用。其中最著名的一个项目是Babel。Babel是一个用于将ES6代码转为ES5语法。Babel的工作原理是先将ES6源码转换为AST，然后再将ES6语法的AST转换为ES5语法的AST，最后利用ES5的AST生成Javascript源代码。除了Babel外，还有Eslint也使用AST。Eslint是一个用来检查Javascript编写规范的插件，其检测流程也是需要将源码转换为AST，然后再利用AST来检查代码规范化的问题。

抽象语法树（`Abstract Syntax Tree`）简称 `AST`，是源代码的抽象语法结构的树状表现形式

我们常用的浏览器就是通过将 js 代码转化为抽象语法树来进行下一步的分析等其他操作

###### 生成AST需要经过两个阶段

分词：又称词法分析，其作用是将一行行源码拆解成一个个token。token是指词法上不能再分的，最小的单元符或字节符

<!-- ![](微信图片_20200608194610.png) -->
<img :src="$withBase('/images/微信图片_20200608194610.png')" alt="">

解析：语法分析，其作用是将上一步生成的token数据，根据语法规则转为AST。如果源码符合语法规则，这一步会顺利完成。但如果源码存在语法错误，这一步就会终止，并抛出一个‘语法错误’

这就是AST生成过程，先分词，后解析。有了AST之后，接下来V8就会生成该段代码的执行上下文。

- ##### 生成字节码

有了AST和执行上下文后，解释器(Ignition)会根据AST生成字节码，并解释执行字节码

其实一开始V8没有字节码，而是直接将AST转换为机器码，由于执行机器码效率是非常高效的。但是由于需要消耗大量的内存来存放转换后的机器码，存在内存占用的问题。于是引入字节码。

字节码是介于AST和机器码之间的一种代码，但是与特定类型的机器码无关，字节码需要通过解释器将其转换为机器码后才能执行。

- ##### 执行代码

生成字节码之后，接下来就要进入执行阶段。

通常，如果有一段第一次执行的字节码，解释器Ignition会逐条解释执行。解释器Ignition除了负责生成字节码之外，他还有另外一个作用，就是解释执行字节码。在Ignition执行字节码过程中，如果发现有热点代码(HotSpot)，比如一段代码被重复执行多次，这种称为热点代码，那么后台的编译器TurboFan就会把该段热点的字节码编译为高效的机器码，然后当再次执行这段被优化的代码时，只需要执行编译后的机器码就可以了，这样大大提升了代码的执行效率。

##### JIT(即时编译器)

在V8中，解释器Ignition在解释执行字节码的同时，收集代码信息，当他发现某一部分代码变热以后，TurboFan编译器把热点的字节码转换为机器码，并把转换后的机器码保存起来，以备下次使用，这种技术称为JIT(即时编译器)

<!-- ![](微信图片_20200608201026.png) -->
<img :src="$withBase('/images/微信图片_20200608201026.png')" alt="">



js代码执行过程包括两个过程：编译阶段、代码执行阶段

<!-- ![](1589457365851.png) -->
<img :src="$withBase('/images/1589457365851.png')" alt="">

编译阶段会进行变量提升，生成执行上下文和可执行代码

##### 变量提升

变量提升是指在js代码执行过程中，js引擎把变量的声明部分和函数声明部分提升到代码开头，并给变量设置默认值undefined。

执行上下文：js执行一段代码时的运行环境，比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的this、变量、对象、以及函数等

##### 创建执行上下文

当js执行全局代码时，会编译全局代码并创建 **全局执行上下文**

当调用一个函数时，函数体内的代码会被编译，并创建 **函数执行上下文**

当使用eval函数时，eval的代码也会被编译，并创建执行上下文

<!-- ![](1589457018988.png) -->
<img :src="$withBase('/images/1589457018988.png')" alt="">

- Js代码执行过程中，需要先做变量提升，而之所以需要实现变量提升，是因为js代码在执行之前需要先编译
- 在编译阶段，变量和函数会被存放到变量环境中，变量的默认值会被设置成undefined;在代码执行阶段，js引擎会从变量环境中去查找自定义的变量和函数
- 如果在编译阶段，存在两个相同的函数，后定义的会覆盖之前定义的，最终存放在变量环境中的是最后定义的那个。如果变量和函数名同名，在编译阶段，变量的声明会被忽略。

##### js调用栈

在执行上下文创建好之后，js引擎会将执行上下文压入栈中，这种用来管理执行上下文的栈称为执行上下文栈，又称调用栈。调用栈是有大小的，当入栈的执行上下文超过一定数目，js引擎就会报错，这种错误叫做栈溢出。

```
var a = 2
function add(b, c){
	return b+c
}
function addAll(b,c){
	var d= 10
	result = add(b,c)
	return a + result + d
}
addAll(3, 6)
```

<!-- ![](1589460198236.png) -->
<img :src="$withBase('/images/1589460198236.png')" alt="">

- 每调用一个函数，js引擎会为其创建执行上下文，并把该执行上下文压入调用栈，然后js引擎开始执行函数代码
- 如果一个函数A中调用了一个另一个函数B，那么js引擎会为B函数创建执行上下文，并将B函数的执行上下文压入栈顶。
- 当前函数执行完毕后，js引擎会将该函数的执行上下文弹出栈
- 当分配的调用栈空间被占满时，会引发堆栈溢出问题；

##### 作用域

作用域就是变量与函数的可访问范围，即作用域控制着变量和函数的可见范围和生命周期

ES6之前作用域只有两种：全局作用域和函数作用域

- 全局作用域中的对象在代码中任何地方都能访问，生命周期伴随着页面的生命周期
- 函数作用域就是在函数内部定义的变量或者函数，并且定义的变量和函数只能在函数内部被访问。函数执行结束后，函数内部定义的变量会被销毁

##### 变量提升带来的问题

- 变量容易在不被察觉的情况下被覆盖

```js
var myname = 'Jack'
function showName(){
	console.log(myname)//undefined
	if(0){
		var myname = 'Pual'
	}
	console.log(myname)//undefined
}
showName()
```

- 本应销毁的变量没有被销毁

```js
function foo(){
	for(var i=0;i<7;i++){
	}
	console.log(i)//7
}
foo()

//无块级作用域，setTimeout每次访问都是10，闭包只能取得包含函数中任何变量的最后一个值，这是因为闭包所保存的是整个变量对象，而不是某个特殊的变量
for(var i=0;i<10;i++){
   setTimeout(function(){
     console.log(i)
  },1000)
}//10个10

for(let i=0;i<10;i++){
   setTimeout(function(){
     console.log(i)
  },1000)
}//1-9
//let具有块级作用域，每一个i与setTimeout对应，
```

##### ES6是如何解决变量提升带来的缺陷(引入块级作用域，同时支持变量提升和块级作用域)

js引擎在编译阶段将let、const声明的变量存放在词法环境中

```js
function foo(){
	var a = 1
	let b = 2
	{
		let b = 3
		var c = 4
		let d = 5
		console.log(a)
		console.log(b)
	}
	console.log(b)
	console.log(c)
	console.log(d)
}
foo()
```

<!-- ![](1591325701299.png) -->
<img :src="$withBase('/images/1591325701299.png')" alt="">

###### 变量查找

沿着词法环境的栈顶向下查询，如果在词法环境中的某个块中查找到了，就直接返回给js引擎，如果没有找到，那么继续在变量环境中查找

当作用域块执行结束后，其内部定义的变量就会从词法环境的栈顶弹出

<!-- ![](1591325797732-1591619161228.png) -->
<img :src="$withBase('/images/1591325797732.png')" alt="">

###### 形成暂时性死区

在代码块内，使用let命令声明变量之前，该变量都是不可用的，这在语法上，称为“暂时性死区”。

```js
console.log(typeof NaN);   //'number'
console.log(typeof null);  //'object'  

var obj = new String();
console.log(typeof(obj));    //'object'

var  fn = function(){};
console.log(typeof(fn));  //'function'
```

##### 作用域链

每个函数都会形成一个作用域，如果函数被其他函数包裹，包裹函数也有作用域，一直往上直到全局环境，这样就形成了一条作用域链。若当前作用域内该变量未声明，则在上一级作用域中查找，一直到全局作用域。

```js
function bar(){
	console.log(myname)//Pual
}
function foo(){
	var myname = 'Jack'
	bar()
}
var myname = 'Pual'
foo()
```

在每个执行上下文的变量环境中，都包含了一个外部引用，用来指向外部的执行上下文，我们把这个外部引用称为outer。

当一段代码使用了一个变量时，js引擎首先会在当前的执行上下文中查找该变量，如果在当前的执行上下文中没有查找到，js引擎会继续在outer所指向的执行上下文中查找。

<!-- ![](1591326814713.png) -->
<img :src="$withBase('/images/1591326814713.png')" alt="">

###### 词法作用域(为什么上面bar和foo的外部引用outer都指向全局执行上下文)

<!-- ![](1591327801719.png) -->
<img :src="$withBase('/images/1591327801719.png')" alt="">

词法作用域是代码阶段就决定好了，和函数怎么调用没有关系，我们通过作用域查找变量的链条称为作用域链，作用域链是通过词法作用域来确定的

#### 闭包

内部函数总是可以访问其外部函数中声明的变量，当通过调用一个外部函数返回一个内部函数后，即使该外部函数已经执行结束了，但内部函数引用外部函数的变量依然保存在内存中，我们把这些变量的集合称为闭包。

```js
function foo(){
	var myname = 'Jack'
	let test1 = 1
	const test2 = 2
	var innerBar = {
		getName: function(){
			console.log(test1)
			return myname
		},
		setName: function(newName){
			myname = newName
		}
	}
	return innerBar
}
var bar = foo()
bar.setName('Pual')
bar.getName()//1
console.log(bar.getName())//1,Pual
```

<!-- ![](1591337791435.png) -->
<img :src="$withBase('/images/1591337791435.png')" alt="">

闭包就是指有权访问另一个函数作用域中的变量的函数

创建闭包最常见方式，就是在一个函数内部创建另一个函数

##### 闭包有什么用

- 读取函数内部的变量
- 让这些变量的值始终保持在内存中。不会在函数调用后被自动清除。

##### 闭包使用场景  (防抖)设计私有的方法和变量

- 函数作为返回值

  ```js
  function F1(){
  	var a = 100
  	//返回一个函数(函数作为返回值)
  	return function(){
  		console.log(a)
  	}
  }
  var f1 = F1()
  var a = 200
  f1()
  ```

- 函数作为参数传递

  ```js
  function F1(){
  	var a = 100
  	return function(){
  		console.log(a)   //自由变量，父作用域寻找
  	}
  }
  
  function F2(fn){
  	var a = 200
  	fn()
  }
  
  var f1 = F1()
  F2(f1)//100
  ```

##### 闭包有什么副作用需要注意

- 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。但是，在创建了一个闭包以后，这个函数的作用域就会一直保存到闭包不存在为止。在javascript中，如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收；如果两个对象互相引用，而不再被第3者所引用，那么这两个互相引用的对象也会被回收

- 闭包只能取得包含函数中任何变量的最后一个值，这是因为闭包所保存的是整个变量对象，而不是某个特殊的变量

- 闭包中的 this 对象

  ```js
  var name = "The Window";
  
  var obj = {
    name: "My Object",
    
    getName: function(){
      return function(){
        return this.name;
      };
    }
  };
  
  console.log(obj.getName()());  // The Window
  //obj.getName()()实际上是在全局作用域中调用了匿名函数，this指向了window。这里要理解函数名与函数功能（或者称函数值）是分割开的，不要认为函数在哪里，其内部的this就指向哪里。匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window
  ```

为什么会造成内存泄漏，什么情况下会造成内存泄漏

- 闭包的缺点就是常驻内存会增大内存使用量，并且使用不当很容易造成内存泄露。
- 如果不是因为某些特殊任务而需要闭包，在没有必要的情况下，在其它函数中创建函数是不明智的，因为闭包对脚本性能具有负面影响，包括处理速度和内存消耗



#### 垃圾回收机制

javascript采用自动垃圾回收策略，产生的垃圾数据由垃圾回收器来释放，不需要手动通过代码来释放。垃圾回收的好处是不需要我们去管理内存，把更多的精力放在实现复杂应用上，但坏处也来自于此，不用管理了，就有可能在写代码的时候不注意，造成循环引用等情况，导致内存泄露。

##### 主要有两种垃圾回收算法：

######    1、标记清除，离开作用域的变量将自动标记为可以回收，并在垃圾回收期间被删除，回收其内存

当变量进入环境（例如，在函数中声明一个变量）时，就将这个变量标记为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。而当变量离开环境时，则将其标记为“离开环境”。

可以使用任何方式来标记变量。比如，可以通过翻转某个特殊的位来记录一个变量何时进入环境，或者使用一个“进入环境的”变量列表及一个“离开环境的”变量列表来跟踪哪个变量发生了变化。如何标记变量并不重要，关键在于采取什么策略。

- 垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记（当然，可以使用任何标记方式）。
- 然后，它会去掉运行环境中的变量以及被环境中变量所引用的变量的标记
- 此后，依然有标记的变量就被视为准备删除的变量，原因是在运行环境中已经无法访问到这些变量了。
- 最后，垃圾收集器完成内存清除工作，销毁那些带标记的值并回收它们所占用的内存空间。

######    2、引用计数，跟踪记录变量被引用的次数，但当代码中存在循环引用时，引用计数算法会导致问题

引用计数跟踪记录每个值被引用的次数。当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是1。如果同一个值又被赋给另一个变量，则该值的引用次数加1。相反，如果包含对这个值引用的变量改变了引用对象，则该值引用次数减1。当这个值的引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间回收回来。这样，当垃圾收集器下次再运行时，它就会释放那些引用次数为0的值所占用的内存。**但很快它就遇到了一个严重的问题：循环引用。**

```js
function foo () {
    var objA = new Object();
    var objB = new Object();
    
    objA.otherObj = objB;
    objB.anotherObj = objA;
}
//el有一个属性onclick引用了一个函数（其实也是个对象），函数里面的参数又引用了el,这样el的引用次数一直是2
var el = document.getElementById('#el');
el.onclick = function (event) {
    console.log('element was clicked');
}
// el.onclick = null;
```

在采用标记清除策略的实现中，由于函数执行后，这两个对象都离开了作用域，但objA和objB还将继续存在，因为它们的引用次数永远不会是0，导致内存泄漏

##### V8垃圾回收策略

V8采用了一种代回收的策略，将内存分为两个生代：新生代（new generation）和老生代（old generation），根据对象的生存周期不同，采用不同的垃圾回收算法来提高效率。

##### 内存泄漏

内存泄漏指任何对象在您不再拥有或需要它之后仍然存在，以下情况会造成内存泄漏：

- setTimeout、setInterval离开页面时，定时器未清除
- 闭包
- 控制台日志
- 循环引用（在两个对象彼此引用且彼此保留时，就会产生一个循环）

#### 继承

任何对象都存在一条原型链，通过访问原型链中的属性和方法，从而实现继承。

#### 原型

是一个对象，用于实现数据共享，其他对象可以通过它实现属性和方法的继承；

#### 为什么要使用原型来实现继承

在使用构造函数实例化对象时，会分配一分内存，比较消耗内存。将构造函数中公共的属性和方法放到构造函数.prototype(原型)中，实现属性和方法的继承，节省内存

#### 原型链

对象有原型对象，原型对象也是对象，原型对象也有原型对象，这样一环扣一环，就形成了一条链式结构，叫做原型链。（对象在被创建时，原型就确定下来了，原型链也就确定下来了）

<!-- ![1595496492850](1595496492850.png) -->
<img :src="$withBase('/images/1595496492850.png')" alt="">

#### DOM事件流

DOM事件流：事件捕捉、目标阶段、冒泡阶段

事件委托：例如父元素里有多个元素需要绑定相同的事件，这时可以给父元素绑定事件

#### 事件代理

对“事件处理程序过多”问题的解决方案就是事件委托。事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。click事件会一直冒泡到document层次。也就是说，我们可以为整个页面指定一个onclick事件处理程序，而不必给每个可单击的元素分别添加事件处理程序。

#### 事件循环机制event loop   执行栈、主线程

Js是单线程运行，单线程存在运行阻塞问题，Event Loop(事件循环)是解决javaScript单线程运行阻塞的一种机制。

任务队列`Task Queue`，是一种先进先出的一种数据结构。在队尾添加新元素，从队头移除元素。

javascript是单线程。单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。于是js所有任务分为两种：**同步任务，异步任务**

**同步任务**是调用立即得到结果的任务，同步任务在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；

**异步任务**是调用无法立即得到结果，需要额外的操作才能得到预期结果的任务，异步任务不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。
 JS引擎遇到异步任务（DOM事件监听、网络请求、setTimeout计时器等），会交给相应的线程单独去维护异步任务，等待某个时机（计时器结束、网络请求成功、用户点击DOM），然后由 事件触发线程 将异步对应的 回调函数 加入到消息队列中，消息队列中的回调函数等待被执行。

##### 具体来说，异步运行机制如下：

- 所有同步任务都在主线程上执行，形成一个js执行栈
- 主线程之外，还存在一个"任务队列"（task queue）。当遇到一个异步任务后，并不会一直等待异步任务返回结果，而是会将异步任务要执行的回调函数放置到任务队列(Task Queue)中。
- 当主线程将执行栈中所有的代码执行完之后，主线程将会去查看任务队列是否有任务。如果有，那么主线程会依次执行那些任务队列中的回调函数。
- 主线程不断重复上面的第三步。

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）

##### 宏任务与微任务:

异步任务分为 宏任务（macrotask） 与 微任务 (microtask)，不同的API注册的任务会依次进入自身对应的队列中，然后等待 Event Loop 将它们依次压入执行栈中执行。

##### 宏任务(macrotask)：

script(整体代码)、setTimeout、setInterval、UI 渲染、 I/O、postMessage、 MessageChannel、setImmediate(Node.js 环境)

##### 微任务(microtask)：

Promise、 MutaionObserver、process.nextTick(Node.js环境）

在挂起任务时，JS 引擎会将所有任务按照类别分到这两个队列中，首先在 宏任务 的队列中取出第一个任务，执行完毕后取出 微任务 队列中的所有任务顺序执行；之后再取 宏任务，周而复始，直至两个队列的任务都取完。

```js
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout')
},0)  
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')

script start
async1 start
async2
promise1
script end
promise2
async1 end
setTimeout

定义一个异步函数 async1
定义一个异步函数 async2
打印 ‘script start’ // *1
定义一个定时器（宏任务，优先级低于微任务），在0ms 之后输出
执行异步函数 async1
打印 'async1 start' // *2
遇到await 表达式，执行 await 后面的 async2
打印 'async2' // *3
返回一个 Promise，跳出 async1 函数体
执行 new Promise 里的语句
打印 ‘promise1‘	// *4
resolve() , 返回一个 Promise 对象，把这个 Promise 压进队列里
打印 ’script end'  // *5
同步栈执行完毕
回到 async1 的函数体，async2 函数没有返回 Promise，所以把要等async2 的值 resolve，把 Promise 压进队列
执行 new Promise 后面的 .then，打印 ’promise2‘ // *6
回到 async1 的函数体，await 返回 Promise.resolve() ，然后打印后面的 ’async1 end‘  // *7
最后执行定时器（宏任务） setTimeout，打印 ’setTimeout‘ // *8
```

遇到 await 表达式时，会让 async 函数 暂停执行，**等到 await 后面的语句（Promise）状态发生改变（resolved或者rejected）之后，再恢复 async 函数的执行（再之后 await 下面的语句）**，并返回解析值（Promise的值）

#### ES6新的特性

1. 新增了块级作用域(let,const)
2. 提供了定义类的语法糖(class)
3. 新增了一种基本数据类型(Symbol)
4. 新增了变量的解构赋值
5. 函数参数允许设置默认值，引入了rest参数，新增了箭头函数
6. 数组新增了一些API，如 isArray / from / of 方法;数组实例新增了 entries()，keys() 和 values() 等方法
7. 对象和数组新增了扩展运算符
8. ES6 新增了模块化(import/export)
9. ES6 新增了 Set 和 Map 数据结构
11. ES6 新增了生成器(Generator)和遍历器(Iterator)

**Object.entries(obj)**

```js
const object1 = {
  a: 'somestring',
  b: 42
};

for (let [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}
// expected output:
// "a: somestring"
// "b: 42"
```

#### ES6 ES5 class的区别

class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到。新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法。

- 语法上：function/class、类中默认有一个`constructor`方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。`constructor`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象

- 类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行

- ES6中类的内部所有定义的方法，都是不可通过Object.keys(Point.prototype)枚举的（non-enumerable），但是ES5中是可以枚举的

- class没有变量提升，需要先定义再使用，否则会报错。

- 重复定义：function会覆盖之前定义的方法，class会报错

- this的指向，类的方法内部如果含有`this`，它默认指向类的实例。但是一旦单独使用该方法，很可能报错。

  ```javascript
  class Logger {
    printName(name = 'there') {
      this.print(`Hello ${name}`);
    }
  
    print(text) {
      console.log(text);
    }
  }
  
  const logger = new Logger();
  const { printName } = logger;
  printName(); // TypeError: Cannot read property 'print' of undefined
  
  //一个比较简单的解决方法是，在构造方法中绑定this，这样就不会找不到print方法了
  class Logger {
    constructor() {
      this.printName = this.printName.bind(this);
    }
    // ...
  }
  ```
  
- Class 可以通过`extends`关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。子类必须在`constructor`方法中调用`super`方法，否则新建实例时会报错。这是因为子类自己的`this`对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用`super`方法，子类就得不到`this`对象。

- 在`function`定义的构造函数中，其`prototype.constructor`属性指向构造器自身。在`class`定义的类中，`constructor`其实也相当于定义在`prototype`属性上。类的所有方法都定义在类的`prototype`属性上面。

- 都可通过实例的__proto__属性向原型添加方法

- `Foo`类的`classMethod`方法前有`static`关键字，表明该方法是一个静态方法，可以直接在`Foo`类上调用（`Foo.classMethod()`），而不是在`Foo`类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法



#### 数据结构Set

ES6 提供了新的数据结构 Set，它类似于数组，但是成员的值都是唯一的，没有重复的值。

```javascript
const set = new Set([1, 2, 3, 4, 4]);
[...set]
// [1, 2, 3, 4]
```

#### 数据结构Map

#### 模块化CommonJS,ES6 Module,AMD,CMD

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

##### ES6 模块与 CommonJS 模块的差异

```js
// CommonJS模块
let { stat, exists, readFile } = require('fs');

// ES6模块
import { stat, exists, readFile } from 'fs';
```

- ##### CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用

  ```js
  // lib.js
  var counter = 3;
  function incCounter() {
    counter++;
  }
  module.exports = {
    counter: counter,
    incCounter: incCounter,
  };
  ```

  ```js
  // main.js
  var mod = require('./lib');
  
  console.log(mod.counter);  // 3
  mod.incCounter();
  console.log(mod.counter); // 3
  ```

  ```
  - CommonJS 模块输出的是值的拷贝，模块一旦加载完成之后，模块内部的变化就影响不到这个值。
  
  - ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令`import`，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。原始值变了，`import`加载的值也会跟着变。因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块
  ```

- ##### CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

  ```
  运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。
  
  编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。
  ```

CommonJS 加载的是一个对象（即`module.exports`属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。



runtime：仅包含运行时的版本，包含vue运行核心代码但没有编译器，如vue.runtime.js 

umd：Universal Module Definition规范，用于浏览器script标签引入，默认包含运行时和编译器，如vue.js

common.js：cjs规范用于旧版打包器如browserify、webpack1，如vue.runtime.commom.js

require

esm：ES Module规范用于现代打包器如webpack2及以上版本vue.runtime.esm.js



#### this

- 全局上下文中，this指向window, 严格模式下指向undefined；

- 直接调用函数，this相当于全局上下文的情况

- `对象.方法`obj.a()的情况，this指向这个对象

- DOM事件绑定，onclick和addEventerListener中 this 默认指向绑定事件的元素。IE比较奇异，使用attachEvent，里面的this默认指向window。

- new+构造函数，构造函数中的this指向实例对象

- 箭头函数没有this，里面的this会指向当前最近的非箭头函数的this，找不到就是window(严格模式是undefined)

- call/apply/bind可以显示绑定

  

#### 箭头函数与一般函数区别

- 箭头函数是匿名函数，不能作为构造函数，不能使用new

- 箭头函数没有原型`prototype`属性

- 箭头函数不绑定this，会捕获其所在的上下文的this值，作为自己的this值，普通函数的this指向调用它的那个对象

- 箭头函数不绑定arguments，取而代之用rest参数...解决

  ```js
  function A(a){
    console.log(arguments);
  }
  A(1,2,3,4,5,8);  //[1, 2, 3, 4, 5, 8, callee: ƒ, Symbol(Symbol.iterator): ƒ]
  
  let B = (b)=>{
    console.log(arguments);
  }
  B(2,92,32,32);   // Uncaught ReferenceError: arguments is not defined
  
  let C = (...c) => {
    console.log(c);
  }
  C(3,82,32,11323);  // [3, 82, 32, 11323]
  ```

#### 防止表单重复提交

1、设置标志位或者设置disable样式，避免重复点击；

2、利用Session防止表单重复提交

实现原理：

服务器返回表单页面时，会先生成一个subToken保存于session，并把该subToen传给表单页面。当表单提交时会带上subToken，服务器拦截器Interceptor会拦截该请求，拦截器判断session保存的subToken和表单提交subToken是否一致。若不一致或session的subToken为空或表单未携带subToken则不通过。

首次提交表单时session的subToken与表单携带的subToken一致走正常流程，然后拦截器内会删除session保存的subToken。当再次提交表单时由于session的subToken为空则不通过。从而实现了防止表单重复提交。

#### 继承

- 原型链继承
- 借用构造函数
- 组合继承（最常用）
- 原型式继承
- 寄生式继承
- 寄生组合式继承
- ES6类继承extends

##### 原型链继承

基本思想：利用原型让一个引用类型继承另一个引用类型的属性和方法

```js
 	function SupType(){
        this.property = true
    }
    SupType.prototype.getSuperValue = function(){
        return this.property
    }
    function SubType(){
        this.subProperty = false
    }
 	SubType.prototype = new SupType()
    SubType.prototype.getSubValue = function(){
        return this.subProperty
    }
    var instance = new SubType()
    instance.getSuperValue()//true
```

注意点：

- 给原型添加方法的代码一定要放在替换原型的语句后面
- 不能使用对象字面量添加原型方法，这样会重写原型链

```js
    SubType.prototype = new SupType()
    subType.prototype = {
        getSubValue: function(){
            return this.subProperty
        },
        someOtherMethod: function(){
            return false
        }
    }
```

- 当原型链中包含引用类型值的原型时,该引用类型值会被所有实例共享
- 创建子类型的实例时，没有办法在不影响所有对象实例的情况下，向超类型的构造函数中传递参数

```js
    function SupType(){
        this.colors = ['red', 'black']
    }
    function SubType(){
    }
    SubType.prototype = new SupType()
    var instance1 = new SubType()
    instance1.colors.push('blue')
    console.log('instance.colors',instance1.colors)//['red', 'black','blue']

    var instance2 = new SubType()
    console.log('instance.colors',instance2.colors)//['red', 'black','blue']
```

##### 借用构造函数

基本思想：在子类型构造函数内部调用超类型构造函数

```js
    function SupType(name){
        this.name = name
        this.colors = ['red', 'black']
    }
    function SubType(){
        SupType.call(this, 'Nicholas')
        this.age = 29
    }
    var instance1 = new SubType()
    instance1.colors.push('blue')
    console.log('instance1.colors',instance1.colors)//['red', 'black','blue']
    
    var instance2 = new SubType()
    console.log('instance2.colors',instance2.colors)//['red', 'black']
```

- 保证了原型链中引用类型值的独立,不再被所有实例共享

- 可以在子类型构造函数中向超类型构造函数传递参数
- 在超类型的原型中定义的方法，对于子类型而言是不可见的，只能使用构造函数中属性和方法

##### 组合继承（最常用）

基本思想：使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承

```js
    function SupType(name){
        this.name = name
        this.colors = ['red', 'black']
    }
    SupType.prototype.sayName = function(){
        console.log(this.name)
        console.log('333',this)//指向调用sayName的对象，instance
    }
    function SubType(name, age){
        console.log('111',this)
        SupType.call(this, name)//第二次调用SupType
        this.age = age
    }
    SubType.prototype = new SupType()//第一次调用SupType
    SubType.prototype.constructor = SubType
    SubType.prototype.sayAge = function(){
        console.log('222',this)//指向调用sayName的对象，instance
        console.log(this.age)
    }
    var instance1 = new SubType('nicholas',29)
    instance1.colors.push('blue')
    console.log('instance1.colors',instance1.colors)//['red', 'black','blue']
    instance1.sayAge()//29
    instance1.sayName()//nicholas

    var instance2 = new SubType('allen',26)
    console.log('instance2.colors',instance2.colors)//['red', 'black']
    instance2.sayAge()//26
    instance2.sayName()//allen
```

- 通过在原型上定义方法实现了函数复用,又能保证每个实例都有它自己的属性
- 组合继承调用了两次父类构造函数, 造成了不必要的消耗

##### 原型式继承

```js
    var person = {
        name: 'Nicholas',
        friends: ['shelly', 'Court', 'Vant']
    }
    var anotherPerson = object.create(person)//新对象以person作为原型
    anotherPerson.name = 'Greg'
	anotherPerson.friends.push('Rob')

    var yetAnotherPerson = object.create(person)
    yetAnotherPerson.name = 'Linda'
	yetAnotherPerson.friends.push('Barbie')

    console.log(person.friends)//['shelly', 'Court', 'Vant','Rob','Barbie']
	console.log(person.name)//Nicholas


	var person = {
        name: 'Nicholas',
        friends: ['shelly', 'Court', 'Vant']
    }
    var anotherPerson = object.create(person, {
        name: {
            value: 'Greg'
        }
    })
    console.log(anotherPerson.name)//Greg
```

- 引用类型值会被所有实例共享，与原型链一样

##### 寄生式继承

寄生式继承是与原型式继承紧密相关的一种思路， 同样是克罗克福德推而广之

```js
    function createAnother(original){
        var clone = Object.create(original)//通过调用函数创建一个新对象
        clone.sayHi = function(){		   //以某种方式来增强这个对象
            console.log('hi')
        }
        return clone                       //返回对象
    }
    var person = {
        name: 'Nicholas',
        friends: ['shelly', 'Court', 'Vant']
    }
    var anotherPerson = createAnother(person)
    anotherPerson.sayHi()
```

- 使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率，与构造函数类似

##### 寄生组合式继承

寄生组合式继承就是为了降低调用父类构造函数的开销而出现的， 不必为了指定子类型的原型而调用超类型的构造函数

```js
    function inheritPrototype(SubType, SupType){
        var prototype = Object.create(SupType.prototype) //创建对象
        prototype.constructor = SubType				     //增强对象
        SubType.prototype = prototype 				     //指定对象
    }

	function SupType(name){
        this.name = name
        this.colors = ['red', 'black']
    }
    SupType.prototype.sayName = function(){
        console.log(this.name)
    }
    function SubType(name, age){
        SupType.call(this, name)
        this.age = age
    }

	inheritPrototype(SubType, SupType)

    SubType.prototype.sayAge = function(){
        console.log(this.age)
    }
```

##### ES6类继承extends

```js
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    toString() {
        return this.x + '' + this.y
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y) //调用父类的constructor(x, y)
        this.color = color
    }
    toString() {
        return this.color + ' ' + super.toString() // 调用父类的toString()
    }
}
var colorPoint = new ColorPoint('1', '2', 'red')
console.log(colorPoint.toString())  // red 12
```

##### 理想继承方式

```js
function Parent(name) {
    this.parent = name
}
Parent.prototype.say = function() {
    console.log(`${this.parent}: 你打篮球的样子像kunkun`)
}
function Child(name, parent) {
    // 将父类的构造函数绑定在子类上
    Parent.call(this, parent)
    this.child = name
}

/** 
 1. 这一步不用Child.prototype =Parent.prototype的原因是怕共享内存，修改父类原型对象就会影响子类
 2. 不用Child.prototype = new Parent()的原因是会调用2次父类的构造方法（另一次是call），会存在一份多余的父类实例属性
3. Object.create是创建了父类原型的副本，与父类原型完全隔离
*/
Child.prototype = Object.create(Parent.prototype);
Child.prototype.say = function() {
    console.log(`${this.parent}好，我是练习时长两年半的${this.child}`);
}

// 注意记得把子类的构造指向子类本身
Child.prototype.constructor = Child;

var parent = new Parent('father');
parent.say() // father: 你打篮球的样子像kunkun

var child = new Child('cxk', 'father');
child.say() // father好，我是练习时长两年半的cxk
```

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