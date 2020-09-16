#### 模板编译

模板编译的主要目标是将模板(template)转换为渲染函数(render)

```html
<div id="demo">
    <h1>Vue.js测试</h1>
    <p>{{foo}}</p>
</div>
<script>
    // 使用el方式
    new Vue({
        data: { foo: 'foo' },
        el: "#demo",
    });
</script>
```

```js
ƒunction anonymous() {
    with (this) {
        return _c('div', { attrs: { "id": "demo" } }, [
            _c('h1', [_v("Vue.js测试")]),
            _v(" "),
            _c('p', [_v(_s(foo))])
        ])
    }
}
//元素节点使用createElement创建，别名_c
//本文节点使用createTextVNode创建，别名_v
//表达式先使用toString格式化，别名_s
```

**模板编译过程**

实现模板编译共有三个阶段：**解析、优化和生成**

【core/instance/init.js】

vm.$mount(vm.$options.el) 

【platforms/web/entry-runtime-with-compiler.js】

const { render, staticRenderFns } = compileToFunctions(template, {}, this)

【compiler/to-function.js】

const compiled = compile(template, options)

【compiler/create-compiler.js】

const compiled = baseCompile(template.trim(), finalOptions)

【compiler/index.js】

```js
// compiler/index.js
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

**解析 - parse**
解析器将模板解析为抽象语法树AST，只有将模板解析成AST后，才能基于它做优化或者生成代码字符串。调试查看得到的AST，/src/compiler/parser/index.js - parse，结构如下：

![1587019985147](C:\Users\ucmed\AppData\Roaming\Typora\typora-user-images\1587019985147.png)

解析器内部分了HTML解析器(html-parser.js)、文本解析器(text-parser.js)和过滤器解析器(filter-parser.js)，最主要是HTML解析器，核心算法说明：

```js
// src/compiler/parser/index.js
parseHTML(tempalte, {
    start(tag, attrs, unary){}, // 遇到开始标签的处理
    end(){},// 遇到结束标签的处理
    chars(text){},// 遇到文本标签的处理
    comment(text){}// 遇到注释标签的处理
})
```

**优化 - optimize**
优化器的作用是在AST中找出那些静态节点和静态根节点并打上标记。静态节点是在AST中永远不变的节点，如纯文本节点。如果某个子节点不是静态节点，那么讲当前节点的标记改为 `false`。

标记静态节点的好处：

- 每次重新渲染，不需要为静态节点创建新节点
- 虚拟DOM patching 时，可以跳过静态节点

```js
function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // 当前节点的 attrs 中，不能有 v-、@、:开头的 attr
    !node.if && !node.for && // 元素节点不能有 if 和 for属性
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
```

**type**

- 1   元素节点
- 2   带变量的动态文本节点
- 3   不带变量的纯文本节点

```js
// compiler/optimizer.js
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}
```

**代码生成 - generate**

将AST转换成render函数代码，即代码字符串。

```js
// compiler/codegen/index.js
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}
```

**总结**

解析器（parser）的原理是一小段一小段的去截取字符串，然后维护一个 `stack` 用来保存DOM深度，每截取到一段标签的开始就 `push` 到 `stack` 中，当所有字符串都截取完之后也就解析出了一个完整的 `AST`。

优化器（optimizer）的原理是用递归的方式将所有节点打标记，表示是否是一个 `静态节点`，然后再次递归一遍把 `静态根节点` 也标记出来。

代码生成器（code generator）的原理也是通过递归去拼一个函数执行代码的字符串，递归的过程根据不同的节点类型调用不同的生成方法，如果发现是一颗元素节点就拼一个 `_c(tagName, data, children)` 的函数调用字符串，然后 `data` 和 `children` 也是使用 `AST` 中的属性去拼字符串。

如果 `children` 中还有 `children` 则递归去拼。

最后拼出一个完整的 `render` 函数代码



调用 compile 函数,生成 render 函数字符串 ,编译过程如下:

- parse 函数解析 template,生成 ast(抽象语法树)
- optimize 函数优化静态节点 (标记不需要每次都更新的内容,diff 算法会直接跳过静态节点,从而减少比较的过程,优化了 patch 的性能)
- generate 函数生成 render 函数字符串

参考链接：https://juejin.im/post/5aaa506ff265da239236131b#heading-8