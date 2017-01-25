/**
 * Created by chinghsu on 16/11/8.
 */
// if(typeof require !== 'undefined') XLSX = require('xlsx');
// var workbook = XLSX.readFile('data/data2.csv');
// var first_sheet_name = workbook.SheetNames[2];
// var address_of_cell = 'A2';
//
// /* Get worksheet */
// var worksheet = workbook.Sheets[first_sheet_name];
// // console.log(worksheet['!cols']);
// // var desired_cell = worksheet[address_of_cell];
// var sheet_name_list = workbook.SheetNames;
//
// sheet_name_list.forEach(function(y,index) { /* iterate through sheets */
//     if(index==2) {
//         var worksheet = workbook.Sheets[y];
//         for (z in worksheet) {
//             // console.log(worksheet);
//             /* all keys that do not begin with "!" correspond to cell addresses */
//             // if(z[0] === '!') continue;
//             // console.log(worksheet[z].w);
//             // console.log(y + "!" + z + "=" + JSON.stringify(worksheet[z].v));
//         }
//     }
// });

// var Excel = require('exceljs');
// var workbook = new Excel.Workbook();
// var options = {
//     map: function(value, index) {
//         switch(index) {
//             case 0:
//                 // column 1 is string
//                 return value;
//             case 1:
//                 // column 2 is a date
//                 return new Date(value);
//             case 2:
//                 // column 3 is JSON of a formula value
//                 return JSON.parse(value);
//             default:
//                 // the rest are numbers
//                 return parseFloat(value);
//         }
//     }
// };
// workbook.csv.readFile("data/data2.csv")
//     .then(function(worksheet) {
//         // use workbook or worksheet
//         // var lk=worksheet.getColumn(1)._worksheet._rows[0];
//         console.log(worksheet.lastRow);
//     });

// var convertExcel = require('excel-as-json').processFile;
//
// convertExcel("data/data.xlsx","data.json");
var csv = require('csv-parser')
var fs = require('fs')

fs.createReadStream('data/data2.csv')
    .pipe(csv())
    .on('data', function (data) {
        console.log(data);
    });