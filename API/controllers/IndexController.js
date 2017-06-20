'use strict';

module.exports.get = function*() {
  this.body = {
    index: 'Hello koa-spec!'
  };
};
