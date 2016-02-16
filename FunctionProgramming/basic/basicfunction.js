/**
 * Created by chinghsu on 16/2/12.
 */
var _ = require("underscore");

function existy(x) {
	return x != null;
}

function cat() {
	var head = _.first(arguments);
	if (existy(head))
		return head.concat.apply(head, _.rest(arguments));
	else
		return [];
}

function construct(head,tail){
	return cat([head], _.toArray(tail));
}

function partial1(fun,arg1){
	return function(){
		var args=construct(arg1,arguments);
		return fun.apply(fun,args);
	}
}

module.exports={
	cat:cat,
	existy:existy,
	construct:construct,
	partial1:partial1
};

global.cat=cat;
global.existy=existy;
global.construct=construct;
global.partial1=partial1;




//if (typeof exports !== "undefined") {
//	exports.existy = existy;
//	exports.cat = cat;
//} else {
//	this.existy = existy;
//	this.cat = cat;
//}