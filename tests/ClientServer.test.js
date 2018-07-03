/**
 * Created by lockepc on 2017/6/30.
 */
const net = require('net');

const ClientServerTest = require('../src/ClientServer');
const clientServer = new ClientServerTest();
const listenOpt = {port: null, host: 'localhost'};



describe('device test connect', function () {
    let client;
    beforeAll(done => {
        clientServer.listen({
            port:0,
            host:'localhost'
        },function () {
            listenOpt.port = clientServer.address().port;
            done();
        });


    });
    afterAll((done) => {
        client.destroy();
        clientServer.close(function () {
            done();
        });
    });


    test('server connect 1,and clientId same', (done) => {
        client = net.connect(listenOpt,
            () =>  {
            });
        client.setEncoding('utf8');

        clientServer.on('newClient',function (receiveClient) {
            let clientId = receiveClient.clientId;

            let num = Object.keys(clientServer.client).length;
            let saveClient = clientServer.client[clientId];
            expect(num).toBe(1);
            expect(saveClient.clientId).toBe(clientId);
            done()
        });

    });

});





