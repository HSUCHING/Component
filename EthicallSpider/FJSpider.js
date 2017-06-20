'use strict'

const superagent = require('superagent').agent();
const htmlparser = require('htmlparser2');
// const async = require('async');
const cheerio = require('cheerio');
const urlPath = 'http://www.fj12320.com';
let index = 0;
// .then(() => {
//   return superagent.get('/cookied-page');
// })
let data = {
  root: {}
};
const getPosts = (url) => new Promise(resolve => {
  console.log('正在抓取...');
  superagent.get(url).end(function(err, res) {
    var rawData = res.text;
    var reg = /<div id="dqyydiv1">([\s|\S]*)<\/div>/g
    var current = reg.exec(res.text)[0];
    var $ = cheerio.load(current, {
      decodeEntities: false
    });

    // var arr = Array.prototype.slice.call($('div.comList_listright.fr'));
    var doctor = [];
    $('table').each(function(i, elem) {
      if ($('table').length >= (i + 2)) {
        var obj = {
          name: $(this).find('.ab14').text(),
          title: $(this).find('.textc_y12').text(),
          url: urlPath + '/' + $(this).find('.ab14').attr('href').replace(/;WEBSOLESESSION=([\s|\S]*)/, '')

        // area: $(this).eq(3).find('.textc_b12').text(),
        // hospital: $(this).find('.textc_y12').text(),
        // department: $(this).find('.textc_y12').text(),
        // major: $(this).find('.textc_y12').text(),
        // specialist: $(this).find('.textc_y12').text()
        }
        // let detail = spiderDetail(urlPath + '/' + $(this).find('.ab14').attr('href').replace(/;WEBSOLESESSION=([\s|\S]*)/, ''));
        // console.log(detail);
        doctor.push(obj);
      // doctor.push($(this).find('.ab14').text());
      }
    });
    // console.log(doctor);
    resolve(doctor);
  })
});

const getDetail = (doctor) => new Promise(resolve => {
  // console.log(url);
  console.log("现在爬取" + doctor.name + "医生数据!");
  superagent.get(doctor.url).end(function(err, res) {
    var rawData = res.text;
    var reg = /<td class="t_ys_info_c1">([\s|\S]*)<\/td>/g
    // var current = reg.exec(res.text)[0].replace('<!--commonWidth-->', '');
    var current = reg.exec(res.text)[0];
    // console.log(current);
    var $ = cheerio.load(current, {
      decodeEntities: false
    });
    console.log($('td').parent().find('.text_info').text())
    var obj = {
      name: doctor.name,
      title: doctor.title,
      area: $('table tbody tr').eq(2).find('td').text().split("：")[1],
      hospital: $('table tbody tr').eq(3).find('td').text().split("：")[1],
      department: $('table tbody tr').eq(4).find('td').text().split("：")[1],
      major: $('table tbody tr').eq(5).find('td').text().split("：")[1],
      specialist: $('table tbody tr').eq(6).find('td').text().split("：")[1],
      description: $('td').parent().find('.text_info').text()
    };
    resolve(obj);
  })
});

async function spider(param, callback) {
  for (var k = 0; k < param.metaData.cityInfo.length; k++) {
    data.root.children[param.metaData.cityInfo[k].name] = [];
    var city = param.metaData.cityInfo[k].name;
    var cityLen = param.metaData.cityInfo[k].length;
    var cityId = param.metaData.cityInfo[k].id;
    console.log('开始爬取' + param.metaData.cityInfo[k].name + '市的医生数据！');
    for (var i = 0; i < cityLen; i++) {
      console.log("开始爬取" + city + "第" + (i + 1) + "页数据!");
      const result = await getPosts(urlPath + param.urlPath + param.cityPath + cityId + param.pagerPath + (i) * 10);
      for (var j = 0; j < result.length; j++) {
        console.log(result[j].url);
        const detail = await getDetail(result[j]);
        console.log(detail);
        data.root.children[param.metaData.cityInfo[k].name].push(detail);
      }
      console.log("已爬取完" + city + "市的第" + (i + 1) + "页医生数据!");
      callback(null, data);
    }
    console.log("已爬取完" + city + "市的医生数据");
    callback(null, data);
  }
  callback(null, data);
}

exports.getData = function(param, callback) {
  data.root.name = param.root;
  data.root.children = {};
  spider({
    urlPath: '/doctor',
    cityPath: '?&city=',
    metaData: param,
    pagerPath: '&&pager.offset=',
    data: data.root.children
  }, function() {
    callback(null, data);
  });
}
