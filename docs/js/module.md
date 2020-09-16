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