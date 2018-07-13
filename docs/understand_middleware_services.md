理解服务和中间件
====

**讲解服务和中间件的区别**

-----

## 中间件
类似  [express 中间件](http://www.expressjs.com.cn/guide/using-middleware.html#middleware.third-party)概念,
当 socket server 接收到来自客户端的消息时,会根据路径匹配执行相应的中间件.

中间件会按照挂载顺序,依次执行.

> **danger**
> 中间件只在服务器接收到客户端消息时才会触发!!!

## 服务
利用中间件可以完成对客户端消息的链式处理.
但为了实现 socket server 的一些全局功能,例如日志记录,状态推送等功能,需要定义全局
方法实现,这些均称为服务.利用 `services` 方法定义服务.
之后即可使用 `services_*` 的方式调用注入的服务.