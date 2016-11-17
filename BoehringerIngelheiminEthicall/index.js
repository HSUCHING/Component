/**
 * Created by chinghsu on 16/11/15.
 */
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var MongoStore = require('connect-mongo')(session);
var setting = require('./setting');
var authentication = require('./routes/authorize');
var admin = require('./routes/admin');


//set express.locals
app.locals.title = "BI";
app.locals.strftime = require("strftime");
app.use(cookieParser());
app.use(session({
    secret: setting.cookieSecret,
    store: new MongoStore({
        url: 'mongodb://localhost/'+setting.db
    })
}));

//config express
app.set('views', path.join(__dirname, 'views'));


//config express middleware
// app.use(function (req, res, next) {
//     console.log('Time: ', Date.now());
//     next();
// });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//仅开发环境使用
if (app.get("env") == "development") {
    console.log("development");
}

//访问控制
app.use(authentication);
app.use('/static', express.static('public'));
app.use('/',admin);


// app.post('/login', function (req, res) {
//
//     var user = {
//         username: req.body.username,
//         password: req.body.password
//     };
//     MongoClient.connect('mongodb://localhost:27017/ethicall', function (err, db) {
//         if (err) {
//             throw err;
//         }
//         db.collection('user').find({"username": user.username}).toArray(function (err, result) {
//             if (err) {
//                 throw err;
//                 res.send(404);
//             }
//             if (result.length > 0) {
//                 if (result[0].password == user.password) {
//                     res.send(200);
//                 } else {
//                     res.send(404);
//                 }
//             } else {
//                 res.send(404);
//             }
//         });
//         db.close();
//     });
//
//
// });
//
// app.post('/user', function (req, res) {
//     var user = {
//         username: req.body.username,
//         password: req.body.password,
//         newPsw: req.body.newPsw
//     };
//     MongoClient.connect('mongodb://localhost:27017/ethicall', function (err, db) {
//         if (err) {
//             throw err;
//         }
//
//         db.collection('user').find({"username": user.username}).toArray(function (err, result) {
//             if (err) {
//                 throw err;
//                 res.send(404);
//             }
//             if (result.length > 0) {
//                 if (result[0].password == user.password) {
//                     db.collection('user').updateOne({"username": user.username}, {$set: {"password": req.body.newPsw}}, function (err, result) {
//                         if (err) {
//                             throw err;
//                             res.send(404);
//                         } else {
//                             res.send(200);
//                         }
//                     });
//                     db.close();
//                 } else {
//                     res.send(404);
//                 }
//             } else {
//                 res.send(404);
//             }
//         });
//
//     });
//
// });


var server = app.listen(8899, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
