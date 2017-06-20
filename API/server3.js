import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-oai-router';

const app = new Koa();
const server = app.listen(9000);
app.use(bodyParser());

var opt = {
  // API文档路径
  apiDoc: './api/api.yaml',
  // controllers的目录
  controllerDir: './controllers',
  // 从server中获取监听的端口，为了方便打开api-explorer
  server: server,
  // 对接口做版本控制
  versioning: true,
  // 展示api-explorer
  apiExplorerVisible: true
};

var router = new Router(opt);
// 挂载由apiDoc识别的接口
app.use(router.routes());
// 挂载api-explorer工具
app.use(router.apiExplorer());
