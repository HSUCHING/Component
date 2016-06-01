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