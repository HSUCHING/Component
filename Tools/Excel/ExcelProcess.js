/**
 * Created by chinghsu on 16/11/8.
 */
var xlsx = require("node-xlsx");
var list = xlsx.parse("./data/data.xlsx");
console.log(list);

for(var index in list){
    if(index==2){
        console.log(list[index].data);
    }
}