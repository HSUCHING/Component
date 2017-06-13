'use strict';

const CNodeJS = require('./');
const client = new CNodeJS({
  token: ''
});
// client.getTopics({
//     page: 1
//   })
//   .then(list => console.log(list))
//   .catch(err => console.error(err))
client.getTopicDetail({
    id: '592f8cefe018d6750dbfa0e2'
  })
  .then(list => console.log(list))
  .catch(err => console.error(err))
  // client.request('GET', 'topics', {
  //     page: 1
  //   })
  //   .then(ret => console.log(ret))
  //   .catch(err => console.error(err));
  //
  // client.request('GET', 'topics', {
  //   page: 1
  // }, (err, ret) => {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log(ret);
  //   }
  // })
