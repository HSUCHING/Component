/**
 * Created by chinghsu on 16/3/9.
 */
var base64Img = require('base64-img');
var fs = require('fs');
var path = require('path');


function getpath(filepath) {
	return path.join(__dirname, filepath);
}

//var url = '/image/huodongjieshu.jpg';
//base64Img.requestBase64(url, function(err, res, body) {
//console.log(res);
//});


base64Img.base64(getpath('image/weihu.jpg'), function(err, data) {
	console.log(data);
	base64Img.img(data, getpath('dest'), '1', function(err, filepath) {
	});
});
