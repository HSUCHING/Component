/**
 * Created by chinghsu on 16/11/16.
 */
var user=require('./../../models/user');


function login(req, res, next) {
    var data = req.body.user;
    user.authenticate(data.name,data.psw,function(err,user){
        if(err){
            res.sendStatus(404);
        }else{
            if(!user){
                res.redirect("back");
            }else{
                // res.render('home.ejs', {name: user.name});
                req.session.username = user.name;
                res.redirect("/home");
            }
        }
    });
    //
    // if (usrObj) {
    //     req.session.uid = user.id;
    //     req.session.user = req.body.username;
    //     console.log(req.session.user + "-=-=-=-=-=");
    //     res.redirect('/');
    // } else {
    //     res.error("登录失败");
    //     res.redirect('back');
    // }
}

module.exports = login;


