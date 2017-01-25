/**
 * Created by chinghsu on 16/11/16.
 */
function logout(req, res, next) {

    // var usrObj=user.authenticate(req.body.userName,req.body.password);
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
    req.session.destroy(function (err) {
        if (err) throw err;
        res.redirect('/');
    });
}

module.exports = logout;