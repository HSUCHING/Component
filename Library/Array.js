/**
 * Created by chinghsu on 16/5/31.
 */


!Array.prototype.hasOwnProperty("bouncer") && (Array.prototype.bouncer = function () {
    // console.log(Boolean(0));        // false
    // console.log(Boolean(-0));       // false
    // console.log(Boolean('0'));      // true
    // console.log(Boolean(false));    // false
    // console.log(Boolean('false'));  // true
    // console.log(Boolean(true));     // true
    // console.log(Boolean('true'));   // true
    // console.log(Boolean(null));     // false
    // console.log(Boolean(NaN));      // false
    // console.log(Boolean(undefined));// false
    // console.log(Boolean(''));       // false
    // console.log(Boolean(1));        // true
    // console.log(Boolean(-1));       // true
    // console.log(Boolean(3));        // true
    // console.log(Boolean("w3cplus"));// true

    // 在JavaScript中，下列值总是falsy:
    //
    // false
    // null
    // undefined
    // NaN
    // 0
    // " "(空字符串)

    var arr = this;

    function isFalsy(value) {
        return Boolean(value);
    }

    var result = arr.filter(isFalsy);


    // var index = -1,
    //     len = arr ? arr.length : 0,
    //     resIndex = -1,
    //     result = [];
    //
    // while (++index < len) {
    //     var value = arr[index];
    //
    //     if (value) {
    //         result[++resIndex] = value;
    //     }
    // }


    return result;
});


!Array.prototype.hasOwnProperty("chunk") && (Array.prototype.chunk = function (size) {


    var tempArr = [],
        newArr = [],
        arr = this,
        i = 0,
        len = arr.length;


    while (i < len) {
        tempArr = arr.slice(i, i += size);
        newArr.push(tempArr);

    }


    // var newArr = [];
    //
    // for (var i = 0; i < arr.length; i++) {
    //     if (i % size === 0) {
    //         newArr.unshift([]);
    //     }
    //     newArr[0].push(arr[i]);
    // }

    return newArr;
});


!Array.prototype.hasOwnProperty("where") && (Array.prototype.where = function (num) {
    var arr = this;
    arr.push(num);
    var compare = function (a, b) {
        if (a < b) {
            return -1; // a排在b的前面
        } else if (a > b) {
            return 1; // a排在b的后面
        } else {
            return 0; // a和b的位置保持不变
        }
    };
    arr.sort(compare);


    return arr.indexOf(num);
});

!Array.prototype.hasOwnProperty("destroyer") && (Array.prototype.destroyer = function (arr) {
    var newArray = this; // [1, 2, 1, 3, 2, 1, 3, 4, 2, 6]
    // 声明一个空数组，用来存储需要从`newArray`中删除的元素
    var removeArgs = Array.prototype.slice.call(arguments);

    // 声明filter()方法的callback函数

    function isFalse (value) {
        return removeArgs.indexOf(value) === -1;

        /*
         *  removeArgs = [1,2]
         *  removeArgs.indexOf(value) = ?  removeArgs.indexOf(value) === -1
         *  [1,2].indexOf(1) = 0              false
         *  [1,2].indexOf(2) = 1              false
         *
         */
    }

    return newArray.filter(isFalse);// newArray中删除1,2
});




