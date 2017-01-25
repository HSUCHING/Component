/**
 * Created by chinghsu on 16/11/16.
 */

/* GET users listing. */
function authentication(req, res, next) {

    if (req.session.username || req.path == '/admin' || req.path == '/admin/register' || req.path == '/admin/login' || req.path == '/admin/modify' || /^\/source\//.test(req.path)) {
        // res.redirect("/home");
        console.log(req.path);
        next();
    } else {
        res.redirect("/admin");
    }
}

module.exports = authentication;