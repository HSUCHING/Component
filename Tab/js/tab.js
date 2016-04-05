/**
 * Created by chinghsu on 16/4/5.
 */
var radios=document.querySelectorAll("input.tab");
for(var i=0;i<radios.length;i++){
    radios[i].addEventListener("click",radioSelect);
}

function radioSelect(e){
    console.log(e);
}