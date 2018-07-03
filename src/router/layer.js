// const pathRegexp = require('path-to-regexp');
// const debug = require('debug')('ClientServer:router:layer');

/**
 * Module variables.
 * @private
 */


/**
 * Module exports.
 * @public
 */

module.exports = class Layer {

    /**
     * 装载路由
     * @param  {all} path,路由地址,参见 {@link https://github.com/pillarjs/path-to-regexp#path-to-regexp|path}
     * @param {all} options,路由解析配置,参见 {@link https://github.com/pillarjs/path-to-regexp#path-to-regexp|options}
     * @param  {Function} fn,对应路由绑定的回调函数
     * @return {module.Layer}
     */
    constructor(path, options, fn) {
        if (!(this instanceof Layer)) {
            return new Layer(path, options, fn);
        }

        let opts = options || {};

        //匹配层的处理句柄
        this.handle = fn;
        //匹配层的函数名
        this.name = fn.name || '<anonymous>';
        //匹配层路径
        this.path = path;
    }

    /**
     * 层的错误处理函数.
     * @param {Error} error 错误对象.
     * @param {Client} client 错误对象.
     * @param {Function} next 回调对象.
     *
     */
     handle_error(error, client, next) {
        let fn = this.handle_client;

        if (fn.length !== 3) {
            // not a standard error handler
            return next(error);
        }

        //避免指向函数树接收到错误
        try {
            fn(error, client, next);
        } catch (err) {
            next(err);
        }
    };

    /**
     * 请求处理层.
     *
     * @param {Client} client 客户端的请求对象
     * @param {Function} next 递归指向的函数
     * @api private
     */

    handle_client(client, next) {
        let fn = this.handle;

        if (fn.length > 2) {
            // not a standard request handler
            return next();
        }
        //避免执行回调时出错
        try {
            fn(client, next);
        } catch (err) {
            next(err);
        }
    };


    /**
     * 检测当前路径是否匹配对应层
     *
     * @param {String} path
     * @return {Boolean}
     */
    match(path) {
        return this.path === path;
    }
}



