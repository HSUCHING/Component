'use strict'

const superagent = require('superagent');
const htmlparser = require('htmlparser2');
// const async = require('async');
const cheerio = require('cheerio');
const url = 'http://www.cyicai.com/hospital/s/';
let index = 0;
const getPosts = (url) => new Promise(resolve => {
  console.log('正在抓取...');
  superagent.get(url).end(function(err, res) {
    var rawData = res.text;
    var reg = /<div class="commonWidth comList_mainBg">([\s|\S]*)<\/div><!--commonWidth-->/g
    var current = reg.exec(res.text)[0].replace('<!--commonWidth-->', '');
    // console.log(current);
    var $ = cheerio.load(current, {
      decodeEntities: false
    });

    // var arr = Array.prototype.slice.call($('div.comList_listright.fr'));
    var hospital = [];
    $('div.comList_listright.fr').each(function(i, elem) {
      hospital.push($(this).find('.comList_Name').text());
    })
    console.log(hospital);
  });
// http.get(url, function(res) {
//   var rawData = ''
//   var statusCode = res.statusCode
//
//   console.log('正在抓取...')
//
//   if (statusCode !== 200) {
//     res.resume()
//     return callback(new Error('Request Failed. Status Code: ' + statusCode))
//   }
//
//   res.setEncoding('utf8')
//
//   res.on('data', function(chunk) {
//     rawData += chunk
//   })
//
//   res.on('end', function() {
//     // var current
//     // var result = {}
//     // var reg = /<span lang="EN-US">(.*?)<span>(?:&nbsp;)+ <\/span><\/span>(?:<\/b>)?(?:<b>)?<span style="font-family: 宋体">(.*?)<\/span>/g
//     //
//     // while ((current = reg.exec(rawData)) !== null) {
//     //   result[current[1]] = current[2].trim()
//     // }
//     //
//     // console.log(rawData);
//     resolve(rawData);
//     // var parser = new htmlparser.Parser({
//     //   onopentag: function(name, attribs) {},
//     //   ontext: function(text) {
//     //     console.log(text)
//     //   },
//     //   onclosetag: function(tagname) {},
//     //   onend: function(text) {
//     //     resolve(text);
//     //   }
//     // });
//     //
//     // var reg = /<div class="commonWidth comList_mainBg">([\s|\S]*)<\/div>/g
//     // var current = reg.exec(rawData);
//     // current.replace('<!--commonWidth-->', '');
//     // console.log(current);
//     // console.log(parser.parseComplete(rawData));
//
//   })
// });
});

async function spider(param, callback, stop) {
  // if (stop) {
  //   return new Promise((resolve, reject) => {
  //     resolve(obj);
  //   });
  // } else {
  //
  //   await spider();
  // }
  console.log("Start");
  for (var i = 0; i < param.length; i++) {
    const result = await getPosts(url + param.urlPath + (i + 2) + '.html');
    console.log(result);
  }
}

exports.getData = function(callback) {
  spider({
    urlPath: '+++/list-',
    length: 1
  }, callback);
}
