/**
 * Created by chinghsu on 16/2/22.
 */
/**
 * Created by chinghsu on 16/2/20.
 */
(function (t) {
	"use strict";
	function e(t) {
		return RegExp("(^|\\s+)" + t + "(\\s+|$)")
	}

	function n(t, e) {
		var n = i(t, e) ? r : o;
		n(t, e)
	}

	var i, o, r;
	"classList"in document.documentElement ? (i = function (t, e) {
		return t.classList.contains(e)
	}, o = function (t, e) {
		t.classList.add(e)
	}, r = function (t, e) {
		t.classList.remove(e)
	}) : (i = function (t, n) {
		return e(n).test(t.className)
	}, o = function (t, e) {
		i(t, e) || (t.className = t.className + " " + e)
	}, r = function (t, n) {
		t.className = t.className.replace(e(n), " ")
	});
	var s = {hasClass: i, addClass: o, removeClass: r, toggleClass: n, has: i, add: o, remove: r, toggle: n};
	"function" == typeof define && define.amd ? define(s) : t.classie = s
})(window), function (t) {
	"use strict";
	var e = document.documentElement, n = function () {
	};
	e.addEventListener ? n = function (t, e, n) {
		t.addEventListener(e, n, !1)
	} : e.attachEvent && (n = function (e, n, i) {
		e[n + i] = i.handleEvent ? function () {
			var e = t.event;
			e.target = e.target || e.srcElement, i.handleEvent.call(i, e)
		} : function () {
			var n = t.event;
			n.target = n.target || n.srcElement, i.call(e, n)
		}, e.attachEvent("on" + n, e[n + i])
	});
	var i = function () {
	};
	e.removeEventListener ? i = function (t, e, n) {
		t.removeEventListener(e, n, !1)
	} : e.detachEvent && (i = function (t, e, n) {
		t.detachEvent("on" + e, t[e + n]);
		try {
			delete t[e + n]
		} catch (i) {
			t[e + n] = void 0
		}
	});
	var o = {bind: n, unbind: i};
	"function" == typeof define && define.amd ? define(o) : t.eventie = o
}(this), function () {
	"use strict";
	function t() {
	}

	function e(t, e) {
		for (var n = t.length; n--;)if (t[n].listener === e)return n;
		return -1
	}

	function n(t) {
		return function () {
			return this[t].apply(this, arguments)
		}
	}

	var i = t.prototype;
	i.getListeners = function (t) {
		var e, n, i = this._getEvents();
		if ("object" == typeof t) {
			e = {};
			for (n in i)i.hasOwnProperty(n) && t.test(n) && (e[n] = i[n])
		} else e = i[t] || (i[t] = []);
		return e
	}, i.flattenListeners = function (t) {
		var e, n = [];
		for (e = 0; t.length > e; e += 1)n.push(t[e].listener);
		return n
	}, i.getListenersAsObject = function (t) {
		var e, n = this.getListeners(t);
		return n instanceof Array && (e = {}, e[t] = n), e || n
	}, i.addListener = function (t, n) {
		var i, o = this.getListenersAsObject(t), r = "object" == typeof n;
		for (i in o)o.hasOwnProperty(i) && -1 === e(o[i], n) && o[i].push(r ? n : {listener: n, once: !1});
		return this
	}, i.on = n("addListener"), i.addOnceListener = function (t, e) {
		return this.addListener(t, {listener: e, once: !0})
	}, i.once = n("addOnceListener"), i.defineEvent = function (t) {
		return this.getListeners(t), this
	}, i.defineEvents = function (t) {
		for (var e = 0; t.length > e; e += 1)this.defineEvent(t[e]);
		return this
	}, i.removeListener = function (t, n) {
		var i, o, r = this.getListenersAsObject(t);
		for (o in r)r.hasOwnProperty(o) && (i = e(r[o], n), -1 !== i && r[o].splice(i, 1));
		return this
	}, i.off = n("removeListener"), i.addListeners = function (t, e) {
		return this.manipulateListeners(!1, t, e)
	}, i.removeListeners = function (t, e) {
		return this.manipulateListeners(!0, t, e)
	}, i.manipulateListeners = function (t, e, n) {
		var i, o, r = t ? this.removeListener : this.addListener, s = t ? this.removeListeners : this.addListeners;
		if ("object" != typeof e || e instanceof RegExp)for (i = n.length; i--;)r.call(this, e, n[i]); else for (i in e)e.hasOwnProperty(i) && (o = e[i]) && ("function" == typeof o ? r.call(this, i, o) : s.call(this, i, o));
		return this
	}, i.removeEvent = function (t) {
		var e, n = typeof t, i = this._getEvents();
		if ("string" === n)delete i[t]; else if ("object" === n)for (e in i)i.hasOwnProperty(e) && t.test(e) && delete i[e]; else delete this._events;
		return this
	}, i.emitEvent = function (t, e) {
		var n, i, o, r, s = this.getListenersAsObject(t);
		for (o in s)if (s.hasOwnProperty(o))for (i = s[o].length; i--;)n = s[o][i], r = n.listener.apply(this, e || []), (r === this._getOnceReturnValue() || n.once === !0) && this.removeListener(t, n.listener);
		return this
	}, i.trigger = n("emitEvent"), i.emit = function (t) {
		var e = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(t, e)
	}, i.setOnceReturnValue = function (t) {
		return this._onceReturnValue = t, this
	}, i._getOnceReturnValue = function () {
		return this.hasOwnProperty("_onceReturnValue") ? this._onceReturnValue : !0
	}, i._getEvents = function () {
		return this._events || (this._events = {})
	}, "function" == typeof define && define.amd ? define(function () {
		return t
	}) : "object" == typeof module && module.exports ? module.exports = t : this.EventEmitter = t
}.call(this), function (t) {
	"use strict";
	function e(t) {
		if (t) {
			if ("string" == typeof i[t])return t;
			t = t.charAt(0).toUpperCase() + t.slice(1);
			for (var e, o = 0, r = n.length; r > o; o++)if (e = n[o] + t, "string" == typeof i[e])return e
		}
	}

	var n = "Webkit Moz ms Ms O".split(" "), i = document.documentElement.style;
	"function" == typeof define && define.amd ? define(function () {
		return e
	}) : t.getStyleProperty = e
}(window), function (t) {
	"use strict";
	function e(t) {
		var e = parseFloat(t), n = -1 === t.indexOf("%") && !isNaN(e);
		return n && e
	}

	function n() {
		for (var t = {
			width: 0,
			height: 0,
			innerWidth: 0,
			innerHeight: 0,
			outerWidth: 0,
			outerHeight: 0
		}, e = 0, n = s.length; n > e; e++) {
			var i = s[e];
			t[i] = 0
		}
		return t
	}

	function i(t) {
		function i(t) {
			if ("string" == typeof t && (t = document.querySelector(t)), t && "object" == typeof t && t.nodeType) {
				var i = r(t);
				if ("none" === i.display)return n();
				var h = {};
				h.width = t.offsetWidth, h.height = t.offsetHeight;
				for (var d = h.isBorderBox = !(!a || !i[a] || "border-box" !== i[a]), u = 0, c = s.length; c > u; u++) {
					var f = s[u], p = i[f], l = parseFloat(p);
					h[f] = isNaN(l) ? 0 : l
				}
				var g = h.paddingLeft + h.paddingRight, v = h.paddingTop + h.paddingBottom, m = h.marginLeft + h.marginRight, y = h.marginTop + h.marginBottom, E = h.borderLeftWidth + h.borderRightWidth, b = h.borderTopWidth + h.borderBottomWidth, x = d && o, L = e(i.width);
				L !== !1 && (h.width = L + (x ? 0 : g + E));
				var P = e(i.height);
				return P !== !1 && (h.height = P + (x ? 0 : v + b)), h.innerWidth = h.width - (g + E), h.innerHeight = h.height - (v + b), h.outerWidth = h.width + m, h.outerHeight = h.height + y, h
			}
		}

		var o, a = t("boxSizing");
		return function () {
			if (a) {
				var t = document.createElement("div");
				t.style.width = "200px", t.style.padding = "1px 2px 3px 4px", t.style.borderStyle = "solid", t.style.borderWidth = "1px 2px 3px 4px", t.style[a] = "border-box";
				var n = document.body || document.documentElement;
				n.appendChild(t);
				var i = r(t);
				o = 200 === e(i.width), n.removeChild(t)
			}
		}(), i
	}

	var o = document.defaultView, r = o && o.getComputedStyle ? function (t) {
		return o.getComputedStyle(t, null)
	} : function (t) {
		return t.currentStyle
	}, s = ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "marginLeft", "marginRight", "marginTop", "marginBottom", "borderLeftWidth", "borderRightWidth", "borderTopWidth", "borderBottomWidth"];
	"function" == typeof define && define.amd ? define(["get-style-property/get-style-property"], i) : t.getSize = i(t.getStyleProperty)
}(window), function (t) {
	"use strict";
	function e(t, e) {
		for (var n in e)t[n] = e[n];
		return t
	}

	function n() {
	}

	function i(i, o, s, d, u) {
		function f(t, n) {
			this.element = t, this.options = e({}, this.options), e(this.options, n), this._create()
		}

		function p() {
			return !1
		}

		function l(t, e) {
			t.x = void 0 !== e.pageX ? e.pageX : e.clientX, t.y = void 0 !== e.pageY ? e.pageY : e.clientY
		}

		var g = d("transform"), v = !!d("perspective");
		e(f.prototype, o.prototype), f.prototype.options = {}, f.prototype._create = function () {
			this.position = {}, this._getPosition(), this.startPoint = {x: 0, y: 0}, this.dragPoint = {
				x: 0,
				y: 0
			}, this.startPosition = e({}, this.position);
			var t = a(this.element);
			"relative" !== t.position && "absolute" !== t.position && (this.element.style.position = "relative"), this.enable(), this.setHandles()
		}, f.prototype.setHandles = function () {
			this.handles = this.options.handle ? this.element.querySelectorAll(this.options.handle) : [this.element];
			for (var t = 0, e = this.handles.length; e > t; t++) {
				var n = this.handles[t];
				s.bind(n, "mousedown", this), s.bind(n, "touchstart", this), y(n)
			}
		};
		var m = "attachEvent"in r.documentElement, y = m ? function (t) {
			"IMG" === t.nodeName && (t.ondragstart = p);
			for (var e = t.querySelectorAll("img"), n = 0, i = e.length; i > n; n++) {
				var o = e[n];
				o.ondragstart = p
			}
		} : n;
		f.prototype._getPosition = function () {
			var t = a(this.element), e = parseInt(t.left, 10), n = parseInt(t.top, 10);
			this.position.x = isNaN(e) ? 0 : e, this.position.y = isNaN(n) ? 0 : n, this._addTransformPosition(t)
		}, f.prototype._addTransformPosition = function (t) {
			if (g) {
				var e = t[g];
				if (0 === e.indexOf("matrix")) {
					var n = e.split(","), i = 0 === e.indexOf("matrix3d") ? 12 : 4, o = parseInt(n[i], 10), r = parseInt(n[i + 1], 10);
					this.position.x += o, this.position.y += r
				}
			}
		}, f.prototype.handleEvent = function (t) {
			var e = "on" + t.type;
			this[e] && this[e](t)
		}, f.prototype.getTouch = function (t) {
			for (var e = 0, n = t.length; n > e; e++) {
				var i = t[e];
				if (i.identifier === this.pointerIdentifier)return i
			}
		}, f.prototype.onmousedown = function (t) {
			var e = t.button;
			e && 0 !== e && 1 !== e || this.dragStart(t, t)
		}, f.prototype.ontouchstart = function (t) {
			this.isDragging || this.dragStart(t, t.changedTouches[0])
		}, f.prototype.dragStart = function (e, n) {
			if (this.isEnabled) {
				e.preventDefault ? e.preventDefault() : e.returnValue = !1;
				var o = "touchstart" === e.type;
				this.pointerIdentifier = n.identifier, this._getPosition(), this.measureContainment(), l(this.startPoint, n), this.startPosition.x = this.position.x, this.startPosition.y = this.position.y, this.setLeftTop(), this.dragPoint.x = 0, this.dragPoint.y = 0, this._bindEvents({
					events: o ? ["touchmove", "touchend", "touchcancel"] : ["mousemove", "mouseup"],
					node: e.preventDefault ? t : r
				}), i.add(this.element, "is-dragging"), this.isDragging = !0, this.emitEvent("dragStart", [this, e, n]), this.animate()
			}
		}, f.prototype._bindEvents = function (t) {
			for (var e = 0, n = t.events.length; n > e; e++) {
				var i = t.events[e];
				s.bind(t.node, i, this)
			}
			this._boundEvents = t
		}, f.prototype._unbindEvents = function () {
			var t = this._boundEvents;
			if (t && t.events) {
				for (var e = 0, n = t.events.length; n > e; e++) {
					var i = t.events[e];
					s.unbind(t.node, i, this)
				}
				delete this._boundEvents
			}
		}, f.prototype.measureContainment = function () {
			var t = this.options.containment;
			if (t) {
				this.size = u(this.element);
				var e = this.element.getBoundingClientRect(), n = h(t) ? t : "string" == typeof t ? r.querySelector(t) : this.element.parentNode;
				this.containerSize = u(n);
				var i = n.getBoundingClientRect();
				this.relativeStartPosition = {x: e.left - i.left, y: e.top - i.top}
			}
		}, f.prototype.onmousemove = function (t) {
			this.dragMove(t, t)
		}, f.prototype.ontouchmove = function (t) {
			var e = this.getTouch(t.changedTouches);
			e && this.dragMove(t, e)
		}, f.prototype.dragMove = function (t, e) {
			if (l(this.dragPoint, e), this.dragPoint.x -= this.startPoint.x, this.dragPoint.y -= this.startPoint.y, this.options.containment) {
				var n = this.relativeStartPosition.x, i = this.relativeStartPosition.y;
				this.dragPoint.x = Math.max(this.dragPoint.x, -n), this.dragPoint.y = Math.max(this.dragPoint.y, -i), this.dragPoint.x = Math.min(this.dragPoint.x, this.containerSize.width - n - this.size.width), this.dragPoint.y = Math.min(this.dragPoint.y, this.containerSize.height - i - this.size.height)
			}
			this.position.x = this.startPosition.x + this.dragPoint.x, this.position.y = this.startPosition.y + this.dragPoint.y, this.emitEvent("dragMove", [this, t, e])
		}, f.prototype.onmouseup = function (t) {
			this.dragEnd(t, t)
		}, f.prototype.ontouchend = function (t) {
			var e = this.getTouch(t.changedTouches);
			e && this.dragEnd(t, e)
		}, f.prototype.dragEnd = function (t, e) {
			this.isDragging = !1, delete this.pointerIdentifier, g && (this.element.style[g] = "", this.setLeftTop()), this._unbindEvents(), i.remove(this.element, "is-dragging"), this.emitEvent("dragEnd", [this, t, e])
		}, f.prototype.ontouchcancel = function (t) {
			var e = this.getTouch(t.changedTouches);
			this.dragEnd(t, e)
		}, f.prototype.animate = function () {
			if (this.isDragging) {
				this.positionDrag();
				var t = this;
				c(function () {
					t.animate()
				})
			}
		};
		var E = v ? function (t, e) {
			return "translate3d( " + t + "px, " + e + "px, 0)"
		} : function (t, e) {
			return "translate( " + t + "px, " + e + "px)"
		};
		return f.prototype.setLeftTop = function () {
			this.element.style.left = this.position.x + "px", this.element.style.top = this.position.y + "px"
		}, f.prototype.positionDrag = g ? function () {
			this.element.style[g] = E(this.dragPoint.x, this.dragPoint.y)
		} : f.prototype.setLeftTop, f.prototype.enable = function () {
			this.isEnabled = !0
		}, f.prototype.disable = function () {
			this.isEnabled = !1, this.isDragging && this.dragEnd()
		}, f
	}

	for (var o, r = t.document, s = r.defaultView, a = s && s.getComputedStyle ? function (t) {
		return s.getComputedStyle(t, null)
	} : function (t) {
		return t.currentStyle
	}, h = "object" == typeof HTMLElement ? function (t) {
		return t instanceof HTMLElement
	} : function (t) {
		return t && "object" == typeof t && 1 === t.nodeType && "string" == typeof t.nodeName
	}, d = 0, u = "webkit moz ms o".split(" "), c = t.requestAnimationFrame, f = t.cancelAnimationFrame, p = 0; u.length > p && (!c || !f); p++)o = u[p], c = c || t[o + "RequestAnimationFrame"], f = f || t[o + "CancelAnimationFrame"] || t[o + "CancelRequestAnimationFrame"];
	c && f || (c = function (e) {
		var n = (new Date).getTime(), i = Math.max(0, 16 - (n - d)), o = t.setTimeout(function () {
			e(n + i)
		}, i);
		return d = n + i, o
	}, f = function (e) {
		t.clearTimeout(e)
	}), "function" == typeof define && define.amd ? define(["classie/classie", "eventEmitter/EventEmitter", "eventie/eventie", "get-style-property/get-style-property", "get-size/get-size"], i) : t.Draggabilly = i(t.classie, t.EventEmitter, t.eventie, t.getStyleProperty, t.getSize)
}(window);
;


(function (window) {

	'use strict';

	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	// support
	var is3d = !!getStyleProperty('perspective'),
		supportTransitions = true,
	// transition end event name
		transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames["transition"];

	function StackInteraction(el, options) {
		this.container = el;
		this.ordination = {
			x: 0,
			y: 0
		}
		this.options = extend({}, this.options);
		extend(this.options, options);
		this._init();
	}

	function setTransformStyle(el, tval) {
		el.style.WebkitTransform = tval;
		el.style.msTransform = tval;
		el.style.transform = tval;
	}

	StackInteraction.prototype.options = {
		// distDragBack: if the user stops dragging the image in a area that does not exceed [distDragBack]px for either x or y then the image goes back to the stack
		distDragBack: 200,
		// distDragMax: if the user drags the image in a area that exceeds [distDragMax]px for either x or y then the image moves away from the stack
		distDragMax: 450,
		// callback
		onUpdateStack: function (current) {
			return false;
		}
	};

	StackInteraction.prototype._init = function () {
		// items
		this.items = [].slice.call(this.container.children);
		// total items
		this.itemsCount = this.items.length;
		// current item's index (the one on the top of the stack)
		this.current = 0;
		// set initial styles
		this._setStackStyle();
		// return if no items or only one
		if (this.itemsCount <= 1) return;
		// add dragging capability
		this._initDragg();
		// init drag events
		this._initEvents();
	};

	StackInteraction.prototype._initEvents = function () {
		var self = this;
		this.draggie.on('dragStart', function (i, e, p) {
			self._onDragStart(i, e, p);
			self.ordination.x = i.position.x;
			self.ordination.y = i.position.y;
			console.log(self.ordination);
		});
		this.draggie.on('dragMove', function (i, e, p) {
			self._onDragMove(i, e, p);
		});
		this.draggie.on('dragEnd', function (i, e, p) {
			self._onDragEnd(i, e, p);
			if (Math.abs(i.position.x - self.ordination.x) < 10 && Math.abs(i.position.y - self.ordination.y) < 10) {
				window.location.href = e.srcElement.getAttribute("data-url");
			}
		});
	};

	StackInteraction.prototype._setStackStyle = function () {
		var item1 = this._firstItem(), item2 = this._secondItem(), item3 = this._thirdItem(), item4 = this._fourthItem();

		if (item1) {
			item1.style.opacity = 1;
			item1.style.zIndex = 5;
			setTransformStyle(item1, is3d ? 'rotate(0deg)' : '');
		}

		if (item2) {
			item2.style.opacity = 1;
			item2.style.zIndex = 4;
			setTransformStyle(item2, is3d ? 'rotate(-2deg)' : '');
		}

		if (item3) {
			item3.style.opacity = 1;
			item3.style.zIndex = 3;
			setTransformStyle(item3, is3d ? 'rotate(-8deg)' : '');
		}

		if (item4) {
			item4.style.opacity = 1;
			item4.style.zIndex = 2;
			setTransformStyle(item4, is3d ? 'rotate(8deg)' : '');
		}
	};

	StackInteraction.prototype._moveAway = function (instance) {
		// disable drag
		this._disableDragg();

		// add class "animate"
		classie.add(instance.element, 'animate');

		// calculate how much to translate in the x and y axis
		var tVal = this._getTranslateVal(instance);

		// apply it
		setTransformStyle(instance.element, is3d ? 'translate3d(' + tVal.x + 'px,' + tVal.y + 'px, 0px)' : 'translate(' + tVal.x + 'px,' + tVal.y + 'px)');

		// item also fades out
		instance.element.style.opacity = 0;

		// other items move back to stack
		var item2 = this._secondItem(), item3 = this._thirdItem(), item4 = this._fourthItem();

		if (item2) {
			classie.add(item2, 'move-back');
			classie.add(item2, 'animate');
			setTransformStyle(item2, is3d ? 'rotate(-2deg)' : '');
		}
		if (item3) {
			classie.add(item3, 'move-back');
			classie.add(item3, 'animate');
			setTransformStyle(item3, is3d ? 'rotate(-8deg)' : '');
		}
		if (item4) {
			classie.add(item4, 'move-back');
			classie.add(item4, 'animate');
			setTransformStyle(item4, is3d ? 'rotate(8deg)' : '');
		}

		// after transition ends..
		var self = this,
			onEndTransFn = function () {
				instance.element.removeEventListener(transEndEventName, onEndTransFn);

				// reset first item
				//setTransformStyle(instance.element, is3d ? 'translate3d(0,0,-180px)' : 'translate(0,0,0)');
				instance.element.style.left = instance.element.style.top = '0px';
				instance.element.style.zIndex = -1;
				classie.remove(instance.element, 'animate');

				// reorder stack
				self.current = self.current < self.itemsCount - 1 ? self.current + 1 : 0;
				// new front items
				var item1 = self._firstItem(),
					item2 = self._secondItem(),
					item3 = self._thirdItem(),
					item4 = self._fourthItem();

				// reset transition timing function
				classie.remove(item1, 'move-back');
				if (item2) classie.remove(item2, 'move-back');
				if (item3) classie.remove(item3, 'move-back');
				if (item4) classie.remove(item4, 'move-back');

				setTimeout(function () {
					// the upcoming one will animate..
					classie.add(self._lastItem(), 'animate');
					// reset style
					self._setStackStyle();
				}, 25);

				// add dragging capability
				self._initDragg();

				// init drag events on new current item
				self._initEvents();

				// callback
				self.options.onUpdateStack(self.current);
			};

		if (supportTransitions) {
			instance.element.addEventListener(transEndEventName, onEndTransFn);
		}
		else {
			onEndTransFn.call();
		}
	};

	StackInteraction.prototype._moveBack = function (instance) {
		var item2 = this._secondItem(), item3 = this._thirdItem(), item4 = this._fourthItem();

		classie.add(instance.element, 'move-back');
		classie.add(instance.element, 'animate');
		//setTransformStyle(instance.element, is3d ? 'translate3d(0,0,0)' : 'translate(0,0)');
		instance.element.style.left = '0px';
		instance.element.style.top = '0px';

		if (item2) {
			classie.add(item2, 'move-back');
			classie.add(item2, 'animate');
			setTransformStyle(item2, is3d ? 'rotate(-8deg)' : '');
		}
		if (item3) {
			classie.add(item3, 'move-back');
			classie.add(item3, 'animate');
			setTransformStyle(item3, is3d ? 'rotate(-2deg)' : '');
		}
		if (item4) {
			classie.add(item4, 'move-back');
			classie.add(item4, 'animate');
			setTransformStyle(item4, is3d ? 'rotate(8deg)' : '');
		}
	};

	StackInteraction.prototype._onDragStart = function (instance, event, pointer) {
		// remove transition classes if any
		var item2 = this._secondItem(), item3 = this._thirdItem(), item4 = this._fourthItem();

		classie.remove(instance.element, 'move-back');
		classie.remove(instance.element, 'animate');

		if (item2) {
			classie.remove(item2, 'move-back');
			classie.remove(item2, 'animate');
		}
		if (item3) {
			classie.remove(item3, 'move-back');
			classie.remove(item3, 'animate');
		}
		if (item4) {
			classie.remove(item4, 'move-back');
			classie.remove(item4, 'animate');
		}
	};

	StackInteraction.prototype._onDragMove = function (instance, event, pointer) {
		if (this._outOfBounds(instance)) {
			this._moveAway(instance);
		}
		else {
			// the second and third items also move
			var item2 = this._secondItem(), item3 = this._thirdItem(), item4 = this._fourthItem();
			if (item2) {
				//setTransformStyle(item2, is3d ? 'translate3d(' + ( instance.position.x * .6 ) + 'px,' + ( instance.position.y * .6 ) + 'px, -60px)' : 'translate(' + ( instance.position.x * .6 ) + 'px,' + ( instance.position.y * .6 ) + 'px)');
			}
			if (item3) {
				//setTransformStyle(item3, is3d ? 'translate3d(' + ( instance.position.x * .3 ) + 'px,' + ( instance.position.y * .3 ) + 'px, -120px)' : 'translate(' + ( instance.position.x * .3 ) + 'px,' + ( instance.position.y * .3 ) + 'px)');
			}
			if (item4) {
				//setTransformStyle(item4, is3d ? 'translate3d(' + ( instance.position.x * .3 ) + 'px,' + ( instance.position.y * .3 ) + 'px, -120px)' : 'translate(' + ( instance.position.x * .3 ) + 'px,' + ( instance.position.y * .3 ) + 'px)');

			}
		}
	};

	StackInteraction.prototype._onDragEnd = function (instance, event, pointer) {
		if (this._outOfBounds(instance)) return;
		if (this._outOfSight(instance)) {
			this._moveAway(instance);
		}
		else {
			this._moveBack(instance);
		}
	};

	StackInteraction.prototype._initDragg = function () {
		this.draggie = new Draggabilly(this.items[this.current]);
	};

	StackInteraction.prototype._disableDragg = function () {
		this.draggie.disable();
	};

	// returns true if x or y is bigger than distDragMax
	StackInteraction.prototype._outOfBounds = function (el) {
		return Math.abs(el.position.x) > this.options.distDragMax || Math.abs(el.position.y) > this.options.distDragMax;
	};

	// returns true if x or y is bigger than distDragBack
	StackInteraction.prototype._outOfSight = function (el) {
		return Math.abs(el.position.x) > this.options.distDragBack || Math.abs(el.position.y) > this.options.distDragBack;
	};

	StackInteraction.prototype._getTranslateVal = function (el) {
		var h = Math.sqrt(Math.pow(el.position.x, 2) + Math.pow(el.position.y, 2)),
			a = Math.asin(Math.abs(el.position.y) / h) / ( Math.PI / 180 ),
			hL = h + this.options.distDragBack,
			dx = Math.cos(a * ( Math.PI / 180 )) * hL,
			dy = Math.sin(a * ( Math.PI / 180 )) * hL,
			tx = dx - Math.abs(el.position.x),
			ty = dy - Math.abs(el.position.y);

		return {
			x: el.position.x > 0 ? tx : tx * -1,
			y: el.position.y > 0 ? ty : ty * -1
		}
	};

	// returns the first item in the stack
	StackInteraction.prototype._firstItem = function () {
		return this.items[this.current];
	};

	// returns the second item in the stack
	StackInteraction.prototype._secondItem = function () {
		if (this.itemsCount >= 2) {
			return this.current + 1 < this.itemsCount ? this.items[this.current + 1] : this.items[Math.abs(this.itemsCount - ( this.current + 1 ))];
		}
	};

	// returns the third item in the stack
	StackInteraction.prototype._thirdItem = function () {
		if (this.itemsCount >= 3) {
			return this.current + 2 < this.itemsCount ? this.items[this.current + 2] : this.items[Math.abs(this.itemsCount - ( this.current + 2 ))];
		}
	};

	// returns the third item in the stack
	StackInteraction.prototype._fourthItem = function () {
		if (this.itemsCount >= 4) {
			return this.current + 3 < this.itemsCount ? this.items[this.current + 3] : this.items[Math.abs(this.itemsCount - ( this.current + 3 ))];
		}
	};


	// returns the last item (of the first three) in the stack
	StackInteraction.prototype._lastItem = function () {
		if (this.itemsCount >= 4) {
			return this._fourthItem();
		} else if (this.itemsCount >= 3) {
			return this._thirdItem();
		} else {
			return this._secondItem();
		}
	};

	// add to global namespace
	window.StackInteraction = StackInteraction;

})(window);