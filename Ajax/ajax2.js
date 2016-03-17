/**
 * Created by chinghsu on 16/3/9.
 */
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

	function pend() {
		//this.ajaxSend;
		if (!this._options.timeout){
			this._options.loop=0;
			this._options.timeout=true;
			//this._targetElement.disabled=false;
			this.st = setTimeout(send.bind(this), this._options.time);
		}
		this._options.loop++;
		return this;
	}

	function send() {
		console.log("hello");
		this._targetElement.tagName == "BUTTON" ? (this._targetElement.disabled = true) : (this._targetElement.style.pointerEvents = "none");
		this._ajaxSend();
		var time=10;
		var txt=this._targetElement.innerHTML;
		this.si=setInterval((function(){
			this._targetElement.innerHTML=txt+" ("+(time--)+"秒)后重新发送";
			if(time<0){
				this._targetElement.tagName == "BUTTON" ? (this._targetElement.disabled = false) : (this._targetElement.style.pointerEvents = "auto");
				this._options.timeout = false;
				this._targetElement.innerHTML=txt;
				reset();
				clearInterval(this.si);
			}

		}).bind(this),1000);
	}



	function reset(){
		clearTimeout(this.st);
	}






	function Interaction(obj,options) {
		if (typeof (obj) === 'string') {
			this._targetElement = document.querySelector(obj);
		}
		this._options = {
			time: 1000,
			timeout: false
		}
		this.st = null;
		extend(this._options, options);


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

	window.Interaction = Interaction;
})(window);

var i=0;
setInterval(function(){i++;},10);
var interaction = new Interaction("#submit").ajaxSend(function () {
	console.log(i);
});