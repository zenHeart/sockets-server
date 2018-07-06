const  EventEmitter = require('events');
const  shortId = require('shortid');
const HashIds =  require('hashids');
const  debug = require('debug')('socket:client');

/**
 * 客户端模块
 * @module Client.
 */
module.exports = class Client extends  EventEmitter {
    /**
     * 实例化客户端对象
     * @param {Object} server 参见 {@link ClientServer}
     * @param {Object} socket 参见 {@link https://nodejs.org/dist/latest-v10.x/docs/api/net.html#net_event_connection|connnection}
     */
    constructor(server,socket) {
        //调用父类方法
        super();
        this.rawData = null;
        this.server = server;
        this.socket = socket;
        //利用 socket 的 ip 和端口生成客户端 id
        this.clientId = socket.remoteAddress+":"+socket.remotePort;
        //初始化客户端
        this.setup();
    }

    /**
     * 初始化客户端,绑定客户端原生事件
     * 'data', 'error', 'close', 'timeout','end'
     */

    setup() {
        //由于事件为异步,在执行回调时,this 指向 socket 而非 client 对象
        //所以需要绑定 this 为 client 防止 this 丢失
        this._ondata = this._ondata.bind(this);
        this._onerror = this._onerror.bind(this);
        this._ontimeout = this._ontimeout.bind(this);
        this._onclose = this._onclose.bind(this);
        this._onend = this._onend.bind(this);



        this.socket.on('data',this._ondata);
        this.socket.on('error',this._onerror);
        this.socket.on('timeout',this._ontimeout);
        this.socket.on('close',this._onclose);
        this.socket.on('end',this._onend);


    }

    destroy() {
        let clientId = this.clientId;
        let server = this.server;
        //销毁 socket
        this.socket.destroy();
        //销毁缓存
        server.removeClient(clientId);
    }

    /**
     * 委托 socket 发送客户端数据.
     * @param  {String} data
     */
    write(data) {
        let self = this;
        this.socket.write(data,function () {
            debug(`write to ${self.clientId} : ${data}`);
            self.emit('clientWrite',self,data);
        });
    }


    /**
     * 发送控制命令,必须等待返回值.
     * @param {Object} data json 对象.
     * @return {Promise} 设备响应结果
     *
     */
    sendCommand(data) {
        let msgId = Client.generateMsgId();

        let sendData = {
            ...data,
            msgId
        };
        //发送数据
        this.write(JSON.stringify(sendData));
        return  Promise.race([this._waitOverTime(msgId),this._bindCommand(msgId)])
    }


    /**
     * 生成唯一的 msgId.
     */
    static generateMsgId() {
        let hashIds = new HashIds(shortId.generate(),8);
        return hashIds.encode(1);
    }


    _ondata(data) {
        let server = this.server;
        this.rawData = data;
        debug(`${this.clientId} send data: ${data}`);
        server.emit('clientData',this);
    }

    _onerror(err) {
        debug('error');
        this.socket.destroy();
    }

    _ontimeout() {
        debug('timeout');

        this.socket.destroy();
    }

    _onclose() {
        debug('close');

        delete  this;
    }

    _onend() {
        debug('end');
        this.socket.destroy();
    }

    /**
     * 设备的超时等待处理函数
     * @private
     */
    _waitOverTime(msgId) {
        //响应的超时等待时间
        let self = this;
        let WAIT_OVERTIME = self.server.config.WAIT_OVERTIME || 3000;

        return new Promise((resolve,reject) => {
            setTimeout(() => {
                //响应超时移除监听器
                self.removeAllListeners(msgId);
                reject(new  Error(`device no respond in ${WAIT_OVERTIME}ms`));
            },WAIT_OVERTIME)
        });
    }

    /**
     * 绑定发送命令的响应回调
     * @param {String} msgId 监听的消息 id
     */
    _bindCommand(msgId) {
        let self = this;
        return  new Promise( (resolve,reject) => {
            self.once(msgId,function (data) {
                resolve(data);
            })
        })
    }
}




