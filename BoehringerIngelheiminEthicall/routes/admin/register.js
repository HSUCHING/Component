/**
 * Created by chinghsu on 16/11/16.
 */
var User = require('./user');


function register(req, res, next) {

    // if(req.body.username!=""&&req.body.password!=""){
    //     // user.register(req,res,next);
    //     User.getByName()
    //
    // }else{
    //     res.redirect("back");
    // }
    var data = req.body.user;
    User.getByName(data.name, function (err, user) {
        if (err) return next(err);
        if (user.id) {
            // res.error("Username already taken!");
            res.redirect('back');
        } else {
            var user=new User({
                username:data.name,
                password:data.psw
            });
            user.register(function(err){
                if(err) return next(err);
                req.session.username = data.name;
                res.redirect('/');
            });
        }
    });


}

module.exports = register;