### **CSS篇**

- **盒模型**
- **定位**
- **去除浮动**
- **margin塌陷问题**
- **块格式化上下文BFC**
- **flex布局**
- **opacity与rgba区别**
- **CSS引入方式、区别、优先级**
- **浏览器兼容性问题(css/js)**
- **css继承性与层叠性**
- **选择器类型、优先级**
- **居中布局**
- **伪类与伪元素、区别、使用场景**
- **display**
- **换行显示与隐藏**
- **CSS预处理器(Sass/Less/Postcss)**
- **CSS3有哪些新特性？**
- **HTML5新特性**
- **1px解决方案**
- **响应式布局**



#### **盒模型**

```css
标准盒模型: box-sizing: content-box;
IE盒模型: box-sizing: border-box;
```

标准盒模型：width = 内容的宽度；height = 内容的高度

IE盒模型：width = border + padding + 内容的宽度；height = border + padding + 内容的高度



#### **定位**

- position: relative;相对定位，相对于自身位置的偏移
- position: absolute;绝对定位，相对于最近的已定位祖先元素
- position: fixed;固定定位，相对于浏览器窗口进行定位
- position: static;默认值，没有定位



#### **去除浮动**(浮动元素不在文本流中)

- 给浮动的元素的祖先设置高度
- 通过给元素添加clear: both，清除别人对我的影响，但是会出现margin失效的问题
- 隔墙法，在浮动元素与不想浮动之间添加div，可解决margin失效的问题
- 创建父级 BFC，overflow: hidden;



#### margin塌陷问题

浮动元素不存在塌陷问题，margin-bottom: 30px; margin-top: 40px; 70px

标准流中元素存在margin塌陷问题，上下margin取较大的，左右不存在塌陷问题；



#### **块格式化上下文BFC**

块级格式化上下文，是一个独立的渲染区域，让处于 BFC 内部的元素与外部的元素相互隔离，使内外元素的定位不会相互影响。

**BFC的特性**：

- 属于同一个BFC的两个相邻Box的margin会发生折叠，不同BFC不会发生折叠
- BFC的区域不会与浮动元素的区域重叠
- BFC的高度包含浮动子元素的高度
- BFC在页面上是一个独立的容器，里外的元素不会互相影响
- 每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）

**BFC的创建方法**

- **浮动** (元素的`float`不为`none`)；
- **绝对定位元素** (元素的`position`为`absolute`或`fixed`)；
- **行内块**`inline-blocks`(元素的 `display: inline-block`)；
- **表格单元格**(元素的`display: table-cell`，HTML表格单元格默认属性)；
- `overflow`的值不为`visible`的元素；
- **弹性盒 flex boxes** (元素的`display: flex`或`inline-flex`)；

但其中，最常见的就是`overflow:hidden`、`float:left/right`、`position:absolute`。也就是说，每次看到这些属性的时候，就代表了该元素以及创建了一个BFC了。

**BFC使用场景：**

- 去除边距重叠现象
- 清除浮动（让父元素的高度包含子浮动元素）
- 避免某元素被浮动元素覆盖
- 避免多列布局由于宽度计算四舍五入而自动换行
- 计算 BFC 的高度时，浮动子元素也参与计算

```html
//防止与浮动元素重叠left、right
//box闭合浮动,高度为200px
<div class='box BFC'>
    <div class='left BFC'> </div>
    <div class='right BFC'>
        <div class='little'></div>
        <div class='little'></div>
        <div class='little'></div>
    </div>
</div>
	.left{
        background: #73DE80;    /* 绿色 */
        /* opacity: 0.5; */
        border: 3px solid #F31264;
        width: 200px;
        height: 200px;
        float: left;
    }
    .right{                        /* 粉色 */
        background: #3978ff;
        /* opacity: 0.5; */
        border: 3px solid #F31264;
        width:400px;
        min-height: 100px;
        overflow: hidden;
    }
    .box{
        background:#888;
        margin-left: 50px;
        overflow: hidden;
    }
    .little{
        background: #fff;
        width: 50px;
        height: 50px;
        margin: 10px;
        float: left;
    }
```

![1577424860944](C:\Users\ucmed\AppData\Roaming\Typora\typora-user-images\1577424860944.png)

#### flex布局

- flex-direction：row | row-reverse | column | column-reverse
- flex-wrap: nowrap | wrap | wrap-reverse;
- flex-flow: flex-direction || flex-wrap，是`flex-direction`属性和`flex-wrap`属性的简写形式，默认值为`row nowrap`
- justify-content: flex-start | flex-end | center | space-between | space-around;
- align-items: flex-start | flex-end | center | baseline | stretch;
- align-content: flex-start | flex-end | center | space-between | space-around | stretch;

**flex-grow**

`flex-grow`属性定义项目的放大比例，默认为`0`，即如果存在剩余空间，也不放大。如果所有项目的`flex-grow`属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的`flex-grow`属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

```css
.item {
  flex-grow: number; /* default 0 */
}
```

**flex-shrink**

`flex-shrink`属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。如果所有项目的`flex-shrink`属性都为1，当空间不足时，都将等比例缩小。如果一个项目的`flex-shrink`属性为0，其他项目都为1，则空间不足时，前者不缩小。负值对该属性无效。

```css
.item {
  flex-shrink: number; /* default 1 */
}
```

**flex**

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选

```css
.item {
  flex: none | [ 'flex-grow' 'flex-shrink'? || 'flex-basis' ]
}
```

该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)

##### 等分

```html
<div class="box">
    <div>等分效果</div>
    <div>等分效果</div>
</div>
.box{
    display: flex;
    div{
         height: 300px;
         border: 1px solid #000000;
         flex: 1;//这就是flex：1的妙用
         text-align: center;
    }
}
```

##### 左侧固定，右侧自适应

```html
<div class="box">
    <div class="left">左边固定效果</div>
    <div class="right">右边自适应效果</div>
</div>
.box {
    display: flex;
    div {
        height: 300px;
        text-align: center;
        &.right {
            flex: 1;
            border: 1px solid #000000;
        }
        &.left {
            border: 1px solid #000000;
            flex-basis: 100px;
        }
    }
}
```

#### **opacity与rgba区别**

有opacity属性的所有后代元素都会继承 opacity 属性，而RGBA后代元素不会继承不透明属性



#### **CSS引入方式**

行内样式、内嵌样式、link链接样式、@import样式

**优先级**

理论上优先级：行内>内嵌>link链接>导入@import

实际上：内嵌、链接、导入在同一个文件头部，谁离相应的代码近，谁的优先级高

1、如果同一个css定义分布在两个css文件中，那么样式取后引入的css文件。

2、最好将第三方组件的css放在html靠前位置，自定义的css放到html后面位置。

**CSS优化：**

- 将渲染首屏内容所需的关键CSS内联到HTML中(行内样式)
- 异步加载CSS，JavaScript动态创建样式表link元素，并插入到header后面

```js
// 创建link标签
const myCSS = document.createElement( "link" );
myCSS.rel = "stylesheet";
myCSS.href = "mystyles.css";
// 插入到header的最后位置
document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );
```

- 文件压缩，使用webpack插件
- 减少重排重绘
- 不要使用@import

**link与@import区别**

- 当解析到`link`时，页面会同步加载所引的 css，而`@import`所引用的 css 会等到页面加载完才被加载
- `@import`存在兼容性问题，需要 IE5 以上才能使用
- `link`可以使用 js 动态引入，`@import`不行
- `link`引入的样式权重大于`@import`引入的样式



#### **浏览器兼容性问题(css/js)**

CSS兼容性

- 不同的浏览器样式存在差异，padding,margin存在差异 { margin: 0; padding: 0; }

- 当标签的高度设置小于10px，在IE6、IE7中会超出自己设置的高度

  解决方案：超出高度的标签设置overflow：hidden，或者设置line-height的值小于你的设置高度

- overflow、opacity兼容性

- css属性添加浏览器前缀

JS兼容性

- 获取 scrollTop 通过 document.documentElement.scrollTop 兼容非chrome浏览器
- ajax略有不同，IE：ActiveXObject；其他：xmlHttpRequest
- 事件绑定不同。IE:dom.attachEvent()；其他浏览器：dom.addEventListener();



#### css继承性与层叠性

**继承性**

所有与字体相关的，例如color、text、font、line等属性都可以继承，但与盒模型相关的属性width、height、padding、border、margin、background不可继承

层叠性

![1577425726302](C:\Users\ucmed\AppData\Roaming\Typora\typora-user-images\1577425726302.png)

#### 选择器类型、优先级

**选择器类型：**id选择器、类选择器、标签选择器、复合选择器(交集选择器：div.active；并集选择器：active, box；后代选择器：div .active；子代选择器：div>active)、属性选择器(input[text='text'])

**选择器优先级**

- `!important` > 行内样式 > `#id` > `.class` > `tag` > * > 继承 > 默认浏览器样式
- 选择器 **从右往左** 解析

```css
li:first-child{}
li:last-child{}
基数选中：li:nth-child(odd)
偶数选中：li:nth-child(even)
指定第几个：li:nth-child(4){}
3 的倍数的所有 li 元素的背景色：li:nth-child(3n+0)//描述：表示周期的长度，n 是计数器（从 0 开始），b 是偏移值。

```



#### **居中布局**

- 水平居中

```
行内元素: `text-align: center`

块级元素: `margin: 0 auto`

浮动长度已知：width: 100px; left: 50%; margin-left: -50px;   

浮动长度未知:display: flex; justify-content: center; //space-between, space-around  

position: absolute;  left: 50%; transform: translateX(-50%);

```

- 垂直居中

```
line-height: height

高度已知：height: 100px; top: 50%; margin-top: -50px; 

高度未知：父盒子：display: table; 子元素：display: table-cell;  vertical-align: middle;  

position: absolute;  top: 50%; transform: translateY(-50%);

display:flex; align-items: center;

```

- 水平垂直居中

```css
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);

flex + justify-content + align-items

```



#### **伪类与伪元素**

**伪类LoVe、HAte**

伪类用于当已有元素处于的某个状态时，为其添加对应的样式。比如说，当用户悬停在指定的元素时，我们可以通过:hover来描述这个元素的状态。虽然它和普通的css类相似，可以为已有的元素添加样式，但是它只有处于dom树无法描述的状态下才能为元素添加样式，所以将其称为伪类。

```
:link{}
:visited{}
:hover{}
:active{}

```

**伪元素 before、after**

伪元素用于创建一些不在文档树中的元素，并为其添加样式。比如说，我们可以通过:before来在一个元素前增加一些文本，并为这些文本添加样式。虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。

```css
div:before{ content: ''; display: block;}
div:after{ content: ''; display: block;}

```

**伪元素与伪类的区别**

- 伪类的操作对象是文档树中已有的元素，而伪元素则创建了一个文档树外的元素。因此，伪类与伪元素的区别在于：**有没有创建一个文档树之外的元素。**
- CSS3规范中的要求使用双冒号(::)表示伪元素，以此来区分伪元素和伪类，比如::before和::after等伪元素使用双冒号(::)，:hover和:active等伪类使用单冒号(:)



#### display

```css
display: none;//将标签从页面中移除，不占页面空间
visibility: hidden;//隐藏页面元素，占据页面空间
display: inline-block;//不独占行，可设置宽高

```

#### 换行显示与...隐藏

```css
强制不换行
white-space: nowrap;//normal默认换行

强制换行
word-wrap: break-word;

//单行文本溢出
.oneLine {
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

//多行文本溢出
.twoLine {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}
//设置placeholder样式
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
	color: #666;
}
input:-moz-placeholder, textarea:-moz-placeholder {
	color: #666;
}
input::-moz-placeholder, textarea::-moz-placeholder {
	color: #666;
}
input:-ms-input-placeholder, textarea:-ms-input-placeholder {
	color: #666;
}

```

#### 背景图全屏显示

```css
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../assets/images/login-bg.jpg") center top no-repeat fixed;
    background-size: cover;
    -webkit-background-size: cover; /* 兼容Webkit内核浏览器如Chrome和Safari */
    -o-background-size: cover; /* 兼容Opera */
    zoom: 1;

//background-size背景图片尺寸，
//cover:把背景图像扩展至足够大，以使背景图像完全覆盖背景区域
//contain:把图像扩展至最大尺寸，以使其宽度和高度完全适应内容区域

```

#### CSS预处理器(Sass/Less/Postcss)

为 CSS 增加了一些编程的特性，用一种专门的编程语言，开发者就只要使用这种语言进行 CSS 的编码工作，再通过编译器转化为正常的 CSS 文件。在这层编译之上，便可以赋予 CSS 更多更强大的功能，scss/less常用功能:

- 嵌套
- 变量
- 指令



#### CSS3有哪些新特性？

- CSS3实现圆角（border-radius），阴影（box-shadow），
- 对文字加特效（text-shadow、），线性渐变（gradient），旋转（transform）
- transform:rotate(9deg) scale(0.85,0.90) translate(0px,-30px) skew(-9deg,0deg);// 旋转,缩放,定位,倾斜
- 增加了更多的CSS选择器 多背景 rgba
- 媒体查询，多栏布局



#### **HTML5新特性**

- 新增的语义header、footer、aside、nav、section
- 新增input类型tel、email、number
- 新增多媒体标签video、audio
- 新增html5 API，例如Local Storage 本地存储、getCurrentPosition() 获取地理位置



#### 移动端基本概念

**屏幕尺寸**：是以屏幕对角线的长度来计量，计量单位为英寸

**像素**（Pel，pixel;pictureelement），为组成一幅图像的全部亮度和色度的最小图像单元。电视的图像是由按一定间隔排列的亮度不同的像点构成的，形成像点的单位也就是像素，组成图像的最小单位就是像素

**分辨率**：屏幕分辨率确定计算机屏幕上显示多少信息的设置，以水平和垂直像素来衡量。就相同大小的屏幕而言，当屏幕分辨率低时（例如 640 x 480），在屏幕上显示的像素少，单个像素尺寸比较大。屏幕分辨率高时（例如 1600 x 1200），在屏幕上显示的像素多，单个像素尺寸比较小。我们看到320x480叫分辨率，而这个所谓的分辨率就是说白了就是横向320个像素纵向480个像素组成。屏幕分辨率是指纵横向上的像素点数，单位是px。

**物理分辨率**(设备像素)：苹果官网上的苹果6的分辨率为750x1334啊

**逻辑分辨率**(设备独立像素) 我们代码写的1px就是设备独立像素 ，设计稿上苹果6的分辨率为375x667

**设备像素比**：device pixel ratio简称dpr，即物理像素/设备独立像素



#### 移动端适配方案

##### rem适配

rem 是相对于html节点的font-size来做计算的。所以在页面初始话的时候给根元素设置一个font-size，接下来的元素就根据rem来布局，这样就可以保证在页面大小变化时，布局可以自适应，如此我们只需要给设计稿的px转换成对应的rem单位即可。

##### em适配

em是相对长度单位。相对于当前对象内本文的字体尺寸（如果没有设置本文尺寸，那就是相对于浏览器默认的字体尺寸，也就是16px），这样计算的话。如果没有设置字体尺寸就是1em = 16px。如果使用em的话，有个好的建议，就是将body的font-size设置成62.5%，也就是16px * 62.5% = 10px。这样的话1em = 10px

##### vw，vh布局

vh、vw方案即将视觉视口宽度 window.innerWidth和视觉视口高度 window.innerHeight 等分为 100 份。**vw始终相对于可视窗口的宽度，而百分比和其父元素的宽度有关。**

##### px为主，vx和vxxx（vw/vh/vmax/vmin）为辅，搭配一些flex（推荐）

用户之所以去买大屏手机，不是为了看到更大的字，而是为了看到更多的内容

##### postcss-adaptive插件

直接通过postcss的postcss-adaptive插件，会帮我们自动计算比例大小，比例大小可以自己设定。写样式文件的时候，直接就可以写px单位就可以了。最后会按照比率自动打包编译为rem单位；

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    'autoprefixer': { browsers: ['ie>=8', '>1% in CN'] },
    'cssnano': {},
    'postcss-adaptive': { remUnit: 100, autoRem: true }
  }
}

```



#### 移动端适配流程

1. 在head 设置width=device-width的viewport
2. 在css中使用px
3. 在适当的场景使用flex布局，或者配合vw进行自适应
4. 在跨设备类型的时候（pc <-> 手机 <-> 平板）使用媒体查询
5. 在跨设备类型如果交互差异太大的情况，考虑分开项目开发



###### 项目中使用

- lib-flexible

import 'lib-flexible'
通过要以上两步，就完成了在vue项目使用lib-flexible来解决移动端适配了。

lib-flexible会自动在html的head中添加一个meta name="viewport"的标签，同时会自动设置html的font-size为屏幕宽度除以10，也就是1rem等于html根节点的font-size。假如设计稿的宽度750px，此时1rem应该等于75px。假如量的某个元素的宽度是150px

- postcss-adaptive

```js
module.exports = {
​    plugins: {
​        autoprefixer: {},
​        'postcss-adaptive': {
​            remUnit: 16,
​            autoRem: true,
​            hairlineClass: 'hairlines'
​        }
​    }
}

```



##### 1px产生原因与解决方案

当我们css里写的1px的时候，由于它是逻辑像素，导致我们的逻辑像素根据这个设备像素比（dpr）去映射到设备上就为2px，或者3px，由于每个设备的屏幕尺寸不一样，就导致每个物理像素渲染出来的大小也不同（记得上面的知识点吗，设备的像素大小是不固定的），这样如果在尺寸比较大的设备上，1px渲染出来的样子相当的粗矿，这就是经典的一像素边框问题

###### transform: scale(0.5) 方案

```css
/*手机端实现真正的一像素边框*/
.border-bottom-1px{
    position: relative;
}

/*底边边框一像素*/
.border-bottom-1px::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    transform: scaleY(0.5);
    transform-origin: 0 0;
    background-color: #000;
}

```

###### 媒体查询

```css
/* 2倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 2.0) {
    .border-bottom::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
}

/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
    .border-bottom::after {
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
    }
}

```

###### viewport + rem

同时通过设置对应`viewport`的`rem`基准值，这种方式就可以像以前一样轻松愉快的写1px了。在`devicePixelRatio=2` 时，设置`meta`：

```html
<meta name="viewport" content="width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">

```

在`devicePixelRatio=3` 时，设置`meta`：

```html
<meta name="viewport" content="width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">

```

参考链接

移动端适配解决方案：https://juejin.im/post/5e6caf55e51d4526ff026a71

1px解决方案：https://mp.weixin.qq.com/s?__biz=MzAwNzQ2ODEyMQ==&mid=2247484448&idx=1&sn=65bf7e33816ea3dce08698ba47754094&chksm=9b7ce116ac0b68002d9884209df94007e6f8f5f980114d6c146be2fbcfb19e909e7189ac46f6&mpshare=1&scene=1&srcid=&sharer_sharetime=1586825821128&sharer_shareid=ca6059f3553ecd179fc5726d9eb4c926&key=a2b333d4ef0d8c231b16376924b324328fe4a8d64a8b3510f42c561e7181c6de61c07c037c40fcf541e9f87e20d96c029007e60134d491228fd73d776a476f59dade4c1b8cc0882366c4dc569b36ae94&ascene=1&uin=MTY0NzUyOTUwMA%3D%3D&devicetype=Windows+10&version=62080079&lang=zh_CN&exportkey=AWvkXwZQkt5DoJ8cdG8noO4%3D&pass_ticket=3nPEZPqcLnK8dPaBR%2FzQuZqswzlu91akal0wBSGK2fyPSFrCvKDxzyNbivH32ryh