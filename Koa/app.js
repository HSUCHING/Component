/**
 * Created by chinghsu on 17/2/21.
 */
// import babel from 'babel-core';
const Koa = require('koa');
const cors = require('kcors');
const app = new Koa();
const router = require('./router/router');
const staticServe = require('koa-static');
// const staticServe = require('koa-static-server');

const authentication = require('./router/authorize');
const session = require('koa-session2');
const Store = require('./models/store');
// const Store = require('./router/store');
const bodyParser = require('koa-bodyparser');
const convert = require('koa-convert');

const staticPath = '/static';
app.use(convert(cors()));
app.use(bodyParser());
app.use(session({
	store: new Store()
}));
app.use(authentication);
// app.use((ctx, next) => {
// 			const start = new Date();
// 			return next().then(() => {
// 				const ms = new Date() - start;
// 				console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// 			}));

app.use(staticServe(__dirname + staticPath, {
	index: 'index.html'
}));
// app.use(staticServe({
// 	rootDir: 'dist',
// 	rootPath: '/'
// }));
app.use(convert(router.routes()))
	.use(convert(router.allowedMethods()));

// app.use(async(ctx, next) => {
// 	try {
// 		const start = new Date();
// 		await next();
// 		const ms = new Date() - start;
// 		console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
// 	} catch (err) {
// 		ctx.body = {
// 			message: err.message
// 		}
// 		ctx.status = err.status || 500
// 	}
// });


// response
// app.use(ctx => {
// 	// console.log('response');
// 	// ctx.body = 'Hello Koa';
// 	ctx.redirect('./index.html');
// });

app.on('error', function(err, ctx) {
	if (process.env.NODE_ENV != 'test') {
		console.log(err.message);
		console.log(err);
	}
});


app.listen(3000, () => console.log('server started， port 3000'));

// Email
// const nodemailer = require("nodemailer");
// let username = 'xuj@ethicall.cn';
// let password = '19860304XJxj';
// let smtpTransport = nodemailer.createTransport({
// 	// pool: true,
// 	// host: 'smtp.exmail.qq.com',
// 	// port: 465,
// 	service: 'QQex',
// 	// secure: true, // use SSL
// 	auth: {
// 		user: username,
// 		pass: password
// 	}
// });
//
// smtpTransport.sendMail({
// 	from: '"XUJIN" <xuj@ethicall.cn>',
// 	to: 'XUJIN <xuj@ethicall.cn>',
// 	subject: 'Test',
// 	html: '邮件测试！'
// }, function(err, res) {
// 	console.log(err, res);
// });



module.exports = app;
