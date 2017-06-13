'use strict'
let spider = require('./Spider');
let fjspider = require('./FJSpider');
let fs = require('fs');
let path = require('path');
/**
 * 输出 JSON 数据到 dist 目录下
 * @author Hsuching
 * @datetime 2016-12-19 16:45
 */
function outputJSON() {
  // spider.getData(function(err, callback) {
  //   // if (err) {
  //   //   return console.log(err);
  //   // }
  //   console.log("Data Ready!");
  // })
  fjspider.getData({
    root: "福建",
    cityInfo: [
      {
        id: "0591",
        length: 308,
        name: "福州"
      }, {
        id: "0593",
        length: 62,
        name: "宁德"
      }, {
        id: "0594",
        length: 118,
        name: "莆田"
      }, {
        id: "0595",
        length: 279,
        name: "泉州"
      }, {
        id: "0596",
        length: 42,
        name: "漳州"
      }, {
        id: "0597",
        length: 51,
        name: "龙岩"
      }, {
        id: "0598",
        length: 111,
        name: "三明"
      }, {
        id: "0599",
        length: 109,
        name: "南平"
      }
    ]
  }, function(err, data) {
    if (err) {
      return console.log(err);
    }
    outputFile('福建医院', data);
    console.log("数据导出成功!");
  });
}
outputJSON();

function outputFile(name, data) {
  var fileName = 'dist/' + name + '.json'

  fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify(data))
}
