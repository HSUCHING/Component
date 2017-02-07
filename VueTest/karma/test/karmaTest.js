/**
 * Created by chinghsu on 17/2/4.
 */
describe('test.js', function() {
	it('isNum() should work fine.', function() {
		expect(isNum(1)).toBe(true)
		expect(isNum('1')).toBe(false)
	})
});