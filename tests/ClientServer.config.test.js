/**
 * Created by lockepc on 2017/6/30.
 */
const net = require('net');

const ClientServerTest = require('../src/ClientServer');
const listenOpt = {port: null, host: 'localhost'};

describe('test ClientSever config', function () {
    let client;
    let clientServer;
    afterEach(done => {
        client.destroy();
        clientServer.close(function () {
            done();
        });
    })

    test('options.parserData',done => {
        let testData = {
            input:" hello world ",
            expect:"hello world"
        };

        clientServer = new ClientServerTest({
            parserData:function(data) {
                return data.trim();
            }
        });
        clientServer.listen({
            port:0,
            host:'localhost'
        },function () {
            listenOpt.port = clientServer.address().port;
            client = net.connect(listenOpt,
                () =>  {
                    client.write(testData.input)
                });
            client.setEncoding('utf8');
        });
        clientServer.on('resolveFinish',function (receiveClient) {
            try {
                expect(receiveClient.data).toBe(testData.expect);
                done();
            } catch(e){
                done(e);
            }
        });
    })

    test('options.parsePath',done => {
        let testData = {
            input:{path:"test"},
            expect:"test"
        };

        clientServer = new ClientServerTest({
            parserPath:function(data) {
                return data['path'];
            }
        });
        clientServer.listen({
            port:0,
            host:'localhost'
        },function () {
            listenOpt.port = clientServer.address().port;
            client = net.connect(listenOpt,
                () =>  {
                    client.write(JSON.stringify(testData.input))
                });
            client.setEncoding('utf8');
        });
        clientServer.on('resolveFinish',function (receiveClient) {
            try {
                expect(receiveClient.path).toBe(testData.expect);
                done();
            } catch(e){
                done(e);
            }
        });
    })

});





