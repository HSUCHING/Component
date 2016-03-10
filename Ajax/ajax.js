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

	function send() {
		if (!this._options.timeout) {
			this._ajaxSend();
			this._options.timeout = true;
			this._targetElement.tagName == "BUTTON" ? (this._targetElement.disabled = true) : (this._targetElement.style.pointerEvents = "none");
			this.st = setTimeout(reset.bind(this), this._options.time);
		}
		return this;
	}

	function reset() {
		this._options.timeout = false;
		this._targetElement.tagName == "BUTTON" ? (this._targetElement.disabled = false) : (this._targetElement.style.pointerEvents = "auto");
		clearTimeout(this.st);
	}


	function Interaction(obj) {
		if (typeof (obj) === 'string') {
			this._targetElement = document.querySelector(obj);
		}
		this._options = {
			time: 1500,
			timeout: false
		}
		this.st = null;

		this._targetElement && this._targetElement.addEventListener("click", send.bind(this));
	}


	Interaction.prototype = {
		send: send,
		reset: reset,
		completed: function (providedCallback) {
			if (typeof (providedCallback) === 'function') {
				this._introCompleteCallback = providedCallback;
			} else {
				throw new Error('Provided callback for oncomplete was not a function.');
			}
			return this;
		},
		ajaxSend: function (ajaxSend) {
			if (typeof (ajaxSend) === 'function') {
				this._ajaxSend = ajaxSend;
			} else {
				throw new Error('Provided callback for oncomplete was not a function.');
			}
			return this;
		}
	}
})(window)

var interaction = new Interaction("#submit").ajaxSend(function () {
	console.log("Hello!");
});