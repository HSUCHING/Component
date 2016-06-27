/**
 * Created by chinghsu on 16/5/31.
 */

// Mutations 对一个包含两个元素的数组，检测数组中的第二个元素的所有字母是否都在第一个元素中出现过，如果出现过，返回的是true，否则返回的是false。(其中忽略大小写)
//
// 简单分解一下：
//
// 将目标字符串(数组中的第一个元素arr[0])和测试字符串(数组中的第二个元素arr[1])转换为小写字符串(通过toLowerCase())
// 将数组中的两个元素分别转换为数组(通过split())
// 使用for循环将测试字符串每个字符传入到目标字符串中搜索(通过indexOf())
// 如果搜索传回值为负数，也就是indexOf()传来的值为-1，则返回false，也就是说测试字符串在目标字符串中没有匹配的字符串
// 若全部字符串匹配(indexOf()的值大于或等于0)，返回true

!Utility.muation && (Utility.mutation = function (arr) {
    var baseStr = arr[0].toLowerCase().split('');
    var testStr = arr[1].toLowerCase().split('');

    /*
     * arr = ["Hello","hey"]
     * arr[0].toLowerCase().split('') => ["H", "e", "l", "l", "o"]
     * arr[1].toLowerCase().split('') => ["h", "e", "y"]
     * len = arr[1].length = 3
     */
    for (var i = 0, len = testStr.length; i < len; i++) {
        var temp = baseStr.indexOf(testStr[i]);
        /*
         *  遍历次数  i=? i<len  testStr[i]   baseStr.indexOf(testStr[i])
         *  1st      0    yes    "h"            0
         *  2en      1    yes    "e"            1
         *  3rd      2    yes    "y"           -1
         *  4th      3     no
         *  end loop
         */
        if (temp === -1) {
            return false;
        }
    }
    return true;
});

!Utility.factorial && (Utility.factorial = function (num) {
    // 如果num是一个小于0的整数，就会拒绝
    if (num < 0) {
        return -1;
    } else if (num === 0 || num === 1) {
        // 如果num是一个0或者1，其阶乘是1
        return 1;
    } else {
        // 调用递归
        return (num * this.factorial(num - 1));
        /*
         * 第一部分：不会只调用一次，会有多个嵌套
         * 每次调用  num === ?      num * factorial (num - 1)
         * 1st     factorial(5)    5 * factorial(5 - 1) => factorial(4)
         * 2nd     factorial(4)    4 * factorial(4 - 1) => factorial(3)
         * 3rd     factorial(3)    3 * factorial(3 - 1) => factorial(2)
         * 4th     factorial(2)    2 * factorial(2 - 1) => factorial(1)
         * 5th     factorial(1)    1 * factorial(1- 1) => factorial(0)
         * 第二部分： 如果条件符合，数字num本身乘于1 => num * 1,
         * 并且函数将返回总的积
         * 5th => 5 * (5 - 1) => num = 5 * 4 = 20
         * 4th => 20 * (4 - 1) => num = 20 * 3 = 60
         * 3rd => 60 * (3 - 1) => num = 60 * 2 = 120
         * 2nd => 120 * (2 - 1) => num = 120 * 1 = 120
         * 1st => 120 => num = 120
         * 将上面的过程写成一行：(5*(5-1)*(4-1)*(3-1)*(2-1))=5*4*3*2*1=120
         */
    }

    // function factorial (num) {
    //     // 第一步：创建一个变量result来存储num结果
    //     var result = num;
    //     // 如果num 小于 0, 就会拒绝
    //     if (num < 0) {
    //         return -1;
    //     } else if (num === 0 || num === 1) {
    //         // 如果num = 0 或者 num = 1，factorial将返回1
    //         return 1;
    //     } else {
    //         // 创建一个while循环
    //         while (num > 1) {
    //             // 每次迭代num 自减1
    //             num--;
    //             result *= num;
    //
    //             /*
    //              * 迭代次数     num  num--  result   result *= num
    //              * 1st          5    4       5        20 = 5 * 4
    //              * 2nd          4    3      20        60 = 20 * 3
    //              * 3rd          3    2      60        120 = 60 * 2
    //              * 4th          2    1      120       120 = 120 * 1
    //              * 5th          1    0      120
    //              * 结束遍历
    //              */
    //         }
    //     }
    //     // 返回factorial最终乘积
    //     return result;
    // }
    //
    // function factorial ( num ) {
    //     // 如果 num 小于 0，factorial将终止
    //     if (num < 0) {
    //         return -1;
    //     } else if (num === 0 || num === 1) {
    //         // 如果num = 0 或 num = 1，factorial将返回1
    //         return 1;
    //     } else {
    //         // 开始for 循环，每次遍历减1
    //         for (var i = num - 1; i >= 1; i--) {
    //             num *= i;
    //
    //             /*
    //              *  遍历次数  num   i = num - 1   num *= i       i--  i>= 1?
    //              *  1st       5    4 = 5 - 1     20 = 5 * 4      3    yes
    //              *  2nd      20    3 = 4 - 1     60 = 20 * 3     2    yes
    //              *  3rd      60    2 = 3 - 1     120 = 60 * 2    1    yes
    //              *  4th     120    1 = 2 - 1     120 =  120 * 1  0    no
    //              *  5th     120    0             120
    //              * 结束for循环
    //              */
    //         }
    //
    //     }
    //     return num;
    // }

});


!Utility.addCommas && (Utility.addCommas = function (val) {
    var aIntNum = val.toString().split('.');
    if (aIntNum[0].length >= 5) {
        aIntNum[0] = aIntNum[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (aIntNum[1] && aIntNum[1].length >= 5) {
        aIntNum[1] = aIntNum[1].replace(/(\d{3})/g, '$1 ');
    }
    return aIntNum.join('.');
});


!Utility.falsy && (Utility.falsy = function (value) {
    // if (value) {
    //     return true;
    // }
    //
    // if (value === false || value === null || value === 0 || value === "" || value === undefined || isNaN(value)) {
    //     return false;
    // } else {
    //     return true;
    // }

    return Boolean(value);
});

!Utility.isLetter && (Utility.isLetter = function (letter) {

    if ((letter >= 65 && letter <= 90) || (letter >= 97 && letter <= 122)) {
        return true;
    } else {
        return false;
    }

});

!Utility.rot13 && (Utility.rot13 = function (str) {
    return str.replace( /[A-Za-z]/g , function(c) {
        return String.fromCharCode( c.charCodeAt(0) + ( c.toUpperCase() <= "M" ? 13 : -13 ) );
    } );

});