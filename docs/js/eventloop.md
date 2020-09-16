#### 事件循环机制**event loop**   执行栈、主线程

Js是单线程运行，单线程存在运行阻塞问题，Event Loop(事件循环)是解决javaScript单线程运行阻塞的一种机制。

任务队列`Task Queue`，是一种先进先出的一种数据结构。在队尾添加新元素，从队头移除元素。

javascript是单线程。单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。于是js所有任务分为两种：**同步任务，异步任务**

**同步任务**是调用立即得到结果的任务，同步任务在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；

**异步任务**是调用无法立即得到结果，需要额外的操作才能得到预期结果的任务，异步任务不进入主线程、而进入"任务队列"（task queue）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。
 JS引擎遇到异步任务（DOM事件监听、网络请求、setTimeout计时器等），会交给相应的线程单独去维护异步任务，等待某个时机（计时器结束、网络请求成功、用户点击DOM），然后由 事件触发线程 将异步对应的 回调函数 加入到消息队列中，消息队列中的回调函数等待被执行。

**具体来说，异步运行机制如下：**

- 所有同步任务都在主线程上执行，形成一个[执行栈]
- 主线程之外，还存在一个"任务队列"（task queue）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
- 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
- 主线程不断重复上面的第三步。

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为Event Loop（事件循环）

##### **宏任务与微任务:**

异步任务分为 宏任务（macrotask） 与 微任务 (microtask)，不同的API注册的任务会依次进入自身对应的队列中，然后等待 Event Loop 将它们依次压入执行栈中执行。

**宏任务(macrotask)：**：

script(整体代码)、setTimeout、setInterval、UI 渲染、 I/O、postMessage、 MessageChannel、setImmediate(Node.js 环境)

**微任务(microtask)：**

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

要明确的一点是，主线程跟执行栈是不同概念，主线程规定现在执行执行栈中的哪个事件。

主线程循环：即主线程会不停的从执行栈中读取事件，会执行完所有栈中的同步代码。

当遇到一个异步事件后，并不会一直等待异步事件返回结果，而是会将这个事件挂在与执行栈不同的队列中，我们称之为任务队列(Task Queue)。

**当主线程将执行栈中所有的代码执行完之后，主线程将会去查看任务队列是否有任务**。如果有，那么主线程会依次执行那些任务队列中的回调函数。