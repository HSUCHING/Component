function* Gene() {
  var a = yield 1;
  console.log(a);
  yield 2;
}
var gene = Gene();
console.log(gene.next()); //{ value: 1, done: false }
console.log(gene.next(1)); //{ value: 2, done: false }
console.log(gene.next()); //{ value: undefined, done: true }
console.log(gene.next()); //Error: Generator has already finished  经@Ralph-Wang提醒从 v0.11.13 开始不抛错了，返回{ value: undefined, done: true }


var slice = Array.prototype.slice;
var fs = require('fs');

function read(file) {
  return function(fn) {
    fs.readFile(file, 'utf8', fn);
  }
}
co(function*() {
  var a = yield read('.gitignore');
  var b = yield read('Makefile');
  var c = yield read('package.json');
  console.log(a.length);
  console.log(b.length);
  console.log(c.length);
})(function(err, args) {
  console.log("callback===args=======");
  console.log(args);

});

function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}

var fs = require("fs")

function size(file) {
  return function(fn) {
    fs.stat(file, function(err, stat) {
      if (err) return fn(err);
      fn(null, stat.size);
    });
  }
}

function co(fn) {
  return function(done) {
    var ctx = this;
    //old line
    //var gen = fn.call(ctx);
    //new line
    var gen = isGenerator(fn) ? fn : fn.call(ctx);
    var it = null;

    function _next(err, res) {
      it = gen.next(res);
      if (it.done) {
        done.call(ctx, err, it.value);
      } else {
        //new line
        it.value = toThunk(it.value, ctx);
        it.value(_next);
      }
    }
    _next();
  }
}

function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}

function isGenerator(obj) {
  return obj && 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

function isPromise(obj) {
  return obj && 'function' == typeof obj.then;
}

function isObject(obj) {
  return obj && Object == obj.constructor;
}

function isArray(obj) {
  return Array.isArray(obj);
}

function promiseToThunk(promise) {
  return function(done) {
    promise.then(function(err, res) {
      done(err, res);
    }, done)
  }
}

function objectToThunk(obj) {
  var ctx = this;
  return function(done) {
    var keys = Object.keys(obj);
    var results = new obj.constructor();
    var length = keys.length;
    var _run = function(fn, key) {
      fn = toThunk(fn);
      fn.call(ctx, function(err, res) {
        results[key] = res;
        --length || done(null, results);
      })
    }
    for (var i in keys) {
      _run(obj[keys[i]], keys[i]);
    }

  }
}

function toThunk(obj, ctx) {
  if (isGeneratorFunction(obj)) {
    return co(obj.call(ctx));
  }
  if (isGenerator(obj)) {
    return co(obj);
  }
  if (isObject(obj) || isArray(obj)) {
    return objectToThunk.call(ctx, obj);
  }
  if (isPromise(obj)) {
    return promiseToThunk.call(ctx, obj);
  }
  return obj;
}


function co(fn) {
  //判断是否为 generatorFunction
  var isGenFun = isGeneratorFunction(fn);

  return function(done) {
    var ctx = this;

    // in toThunk() below we invoke co()
    // with a generator, so optimize for
    // this case
    var gen = fn;

    // we only need to parse the arguments
    // if gen is a generator function.
    if (isGenFun) {
      //把 arguments 转换成数组
      var args = slice.call(arguments),
        len = args.length;
      //根据最后一个参数是否为函数，判断是否存在回掉函数
      var hasCallback = len && 'function' == typeof args[len - 1];
      done = hasCallback ? args.pop() : error;
      //执行 generatorFunction
      gen = fn.apply(this, args);
    } else {
      done = done || error;
    }
    //调用 next 函数，这是一个递归函数
    next();

    // #92
    // wrap the callback in a setImmediate
    // so that any of its errors aren't caught by `co`
    function exit(err, res) {
      setImmediate(function() {
        done.call(ctx, err, res);
      });
    }

    function next(err, res) {
      var ret;

      // multiple args
      if (arguments.length > 2) res = slice.call(arguments, 1);

      // error
      if (err) {
        try {
          ret = gen.throw(err);
        } catch (e) {
          return exit(e);
        }
      }

      // ok
      if (!err) {
        try {
          //执行 next，会获得 yield 返回的对象。同时通过 next 传入数据，为变量赋值
          //返回的对象格式是{value:xxx,done:xxx},这里的 value 是一个函数
          ret = gen.next(res);
        } catch (e) {
          return exit(e);
        }
      }

      // done 判断是否完成
      if (ret.done) return exit(null, ret.value);

      // normalize
      ret.value = toThunk(ret.value, ctx);

      // run
      if ('function' == typeof ret.value) {
        var called = false;
        try {
          //执行 ret.value 函数，同时传入一个回调函数。当异步函数执行完，会递归 next
          //next又会执行gen.next()，同时把结果传出去
          ret.value.call(ctx, function() {
            if (called) return;
            called = true;
            next.apply(ctx, arguments);
          });
        } catch (e) {
          setImmediate(function() {
            if (called) return;
            called = true;
            next(e);
          });
        }
        return;
      }

      // invalid
      next(new TypeError(
        'You may only yield a function, promise, generator, array, or object, ' +
        'but the following was passed: "' + String(ret.value) + '"'));
    }
  }
}
