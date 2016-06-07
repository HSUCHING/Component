/**
 * Created by chinghsu on 16/6/6.
 */
// var faker = require('Faker');
var faker = require('Faker');
var fs = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
faker.locale = "zh_CN";
var bigSet = [];
var app = express();
console.log(faker.name.firstName());
for (var i = 20; i >= 0; i--) {
    var ob = faker.helpers.userCard();
    ob.img = faker.image.image();
    bigSet.push(ob);
}

fs.writeFile(__dirname + '/bigDataSet.json', JSON.stringify(bigSet), function () {
    console.log("bigDataSet generated successfully!");
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
// app.use(express.json()); // support json encoded bodies
// app.use(express.urlencoded()); // support encoded bodies


app.post('/getTestData', function (req, res) {
    //get Parameter;
    console.log(req.is('application/json'));
    console.log(req.get('Content-Type'));
    req.accepts(['json', 'text']);
    console.log(req.body.username);
    console.log(req.body.psw);
    res.send(JSON.stringify(bigSet));
});

// app.get('/getTestData', function (req, res) {
//     //get Parameter;
//     console.log(req.query.name);
//     console.log(req.param('name'));
//     res.send(JSON.stringify(bigSet));
// });

app.get('/getTestData/:version', function (req, res) {
    //get Parameter;
    console.log(req.query.name);
    console.log(req.param('name'));
    res.send(JSON.stringify(bigSet));
});


app.listen(3000);