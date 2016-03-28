/**
 * Created by Hsuching on 16/3/27.
 */
var carouselStack=document.querySelector("#wrapped");
var series=Array.prototype.slice.call(carouselStack.children);
var dataIndex=1;

document.querySelector("button").onclick=function(){
    series[1].innerHTML=arrayData[dataIndex%4];
    dataIndex++;
    series[0].style.left="-200%";
    // series[1].classList.add("active");
    // series[0].style.opacity=0;
    // series[0].style.visibility="hidden";
    var st= setTimeout(function(){
        series[1].classList.add("active");
        series.push(series.shift());
        for(var zIndex in series){
            series[zIndex].style.zIndex=3-zIndex;
            // series[zIndex].style.opacity=1;
            // series[zIndex].style.visibility="visible";
        }
        series[series.length-1].style.left="0%";
        series[series.length-1].classList.remove("active");
        // series[series.length-1].style.opacity=1;
        clearTimeout(st);
    },500);


};




var arrayData=["aa","bb","cc","dd"];

document.querySelector("#item1").innerHTML=arrayData[0];