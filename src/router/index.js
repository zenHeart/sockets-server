const Layer = require('./layer');
const debug = require('debug')('socket:router');
const slice = Array.prototype.slice;

/**
 * socket 路由模块
 * @module ClientRoute.
 */
module.exports = class ClientRoute {
    /**
     * 实例化路由对象
     * @param {Object} options 路由配置项.
     */
    constructor(options) {
        //用在递归路由的定义
        this.options = options;
        this.stack = [];
    }

    /**
     * 路由处理函数,处理 socket 接收到的数据
     * @param {Client} client
     */
    handle(client) {
        let self = this;
        client.path = null;//每次处理需重置 path 为空.

        //路由调用栈
        let idx = 0;

        //获取路由的中间件
        let stack = self.stack;

        //核心在 next 函数,实现对中间件的使用
        next();


        //由于采用回调模式,该函数内部的 this 会丢失变为全局环境
        function next(err) {
            //获取错误
            let layerError = err;

            //到达栈顶
            if (idx >= stack.length) {
                lastDone(layerError,client);
                return;
            }

            let path = client.path || '/';

            //如果路径错误返回失败
            if (path == null) {
                return ;
            }

            // find next matching layer
            let layer;
            let match;

            //不匹配路由,且未出栈,则向下查找组件
            while (match !== true && idx < stack.length) {
                //索引到下个中间件
                layer = stack[idx++];
                //判断路径是否和该层匹配
                match = matchLayer(layer, path);


                //路径不匹配向下查找中间件
                if (match !== true) {
                    continue;
                }

                if (layerError) {
                    match = false;
                    continue;
                }

            }

            // no match
            //未找到匹配层
            //最后一层执行 done 函数
            if (match !== true) {
                //此处不存储递归回调
                //todo 此处需要添加错误处理层,处理任意路由层的错误
                lastDone(layerError,client);
                return;
            }

            if (layerError) {
                layer.handle_error(layerError,client, next);
            } else {
                layer.handle_client(client, next);
            }
        }
    };


    /**
     * 路由绑定中间件
     */
    use(fn) {
        let offset = 0;
        let path = '/';

        if (typeof fn !== 'function') {
            let arg = fn;

            while (Array.isArray(arg) && arg.length !== 0) {
                arg = arg[0];
            }

            // first arg is the path
            if (typeof arg !== 'function') {
                offset = 1;
                path = fn;
            }
        }

        let callbacks = slice.call(arguments, offset);

        if (callbacks.length === 0) {
            throw new TypeError('Router.use() requires a middleware function')
        }

        for (let i = 0; i < callbacks.length; i++) {
            let fn = callbacks[i];

            if (typeof fn !== 'function') {
                throw new TypeError('Router.use() requires a middleware function but got a ' + typeof fn)
            }

            let layer = new Layer(path, {
                sensitive: this.caseSensitive,
                strict: false,
                end: false
            }, fn);


            this.stack.push(layer);
        }

        return this;
    }
}


/**
 * 查找匹配的层,内部使用 layer.match.
 *
 * @param {Layer} layer 层对象,详见 {@link Layer}
 * @param {string} path 匹配的路径
 * @private
 */

function matchLayer(layer, path) {
    try {
        return layer.match(path);
    } catch (err) {
        return err;
    }
}


/**
 * 路由最后一层处理函数.
 * todo 后续需单独分离出来.
 * @param {Error} err 传递错误处理函数
 * @param {Client} client 客户端对象
 */
function lastDone(err,client){
    if(err) {
        debug('device error:',err.message);
    } else {
        debug('layer run success');
    }
}





