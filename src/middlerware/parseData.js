'use strict';
const debug = require('debug')('socket:parseData');

/**
 * @param {Object} options 解析传入的原生数据格式.
 * @param {Function} options.parser 数据解析的函数.
 * @api public
 */

module.exports = function parseData(options) {
    let parser = internalParser;

    if(options && options.parser) {
        parser = options.parser ;

        if( typeof parser !== 'function' ) {
            throw  new TypeError('options.parser must be a function,but get a',typeof parser);
        }
    }

    return function parserData(client, next){
        client.data = parser(client.rawData);
        debug(`${client.clientId} : %O`,client.data);
        next();
    };
};


/**
 *
 * @param {String} data 演示数据必须是 json 格式
 * @return {*}
 */
function internalParser(data) {
    try{
        return JSON.parse(data);
    } catch (e) {
        debug('parser json fail: %s',e.message);
        return {};
    }
}
