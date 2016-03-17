/**
 * Created by chinghsu on 16/3/14.
 */
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


	var transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	}, transEndEventName = transEndEventNames['transition'];

	function ProgressButton(el, options) {
		this.button = el;
		//this.options = extend( {}, this.options );
		this.options = {
			statusTime: 1000
		};
		extend(this.options, options);
		this._init();
	}

	ProgressButton.prototype._init = function () {
		//this._validate();
		// create structure
		this._fill();
		// init events
		this._initEvents();
	};


	ProgressButton.prototype._fill = function () {
		var textEl = document.createElement('span');
		textEl.className = 'content';
		textEl.innerHTML = this.button.innerHTML;
		var progressEl = document.createElement('span');
		progressEl.className = 'progress';

		var progressInnerEl = document.createElement('span');
		progressInnerEl.className = 'progress-inner';
		progressEl.appendChild(progressInnerEl);
		// clear content
		this.button.innerHTML = '';


		this.button.appendChild(textEl);
		this.button.appendChild(progressEl);

		this.progress = progressInnerEl;

		if (this.button.getAttribute('data-horizontal') !== null) {
			this.progressProp = 'width';
		}
		else if (this.button.getAttribute('data-vertical') !== null) {
			this.progressProp = 'height';
		}

		this._enable();
	};

	ProgressButton.prototype._setProgress = function (val) {
		this.progress.style[this.progressProp] = 100 * val + '%';
	};

	ProgressButton.prototype._initEvents = function () {
		var self = this;
		this.button.addEventListener('click', function () {
			// disable the button
			self.button.setAttribute('disabled', '');
			// add class state-loading to the button (applies a specific transform to the button depending which data-style is defined - defined in the stylesheets)
			self.progress.classList.remove('notransition');
			this.classList.add('state-loading');

			setTimeout(function () {
				if (typeof self.options.callback === 'function') {
					self.options.callback(self);
				}
				else {
					self._setProgress(1);
					var onEndTransFn = function (ev) {
						if (true && ev.propertyName !== self.progressProp) return;
						this.removeEventListener(transEndEventName, onEndTransFn);
						self._stop();
					};

					if (true) {
						self.progress.addEventListener(transEndEventName, onEndTransFn);
					}
					else {
						onEndTransFn.call();
					}

				}
			}, 0); // TODO: change timeout to transitionend event callback
		});
	};

	ProgressButton.prototype._stop = function (status) {
		var self = this;

		setTimeout(function () {
			// fade out progress bar

			var onEndTransFn = function (ev) {
				if (true && ev.propertyName !== 'opacity') return;
				this.removeEventListener(transEndEventName, onEndTransFn);
				self.progress.classList.add('notransition');
				self.progress.style[self.progressProp] = '0%';
				self.progress.style.opacity = 1;
			};

			if (true) {
				self.progress.addEventListener(transEndEventName, onEndTransFn);
			}
			else {
				onEndTransFn.call();
			}


			// add class state-success to the button
			if (typeof status === 'number') {
				var statusClass = status >= 0 ? 'state-success' : 'state-error';
				self.button.classList.add(statusClass);
				// after options.statusTime remove status
				setTimeout(function () {
					self.progress.style.opacity = 0;
					self.button.classList.remove(statusClass);
					self._enable();
				}, self.options.statusTime);
			}
			else {
				self._enable();
			}

			// remove class state-loading from the button
			self.button.classList.remove('state-loading');
		}, 100);
	};

	// enable button
	ProgressButton.prototype._enable = function () {
		this.button.removeAttribute('disabled');
	}


	window.ProgressButton = ProgressButton;
})(window);