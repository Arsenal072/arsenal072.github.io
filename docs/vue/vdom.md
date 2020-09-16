#### VDOM

- vm.$mount(vm.$options, el)      core/instance/init.js
- Vue.prototype.$mount                platforms/web/entry-runtime-with-compiler.js

扩展$mount方法，并调用

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }
  return mount.call(this, el, hydrating)
}
```

- compileToFunctions 完成模板编译，生成render函数
- mount.call(this, el, hydrating)                      platforms/web/runtime/index.js

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```

- mountComponent(this, el, hydrating)      core/instance/lifecycle.js

创建组件监听器Watcher

```js
export function mountComponent(
  vm: Component,
  el: ? Element,
  hydrating ? : boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }
  callHook(vm, 'beforeMount')

  let updateComponent
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      mark(startTag)
      const vnode = vm._render()
      mark(endTag)
      measure(`vue ${name} render`, startTag, endTag)

      mark(startTag)
      vm._update(vnode, hydrating)
      mark(endTag)
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)//生成node
    }
  }
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */ )
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```

- vm.\_update(vm._render(), hydrating)       core/instance/render.js 

_render函数生成vnode，update通过diff比较oldVnode与vnode，生成真实DOM

```js
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)//生成vnode
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }
```

```js
// core/instance/lifecycle.js
  Vue.prototype._update = function (vnode: VNode, hydrating ? : boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */ )
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
```

首次生成DOM:      vm.$el = vm.\__patch__(vm.$el, vnode, hydrating, false)

第二次生成DOM：vm.$el = vm.\__patch__(prevVnode, vnode)

- vm.\__patch__(prevVnode, vnode)，diff比较prevVnode, vnode，生成真实DOM

```js
/*createPatchFunction的返回值，一个patch函数*/
return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
/*vnode不存在则删*/
    if (isUndef(vnode)) {
    	if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
		return
	}
    let isInitialPatch = false
    const insertedVnodeQueue = []
	if (isUndef(oldVnode)) {
		/*oldVnode不存在则创建新节点*/
		isInitialPatch = true
		createElm(vnode, insertedVnodeQueue, parentElm, refElm)
	} else {
		/*标记旧的VNode是否有nodeType，如果是它就是一个DOM元素*/
		const isRealElement = isDef(oldVnode.nodeType)
		if (!isRealElement && sameVnode(oldVnode, vnode)) {
			/*是同一个节点的时候做更新*/
			patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
		} else {
			/*带编译器版本才会出现的情况：传了dom元素进来*/
			if (isRealElement) {
				// 挂载一个真实元素，创建一个空的VNode节点替换它
				oldVnode = emptyNodeAt(oldVnode)
			}
            /*取代现有元素*/
            const oldElm = oldVnode.elm
            const parentElm = nodeOps.parentNode(oldElm)
            createElm(
                vnode,
                insertedVnodeQueue,
                oldElm._leaveCb ? null : parentElm,
                nodeOps.nextSibling(oldElm)
            )
            if (isDef(parentElm)) {
                /*移除老节点*/
                removeVnodes(parentElm, [oldVnode], 0, 0)
            } else if (isDef(oldVnode.tag)) {
                /*调用destroy钩子*/
                invokeDestroyHook(oldVnode)
            }
        }
    }
	/*调用insert钩子*/
	invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
	return vnode.elm
}
```

diff算法：通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，同层级只做三件事：增删改。具体规则是：new VNode不存在就删；old VNode不存在就增；都存在就比较类型，类型不同直接替换、类型相同执行更新；

patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)

两个同类型VNode执行更新操作，包括三种操作：**属性更新、文本更新、子节点更新**，规则如下：

- 如果新旧VNode都是静态的，同时它们的key相同（代表同一节点），并且新的VNode是clone或者是标记了v-once，那么只需要替换elm以及componentInstance即可。
- 新老节点均有children子节点，则对子节点进行diff操作，调用updateChildren，这个updateChildren也是diff的核心。
- 如果老节点没有子节点而新节点存在子节点，先清空老节点DOM的文本内容，然后为当前DOM节点加入子节点。
- 当新节点没有子节点而老节点有子节点的时候，则移除该DOM节点的所有子节点。
- 当新老节点都无子节点的时候，只是文本的替换。

```js
/*patchVNode节点*/    core\vdom\patch.js
function patchVnode (oldVnode, vnode,insertedVnodeQueue, ownerArray,index,removeOnly){
    /*两个VNode节点相同则直接返回*/
    if (oldVnode === vnode) {
    	return
    }
    if (isDef(vnode.elm) && isDef(ownerArray)) {
    	// clone reused vnode
    	vnode = ownerArray[index] = cloneVNode(vnode)
    }
    const elm = vnode.elm = oldVnode.elm
    /*
        如果新旧VNode都是静态的，同时它们的key相同（代表同一节点），
        并且新的VNode是clone或者是标记了once（标记v-once属性，只渲染一次），
        那么只需要替换elm以及componentInstance即可。
    */
    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
        vnode.elm = oldVnode.elm
        vnode.componentInstance = oldVnode.componentInstance
        return
    }
    /*如果存在data.hook.prepatch则要先执行*/
    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    	i(oldVnode, vnode)
    }
    const oldCh = oldVnode.children
    const ch = vnode.children
    /*执行属性、事件、样式等等更新操作*/
    if (isDef(data) && isPatchable(vnode)) {
    	for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    	if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    /*开始判断children的各种情况*/
    /*如果这个VNode节点没有text文本时*/
    if (isUndef(vnode.text)) {
    	if (isDef(oldCh) && isDef(ch)) {
    	/*新老节点均有children子节点，则对子节点进行diff操作，调用updateChildren*/
    	if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue,
    	removeOnly)
    } else if (isDef(ch)) {
    	/*如果老节点没有子节点而新节点存在子节点，先清空elm的文本内容，然后为当前节点加入子节点*/
    	if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
    		addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    	} else if (isDef(oldCh)) {
    		/*当新节点没有子节点而老节点有子节点的时候，则移除所有ele的子节点*/
    		removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    	} else if (isDef(oldVnode.text)) {
    		/*当新老节点都无子节点的时候，只是文本的替换，因为这个逻辑中新节点text不存在，所				以清除ele文本*/
    		nodeOps.setTextContent(elm, '')
    	}
    } else if (oldVnode.text !== vnode.text) {
    	/*当新老节点text不一样时，直接替换这段文本*/
    	nodeOps.setTextContent(elm, vnode.text)
    }
    /*调用postpatch钩子*/
    if (isDef(data)) {
    	if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
}
```

- updateChildren        core\vdom\patch.js

updateChildren主要作用是比较新旧两个VNode的children，得出具体DOM操作

在新老两组VNode节点的左右头尾两侧都有一个变量标记，在遍历过程中这几个变量都会向中间靠拢。当oldStartIdx > oldEndIdx或者newStartIdx > newEndIdx时结束循环

```js
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx, idxInOld, elmToMove, refElm
    // 确保移除元素在过度动画过程中待在正确的相对位置，仅用于<transition-group>
    const canMove = !removeOnly
    // 循环条件：任意起始索引超过结束索引就结束
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
    		oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
        	oldEndVnode = oldCh[--oldEndIdx]
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
        /*分别比较oldCh以及newCh的两头节点4种情况，判定为同一个VNode，则直接patchVnode即可*/
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
            canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm,
            nodeOps.nextSibling(oldEndVnode.elm))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
            canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        } else {
            /*生成一个哈希表，key是旧VNode的key，值是该VNode在旧VNode中索引*/
            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx,
            oldEndIdx)
            /*如果newStartVnode存在key并且这个key在oldVnode中能找到则返回这个节点的索引*/
            idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
            if (isUndef(idxInOld)) {
            /*没有key或者是该key没有在老节点中找到则创建一个新的节点*/
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
            } else {
                /*获取同key的老节点*/
                elmToMove = oldCh[idxInOld]
                if (sameVnode(elmToMove, newStartVnode)) {
                /*如果新VNode与得到的有相同key的节点是同一个VNode则进行patchVnode*/
                    patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
                /*因为已经patchVnode进去了，所以将这个老节点赋值undefined，之后如果还有新节点与该节点key相同可以检测出来提示已有重复的key*/
                    oldCh[idxInOld] = undefined
                /*当有标识位canMove实可以直接插入oldStartVnode对应的真实DOM节点前面*/
                    canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
                    newStartVnode = newCh[++newStartIdx]
                } else {
                /*当新的VNode与找到的同样key的VNode不是sameVNode的时候（比如说tag不一样或者是有不一样type的input标签），创建一个新的节点*/
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
                    newStartVnode = newCh[++newStartIdx]
                }
    		}
    	}
    }
    if (oldStartIdx > oldEndIdx) {
    /*全部比较完成以后，发现oldStartIdx > oldEndIdx的话，说明老节点已经遍历完了，新节点比老节点多，所以这时候多出来的新节点需要一个一个创建出来加入到真实DOM中*/
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
    /*如果全部比较完成以后发现newStartIdx > newEndIdx，则说明新节点已经遍历完了，老节点多余新节点，这个时候需要将多余的老节点从真实DOM中移除*/
    	removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```

**属性相关dom操作**

原理：将属性相关dom操作按vdom hooks归类，在patchVnode时一起执行

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']
export function createPatchFunction (backend) {
    const { modules, nodeOps } = backend
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = []
        for (j = 0; j < modules.length; ++j) {
            if (isDef(modules[j][hooks[i]])) {
            	cbs[hooks[i]].push(modules[j][hooks[i]])
            }
        }
    }
    function patchVnode (...) {
        if (isDef(data) && isPatchable(vnode)) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode)
            if (isDef(i = data.hook) && isDef(i = i.update)) 
                i(oldVnode, vnode)
        }
    }
}
```

总结：

- 组件挂载vm.$mount(vm.$options.el)
- 扩展$mount，添加模板编译const { render, staticRenderFns } = compileToFunctions(template, {}, this)，并调用$mount，mount.call(this, el, hydrating)
- 组件挂载mountComponent(this, el, hydrating)
- callHook(vm, 'beforeMount')
- 创建组件watcher

```js
new Watcher(vm, updateComponent, noop, {
    before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */ )
```

- 调用updateComponent

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```

- \_render生成虚拟dom   真正用来创建vnode的函数是createElement，vnode = render.call(vm._renderProxy, vm.$createElement)
- vm._update负责更新dom，核心是调用\_\_patch\_\_

```js
Vue.prototype.__patch__ = inBrowser ? patch : noop  
export const patch: Function = createPatchFunction({ nodeOps, modules })
```

- patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm)   将新老VNode节点进行比对（diff算法），然后根据比较结果进行最小量DOM操作，而不是将整个视图根据新的VNode重绘

diff算法：通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，同层级只做三件事：增删改。具体规则是：new VNode不存在就删；old VNode不存在就增；都存在就比较类型，类型不同直接替换、类型相同执行更新；

- patchVnode (oldVnode, vnode,insertedVnodeQueue, ownerArray,index,removeOnly)属性、事件、样式更新
- updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)比较新旧两个VNode的children，得出具体DOM操作

