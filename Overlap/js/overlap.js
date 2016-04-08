/**
 * Created by chinghsu on 16/4/8.
 */
document.querySelector("#showoverlay").addEventListener("touchstart", function (e) {
    document.querySelector(".overlay").classList.add("open");
    e.stopPropagation();

});
document.querySelector("#close").addEventListener("touchstart", function (e) {
    document.querySelector(".overlay").classList.remove("open");
    e.stopPropagation();

});


