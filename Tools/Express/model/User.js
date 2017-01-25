/**
 * Created by chinghsu on 16/11/14.
 */

function User(username, userage) {
    this.username = username;
    this.userage = userage;
}
User.prototype.say = function () {
    return this.username + this.userage;
};
var userName = "demo";
exports.User = function () {
    return new User('demo', 1111);
};
exports.demoUsername = function () {
    return userName;
};
exports.Usermodel = User;

exports.userModel=function(req,res) {

    var model=new User('Hsuching',false);

    res.json(model);

};
