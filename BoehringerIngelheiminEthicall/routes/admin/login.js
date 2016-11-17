/**
 * Created by chinghsu on 16/11/16.
 */
var user=require('./user');


function login(req, res, next) {

    var usrObj=user.authenticate(req.body.userName,req.body.password);

    if (usrObj) {
        req.session.uid = user.id;
        req.session.user = req.body.username;
        console.log(req.session.user + "-=-=-=-=-=");
        res.redirect('/');
    } else {
        res.error("登录失败");
        res.redirect('back');
    }
}

module.exports = login;


//用户登录this.login = function(req, res){    //1.生成md5密码    var md5 = crypto.createHash('md5');    var password = md5.update(req.body.password).digest('base64');    //2.登录    User.login(req.body.username,password,function(err,user){        if(user!=''){            console.log('登录成功！');            req.session.user=req.body.username;            console.log(req.session.user+"-=-=-=-=-=");;            res.render('index',{ title: '首页' ,                user:req.session.user,                success:'登录成功',                error:'',                posts:[]});        }else{            console.log('登录失败！');            res.render('login',{ title: '用户登录' ,                user:'',                success:'',                error:'用户名或密码错误，请重试'});        }    });}
