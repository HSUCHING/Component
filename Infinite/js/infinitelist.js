/**
 * Created by Hsuching on 16/7/17.
 */
var cursor = {
    current: 0,
    position: []
};
var number = 50;
var sectionEl = document.querySelector(".section");
var initialPosition = {
    x: sectionEl.offsetWdith,
    y: sectionEl.offsetHeight
};

for (var i = 0; i < number; i++) {
    var elFg = document.createElement("figure");
    elFg.classList.add("listItem");
    var el = document.createElement("div");
    el.classList.add("item");
    elFg.appendChild(el);
    sectionEl.appendChild(elFg);
    elFg.style.top = initialPosition.y + "px";
}
//var data = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
var data = [];
for (var k = 1; k <= 1000; k++) {
    data.push("Data:" + k);
}

var els = sectionEl.querySelectorAll(".listItem");

setTimeout(loadData, 100);
function loadData() {
    for (var j = 0; j < 10; j++) {
        var lastTop = 0;
        if (cursor.current) {
            lastTop = cursor.position.reduce(function (a, b) {
                return a + b;
            });
        }
        var el = els[j];
        el.innerHTML = data[j];
        el.style.transitionDelay = (j) * 0.3 + "s";
        el.style.top = lastTop + "px";
        cursor.position.push(els[cursor.current].offsetHeight);
        cursor.current++;
    }
}


function splitStr(str) {
    return str.trim().split(/\s+/g);
}

function addEventListeners(target, types, handler) {
    for (var event in splitStr(types)) {
        target.addEventListener(splitStr(types)[event], handler, false);
    }
}


function removeEventListeners(target, types, handler) {
    for (var event in splitStr(types)) {
        target.removeEventListener(splitStr(types)[event], handler, false);
    }
}

if (!window.StyleHelpers) {
    var StyleHelpers = (function () {
        var applyElementStyle = function (element, styleObj) {
                Object.keys(styleObj).forEach(function (key) {
                    if (element.style[key] != styleObj[key]) {
                        element.style[key] = styleObj[key];
                    }
                })
            },

            applyTransformStyle = function (element, transformValue) {
                var styleObject = {};
                ['webkit', ''].forEach(function (prefix) {
                        styleObject[prefix + 'Transform'] = transformValue;
                    }
                );
                applyElementStyle(element, styleObject);
            };

        return {
            applyElementStyle: applyElementStyle,
            applyTransformStyle: applyTransformStyle
        }
    })();
    window.StyleHelpers = StyleHelpers;
}

_update();

function _update() {

    var move, diff, scrollMoveCallback;
    var scrollMask = document.querySelector(".scrollMask");
    var scrollSection = document.querySelector(".section");
    var currentPosition = {
        y: 0
    };
    var st;
    var moveStart = false;

    addEventListeners(scrollMask, "mousedown touchstart", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var startY = e.pageY || e.touches[0].pageY,
            winW = this.offsetWidth;
        diff = 0;
        move = false;
        var direction;
        moveStart = false;
        scrollMoveCallback = function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!moveStart) {
                moveStart = true;
            }
            move = true;
            var y = e.pageY || e.touches[0].pageY;
            diff = (y - startY);
            startY = y;
            direction = (diff <= 0) ? 1 : -1;
            currentPosition.y += diff;
            var param = {
                diff: currentPosition.y
            };
            _scrollRefreshData(scrollSection.children, param);

        };
        addEventListeners(scrollMask, "mousemove touchmove", scrollMoveCallback);
    });

    function touchendCallback(e) {
        e.preventDefault();
        e.stopPropagation();
        removeEventListeners(scrollMask, "mousemove touchmove", scrollMoveCallback);
        var param = {};
        if (currentPosition.y >= 0) {
            param.diff = 0;
            currentPosition.y = 0;
            param.back = true;
            _scrollRefreshData(scrollSection.children, param);
        }

    }

    addEventListeners(scrollMask, "mouseup touchend", function (e) {
        touchendCallback(e);
    });

}

function _scrollRefreshData(els, param) {
    for (var i = 0; i < 10; i++) {
        if (param.back) {
            StyleHelpers.applyElementStyle(els[i], {
                transition: "transform 400ms ease"
            });
        } else {
            StyleHelpers.applyElementStyle(els[i], {
                transition: ""
            });
        }

        StyleHelpers.applyTransformStyle(els[i], "translateY(" + param.diff + "px)");
    }
}








