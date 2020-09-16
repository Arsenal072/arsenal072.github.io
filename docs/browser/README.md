#### **浏览器输入网址，点击后跳转到目标页面，这之间发生了什么**

```js
1.DNS域名解析；
2.建立TCP连接；
3.发送HTTP请求；
4.服务器处理请求；
5.返回响应结果；
6.关闭TCP连接；
7.浏览器解析HTML；
8.浏览器布局渲染(重绘回流)；
```

#### **DNS域名解析**

首先，客户端向本地域名服务器提出域名解析请求，当本地域名服务器收到请求后，先查询本地缓存,如果有该纪录项,则直接返回查询结果。没找到去根域名服务器查找，没有再去com顶级域名服务器查找，如此的类推下去，直到找到IP地址，然后把它记录在本地，供下次使用。

##### DNS优化

使用DNS缓存：浏览器缓存，系统缓存，路由器缓存，IPS服务器缓存，根域名服务器缓存，顶级域名服务器缓存，主域名服务器缓存。

##### DNS负载均衡

不知道你们有没有注意这样一件事，你访问`baidu.com`的时候，每次响应的并非是同一个服务器（IP地址不同），一般大公司都有成百上千台服务器来支撑访问，假设只有一个服务器，那它的性能和存储量要多大才能支撑这样大量的访问呢？DNS可以返回一个合适的机器的IP给用户，例如可以根据每台机器的负载量，该机器离用户地理位置的距离等等，这种过程就是DNS负载均衡



#### 建立TCP连接(三次握手)

##### 第一次握手：

客户端发送syn包(Seq=x)到服务器，并进入SYN_SEND状态，等待服务器确认；

##### 第二次握手：

服务器收到syn包，必须确认客户的SYN（ack=x+1），同时自己也发送一个SYN包（Seq=y），即SYN+ACK包，此时服务器进入SYN_RECV状态；

##### 第三次握手：

客户端收到服务器的SYN＋ACK包，向服务器发送确认包ACK(ack=y+1)，此包发送完毕，客户端和服务器进入ESTABLISHED状态，完成三次握手。

握手过程中传送的包里不包含数据，三次握手完毕后，客户端与服务器才正式开始传送数据。理想状态下，TCP连接一旦建立，在通信双方中的任何一方主动关闭连接之前，TCP 连接都将被一直保持下去。



#### 发送HTTP请求

请求行：请求方式(Get、Post、Put、Delete、Options)，请求地址、请求协议

请求头：host、accept、accept-language、cookie、connection(keep-alive)

请求主体：

##### ajax请求五步驟

- 创建一个XMLHttpRequest异步对象
- 设置请求方式和请求地址
- 接着，用send发送请求
- 监听状态变化
- 最后，接收返回的数据

```js
var xhr = new XMLHttpRequest();
xhr.open("post","validate.php");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send("username="+name);
xhr.onreadystatechange = function(){
// 判断服务器是否响应，判断异步对象的响应状态
	if(xhr.status == 200 && xhr.readyState == 4){
     }
 }
```

**Get与Post区别**

- GET参数通过URL传递，POST放在Request body中。
- GET请求在URL中传送的参数是有长度限制的，而POST没有。
- GET请求没有请求体，效率更高。
- GET产生一个TCP数据包；POST产生两个TCP数据包。对于GET方式的请求，浏览器会把http header和data一并发送出去，服务器响应200（返回数据）；而对于POST，浏览器先发送header，服务器响应100 continue，浏览器再发送data，服务器响应200 ok（返回数据）
- GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息



#### 服务器接收请求并响应

状态行：请求协议、响应码、响应信息

响应头：常见的响应报头字段有: Server, Connection、cache-control、access-control-allow-origin、access-control-allow-header、access-control-allow-methods、Content-Encoding

响应主体：

状态码是由3位数组成，第一个数字定义了响应的类别，且有五种可能取值:

- 1xx：指示信息–表示请求已接收，继续处理。
- 2xx：成功–表示请求已被成功接收、理解、接受。
- 3xx：重定向–要完成请求必须进行更进一步的操作。
- 4xx：客户端错误–请求有语法错误或请求无法实现。
- 5xx：服务器端错误–服务器未能实现合法的请求。

##### 常见状态码

##### 200 成功

请求成功，通常服务器提供了需要的资源。

##### 204 无内容

服务器成功处理了请求，但没有返回任何内容。

##### 301 永久移动

请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。

##### 302 临时移动

服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。

- 场景一
  想换个域名，旧的域名不用啦，这样用户访问旧域名时用301就重定向到新的域名。其实也是告诉搜索引擎收录的域名需要对新的域名进行收录。
- 场景二
  登录后重定向到指定的页面，这种场景比较常见就是登录成功跳转到具体的系统页面。

##### 304 未修改

自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。

##### 400 错误请求

服务器不理解请求的语法。

##### 401 未授权

请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。

##### 403 禁止

服务器拒绝请求。

##### 404 未找到

服务器找不到请求的网页。

##### 422 无法处理

请求格式正确，但是由于含有语义错误，无法响应

##### 500 服务器内部错误

服务器遇到错误，无法完成请求。



#### **HTTP缓存**

为什么要使用缓存，是因为缓存可以提高性能和用户体验

- 减少了冗余的数据传递，节省宽带流量
- 减少了服务器的负担，大大提高了网站性能
- 加快了网页加载速度 这也正是HTTP缓存属于客户端缓存的原因。

**缓存存储位置**

缓存的储存是内存和磁盘两个位置，由当前浏览器本身的策略决定，比较随机，从内存的缓存中取出的数据会显示 `(from memory cache)`，从磁盘的缓存中取出的数据会显示 `(from disk cache)`

**HTTP缓存包括：强制缓存和协商缓存**

**强制缓存和协商缓存区别**

- 协商缓存每次请求都需要跟服务器通信，验证本地缓存是否依旧有效，最终确定是否使用本地缓存
- 强制缓存命中缓存，服务器返回状态码是 `200`，而协商缓存命中缓存，服务器返回状态码是 `304`

![缓存流程图](https://www.overtaking.top/2018/07/20/20180720110647/cache-rule.png)

##### 强制缓存

强制缓存是第一次访问服务器获取数据后，在有效时间内不会再请求服务器，而是直接使用缓存数据

对于强制缓存，服务器响应的header中会用两个字段来表明——Expires和Cache-Control

![强制缓存流程图](https://www.overtaking.top/2018/07/20/20180720110647/mandatory-cache.png)

**Expires**

在 `HTTP 1.0` 版本，服务器使用的响应头字段为 Expires，Exprires的值为服务端返回的数据到期时间**(绝对时间)**。当再次请求时的请求时间小于返回的此时间，则直接使用缓存数据。但由于服务端时间和客户端时间可能有误差，这也将导致缓存命中的误差，另一方面，Expires是HTTP1.0的产物，故现在大多数使用Cache-Control替代。

**Cache-Control**

Cache-Control有很多属性，不同的属性代表的意义也不同。

- private：客户端可以缓存
- public：客户端和代理服务器都可以缓存
- max-age=t：缓存内容将在t秒后失效
- no-cache：需要使用协商缓存来验证缓存数据
- no-store：所有内容都不会缓存。

`Cache-Control` 的值中最常用的为 `max-age=xxx`**（相对时间）**，缓存本身就是为了数据传输的优化和性能而存在的，所以 `no-store` 几乎不会使用

**注意事项：**

在 `HTTP 1.0` 版本中，`Expires` 字段的**绝对时间**是从服务器获取的，由于请求需要时间，所以浏览器的请求时间与服务器接收到请求所获取的时间是存在误差的，这也导致了缓存命中的误差，在 `HTTP 1.1` 版本中，因为 `Cache-Control` 的值 `max-age=xxx` 中的 `xxx` 是以秒为单位的**相对时间**，所以在浏览器接收到资源后开始倒计时，规避了 `HTTP 1.0` 中缓存命中存在误差的缺点，为了兼容低版本 HTTP 协议，正常开发中两种响应头会同时使用，`HTTP 1.1` 版本的实现优先级高于 `HTTP 1.0`

只不过Cache-Control的选择更多，设置更细致，如果同时设置的话，其优先级高于Expires

##### 协商缓存

设置协商缓存后，第一次访问服务器获取数据时，服务器会将数据和缓存标识一起返回给浏览器，客户端会将数据和标识存入缓存数据库中，下一次请求时，会先去缓存中取出缓存标识发送给服务器进行询问，当服务器数据更改时会更新标识，所以服务器拿到浏览器发来的标识进行对比，相同代表数据未更改，返回304状态码，浏览器会去缓存中获取数据。如果标识不同，代表服务器更改过数据，所以会将新的数据和新的标识返回浏览器，浏览器会将新的数据和标识存入缓存中。

![协商缓存流程图](https://www.overtaking.top/2018/07/20/20180720110647/compared-cache.png)

**两种协商缓存方案：**

- **在 `HTTP 1.0` 版本中，服务器通过 `Last-Modified` 响应头来设置缓存标识，通常取请求数据的最后修改时间（绝对时间）作为值**。而浏览器将接收到返回的数据和标识存入缓存，再次请求会自动发送 `If-Modified-Since` 请求头，值为之前返回的最后修改时间（标识），服务器取出 `If-Modified-Since` 的值与数据的上次修改时间对比，如果上次修改时间大于了 `If-Modified-Since` 的值，说明被修改过，则通过 `Last-Modified` 响应头返回新的最后修改时间和新的数据，否则未被修改，返回状态码 `304` 通知浏览器命中缓存。
- **在 `HTTP 1.1` 版本中，服务器通过 `Etag` 响应头来设置缓存标识（唯一标识，像一个指纹一样，生成规则由服务器来决定）**，浏览器接收到数据和唯一标识后存入缓存，下次请求时，通过 `If-None-Match` 请求头将唯一标识带给服务器，服务器取出唯一标识与之前的标识对比，不同，说明修改过，返回新标识和数据，相同，则返回状态码 `304` 通知浏览器命中缓存。

**注意事项：**

使用协商缓存时 `HTTP 1.0` 版本还是不太靠谱，假设一个文件增加了一个字符后又删除了，文件相当于没更改，但是最后修改时间变了，会被当作修改处理，本应该命中缓存，服务器却重新发送了数据，因此 `HTTP 1.1` 中使用的 `Etag` 唯一标识是根据文件内容或摘要生成的，保证了只要文件内容不变，则一定会命中缓存，为了兼容低版本 HTTP 协议，开发中两种响应头也会同时使用，同样 `HTTP 1.1` 版本的实现优先级高于 `HTTP 1.0`

![缓存策略流程图](https://www.overtaking.top/2018/07/20/20180720110647/cache-flow-chart.jpg)

**缓存使用场景**

对于大部分的场景都可以使用强缓存配合协商缓存解决，但是在一些特殊的地方可能需要选择特殊的缓存策略

- 对于某些不需要缓存的资源，可以使用 Cache-control: no-store ，表示该资源不需要缓存
- 对于频繁变动的资源，可以使用 Cache-Control: no-cache 并配合 ETag 使用，表示该资源已被缓存，但是每次都会发送请求询问资源是否更新

精度：Etag 要优于 Last-Modified(精度为秒)
性能：Last-Modified 要优于 Etag，Last-Modified需要记录时间，而Etag需要服务器通过算法来计算出一个hash值
优先级：服务器校验优先考虑Etag

##### memory Cache与disk Cache 

- 如果memory Cache有数据，优先使用memory Cache然后disk Cache
- 内存读取比硬盘中读取的速度更快。但是我们也不能把所有数据放在内存中缓存的，因为内存也是有限的
- memory cache(内存缓存)退出进程时数据会被清除，而disk cache(硬盘缓存)退出进程时数据不会被清除。



**不同刷新的请求执行过程**

- **浏览器地址栏中写入URL，回车**。浏览器发现缓存中有这个文件了，不用继续请求了，直接去缓存拿。（最快）
- **F5**就是告诉浏览器，别偷懒，好歹去服务器看看这个文件是否有过期了。于是浏览器就战战兢兢的发送一个请求带上If-Modify-since/If-None-Match。
- **Ctrl+F5**告诉浏览器，你先把你缓存中的这个文件给我删了，然后再去服务器请求个完整的资源文件下来。于是客户端就完成了强行更新的操作



#### 关闭TCP连接(四次挥手)

数据传输完毕后，双方都可释放连接。最开始的时候，客户端和服务器都是处于ESTABLISHED状态，假设客户端主动关闭，服务器被动关闭。

##### 第一次挥手：

客户端发送一个FIN，用来关闭客户端到服务器的数据传送，也就是客户端告诉服务器：我已经不 会再给你发数据了(当然，在fin包之前发送出去的数据，如果没有收到对应的ack确认报文，客户端依然会重发这些数据)，但是，此时客户端还可 以接受数据。 FIN=1，其序列号为seq=u（等于前面已经传送过来的数据的最后一个字节的序号加1），此时，客户端进入FIN-WAIT-1（终止等待1）状态。 TCP规定，FIN报文段即使不携带数据，也要消耗一个序号。

##### 第二次挥手：

服务器收到FIN包后，发送一个ACK给对方并且带上自己的序列号seq，确认序号为收到序号+1（与SYN相同，一个FIN占用一个序号）。此时，服务端就进入了CLOSE-WAIT（关闭等待）状态。TCP服务器通知高层的应用进程，客户端向服务器的方向就释放了，这时候处于半关闭状态，即客户端已经没有数据要发送了，但是服务器若发送数据，客户端依然要接受。这个状态还要持续一段时间，也就是整个CLOSE-WAIT状态持续的时间。

此时，客户端就进入FIN-WAIT-2（终止等待2）状态，等待服务器发送连接释放报文（在这之前还需要接受服务器发送的最后的数据）。

##### 第三次挥手：

服务器发送一个FIN，用来关闭服务器到客户端的数据传送，也就是告诉客户端，我的数据也发送完了，不会再给你发数据了。由于在半关闭状态，服务器很可能又发送了一些数据，假定此时的序列号为seq=w，此时，服务器就进入了LAST-ACK（最后确认）状态，等待客户端的确认。

##### 第四次挥手：

主动关闭方收到FIN后，发送一个ACK给被动关闭方，确认序号为收到序号+1，此时，客户端就进入了TIME-WAIT（时间等待）状态。注意此时TCP连接还没有释放，必须经过2∗MSL（最长报文段寿命）的时间后，当客户端撤销相应的TCP后，才进入CLOSED状态。

服务器只要收到了客户端发出的确认，立即进入CLOSED状态。同样，撤销TCB后，就结束了这次的TCP连接。可以看到，服务器结束TCP连接的时间要比客户端早一些。

至此，完成四次挥手。



#### 浏览器渲染页面过程 

![img](https://camo.githubusercontent.com/ae6a6d492332cd6332144f8e6c924d1197e26f7e/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f32382f313637663536353235323166656132663f773d36383926683d33323726663d706e6726733d313235303739)

- 解析HTML形成DOM树
- 解析CSS形成CSS规则树
- 等到Javascript 脚本文件加载后， 通过 DOM API 和 CSSOM API 来操作 DOM Tree 和 CSS Rule Tree。
- 合并DOM树和CSS规则树形成渲染树
- 浏览器开始渲染并绘制页面，这个过程涉及两个比较重要的概念**回流**和**重绘**。DOM节点都是以盒模型形式存在，需要浏览器去计算位置和宽度等，这个过程就是回流。等到页面的位置、宽高，大小等属性确定下来后，浏览器开始绘制内容，这个过程叫做重绘。浏览器刚打开页面一定要经过这两个过程的，但是这个过程非常非常非常消耗性能，所以我们应该尽量减少页面的回流和重绘。

**回流：**DOM节点都是以盒模型形式存在，需要浏览器去计算位置和宽度等，这个过程就是回流。当Render Tree中 ，浏览器重新渲染部分或全部文档的过程称为回流。

会导致回流的操作：

- 页面首次渲染
- 浏览器窗口大小发生改变
- 元素尺寸或位置发生改变
- 元素内容变化（文字数量或图片大小等等）
- 元素字体大小变化
- 添加或者删除可见的DOM元素
- 激活CSS伪类（例如：:hover）
- 查询某些属性或调用某些方法

**重绘：**当页面中元素样式的改变，并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。



**浏览器内核(渲染引擎、js引擎)**

渲染过程中，如果遇到`<script>`就停止渲染，执行 JS 代码。因为浏览器有GUI渲染线程与JS引擎线程，为了防止渲染出现不可预期的结果，这两个线程是互斥的关系。JavaScript的加载、解析与执行会阻塞DOM的构建，也就是说，在构建DOM时，HTML解析器若遇到了JavaScript，那么它会暂停构建DOM，将控制权移交给JavaScript引擎，等JavaScript引擎运行完毕，浏览器再从中断的地方恢复DOM构建。

也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件，这也是都建议将 script 标签放在 body 标签底部的原因。当然在当下，并不是说 script 标签必须放在底部，因为你可以给 script 标签添加 defer 或者 async 属性（下文会介绍这两者的区别）。

**defer 和 async 属性的区别：**

![1595917611680](C:/Users/ucmed/Desktop/1595917611680.png)

**1）情况1**`<script src="script.js"></script>`

没有 defer 或 async，浏览器会立即加载并执行指定的脚本，也就是说不等待后续载入的文档元素，读到就加载并执行。

**2）情况2**`<script async src="script.js"></script>` (**异步下载**)

async 属性表示异步执行引入的 JavaScript，与 defer 的区别在于，如果已经加载好，就会开始执行——无论此刻是 HTML 解析阶段还是 DOMContentLoaded 触发之后。需要注意的是，这种方式加载的 JavaScript 依然会阻塞 load 事件。换句话说，async-script 可能在 DOMContentLoaded 触发之前或之后执行，但一定在 load 触发之前执行。

**3）情况3** `<script defer src="script.js"></script>`(**延迟执行**)   **最优**

defer 属性表示延迟执行引入的 JavaScript，即这段 JavaScript 加载时 HTML 并未停止解析，这两个过程是并行的。整个 document 解析完毕且 defer-script 也加载完成之后（这两件事情的顺序无关），会执行所有由 defer-script 加载的 JavaScript 代码，然后触发 DOMContentLoaded 事件。

**defer 与相比普通 script，有两点区别：**

- 载入 JavaScript 文件时不阻塞 HTML 的解析，执行阶段被放到 HTML 标签解析完成之后。
- 在加载多个JS脚本的时候，async是无顺序的加载，而defer是有顺序的加载。

#### 为什么操作 DOM 慢

因为 DOM 是属于渲染引擎中的东西，而 JS 是 JS 引擎中的东西。当我们用 JS 去操作 DOM 时，本质上是 JS 引擎和渲染引擎之间进行了“跨界交流”。这个“跨界交流”的实现并不简单，它依赖了桥接接口作为“桥梁”，这个开销本身就是不可忽略的。

![1595917654776](C:/Users/ucmed/Desktop/1595917654776.png)

参考链接：https://github.com/ljianshu/Blog/issues/51



#### 跨域

**什么是跨域**

当协议、域名、端口号，有一个或多个不同时，去访问并获取数据的现象称为跨域访问，同源策略限制下 `ajax`、`cookie`、`localStorage`、`dom`都是不支持跨域访问的。

**为什么会出现跨域**

为了抵御`XSS`、`CSRF` 等攻击， Netscape 公司 1995 年在浏览器中引入同源策略/SOP（Same origin policy）。

假设 cookie 支持了跨域，http 协议无状态，当用户访问了一个银行网站登录后，银行网站的服务器给返回了一个 sessionId，当通过当前浏览器再访问一个恶意网站，如果 cookie 支持跨域，恶意网站将获取 sessionId 并访问银行网站，出现安全性问题；

同源策略限制下，可以访问到后台服务器的数据，后台服务器会正常返回数据，而被浏览器给拦截了。

#### 解决方案

- **CORS（跨域资源共享 Cross-origin resource sharing）**
- **使用 jsonp 跨域**
- 利用 **node + webpack + webpack-dev-server** 转发请求
- **使用 nginx 实现跨域**
- **使用 postMessage 实现跨域**（不是使用 `Ajax` 的数据通信，更多是在两个页面之间的通信，在 `A` 页面中引入 `B` 页面，在 `A`、`B` 两个页面之间通信）
- **使用 document.domain 实现跨域**(大多使用于同一公司不同产品间获取数据，必须是一级域名和二级域名的关系)
- **使用 location.hash 实现跨域**
- **使用 window.name 实现跨域**
- **使用 WebSocket 实现跨域**
- **NodeJS 中间件 `http-proxy-middleware` 实现跨域代理**

#### jsonp跨域

动态创建一个script标签，利用script去获取跨域资源。

```js
<script>
    var script = document.createElement('script');
    script.type = 'text/javascript';

    // 传参一个回调函数名给后端，方便后端返回时执行这个在前端定义的回调函数
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=handleCallback';
    document.head.appendChild(script);

    // 回调执行函数
    function handleCallback(res) {
        alert(JSON.stringify(res));
    }
 </script>
```

##### JSONP存在的问题

https://juejin.im/post/5b75b497e51d45666276251d

#### CORS（跨域资源共享 Cross-origin resource sharing）

允许浏览器向跨域服务器发出XMLHttpRequest请求，从而克服跨域问题，它需要浏览器和服务器的同时支持。请求分为简单请求和非简单请求，非简单请求会先进行一次OPTION方法进行预检，看是否允许当前跨域请求。

##### 简单请求

请求方法是以下三种方法之一：

- HEAD
- GET
- POST

HTTP的请求头信息不超出以下几种字段：

- Accept
- Accept-Language
- Content-Language
- Last-Event-ID
- Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain

后端的响应头信息：

- Access-Control-Allow-Origin：该字段是必须的。它的值要么是请求时Origin字段的值，要么是一个*，表示接受任意域名的请求。
- Access-Control-Allow-Credentials：该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。
- Access-Control-Expose-Headers：该字段可选。CORS请求时，XMLHttpRequest对象的getResponseHeader()方法只能拿到6个基本字段：Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma。如果想拿到其他字段，就必须在Access-Control-Expose-Headers里面指定。

##### 非简单请求

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是PUT或DELETE，或者Content-Type字段的类型是application/json。非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。

**预检请求**

- Access-Control-Request-Method：该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法
- Access-Control-Request-Headers：该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是X-Custom-Header。

```js
Accept: */*
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Access-Control-Request-Headers: token,uhospitalid,x-ucmed-deviceid
Access-Control-Request-Method: GET
Cache-Control: no-cache
Connection: keep-alive
Host: ru-test.zwjk.com
Origin: https://open-test.zwjk.com
Pragma: no-cache
Sec-Fetch-Dest: empty
Sec-Fetch-Site: same-site
Sec-Fetch-User: ?F
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.3 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 wechatdevtools/1.02.1910120 MicroMessenger/7.0.4 Language/zh_CN webview/15873648039943518 webdebugger port/64404
```

**预检响应**

**预检请求被拒绝**

如果浏览器否定了"预检"请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被XMLHttpRequest对象的onerror回调函数捕获。

```js
XMLHttpRequest cannot load http://api.alice.com.
Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
```

**预检通过**

```js
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: content-type,token,hospitalId,from,scyUserId,uhospitalId,moduleId,x-ucmed-deviceid,userId
Access-Control-Allow-Methods: POST,GET,DELETE,PUT
Access-Control-Allow-Origin: https://open-test.zwjk.com
Access-Control-Max-Age: 3600
Connection: keep-alive
Content-Length: 0
Date: Mon, 20 Apr 2020 10:37:37 GMT
Server: nginx
```

**Access-Control-Allow-Methods**

该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。

**Access-Control-Allow-Headers**

如果浏览器请求包括`Access-Control-Request-Headers`字段，则`Access-Control-Allow-Headers`字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。

**Access-Control-Allow-Credentials**

该字段与简单请求时的含义相同。

**Access-Control-Max-Age**

该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，即允许缓存该条回应3600秒，在此期间，不用发出另一条预检请求。

**发送正式请求**

```js
Request Method: GET

Accept: application/json, text/javascript, */*; q=0.01
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cache-Control: no-cache
Connection: keep-alive
Host: ru-test.zwjk.com
Origin: https://open-test.zwjk.com
Pragma: no-cache
Sec-Fetch-Dest: empty
Sec-Fetch-Site: same-site
Sec-Fetch-User: ?F
token: 7921adc665c22a435248cc685b606f2b
uhospitalId: ea3ee53f-fe0a-44db-8386-bdade497b235
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.3 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1 wechatdevtools/1.02.1910120 MicroMessenger/7.0.4 Language/zh_CN webview/15873648039943518 webdebugger port/64404
X-ucmed-DeviceId: 
```

#### postMessage跨域

postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一

1.）a.html：(http://www.domain1.com/a.html)

```js
<iframe id="iframe" src="http://www.domain2.com/b.html" style="display:none;"></iframe>
<script>       
    var iframe = document.getElementById('iframe');
    iframe.onload = function() {
        var data = {
            name: 'aym'
        };
        // 向domain2传送跨域数据
        iframe.contentWindow.postMessage(JSON.stringify(data), 'http://www.domain2.com');
    };

    // 接受domain2返回数据
    window.addEventListener('message', function(e) {
        alert('data from domain2 ---> ' + e.data);
    }, false);
</script>
```

2.）b.html：(http://www.domain2.com/b.html)

```js
<script>
    // 接收domain1的数据
    window.addEventListener('message', function(e) {
        alert('data from domain1 ---> ' + e.data);

        var data = JSON.parse(e.data);
        if (data) {
            data.number = 16;

            // 处理后再发回domain1
            window.parent.postMessage(JSON.stringify(data), 'http://www.domain1.com');
        }
    }, false);
</script>

```

#### document.domain + iframe跨域

此方案仅限主域相同，子域不同的跨域应用场景。

实现原理：两个页面都通过js强制设置document.domain为基础主域，就实现了同域

1.）父窗口：(http://www.domain.com/a.html)

```js
<iframe id="iframe" src="http://child.domain.com/b.html"></iframe>
<script>
    document.domain = 'domain.com';
    var user = 'admin';
</script>

```

2.）子窗口：(http://child.domain.com/b.html)

```js
<script>
    document.domain = 'domain.com';
    // 获取父窗口中变量
    alert('get js data from parent ---> ' + window.parent.user);
</script>

```

#### webpack-dev-server

```js
proxyTable: {
    '/api': {
        target: 'http://192.168.1.46:8080',
        pathRewrite: {'^/api' : ''},
        changeOrigin: true
    }
}

```

#### nginx代理跨域

#### Nodejs中间件代理跨域

http-proxy-middleware与webpack-dev-server类似

![1595925041438](C:/Users/ucmed/Desktop/1595925041438.png)

正向代理: 买票的黄牛

反向代理: 租房的代理  



#### Cookies

Cookie通过在客户端记录信息确定用户身份，Session通过在服务器端记录信息确定用户身份。 

**Cookie的工作原理 ：**由于HTTP是一种无状态的协议，服务器单从网络连接上无从知道客户身份。怎么办呢？就给客户端们颁发一个通行证吧，每人一个，无论谁访问都必须携带自己通行证。这样服务器就能从通行证上确认客户身份了。

 如果说Cookie机制是通过检查客户身上的“通行证”来确定客户身份的话，那么Session机制就是通过检查服务器上的“客户明细表”来确认客户身份。Session相当于程序在服务器上建立的一份客户档案，客户来访的时候只需要查询客户档案表就可以了。Session的使用比Cookie方便，但是过多的Session存储在服务器内存中，会对服务器造成压力。

###### Cookie存在的问题

1.`Cookie`数量和长度的限制。 每个特定的域名下最多生成20个cookie，Cookie大小受限，每个cookie长度不能超过4KB，否则会被截掉。

2.安全性问题。如果cookie被人拦截了，那人就可以取得所有的session信息。即使加密也与事无补，因为拦截者并不需要知道cookie的意义，他只要原样转发cookie就可以达到目的了。

3.网络负担：我们知道cookie会被附加在每个HTTP请求中，在HttpRequest 和HttpResponse的header中都是要被传输的，所以无形中增加了一些不必要的流量损失

###### 解决办法

1.通过良好的编程，控制保存在cookie中的session对象的大小。

2.通过加密和安全传输技术（SSL），减少cookie被破解的可能性。https

3.只在cookie中存放不敏感数据，即使被盗也不会有重大损失。

4.控制cookie的生命周期，使之不会永远有效。偷盗者很可能拿到一个过期的cookie。



**cookie 重要的属性**

| 属性           | 说明                                                         |
| :------------- | :----------------------------------------------------------- |
| **name=value** | 键值对，设置 Cookie 的名称及相对应的值，都必须是**字符串类型** - 如果值为 Unicode 字符，需要为字符编码。 - 如果值为二进制数据，则需要使用 BASE64 编码。 |
| **domain**     | 指定 cookie 所属域名，默认是当前域名                         |
| **path**       | **指定 cookie 在哪个路径（路由）下生效，默认是 '/'**。 如果设置为 `/abc`，则只有 `/abc` 下的路由可以访问到该 cookie，如：`/abc/read`。 |
| **maxAge**     | cookie 失效的时间，单位秒。如果为整数，则该 cookie 在 maxAge 秒后失效。如果为负数，该 cookie 为临时 cookie ，关闭浏览器即失效，浏览器也不会以任何形式保存该 cookie 。如果为 0，表示删除该 cookie 。默认为 -1。 - **比 expires 好用，相对时间** |
| **expires**    | 过期时间，在设置的某个时间点后该 cookie 就会失效。 一般浏览器的 cookie 都是默认储存的，当关闭浏览器结束这个会话的时候，这个 cookie 也就会被删除，**绝对时间** |
| **secure**     | 该 cookie 是否仅被使用安全协议传输。安全协议有 HTTPS，SSL等，在网络上传输数据之前先将数据加密。默认为false。 当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效。 |
| **httpOnly**   | **如果给某个 cookie 设置了 httpOnly 属性，则无法通过 JS 脚本 读取到该 cookie 的信息，但还是能通过 Application 中手动修改 cookie，所以只是在一定程度上可以防止 XSS 攻击，不是绝对的安全** |

#### session

session 是基于 cookie 实现的，session 存储在服务器端，sessionId 会被存储到客户端的cookie 中

##### session 认证流程

- 用户第一次请求服务器的时候，服务器根据用户提交的相关信息，创建对应的 Session
- 请求返回时将此 Session 的唯一标识信息 SessionID 返回给浏览器
- 浏览器接收到服务器返回的 SessionID 信息后，会将此信息存入到 Cookie 中，同时 Cookie 记录此 SessionID 属于哪个域名
- 当用户第二次访问服务器的时候，请求会自动判断此域名下是否存在 Cookie 信息，如果存在自动将 Cookie 信息也发送给服务端，服务端会从 Cookie 中获取 SessionID，再根据 SessionID 查找对应的 Session 信息，如果没有找到说明用户没有登录或者登录失效，如果找到 Session 证明用户已经登录可执行后面操作。

##### Cookie 和 Session 的区别

- **安全性：** Session 比 Cookie 安全，Session 是存储在服务器端的，Cookie 是存储在客户端的
- **存取值的类型不同**：Cookie 只支持存字符串数据，想要设置其他类型的数据，需要将其转换成字符串，Session 可以存任意数据类型
- **有效期不同：** Cookie 可设置为长时间保持，比如我们经常使用的默认登录功能，Session 一般失效时间较短，客户端关闭（默认情况下）或者 Session 超时都会失效
- **存储大小不同：** 单个 Cookie 保存的数据不能超过 4K，Session 可存储数据远高于 Cookie，但是当访问量过多，会占用过多的服务器资源



#### 什么是 Token（令牌）Acesss Token

- **访问资源接口（API）时所需要的资源凭证**
- **简单 token 的组成：** uid(用户唯一的身份标识)、time(当前时间的时间戳)、sign（签名，token 的前几位以哈希算法压缩成的一定长度的十六进制字符串）
- 特点：
  - **服务端无状态化、可扩展性好**
  - **支持移动端设备**
  - 安全
  - 支持跨程序调用
- **token 的身份验证流程：**

![1595926545839](C:/Users/ucmed/Desktop/1595926545839.png)

- 每一次请求都需要携带 token，需要把 token 放到 HTTP 的 Header 里
- 基于 token 的用户认证是一种服务端无状态的认证方式，服务端不用存放 token 数据。用解析 token 的计算时间换取 session 的存储空间，从而减轻服务器的压力，减少频繁的查询数据库
- token 完全由应用管理，所以它可以避开同源策略



#### 浏览器本地存储 **Web Storage**

html5中的Web Storage包括了两种存储方式：sessionStorage和localStorage。

sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁(关闭浏览器则自动删除)。因此sessionStorage不是一种持久化的本地存储，仅仅是会话级别的存储。而localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。



#### **web storage和cookie的区别**

Web Storage的概念和cookie相似，区别是它是为了更大容量存储设计的。Cookie的大小是受限的，并且每次你请求一个新的页面的时候Cookie都会被发送过去，这样无形中浪费了带宽，另外cookie还需要指定作用域，不可以跨域调用。 Cookie也是不可或缺的：Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，而Web Storage仅仅是为了在本地“存储”数据而生。



#### **webSocket**

HTTP协议是一种无状态协议，服务器端本身不具有识别客户端的能力，必须借助外部机制，比如session和cookie，才能与特定客户端保持对话。这多多少少带来一些不便，尤其在服务器端与客户端需要持续交换数据的场合（比如网络聊天），更是如此。为了解决这个问题，HTML5提出了浏览器的[WebSocket API](http://dev.w3.org/html5/websockets/)。

WebSocket的主要作用是，允许服务器端与客户端进行全双工（full-duplex）的通信。举例来说，HTTP协议有点像发电子邮件，发出后必须等待对方回信；WebSocket则是像打电话，服务器端和客户端可以同时向对方发送数据，它们之间存在着一条持续打开的数据通道。



#### HTTPS

**什么是HTTPS**

HTTPS是在HTTP上建立SSL加密层，并对传输数据进行加密，是HTTP协议的安全版。

**为什么需要HTTPS，HTTP存在的问题**

在HTTP协议中有可能存在信息窃取或身份伪装等安全问题。使用HTTPS通信机制可以有效地防止这些问题，接下来，我们先来了解下 HTTP协议存在的哪些问题：

- 通信使用明文（不加密），内容可能被窃听
- 无法证明报文的完整性，所以可能遭篡改
- 不验证通信方的身份，因此有可能遭遇伪装

##### HTTPS协议，它比HTTP协议相比多了以下优势

- 数据隐私性：内容经过对称加密，每个连接生成一个唯一的加密密钥
- 数据完整性：内容传输经过完整性校验
- 身份认证：第三方无法伪造服务端（客户端）身份

**解决内容可能被窃听的问题—加密** 对称加密+非对称加密(HTTPS采用这种方式)

##### 对称加密算法

加密和解密使用的是同一个密钥

但是问题又来了~既然网络是不安全的，那么最开始的时候怎么将这个对称密钥发送出去呢？如果对称密钥在发送的时候就已经被拦截，那么发送的信息还是会被篡改和窥视

##### 非对称加密算法RSA

双方必须协商一对密钥，一个私钥一个公钥。用私钥加密的数据，只有对应的公钥才能解密，用公钥加密的数据， 只有对应的私钥才能解密。

这样的话 Bill 将自己的公钥给张大胖，张大胖发送的信息使用 Bill 的公钥加密，这样，只有 Bill 使用自己的私钥才能获取。但是这样有个弊端，RSA比较慢。

##### 非对称密钥+对称密钥

使用对称密钥的好处是速度比较快，使用非对称密钥的好处是可以使得传输的内容不能被破解，因为就算你拦截到了数据，但是没有 Bill 的私钥，也是不能破解内容

所以我们要结合两者的优点，使用 RSA 的方法将加密算法的对称密钥发送过去，之后就可以使用使用这个密钥，利用对称密钥来通信了

##### 解决报文可能遭篡改问题——数字签名

要确定 Bill 给张大胖的公钥确实是 Bill的公钥，而不是别人的。（刚刚电话号码的那个例子，也就是说，需要确定我给你发的电话号码是我的，没有被修改的）那怎么确认 Bill 给张大胖的公钥确实是 Bill 的呢？

这个时候就需要公证处的存在了。也就是说我需要先将我的电话号码到公证处去公证一下，然后我将电话号码传给你之后，你在将你收到的电话号码和公证处的比对下，就知道是不是我的了。

对应到计算机世界，那就是数字签名

![1595927166869](C:/Users/ucmed/Desktop/1595927166869.png)

##### 解决通信方身份可能被伪装的问题——数字证书

数字签名和原始信息合在一起称为数字证书

在拿到数字证书之后，就用同样的Hash 算法， 再次生成消息摘要，然后用证书颁发机构CA的公钥对数字签名解密， 得到证书颁发机构CA创建的消息摘要， 两者一比，就知道有没有人篡改了

![1595927191432](C:/Users/ucmed/Desktop/1595927191432.png)

##### HTTPS工作流程

![1595929124283](C:/Users/ucmed/Desktop/1595929124283.png)

1. Client发起一个HTTPS（比如`https://juejin.im/user/5a9a9cdcf265da238b7d771c`）的请求，根据RFC2818的规定，Client知道需要连接Server的443（默认）端口。
2. Server把事先配置好的公钥证书（public key certificate）返回给客户端。
3. Client验证公钥证书：比如是否在有效期内，证书的用途是不是匹配Client请求的站点，是不是在CRL吊销列表里面，它的上一级证书是否有效，这是一个递归的过程，直到验证到根证书（操作系统内置的Root证书或者Client内置的Root证书）。如果验证通过则继续，不通过则显示警告信息。
4. Client使用伪随机数生成器生成对称密钥，然后用证书的公钥加密这个对称密钥，发给Server。
5. Server使用自己的私钥（private key）解密这个消息，得到对称密钥。至此，Client和Server双方都持有了相同的对称密钥。
6. Server使用对称密钥加密“明文内容A”，发送给Client。
7. Client使用对称密钥解密响应的密文，得到“明文内容A”。
8. Client再次发起HTTPS的请求，使用对称密钥加密请求的“明文内容B”，然后Server使用对称密钥解密密文，得到“明文内容B”。



#### HTTP 与 HTTPS 的区别

- HTTP 是明文传输，HTTPS 通过 SSL/TLS 进行了加密
- HTTP 的端口号是 80，HTTPS 是 443
- HTTPS 需要到 CA 申请证书，一般免费证书很少，需要交费
- HTTPS 的连接很简单，是无状态的；HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全

https://juejin.im/post/59e4c02151882578d02f4aca



#### CSRF

CSRF（Cross-site request forgery）跨站请求伪造

**一个典型的CSRF攻击有着如下的流程**

[受害者登录a.com](http://xn--a-f38al5vkzdt61bv7l.com)，并保留了登录凭证（Cookie）。

[攻击者引诱受害者访问了b.com](http://xn--b-nv6ao4io8bp6po6e00mu47cda4311avpa330h.com)。

[b.com](http://b.com) 向 [a.com](http://a.com) 发送了一个请求：http://a.com/act=xx。浏览器会默认携带a.com的Cookie

a.com接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求。

a.com以受害者的名义执行了act=xx。

攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让a.com执行了自己定义的操作。

##### CSRF攻击类型

- GET类型的CSRF：(JSONP)
- 链接类型的CSRF
- POST类型的CSRF：访问该页面后，表单会自动提交，相当于模拟用户完成了一次POST操作



CSRF的两个特点：

- CSRF（通常）发生在第三方域名。
- CSRF攻击者不能获取到Cookie等信息，只是使用。

##### 防护策略

- 验证码
- 同源检测，Referer
- Samesite Cookie
- CSRF Token



Google起草了一份草案来改进HTTP协议，那就是为Set-Cookie响应头新增Samesite属性，它用来标明这个 Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie，Samesite 有两个属性值:

- Samesite=Strict: 这种称为严格模式，表明这个 Cookie 在任何情况下都不可能作为第三方 Cookie
- Samesite=Lax: 这种称为宽松模式，比 Strict 放宽了点限制,假如这个请求是这种请求且同时是个GET请求，则这个Cookie可以作为第三方Cookie



CSRF 攻击要成功的条件在于攻击者能够准确地预测所有的参数从而构造出合法的请求，所以根据不可预测性原则，我们可以对参数进行加密从而防止 CSRF 攻击，可以保存其原有参数不变，另外添加一个参数 Token，其值是随机的，这样攻击者因为不知道 Token 而无法构造出合法的请求进行攻击，所以我们在构造请求时候只需要保证：

1. Token 要足够随机，使攻击者无法准确预测
2. Token 是一次性的，即每次请求成功后要更新 Token，增加预测难度
3. Token 要主要保密性，敏感操作使用 POST，防止 Token 出现在 URL 中



#### XSS

XSS，即 Cross Site Script，中译是跨站脚本攻击

XSS原理：攻击者向有 XSS 漏洞的网站中注入恶意的 HTML 代码，当其它用户浏览该网站时候，该段 HTML 代码会自动执行，从而达到攻击的目的，如盗取用户的 Cookie，破坏页面结构，重定向到其它网站等

XSS攻击可以分为3类：反射型（非持久型）、存储型（持久型）、基于DOM。

##### 存储型 XSS 的攻击步骤

1. 攻击者将恶意代码提交到目标网站的数据库中。
2. 用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等

##### 反射型 XSS 的攻击步骤

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等。

由于需要用户主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。

POST 的内容也可以触发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击），所以非常少见。

##### 反射型跟存储型区别

反射型 XSS 跟存储型 XSS 的区别是：存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里。

非持久性 XSS 的安全威胁比较小，因为只要服务器调整业务代码进行过滤，黑客精心构造的这段 URL 就会瞬间失效了，而相比之下，持久型 XSS 的攻击影响力很大，有时候服务端需要删好几张表，查询很多库才能将恶意代码的数据进行删除。

##### DOM 型 XSS 的攻击步骤

1. 攻击者构造出特殊的 URL，其中包含恶意代码。
2. 用户打开带有恶意代码的 URL。
3. 用户浏览器接收到响应后解析执行，前端 JavaScript 取出 URL 中的恶意代码并执行。
4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞

##### 如何防御 XSS 攻击？

XSS 攻击有两大要素：

1. 攻击者提交恶意代码。
2. 浏览器执行恶意代码。

针对第一个要素：我们是否能够在用户输入的过程，过滤掉用户输入的恶意代码呢？

##### 输入过滤

在用户提交时，由前端过滤输入，然后提交到后端。这样做是否可行呢？

答案是不可行。一旦攻击者绕过前端过滤，直接构造请求，就可以提交恶意代码了。

输入侧过滤能够在某些情况下解决特定的 XSS 问题，但会引入很大的不确定性和乱码问题。在防范 XSS 攻击时应避免此类方法

当然，对于明确的输入类型，例如数字、URL、电话号码、邮件地址等等内容，进行输入过滤还是必要的

既然输入过滤并非完全可靠，我们就要通过“防止浏览器执行恶意代码”来防范 XSS。这部分分为两类：

- 防止 HTML 中出现注入
- 防止 JavaScript 执行时，执行恶意代码

##### 预防存储型和反射型 XSS 攻击

存储型和反射型 XSS 都是在服务端取出恶意代码后，插入到响应 HTML 里的，攻击者刻意编写的“数据”被内嵌到“代码”中，被浏览器所执行。

预防这两种漏洞，有两种常见做法：

- 改成纯前端渲染，把代码和数据分隔开。
- 对 HTML 做充分转义

##### 预防 DOM 型 XSS 攻击

DOM 型 XSS 攻击，实际上就是网站前端 JavaScript 代码本身不够严谨，把不可信的数据当作代码执行了。

在使用 `.innerHTML`、`.outerHTML`、`document.write()` 时要特别小心，不要把不可信的数据作为 HTML 插到页面上，而应尽量使用 `.textContent`、`.setAttribute()` 等。

https://www.cxymsg.com/guide/security.html