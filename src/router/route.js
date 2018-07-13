'use strict';
/**
 * Module dependencies.
 * @private
 */
const debug = require('debug')('socket:router:route');
const flatten = require('array-flatten');
const Layer = require('./layer');
/**
 * Module variables.
 * @private
 */
const slice = Array.prototype.slice;
const toString = Object.prototype.toString;
/**
 * Module exports.
 * @public
 */
module.exports = Route;

/**
 * 初始化路由,
 *
 * @param {String} path
 * @public
 */
class Route {
    /**
     * 构造函数
     * @param path
     */
    constructor(path) {
        this.path = path;
        this.stack = [];
        debug('new %o', path)
        // route handlers for various http methods
        this.methods = {};
    }


    /**
     * 路径处理函数.
     * @private
     */
     _handles_method(method) {
        if (this.methods._all) {
            return true;
        }
        var name = method.toLowerCase();
        if (name === 'head' && !this.methods['head']) {
            name = 'get';
        }
        return Boolean(this.methods[name]);
    };


    /**
     * 该函数为路由中间件处理句柄
     * @private
     */
    dispatch(client,done) {
        let idx = 0;
        let stack = this.stack;//该 path 对应的执行栈
        if (stack.length === 0) {
            return done();
        }

        client.route = this;
        next();

        function next(err) {
            // signal to exit route
            if (err && err === 'route') {
                return done();
            }
            // signal to exit router
            if (err && err === 'router') {
                return done(err)
            }
            let layer = stack[idx++];
            if (!layer) {
                return done(err);
            }
            if (layer.method && layer.method !== method) {
                return next(err);
            }
            if (err) {
                layer.handle_error(err, client, next);
            } else {
                layer.handle_request(client, next);
            }
        }
    };

    send(){
        //利用 flatten 将多个句柄展成一维
        let handles = flatten(slice.call(arguments));
        for (let i = 0; i < handles.length; i++) {
            let handle = handles[i];

            //类型不是函数抛出错误信息
            if (typeof handle !== 'function') {
                let type = toString.call(handle);
                let msg = 'Route.' + method + '() requires a callback function but got a ' + type
                throw new Error(msg);
            }
            debug('%o', this.path);

            let layer = Layer('/', {}, handle);

            //层的属性
            layer.method = method;

            this.methods[method] = true;
            this.stack.push(layer);
        }
        return this;
    };



}


