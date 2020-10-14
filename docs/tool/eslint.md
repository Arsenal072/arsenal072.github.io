#### ESlint

ESLint是一个用来识别 ECMAScript 并且按照规则给出报告的代码检测工具，使用它可以避免低级错误和统一代码的风格。如果每次在代码提交之前都进行一次eslint代码检查，就不会因为某个字段未定义为undefined或null这样的错误而导致服务崩溃，可以有效的控制项目代码的质量

ESLint 使用 AST 去分析代码中的模式

##### 使用

##### 安装

ESLint 支持多种安装方式，可以通过 npm 来安装，也可以在 webpack(eslint-loader) 和 Gulp.js(gulp-eslint) 中使用。

##### 全局安装

```
npm i -g eslint
```

##### 局部安装（推荐）

```
npm i -D eslint
```

##### 初始化

安装完毕后，接下来新建一个配置文件.eslintrc.js，或者使用如下的命令行来自动生成，命令如下：

```
eslint --init
```

##### 配置

运行 eslint --init 之后，.eslintrc 文件会在你的文件夹中自动创建。文件的内容大体如下：

```js
{
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "script"
    },
    "rules": {
        "no-console": 0,
        "no-unused-vars": "error",
        "no-use-before-define": "error",
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "curly": ["error", "all"],
        "default-case": "error",
        "no-else-return": "error",
        "no-empty-function": "error",
        "no-implicit-coercion": "error",
        "no-invalid-this": "error",
        "no-loop-func": "error",
        "no-multi-spaces": "error",
        "no-new-func": "error",
        "no-useless-return": "error",
        "global-require": "error",
        "no-path-concat": "error",
        "no-sync": "error",
        "array-bracket-spacing": [
            "error",
            "never" 
        ],
        "block-spacing": [
            "error",
            "always"
        ],
        "brace-style": [
            "error",
            "1tbs"
        ],
        "camelcase": "error",
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "comma-spacing": [
            "error",
            { "before": false, "after": true }
        ],
        "comma-style": [
            "error",
            "last"
        ],
        "key-spacing": [
            "error", 
            { "beforeColon": false, "afterColon": true }
        ],
        "lines-around-comment": [
            "error",
            { "beforeBlockComment": true }
        ],
        "newline-after-var": [
            "error",
            "always"
        ],
        "newline-before-return": "error",
        "no-multi-assign": "error",
        "max-params": [1, 3],
        "new-cap": [
            "error",
            {
                "newIsCap": true,
                "capIsNew": false
            }
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2
            }
        ],
        "no-shadow-restricted-names": "error",
        "no-undef-init": "error",
        "keyword-spacing": "error",
        "space-before-blocks": [
            "error",
            "always"
        ]
    }
}
```

##### 检测规则

接下来，可以在配置文件中设置一些规则。ESLint规则的三种级别：

- "off" 或者 0：关闭规则。
- "warn" 或者 1：打开规则，并且作为一个警告（不影响exit code）。
- "error" 或者 2：打开规则，并且作为一个错误（exit code将会是1）。

##### 忽略检测

既然有检测的规则，那么必然有忽略检测的配置。要新增忽略检测的规则，首先要在项目根目录创建一个 .eslintignore 文件告诉 ESLint 去忽略掉不需要检测的文件或者目录。

或者通过package.json文件设置需要忽略检测的对象，例如：

```js
{
  "name": "my_project",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": ""
  },
  "eslintConfig": { // 也可配置eslint
    "env": {
      "es6": true,
      "node": true
    }
  },
  "eslintIgnore": ["test.js"]
}
```

##### ESLint自动修复报错

一般来说，当我们使用命令“npm run lint”检测JavaScript的时候，基本上都会出现非常的多报错，基本上就是满屏的error和warning。其实这些错误都可以让ESLint帮助我们自动地修复。具体来说，只需要在package.json文件里面的scripts里面新增一条命令即可：

```js
"lint-fix": "eslint --fix --ext .js --ext .jsx --ext .vue src/"
```

还有一种万能方法，就是在报错的JS文件中第一行写上/ *eslint-disable* /

##### eslint-loader

有时候，我们希望在项目开发的过程当中，每次修改代码都能够自动进行ESLint的检查。因为在我们改代码的过程中去做一次检查，如果有错误，我们就能够很快地去定位到问题并解决问题。这时候我们可以借助eslint-loader插件。

执行完安装操作后，我们还需要在.eslintrc文件里面配置如下脚本：

```js
{
  "extends": "standard",
  "plugins": [
    "html"
  ],
  "parser": "babel-eslint"
}
```

执行完安装操作后，我们还需要在.eslintrc文件里面配置如下脚本：

```
{
  "extends": "standard",
  "plugins": [
    "html"
  ],
  "parser": "babel-eslint"//解析ES6
}
```

为什么我们要配置parser呢？因为我们的项目是基于webpack的，项目里的代码都是需要经过babel去处理的。babel处理的这种语法可能对ESLint不是特别的支持，然后我们使用loader处理ESLint的时候就会出现一些问题。所以一般来说，我们用webpack和babel来进行开发的项目，都会指定它的parser使用babel-eslint。

同时，使用webpack方式构建的项目，还需要在webpack.config.base.js的module下面的rules里面添加一个如下脚本：

```
rules: [
  {
    test: /\.(vue|js|jsx)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/,
    enforce: 'pre'
  },
  ......
]
```

然后我们就可以使用命令 `$ npm run dev`就可以在开发环境进行ESLint错误检测