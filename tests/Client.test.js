/**
 * Created by lockepc on 2017/6/30.
 */
const Client = require('../src/Client');



describe('Client', function () {
    test('create msgId', () => {
        let msgId = [];
        for(let i=0;i++;i<10) {
            msgId.push(Client.generateMsgId());
        }

        msgId.forEach(function (val,index,arr) {
            expect(val.length).toBe(8);
            if(indx < arr.length -1) {            expect(val).not.toBe(arr[index+1])
                expect(val).not.toBe(arr[index+1])
            }
        })
    });
});





