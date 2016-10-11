var fs = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var gd= require('./data');


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
// app.use(express.json()); // support json encoded bodies
// app.use(express.urlencoded()); // support encoded bodies


app.post('/getMockData', function (req, res) {
    //get Parameter;
    // console.log(req.is('application/json'));
    // console.log(req.get('Content-Type'));
    req.accepts(['json', 'text']);
    // console.log(req.body.username);
    // console.log(req.body.psw);
    var data=gd.mock(format);
    res.send(JSON.stringify(data));
    fs.writeFile(__dirname + '/mockDataSet_' + Date.now() + '.json', JSON.stringify(data), function () {
        console.log("bigDataSet generated successfully!");
    });
});


app.get('/getMockData/:version', function (req, res) {
    // console.log(req.is('application/json'));
    // console.log(req.get('Content-Type'));
    req.accepts(['json', 'text']);
    // console.log(req.body.username);
    // console.log(req.body.psw);
    var data=gd.mock();
    res.send(JSON.stringify(data));
    fs.writeFile(__dirname + '/temp/mockDataSet_' + Date.now() + '.json', JSON.stringify(data), function () {
        console.log("MockData generated successfully!");
    });
});



app.listen(3000);