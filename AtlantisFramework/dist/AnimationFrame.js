/**
 * Created by chinghsu on 16/5/28.
 */
var AnimationFrame = MUSE.AnimationFrame = {},
    IDGenerator = MUSE.IDGenerator,
    ids = {};

if (!('requestAnimationFrame' in window)) {

    window.requestAnimationFrame = window.webkitRequestAnimationFrame;
    window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
};

AnimationFrame.stop = function(id) {

    cancelAnimationFrame(ids[id]);

    delete ids[id];
}

AnimationFrame.run = function(func, scope) {

    func = scope ? func.bind(scope) : func;

    var onAnimationFrameEvent = function() {

        var self = arguments.callee,
            id = self.$id;

        if (func() !== false) {

            ids[id] = requestAnimationFrame(self);
        }
        else {

            AnimationFrame.stop(id);
        }
    }

    var id;

    ids[id = onAnimationFrameEvent.$id = IDGenerator.id()] = requestAnimationFrame(onAnimationFrameEvent);

    return id;
}
