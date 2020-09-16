异步编程解决方案：promise、async/await、generator

#### **Promise**

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

**Promise对象有以下两个特点。**

1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

```js
//promise
const p = new Promise(function(resolve,reject){
    if(success){
        resolve('成功的结果')
    }else{
        reject('失败的结果')
    }
})
p.then(function (res) {
    // 接收resolve传来的数据，做些什么
}.catch(function (err) {
    // 接收reject传来的数据或者捕捉到then()中的运行报错时，做些什么
}.finally(function(){
    // 不管什么状态都执行
})
- resolve 返回异步操作成功的结果
- reject 返回异步操作失败的结果
- then 执行Promise状态是成功的操作
- catch 执行Promise状态是失败的操作
- finally 不管Promise状态是成功或失败都执行的操作
        
const p = Promise.all([p1, p2, p3])
p的状态由p1、p2、p3决定，分成两种情况。
（1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
（2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

//async与await
async function getUserByAsync(){
     let user = await fetchUser();
     return user;
 }
getUserByAsync().then(v => console.log(v));

//Generator *、yield、next
function* fetchUserByGenerator() {
    const user = yield fetchUser();
    return user;
}

const g = fetchUserByGenerator();
const result = g.next();
result.then((v) => {
    console.log(v);
}, (error) => {
    console.log(error);
})

```

#### Promise

Promise 是异步编程的一种解决方案，比传统的异步解决方案【回调函数】和【事件】更合理、更强大。

promise解决的痛点：

- 回调地狱
- 代码可读性、可复用性、可维护性差
- 容易滋生 bug
- 回调里的处理异常

**promise链式调用实现原理**

`promise`可以实现链式调用，每次`then` 之后返回的都是一个`promise`对象，可以紧接着使用 `then`继续处理接下来的任务，这样就实现了链式调用。

当Promise的状态为PENDING时，将每次 `then` 方法注册时的回调函数添加到数组中。当状态发生变化时，执行成功或失败回调函数队列中的回调函数。

**Promise.prototype.then(onFulfilled,  onRejected)**

then参数可分为两种情况：

- 当 `promise` 状态变为成功或失败时必须被调用，若 `x` 不为 `Promise` ，则使 `x` 直接作为新返回的 `Promise` 对象的值， 即新的`onFulfilled` 或者 `onRejected` 函数的参数.

  若 `x` 为 `Promise` ，这时后一个回调函数，就会等待该 `Promise` 对象(即 `x` )的状态发生变化，才会被调用，并且新的 `Promise` 状态和 `x` 的状态相同

- 如果 `onFulfilled` 或 `onRejected` 不是函数，其必须被忽略。

```js
let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})
promise2 = promise1.then(res => {
  // 返回一个普通值
  return '这里返回一个普通值'
})
promise2.then(res => {
  console.log(res) //1秒后打印出：这里返回一个普通值
})

let promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, 1000)
})
promise2 = promise1.then(res => {
  // 返回一个Promise对象
  return new Promise((resolve, reject) => {
    setTimeout(() => {
     resolve('这里返回一个Promise')
    }, 2000)
  })
})
promise2.then(res => {
  console.log(res) //3秒后打印出：这里返回一个Promise
})

```

Promise 内部的错误不会影响到 Promise 外部的代码，而这种情况我们就通常称为 “吃掉错误”。

```js
let promise = new Promise(() => {
    throw new Error('error')
});
console.log(2333333);

```

**Promise.prototype.resolve()**

有时需要将现有对象转为 Promise 对象，`Promise.resolve()`方法就起到这个作用

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))

```

`Promise.resolve`方法的参数分成四种情况:

**（1）参数是一个 Promise 实例**

如果参数是 Promise 实例，那么`Promise.resolve`将不做任何修改、原封不动地返回这个实例。

**（2）参数是一个thenable对象**

`thenable`对象指的是具有`then`方法的对象，比如下面这个对象。`Promise.resolve`方法会将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then`方法。

```js
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});

```

**（3）参数不是具有then方法的对象，或根本就不是对象**

如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 Promise 对象，状态为`resolved`。

```js
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello

```

**（4）不带有任何参数**

`Promise.resolve()`方法允许调用时不带参数，直接返回一个`resolved`状态的 Promise 对象。

所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用`Promise.resolve()`方法。

```js
const p = Promise.resolve();

p.then(function () {
  // ...
});

```

**Promise.prototype.reject()**

`Promise.reject(reason)`方法也会返回一个新的 Promise 实例，该实例的状态为`rejected`。

```javascript
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了

```

**Promise.prototype.catch()**

`Promise.prototype.catch`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数

**Promise.prototype.finally()**

`finally`方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是`fulfilled`还是`rejected`。这表明，`finally`方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果

**Promise.prototype.all()**

`p`的状态由`p1`、`p2`、`p3`决定，分成两种情况。

（1）只有`p1`、`p2`、`p3`的状态都变成`fulfilled`，`p`的状态才会变成`fulfilled`，此时`p1`、`p2`、`p3`的返回值组成一个数组，传递给`p`的回调函数。

（2）只要`p1`、`p2`、`p3`之中有一个被`rejected`，`p`的状态就变成`rejected`，此时第一个被`reject`的实例的返回值，会传递给`p`的回调函数。

```js
let arr = [1,2,3,4,5]
console.log(Promise.all(arr).then(res=>{
    console.log(res)//[1, 2, 3, 4, 5]
})).catch(reason=>{
  // ...
});

```

**Promise.prototype.race()**

`Promise.race()`方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

```javascript
const p = Promise.race([p1, p2, p3]);

```

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。



#### async

`async` 函数是 `Generator` 函数的语法糖。使用 关键字 `async` 来表示，在函数内部使用 `await` 来表示异步

`async`函数对 Generator 函数的改进，体现在以下四点

（1）内置执行器。

不像 Generator 函数，需要调用`next`方法，才能真正执行。`async`函数自带执行器

（2）更好的语义。

`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果

（3）更广的适用性。

yield命令后面只能是 Thunk 函数或 Promise 对象，而`async`函数的`await`命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）

（4）返回值是 Promise

`async`函数的返回值是 Promise 对象，这比 Generator 函数的返回值是 Iterator 对象方便多了。你可以用`then`方法指定下一步的操作

**基本用法**

```javascript
async function getStockPriceByName(name) {
  const symbol = await getStockSymbol(name);
  const stockPrice = await getStockPrice(symbol);
  return stockPrice;
}

getStockPriceByName('goog').then(function (result) {
  console.log(result);
});

async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 50);//指定 5  0 毫秒以后，输出hello world

```

**返回 Promise 对象**

`async`函数返回一个 Promise 对象。async函数内部`return`语句返回的值，会成为`then`方法回调函数的参数

```javascript
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"

```

`async`函数内部抛出错误，会导致返回的 Promise 对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

```javascript
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log(v),
  e => console.log(e)
)
// Error: 出错了

```

正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值

```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123

```

**错误处理**

`await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好把`await`命令放在`try...catch`代码块中

```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
  .catch(function (err) {
    console.log(err);
  });
}

```

**async/await使用意义**

在多个回调依赖的场景中，尽管Promise通过链式调用取代了回调嵌套，但过多的链式调用可读性仍然不佳，流程控制也不方便，ES7 提出的async 函数，终于让 JS 对于异步操作有了终极解决方案

> **async 及 await 和 Generator 以及 Promise 什么区别？它们的优点和缺点分别是什么？await 原理是什么？** 

- Promise这种方式充满了 Promise的 `then()` 方法，如果处理流程复杂的话，整段代码将充满 `then`。语义化不明显
- Generator 的方式解决了 Promise 的一些问题，流程更加直观、语义化。但是 Generator 的问题在于，函数的执行需要依靠执行器，每次都需要通过 `g.next()` 的方式去执行。Generator返回的是生成器对象。
- `async` 函数完美的解决了上面两种方式的问题。流程清晰，直观、语义明显。操作异步流程就如同操作同步流程。同时 `async` 函数自带执行器，执行的时候无需手动加载。
- async 函数返回的 Promise 对象，只有当 `async` 函数内部的异步操作都执行完，才会执行 `then` 方法的回调。await能够返回Promise的resolve/reject的值。

**缺点：**

因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 `await` 会导致性能上的降低。

```javascript
//多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发
let foo = await getFoo();
let bar = await getBar();

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

```

`Generator `和`async/await`看起来其实已经很相似了，它们都提供了暂停执行的功能，但二者又有三点不同：

- `async/await`自带执行器，不需要手动调用next()就能自动执行下一步
- `async`函数返回值是Promise对象，而Generator返回的是生成器对象
- `await`能够返回Promise的resolve/reject的值

**await 原理是什么？**

`async` 函数的实现，就是将 `Generator`函数和自动执行器，包装在一个函数里。

```javascript
async function fn(args) {
  // ...
}

// 等同于
function fn(args) {
  return spawn(function* () {
    // ...
  });
}

function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}

```