## bug
* [ ] 若初始化时,不指定端口会导致 remoteAdress 为 ipv6 地址.
而客户端则为 ipv4 地址.会导致无法索引到 clientId.解决方法.
    * 强制转换地址为 ipv4
    * 指定监听地址为 ipv4
    
    