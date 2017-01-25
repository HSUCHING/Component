/**
 * Created by chinghsu on 16/11/28.
 */
// npm start = node server.js
// curl -XPOST -H "Content-Type:application/graphql"  -d 'query { todos { title } }' http://localhost:8080
var graphql = require('graphql').graphql;
var express =require('express');
var graphQLHTTP=require('express-graphql');
var Schema = require('./schema');

// var query = 'query{todos{id,title,completed}}';
var query='mutation {add(title: "GraphQL") {id, title}}';
graphql(Schema,query).then(function (result) {
   console.log(JSON.stringify(result,null," "));
});

var app = express()
    .use('/',graphQLHTTP({schema:Schema,pretty:true}))
    .listen(8080,function(err){
        console.log('GraphQL Server is now running on localhost:8080');
    });
