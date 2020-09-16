## **vue-router**

**路由钩子**

- 全局守卫钩子：router.beforeEach、router.afterEach
- 路由级钩子：beforeEnter
- 组件级钩子：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

```js
beforeRouteEnter(to, from, next) {
	//this不能用
},
beforeRouteUpdate(to, from, next) {},
beforeRouteLeave(to, from, next) {}
```

**路由传参**

- this.$router.push({ path: '/', query: { a: '4545' } })

- 动态路由 { path: "detail/:id", component: Detail }

  ```html
  <template>
      <div>
          <h2>商品详情</h2>
          <p>{{$route.params.id}}</p>
      </div>
  </template>
  ```

**route与router区别**

- $router对象是全局路由的实例，是router构造方法的实例，具有各种钩子函数
- $route表示当前的路由信息对象，包含了当前 URL 解析得到的信息。包含当前的路径，参数，query对象等

**hash与history模式**

**实现原理**

- 实现插件
- url变化监听
- 路由配置解析： {‘/’: Home}
- 实现全局组件：router-link router-view

```js
class VueRouter {
    constructor(options) {
        this.$options = options;
        this.routeMap = {};
        // 路由响应式
        this.app = new Vue({
            data: {
                current: "/"
            }
        });
    }
    init() {
        this.bindEvents(); //监听url变化
        this.createRouteMap(this.$options); //解析路由配置
        this.initComponent(); // 实现两个组件
    }
    bindEvents() {
        window.addEventListener("load", this.onHashChange.bind(this));
        window.addEventListener("hashchange", this.onHashChange.bind(this));
    }
    onHashChange() {
    	this.app.current = window.location.hash.slice(1) || "/";
    }
    createRouteMap(options) {
        options.routes.forEach(item => {
        	this.routeMap[item.path] = item.component;
        });
    }
    initComponent() {
        // router-link,router-view
        // <router-link to="">fff</router-link>
        Vue.component("router-link", {
            props: { to: String },
            render(h) {
                // h(tag, data, children)
                return h("a", { attrs: { href: "#" + this.to } }, [
                    this.$slots.default]);
            }
    	});
        // <router-view></router-view>
        Vue.component("router-view", {
            render: h => {
                const comp = this.routeMap[this.app.current];
                return h(comp);
            }
        });
    }
}

VueRouter.install = function(Vue) {
    // 混入
    Vue.mixin({
        beforeCreate() {
            // this是Vue实例
            if (this.$options.router) {
                // 仅在根组件执行一次
                Vue.prototype.$router = this.$options.router;
                this.$options.router.init();
            }
        }
    });
};
```

- vue-router首先会定义一个vue-router类，定义路由响应式；
- 实现了一个插件，通过混入的方式，在beforeCreate阶段在Vue原型上定义$router属性，并对router进行初始化this.$options.router.init()
- init()，首先，监听路由变化(load，hashchange)，获取当前的路由；其次，解析路由配置，获取路由与组件的对应关系(routeMap)；最后，实现router-link、router-view两个全局组件。当路由发生改变时，我们监听到路由变化，获取到当前的路由，通过routeMap获取到路由对应的组件，重新渲染router-view组件，视图发生更新。