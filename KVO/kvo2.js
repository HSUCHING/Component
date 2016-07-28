/**
 * Created by chinghsu on 16/7/27.
 */
Object.prototype.set = function (key, value) {
    this[key] = value;
    var listeners = this.getListener(key);

    for (var index = 0; index < listeners.length; index++) {
        listeners[index].call(this, value, key);
    }
};

Object.prototype.observe = function (attr, fn) {
    if (!this['_kvo_' + attr]) {
        this['_kvo_' + attr] = [];
        Object.defineProperties(this, {
            attr: {
                set: function (obj) {
                    var listeners = this.getListener(key);
                    for (var index = 0; index < listeners.length; index++) {
                        listeners[index].call(this, obj, attr);
                    }
                },
                get: function () {

                }
            }
        });
    }
    if (this['_kvo_' + attr].indexOf(fn) == -1) {
        this['_kvo_' + attr].push(fn);
    }
};


function Map(location) {
    this.location = location;
}

Map.prototype.updateView = function (newLocation) {
    console.log("update");
};


Object.prototype.getListener = function (key) {

    return this['_kvo_' + key];

};

var map = new Map("Beijin");
map.observe("location", map.updateView);
map.observe("location", map.updateView);
map.set("location", "Shanghai");