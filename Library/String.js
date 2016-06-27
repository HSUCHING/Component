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


!String.prototype.hasOwnProperty("flatten") && (String.prototype.flatten = function (arr1, arr2) {

    //数组合并

    if (arguments == 1) {
        arr1 = Array.prototype.concat.apply([], arr1);
        return arr1.some(Array.isArray) ? flatten(arr1) : arr1;
    } else if (arguments == 2) {
        var result = [];
        var arr = [];

        arr = arr2.reduce(function (prev, curr) {
            prev.push(curr);
            return prev;
        }, arr1);

        for (var i = 0; i < arr.length; i++) {
            var index = arr[i];
            if (result.indexOf(index) === -1) {
                result.push(index);
            }
        }
        return result;
    }

});


!String.prototype.hasOwnProperty("findLongestWord") && (String.prototype.findLongestWord = function () {

    //数组合并

    var strSplit = this.split(' ');

    // 得到数组 strSplit = ["May", "the", "force", "be", "with", "you"];

    // 第2步使用reduce方法，取到strSplit数组中最长的元素
    var longestWord = strSplit.reduce(function (longest, currentWord) {
        return currentWord.length > longest.length ? currentWord : longest;
    }, "");
    // 取到最长的元素longestWord = "force"
    /*
     * strSplit = ["May", "the", "force", "be", "with", "you"];
     * currentWord   longest   currentWord.length   longest.length   currentWord.length > longest.length  longestWord
     *  "May"         ""            3                   0                  yes                               "May"
     *  "the"         "May"         3                   3                  no                                "May"
     *  "force"       "May"         5                   3                  yes                               "force"
     *  "be"          "force"       2                   5                  no                                "force"
     *  "with"        "force"       4                   5                  no                                "force"
     *  "you"         "force"       3                   5                  no                                "force"
     */

    // 第3步. 返回longestWord的length
    return longestWord.length; // 5
    // longestWord.length => "force".length => 5

});

!String.prototype.hasOwnProperty("end") && (String.prototype.end = function (target) {

    //数组合并

    var endingPart = this.substr(-target.length);
    return target === endingPart;

});


!String.prototype.hasOwnProperty("repeat") && (String.prototype.repeat = function (num) {

    // num = Number(num);
    // var str=this;
    //
    // var result = '';
    // while (true) {
    //     if (num & 1) { // (1)
    //         result += str;
    //     }
    //     num >>>= 1; // (2)
    //     if (num <= 0) {break;}
    //     str += str;
    // }
    // return result;
    var str=this;
    return (num < 0) ? "" : new Array(num + 1).join(str);


});



