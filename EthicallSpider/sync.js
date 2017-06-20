//async with then
async function wait(data) {
  return new Promise((resolve, reject) => {
    setTimeout(v => resolve(data), 1000);
  })
}
(async function() {
  var res = await wait('wait 1 sec');
  console.log(res);
  res = await wait('wait 2 sec', 2000);
  console.log(res);
})()
