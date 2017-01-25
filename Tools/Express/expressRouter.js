/**
 * Created by chinghsu on 16/11/14.
 */
var express = require('express');
var app = express();
var router=require('./router');
app.use('/ethicall',router);

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
