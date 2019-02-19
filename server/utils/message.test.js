const expect = require('expect');
let  { generateMessage, generateLocationMessage } = require('./message');



describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Deus';
        let text = 'Deus vult!';
        let message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, text })
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        let from = 'Deus';
        let latitude = 25;
        let longitude = -14;
        let url = `https://www.google.com/maps?q=${latitude},${longitude}`
        let message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({ from, url })
    });
});