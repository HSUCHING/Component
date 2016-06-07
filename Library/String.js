/**
 * Created by chinghsu on 16/6/1.
 *
 * String Extension
 */



!String.prototype.hasOwnProperty("titleCase") && (String.prototype.titleCase = function () {
    var str = this;


    // return str.replace(/\w\S*/g, function (word) {
    //     return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    // });
    //
    // //ES6
    // return str.toLowerCase().replace(/( |^)[a-z]/g, (L) = > L.toUpperCase());


    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');


});


!String.prototype.hasOwnProperty("reverse") && (String.prototype.reverse = function () {
    var str = this;
    // return str.split("").reverse().join("");
    return str && this.reverse(str.substr(1)) + str[0];


    return [].reduceRight.call(str, function (prev, curr) {
        return prev + curr;
    }, '');

    //ES6
    // const reverse = str =>
    // str && reverse(str.substr(1)) + str[0];

    // if (str.length < 2) {
    //     return str;
    // }
    // var halfIndex = Math.ceil(str.length / 2);
    // return str.substr(halfIndex).reverse() + str.substr(0, halfIndex).reverse();

});


!String.prototype.hasOwnProperty("palindrome") && (String.prototype.palindrome = function () {
//     \W删除所有非常字母数字字符：
//
//     \W匹配一个非单字字符
//     等价于[^A-Za-z0-9_]
//     那么\W的意思就是：
//
// [^A-Z]匹配非26个大写字母中的任意一个
//         [^a-z]匹配非26个小写字母中的任意一个
//         [^0-9]匹配非0到9中的任意一个数字
//         [^_]匹配非下划线

    return this.replace(/[\W_]/g, '').toLowerCase() ===
        this.replace(/[\W_]/g, '').toLowerCase().split('').reverse().join('');


});
