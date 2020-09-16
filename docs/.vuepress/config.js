module.exports = {
    title: 'Yellow的博客',
    description: '专注 Node.js 技术栈分享，从前端到Node.js再到数据库',
    themeConfig: {
        lastUpdated: 'Last Updated', // string | boolean
        nav: [{
                text: "主页",
                link: "/"
            },
            {
                text: "Github",
                link: "https://github.com/Arsenal072"
            }
        ],
        sidebar: [
            {
                title: '知识图谱',
                path: '/basic/',
            },
            {
                title: 'CSS',
                path: '/css/',
            },
            {
                title: 'js基础',
                path: '/js/',
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 2,    // 可选的, 默认值是 1
                children: [
                    ['js/eventloop', '事件循环'],
                    ['js/module', '模块化'],
                    ['js/asynchronous', '异步编程'],
                    ['js/handle', '手写'],
                ]
            },
            {
                title: '浏览器相关',
                path: '/browser/',
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 2,    // 可选的, 默认值是 1
                children: [
                    ['browser/crossDomain', '跨域'],
                    ['browser/cache', '缓存']
                ]
            },
            {
                title: 'Vue源码',
                path: '/vue/',
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 2,    // 可选的, 默认值是 1
                children: [
                    ['vue/compile', '编译器'],
                    ['vue/vdom', 'vdom'],
                    ['vue/vuex', 'vuex'],
                    ['vue/vueRouter', 'vue-router'],
                ]
            },
        ]
    }
}