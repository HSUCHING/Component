var fs = require('fs');
fs.readFile('./demo.json', function(err, data) {
  if (err)
    throw err;

  var jsonObj = JSON.parse(data).data.items;
  var space = ' ';
  var newLine = '\n';
  var chunks = [];
  var length = 0;

  for (var i = 0, size = jsonObj.length; i < size; i++) {
    var one = jsonObj[i];
    var value1 = one.user['nickname'];
    var value2 = one['create_time'];
    var value3 = one['content'];
    var value = "评论者:" + value1 + newLine + "评论时间:" + value2 + newLine + "评论内容:" + value3.replace(/<br>/g, '\n') + newLine + newLine
    var buffer = new Buffer(value);
    chunks.push(buffer);
    length += buffer.length;
  }

  var resultBuffer = new Buffer(length)
  for (var i = 0, size = chunks.length, pos = 0; i < size; i++) {
    chunks[i].copy(resultBuffer, pos);
    pos += chunks[i].length;
  }

  fs.writeFile('./resut.txt', resultBuffer, function(err) {
    if (err)
      throw err;
    console.log('has finished');
  });
});
