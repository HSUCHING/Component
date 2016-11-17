/**
 * Created by chinghsu on 16/11/16.
 */

/* GET users listing. */
function authentication(req, res, next) {
    // if (!req.session.user) {
    //     return res.redirect('/register');
    // }else{
    //
    // }
    if(req.session.username != null){
        console.log(req.session.username);
    } else{
        console.log("session为空");
    }
    console.log("hello");
    next();
}

module.exports = authentication;