/**
 * Created by chinghsu on 17/2/2.
 */
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
// var io = require('socket.io')(http);

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});

// io.on('connection', function (socket) {
//     console.log('a user connected');
//     socket.on('chat_message', function (msg) {
//         console.log('message: ' + msg);
//     });
//     socket.on('disconnect', function () {
//         console.log('user disconnected');
//     });
// });

http.listen(3000, function () {
    console.log('listening on *:3000');
});