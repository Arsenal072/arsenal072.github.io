#### **Vuex**

vuex是一个专为vue.js应用程序开发的状态管理模式（它采用集中式存贮管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化）。

对于问题二，vuex五大核心属性：state，getter，mutation，action，modules

当组件进行数据修改的时候我们需要调用dispatch来触发actions里面的方法。actions里面的每个方法中都会有一个commit方法，当方法执行的时候会通过commit来触发mutations里面的方法进行数据的修改。mutations里面的每个函数都会有一个state参数，这样就可以在mutations里面进行state的数据修改，当数据修改完毕后，会传导给页面，页面的数据也会发生改变。

由于传参的方法对于多层嵌套的组件将会非常繁琐，并且对于兄弟组件间的状态传递无能为力，所以我们需要把组件的共享状态抽取出来，以一个全局单例模式管理。

**vuex实现原理**

- vuex也是一个插件
- 实现四个东西：state/mutations/actions/getters
- 创建Store
- 数据响应式

```js
let Vue;
function install(_Vue) {
    Vue = _Vue;
    // 这样store执行的时候，就有了Vue，不用import
    // 这也是为啥Vue.use必须在新建store之前
    Vue.mixin({
        beforeCreate() {
            // 这样才能获取到传递进来的store
            // 只有root元素才有store，所以判断一下
            if (this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        }
    });
}

class Store {
    constructor(options = {}) {
    	this.state = new Vue({
    		data: options.state
    	});
        this.mutations = options.mutations || {};
        this.actions = options.actions;
        options.getters && this.handleGetters(options.getters);
	}
	// 注意这里用箭头函数形式，后面actions实现时会有作用
    commit = (type, arg) => {
		this.mutations[type](this.state, arg);
	};

    dispatch(type, arg) {
        this.actions[type]({
            commit: this.commit,
            state: this.state
        }, arg);
    }

    handleGetters(getters) {
        this.getters = {}; // 定义this.getters
        // 遍历getters选项，为this.getters定义property
        // 属性名就是选项中的key，只需定义get函数保证其只读性
        Object.keys(getters).forEach(key => {
            // 这样这些属性都是只读的
            Object.defineProperty(this.getters, key, {
                get: () => { // 注意依然是箭头函数
                    return getters[key](this.state);
                }
            });
        });
    }
}
export default { Store, install };
```

- 实现一个插件，通过混入方式在beforeCreate阶段给Vue原型定义$store属性
- Store类实现state/mutations/actions/getters4个方法，state响应化、给getters设置只读属性