/**
 * Created by chinghsu on 16/11/21.
 */
var user = require('./../../models/user');

function modify(req, res, next) {
    var data = req.body.user;
    user.authenticate(data.name, data.psw, function (err, user) {
        if (err) {
            res.sendStatus(404);
        } else {
            if (!user) {
                //用户名不对与密码不符,不能修改账号
                // res.redirect("/admin/modify");
                res.json({
                    status:"error",
                    msg:"密码输入不对!"
                });
            } else {
                var updateData = {
                    newPsw: data.newPsw
                };
                user.modify(updateData, function (err) {
                    if (err) {
                        // res.sendStatus(404);
                        res.json({
                            status:"error",
                            msg:"密码修改失败!"
                        });
                    } else {
                        req.session.username = user.name;
                        // res.redirect("/home");
                        res.json({
                            status:"Success",
                            msg:"密码修改成功!"
                        });
                    }
                });

            }
        }
    });

}

module.exports = modify;