/**
 * Created by chinghsu on 16/3/21.
 */
(function () {

	'use strict';


	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function TimeClock(el, options) {
		this.container = document.querySelector(el);
		this.targetEl = document.querySelector(".clock");
		this._options = {
			timeValue: 0,
			timeout: false,
			direction: "clockwise",
			second: 0,
			minute: 0,
			count: 0
		};
		this.count = 0;
		this.st = null;
		extend(this._options, options);
		_init.call(this);
		return this;

	}

	function _init() {
		if (this._options.direction == "clockwise") {
			this._options.second = 0;
		} else if (this._options.direction == "counterclockwise") {
			this._options.second = this._options.timeValue;
		}

		start.call(this);
		return this;
	}

	function _refreshClock() {
		_clock.call(this);
		if (this._options.second <= this._options.timeValue && this._options.second >= 0) {
			this.st = setTimeout(_refreshClock.bind(this), 1000);
		}
	}

	function _format(v) {
		return (v.toString().length == 1) ? '0' + v : v;
	}

	function _clock() {
		this._options.minute = this._options.second / 60;
		var secdeg = (this._options.second % 60) * 6;
		var mindeg = (this._options.minute % 60) * 6;
		this.targetEl.querySelector(".second").style.transform = "rotate(" + secdeg + "deg)";
		this.targetEl.querySelector(".minute").style.transform = "rotate(" + mindeg + "deg)";
		document.querySelector(".countdown .seconds").innerHTML = _format(Math.floor((this._options.timeValue - this._options.second) % 60));
		document.querySelector(".countdown .minutes").innerHTML = _format(Math.floor(((this._options.timeValue - this._options.second) / 60) % 60));
		_pieDegree.call(this, secdeg);
		this._options.second += 1 * (this._options.direction == "clockwise" ? 1 : -1);
		(this.count)++;
		if (this._options.second > this._options.timeValue || this._options.second < 0) {
			alert("时间到!");
			clearTimeout(this.st);
		}
	}

	function _pieDegree(secdeg) {
		var clockBg = document.querySelector(".clock");
		if (clockBg) {
			if (secdeg < (360 / 2)) {
				secdeg = 90 + secdeg;
				clockBg.style.backgroundImage =
					'linear-gradient(' + secdeg + 'deg, transparent 50%, white 50%),linear-gradient(90deg, white 50%, transparent 50%';
			} else if (secdeg >= (360 / 2)) {
				secdeg = -90 + secdeg;
				clockBg.style.backgroundImage =
					'linear-gradient(' + secdeg + 'deg, transparent 50%, #F4886D 50%),linear-gradient(90deg, white 50%, transparent 50%';
			}
		}

	}

	function start() {
		_refreshClock.call(this);
	}

	function stop() {

	}

	function process() {

	}

	function end() {

	}

	function reset() {

	}

	TimeClock.prototype = {
		reset: reset,
		start: start,
		stop: stop,
		process: process,
		end: end
	}


	window.TimeClock = TimeClock;

})(window);

new TimeClock(".container", {
	timeValue: 300,
	pieAnimation: true
	//direction: "counterclockwise"
});