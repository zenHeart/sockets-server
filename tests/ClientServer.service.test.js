/**
 * Created by lockepc on 2017/6/30.
 */
const net = require('net');

const ClientServerTest = require('../src/ClientServer');
const listenOpt = {port: null, host: 'localhost'};

class DemoService {
    constructor(name = 'zenheart') {
        this.name = name;
    }
    hi() {
        console.log(this.name);
    }

}


describe('test ClientSever service method', function () {
    let clientServer;
    beforeEach(() => {
        clientServer = new ClientServerTest({
        });
    })

    test('illegal service',() => {
        expect(() => {clientServer.service({a:1})}).toThrowError(/^Service must be a Instantiated classes/);
    })

    test('duplicate service',() => {
        clientServer.service(new DemoService());
        expect(() => {clientServer.service(new DemoService())}).toThrowError(/^.*define duplicate service/);
    })

    test('duplicate service different name',() => {
        let input = [new DemoService(),[new DemoService(),'DemoService1']],
            expectResult = ['DemoService','DemoService1'];

        clientServer.service(input[0]);
        clientServer.service(input[1][0],input[1][1]);

        expect(Object.keys(clientServer.services)).toEqual(expectResult);
    })

    test('use services in client',() => {
        let input = [new DemoService(),[new DemoService(),'DemoService1']],
            expectResult = ['DemoService','DemoService1'];

        clientServer.service(input[0]);
        clientServer.service(input[1][0],input[1][1]);

        expect(Object.keys(clientServer.services)).toEqual(expectResult);
    })
});





