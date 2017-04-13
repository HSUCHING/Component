const Redis = require("ioredis");
const Store = require("koa-session2/libs/store");

class RedisStore extends Store {
  constructor() {
    super();
    this.redis = new Redis({
      port: 6379,
      host: '127.0.0.1',
      family: 4,
      password: '',
      db: 0
    });
  }

  get(sid) {
    return this.redis.get(`SESSION:${sid}`).then(data => JSON.parse(data));
  }

  set(session, opts) {
    if (!opts.sid) {
      opts.sid = this.getID(24);
    }

    return this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session)).then(
      () => {
        return opts.sid
      });
  }

  destroy(sid) {
    return this.redis.del(`SESSION:${sid}`);
  }
}
