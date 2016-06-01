/**
 * Created by chinghsu on 16/4/29.
 */
(function (window) {

    'use strict';

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

    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }


    function _init() {
        var style = this._options.style;
        var gallery = this._options.image;
        var loop_index = 1;

        this._targetElement.dataset.pos = 1;
        var ulEl = document.createElement('ul');
        for (var i = 0; i < gallery.length; i++) {
            var liEl = document.createElement('li');
            liEl.className = "bli";
            var aEl = document.createElement('a');
            aEl.href = "#";
            aEl.target = "_blank";
            var imgEl = document.createElement('img');
            imgEl.src = gallery[i];
            aEl.appendChild(imgEl);
            liEl.appendChild(aEl);
            ulEl.appendChild(liEl);
            StyleHelpers.applyElementStyle(liEl, {"left": i * 100 + "%"});
        }
        this._targetElement.appendChild(ulEl);

        var indicatorEl = document.createElement('div');
        indicatorEl.className = "slider_dots";
        var indicatoraEl = document.createElement('a');
        indicatoraEl.href = "#";
        indicatoraEl.className = "slider_indicator";
        indicatorEl.appendChild(indicatoraEl);
        for (var j = 0; j < gallery.length; j++) {
            var aEl = document.createElement('a');
            aEl.href = "#";
            aEl.className = "slider_dot";
            aEl.dataset.pos = j;
            indicatorEl.appendChild(aEl);
        }
        this._targetElement.appendChild(indicatorEl);

        var self = this;
        StyleHelpers.applyElementStyle(indicatoraEl, {
            left: 0 * 100 / self._options.image.length + "%",
            right: (self._options.image.length - 1) * 100 / self._options.image.length + "%"
        });
        function loop() {
            if (loop_index == 0) {
                indicatoraEl.classList.add("left");
            } else {
                indicatoraEl.classList.remove("left");
            }
            StyleHelpers.applyElementStyle(indicatoraEl, {
                left: self._targetElement.dataset.pos * 100 / self._options.image.length + "%",
                right: (self._options.image.length - self._targetElement.dataset.pos - 1) * 100 / self._options.image.length + "%"
            });
            StyleHelpers.applyTransformStyle(ulEl, "translateX(" + -(loop_index++) * 100 + "%" + ")");
            self._targetElement.dataset.pos = loop_index;
            if (loop_index >= self._options.image.length) {
                loop_index = 0;
                self._targetElement.dataset.pos = 0;
            }
            setTimeout(loop, 5000);
        }

        setTimeout(loop, 5000);

    }

    function ETBanner(obj, options) {
        if (typeof (obj) === 'string') {
            this._targetElement = document.querySelector(obj);
        }
        this._options = {
            style: "basic",
            image: [],
            auto: true,
            indicator: true,
            e: {}
        };
        extend(this._options, options);

        _init.call(this);
    }


    ETBanner.prototype = {}

    window.ETBanner = ETBanner;
})(window);


var banner = new ETBanner(".banner", {
    image: ["http://mrain.qiniudn.com/banner.jpg",
        "http://mrain.qiniudn.com/banner.jpg",
        "http://mrain.qiniudn.com/banner.jpg",
        "http://mrain.qiniudn.com/banner.jpg"
    ],
    auto: true
});