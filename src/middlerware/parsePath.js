'use strict';

const debug = require('debug')('socket:parsePath');
const has = require('lodash/has');

/**
 * @param {Object} options 路径解析配置项.
 * @param {Function} options.parser 路由解析函数,未赋值则使用内部解析器
 * @api public
 */

module.exports = function parsePath(options) {
    let parser = internalParser;

    if (options && options.parser) {
        parser = options.parser;

        if (typeof parser !== 'function') {
            throw  new TypeError('options.parser must be a function,but get a', typeof parser);
        }
    }

    return function parserPath(client, next) {
        client.path = parser(client.data);
        next();
    };
};


/**
 * 解析路由
 * @param data
 */
function internalParser(data) {
    if (has(data, 'apiId')) {
        debug(`path = ${data['apiId']}`);
        return data['apiId'];
    } else {
        return '/'
    }
}
