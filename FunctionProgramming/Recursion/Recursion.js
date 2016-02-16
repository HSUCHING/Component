/**
 * Created by chinghsu on 16/2/12.
 */
var _=require("underscore");
var basic=require("../basic/basicfunction.js");

console.log(_);
function flat(array){
	if(_.isArray(array))
		return cat.apply(cat, _.map(array,flat));
	else
		return [array];
}

console.log(flat([[1,2],[3,4]]));

function evenOline(n){
	if(n===0){
		return true;
	}else{
		return partial1(oddOline,Math.abs(n)-1);
	}
}

function oddOline(n){
	if(n===0){
		return false;
	}else{
		return partial1(evenOline,Math.abs(n)-1);
	}
}


function trampoline(fun){
	var result=fun.apply(fun, _.rest(arguments));
	while(_.isFunction(result)){
		result=result();
	}
	return result;
}

console.log(trampoline(oddOline,20000));