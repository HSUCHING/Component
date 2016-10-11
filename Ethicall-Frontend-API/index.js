/**
 * Created by chinghsu on 16/9/19.
 */
var express = require('express');
var app = express();
var open = require('open');
var port = 8777;

app.use('/api', express.static('public'));

app.get('/', function (req, res) {
//     app.use('/static', express.static('public'));
    var IP = 'localhost';
    var url = 'http://' + IP + ':' + port;
    res.send('Please visit ' + url + '/api');
});

app.listen(port, function () {
    var IP = 'localhost';
    var url = 'http://' + IP + ':' + port;
    open(url + '/api');
    console.log('Ethicall API document is listening on port 8777!');
});

