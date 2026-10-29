/**
 * Created by lockepc on 2017/6/30.
 */
const Client = require('../src/Client');



describe('Client', function () {
    test('create msgId', () => {
        let msgId = [];
        for(let i=0;i<10;i++) {
            msgId.push(Client.generateMsgId());
        }

        expect(msgId).toHaveLength(10);
        expect(new Set(msgId).size).toBe(10);
        msgId.forEach(function (val) {
            expect(val.length).toBe(8);
        })
    });
});





