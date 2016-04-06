/**
 * Created by chinghsu on 16/4/6.
 */

var removeBt = document.querySelector("#remove");
var reader = new FileReader();
var dropimg = document.querySelector(".image_preview");
var inputFile=document.querySelector("#inputFile");

function upload(e) {
    var fileData = this.files[0];
    reader.readAsDataURL(fileData);
}

removeBt.addEventListener("click", function (e) {
    removeBt.classList.remove("show");
    dropimg.style.backgroundImage = "none";
    inputFile.value=null;
    e.stopPropagation();
    e.preventDefault();
});

reader.onload = function (event) {
    if (event.target.result) {
        removeBt.classList.add("show");
        dropimg.style.backgroundImage = "url(" + event.target.result + ")";
    }
    event.stopPropagation();
};

inputFile.addEventListener("change", upload);