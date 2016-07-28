/**
 * Created by chinghsu on 16/7/27.
 */
Object.prototype.set = function (key, value) {
    this[key] = value;
    var listeners = this.constructor.getListener(key);

    for (var listener in listeners) {

        listeners[listener].call(this, value, key);
    }
};

Function.prototype.observer = function (attr) {

    if (!this.observers) {

        this.observers = [];//用于存储该方法监听的属性

    }

    this.observers.push(attr);

    return this;

};

Object.extend = function (ext) {

    var newc = function (ext) {

    };

    for (var prop in ext) {

        if (ext[prop] instanceof Function) {

            if (ext[prop].observers) {

                for (var observer in ext[prop].observers) {

                    newc['_kvo_' + ext[prop].observers[observer]] = newc ['_kvo_' + ext[prop].observers[observer]] || [];

                    newc ['_kvo_' + ext[prop].observers[observer]].push(ext[prop]);

                }

            }

        }

    }
    return newc;
};


var Map = Object.extend({

    location: '',

    updateView: function (newLocation) {
        console.log("update");

    }.observer('location')

});


// function Map(location) {
//     this.location = location;
// }
//
// Map.prototype.updateView = function (newLocation) {
//     console.log("update");
// };



Function.prototype.getListener = function (key) {

    return this['_kvo_' + key];

};

// Map.prototype.updateView.observer("location");

var map = new Map("Beijin");
map.set("location", "Shanghai");