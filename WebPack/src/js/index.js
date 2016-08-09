/**
 * Created by chinghsu on 16/8/9.
 */
require("../css/style.css");
document.write(require("./content.js"));
var date="2016-08-09 02:19:07";
var date = new Date(date);
var offset = new Date().getTimezoneOffset()* 60 * 1000;
var GMTDate = new Date(date - offset);
document.querySelector('#date').innerHTML = GMTDate;