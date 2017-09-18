var fs = require('fs');

var headers = '省份,市,区域,医院名,地理位置,电话';

fs.readFile('./rawData.json', 'utf8', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    var csv = headers + '\r\n';
    var json = JSON.parse(data);
    for (_key1json in json) {
      var _dataJson1 = json[_key1json];
      for (_key2json in _dataJson1) {
        var _dataJson2 = _dataJson1[_key2json];
        for (_key3json in _dataJson2) {
          var _dataJson3 = _dataJson2[_key3json];
          for (_key4json in _dataJson3) {
            var _dataJson4 = _dataJson3[_key4json];
            csv += _key1json + ',' + _key2json + ',' + _key3json + ',' + _dataJson4.name + ',' + _dataJson4.location + ',' + _dataJson4.code + '\r\n'
          }
        }
      }
    }
    fs.writeFile('data.csv', csv, function(err) {
      if (err) {
        throw err;
      } else {
        console.log('CSV Save');
      }
    })
  }
})
