const expect = require('expect');
let  { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        let res = isRealString(98);

        expect(res).toBe(false);
    });
    it('should reject string with only whitespace', () => {
        let res = isRealString('      ');

        expect(res).toBe(false);
    });
    it('should allow string whit non-space characters', () => {
        let res = isRealString('  DeusExMachina  ');

        expect(res).toBe(true);
    });

});