/**
 * Created by chinghsu on 17/2/6.
 */


describe("Counter", function () {
	it("should say Hi given a name", function () {
		// sayHi("Tom").should.equal("Hi Tom");
		// expect(4+5).to.be.equals(8);
		// var jquery = require("jquery");
		// console.log(jquery.fn);
		// console.log("Print");
		expect(sayHi("Tom")).to.be.equals("Hi Tom");
	});
});