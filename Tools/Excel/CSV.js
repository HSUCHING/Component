/**
 * Created by chinghsu on 16/11/8.
 */
var csv = require('fast-csv');
var fs = require('fs');
var csv = require("fast-csv");

csv.fromPath("data/data2.csv")
    .on("data", function(data){
        console.log(data);
    })
    .on("end", function(){
        console.log("done");
    });