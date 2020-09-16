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

<!-- ![1595925041438](C:/Users/ucmed/Desktop/1595925041438.png) -->
<img :src="$withBase('/images/1595925041438.png')" alt="">

正向代理: 买票的黄牛

反向代理: 租房的代理  