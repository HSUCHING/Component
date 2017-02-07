/**
 * Created by chinghsu on 17/2/4.
 */
const Util = require('../../src/es6/test');

describe('test.js: ', () => {
	it('isNum() should work fine.', () => {
		expect(Util.isNum(1)).toBe(true)
		expect(Util.isNum('1')).toBe(false)
	})
})