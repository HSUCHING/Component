/**
 * Created by Hsuching on 16/7/17.
 */
var cursor = {
    //滑动单元起始终止位置
    current: {
        start: 0,
        end: -1
    },
    //每个数据单元的跨度
    position: [],
    //滑动位置
    scrollPosition: {
        y:0,
        x:0
    }
};
var number = 50;
var sectionEl = document.querySelector(".section");
var initialPosition = {
    x: sectionEl.offsetWidth,
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

function calculate() {

    return 20;
}

function calItemsIndex(index, num) {
    return index >= 0 ? (index % num) : ((num - 1) - (~index % num));
}


setTimeout(loadData(calculate()), 100);


function loadData(num, param) {
    var fillItemsNumber = num;
    for (var j = 0; j < fillItemsNumber; j++) {
        var lastTop = 0;
        if (cursor.current.end != -1) {
            lastTop = cursor.position.reduce(function (a, b) {
                return a + b;
            });
        }
        cursor.current.end++;
        var el = els[cursor.current.end % number];
        el.classList.add("active");
        el.innerHTML = data[cursor.current.end];
        el.style.transitionDelay = (j) * 0.3 + "s";
        el.style.top = lastTop + "px";
        cursor.position.push(els[cursor.current.end % number].offsetHeight);
    }
}

function isDataThreshold(scroll, cursor) {
    var fillItemsNumber = calculate();
    var topThreshold = 0;
    var height = cursor.position.reduce(function (a, b) {
        return a + b;
    });
    cursor.position.reduce(function (a, b) {
        if (a >= 0.7 * height) {
            topThreshold = a + b;
            return false;
        } else {
            return a + b;
        }
    });
    if ((scroll.offset.y < (-1) * topThreshold)) {
        return true
    } else {
        return false;
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
            cursor.scrollPosition.y+=diff;
            var param = {
                offset: {
                    y: cursor.scrollPosition.y
                }
            };
            refresh(param);
            _scroll(scrollSection.querySelectorAll("*>figure.active"), param);

        };
        addEventListeners(scrollMask, "mousemove touchmove", scrollMoveCallback);
    });

    function touchendCallback(e) {
        e.preventDefault();
        e.stopPropagation();
        removeEventListeners(scrollMask, "mousemove touchmove", scrollMoveCallback);
        var param = {};
        if (cursor.scrollPosition.y >= 0) {
            cursor.scrollPosition.y = 0;
            param = {
                offset: {
                    y: cursor.scrollPosition.y
                }
            };
            param.back = true;
            refresh(param);
            _scroll(scrollSection.querySelectorAll("*>figure.active"), param);
        }

    }

    addEventListeners(scrollMask, "mouseup touchend", function (e) {
        touchendCallback(e);
    });

}

function _scroll(els, param) {
    var fillItemsNumber = els.length;
    for (var i = 0; i < fillItemsNumber; i++) {
        if (param.back) {
            StyleHelpers.applyElementStyle(els[i], {
                transition: "transform 400ms ease"
            });
        } else {
            StyleHelpers.applyElementStyle(els[i], {
                transition: "transform 100ms ease"
            });
        }

        StyleHelpers.applyTransformStyle(els[i], "translateY(" + param.offset.y + "px)");
    }
}


function refresh(param) {
    // var fillItemsNumber = calculate();
    var scrollSection = document.querySelector(".section");
    if (isDataThreshold(param, cursor)) {
        recycle();
        refreshData();
        // _scroll(scrollSection.querySelectorAll("*>figure.active"), param);
    } else {

    }

}

function recycle() {
    // cursor.current.start=;
}


function refreshData() {

    // cursor.current.end =;
    loadData(10);
}





