/**
 * Created by chinghsu on 17/2/4.
 */
function isNum(num) {
	if (typeof num === 'number') {
		return true
	} else {
		return false
	}
}

exports.isNum = isNum;