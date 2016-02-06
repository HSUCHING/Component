/**
 * Created by chinghsu on 16/2/1.
 */
window.flux = {
	version: '0.0.1'
};

$(function () {
	if (!flux.browser.supportsTransitions)
		alert("Flux Slider requires a browser that supports CSS3 transitions");
	window.f = new flux.slider('#slider', {
		autoplay: true,
		pagination: true,
		captions: true
	});
});

(function ($) {
	flux.slider = function (elem, opts) {
		// Setup the flux.browser singleton to perform feature detection
		flux.browser.init();

		if (!flux.browser.supportsTransitions) {
			if (window.console && window.console.error)
				console.error("Flux Slider requires a browser that supports CSS3 transitions");
		}

		var _this = this;

		this.element = $(elem);

		// Make a list of all available transitions
		this.transitions = [];
		for (var fx in flux.transitions)
			this.transitions.push(fx);

		this.options = $.extend({
			autoplay: true,
			transitions: this.transitions,
			delay: 4000,
			pagination: true,
			controls: false,
			captions: false,
			width: null,
			height: null,
			onTransitionEnd: null
		}, opts);

		// Set the height/width if given [EXPERIMENTAL!]
		this.height = this.options.height ? this.options.height : null;
		this.width = this.options.width ? this.options.width : null;

		// Filter out non compatible transitions
		var newTrans = [];
		$(this.options.transitions).each(function (index, tran) {
			var t = new flux.transitions[tran](this),
				compatible = true;

			if (t.options.requires3d && !flux.browser.supports3d)
				compatible = false;

			if (t.options.compatibilityCheck)
				compatible = t.options.compatibilityCheck();

			if (compatible)
				newTrans.push(tran);
		});

		this.options.transitions = newTrans;

		this.images = new Array();
		this.imageLoadedCount = 0;
		this.currentImageIndex = 0;
		this.nextImageIndex = 1;
		this.playing = false;

		this.container = $('<div class="fluxslider"></div>').appendTo(this.element);

		this.surface = $('<div class="surface" style="position: relative"></div>').appendTo(this.container);

		// Listen for click events as we may want to follow a link
		this.container.bind('click', function (event) {
			if ($(event.target).hasClass('hasLink'))
				window.location = $(event.target).data('href');
		});

		this.imageContainer = $('<div class="images loading"></div>').css({
			'position': 'relative',
			'overflow': 'hidden',
			'min-height': '100px'
		}).appendTo(this.surface);

		// If the height/width is already set then resize the container
		if (this.width && this.height) {
			this.imageContainer.css({
				width: this.width + 'px',
				height: this.height + 'px'
			});
		}

		// Create the placeholders for the current and next image
		this.image1 = $('<div class="image1" style="height: 100%; width: 100%"></div>').appendTo(this.imageContainer);
		this.image2 = $('<div class="image2" style="height: 100%; width: 100%"></div>').appendTo(this.imageContainer);

		$(this.image1).add(this.image2).css({
			'position': 'absolute',
			'top': '0px',
			'left': '0px'
		});

		// Get a list of the images to use
		this.element.find('img, a img').each(function (index, found_img) {
			var imgClone = found_img.cloneNode(false),
				link = $(found_img).parent();

			// If this img is directly inside a link then save the link for later use
			if (link.is('a'))
				$(imgClone).data('href', link.attr('href'));

			_this.images.push(imgClone);

			// Remove the images from the DOM
			$(found_img).remove();
		});

		// Load the images afterwards as IE seems to load images synchronously
		for (var i = 0; i < this.images.length; i++) {
			var image = new Image();
			image.onload = function () {
				_this.imageLoadedCount++;

				_this.width = _this.width ? _this.width : this.width;
				_this.height = _this.height ? _this.height : this.height;

				if (_this.imageLoadedCount >= _this.images.length) {
					_this.finishedLoading();
					_this.setupImages();
				}
			};

			// Load the image to ensure its cached by the browser
			image.src = this.images[i].src;
		}

		// Catch when a transition has finished
		this.element.bind('fluxTransitionEnd', function (event, data) {
			// If the slider is currently playing then set the timeout for the next transition
			// if(_this.isPlaying())
			// 	_this.start();

			// Are we using a callback instead of events for notifying about transition ends?
			if (_this.options.onTransitionEnd) {
				event.preventDefault();
				_this.options.onTransitionEnd(data);
			}
		});

		// Should we auto start the slider?
		if (this.options.autoplay)
			this.start();

		// Handle swipes
		this.element.bind('swipeLeft', function (event) {
			_this.next(null, {
				direction: 'left'
			});
		}).bind('swipeRight', function (event) {
			_this.prev(null, {
				direction: 'right'
			});
		});

		// Under FF7 autoplay breaks when the current tab loses focus
		setTimeout(function () {
			$(window).focus(function () {
				if (_this.isPlaying())
					_this.next();
			});
		}, 100);
	};

	flux.slider.prototype = {
		constructor: flux.slider,
		playing: false,
		start: function () {
			var _this = this;
			this.playing = true;
			this.interval = setInterval(function () {
				console.log('play');
				_this.transition();
			}, this.options.delay);
		},
		stop: function () {
			this.playing = false;
			clearInterval(this.interval);
			this.interval = null;
		},
		isPlaying: function () {
			return this.playing;
			//return this.interval != null;
		},
		next: function (trans, opts) {
			opts = opts || {};
			opts.direction = 'left';
			this.showImage(this.currentImageIndex + 1, trans, opts);
		},
		prev: function (trans, opts) {
			opts = opts || {};
			opts.direction = 'right';
			this.showImage(this.currentImageIndex - 1, trans, opts);
		},
		showImage: function (index, trans, opts) {
			this.setNextIndex(index);

			// Temporarily stop the transition interval
			//clearInterval(this.interval);
			//this.interval = null;

			this.setupImages();
			this.transition(trans, opts);
		},
		finishedLoading: function () {
			var _this = this;

			this.container.css({
				width: this.width + 'px',
				height: this.height + 'px'
			});

			this.imageContainer.removeClass('loading');

			// Should we setup a pagination view?
			if (this.options.pagination) {
				// TODO: Attach to touch events if appropriate
				this.pagination = $('<ul class="pagination"></ul>').css({
					margin: '0px',
					padding: '0px',
					'text-align': 'center'
				});

				this.pagination.bind('click', function (event) {
					event.preventDefault();
					_this.showImage($(event.target).data('index'));
				});

				$(this.images).each(function (index, image) {
					var li = $('<li data-index="' + index + '">' + (index + 1) + '</li>').css({
						display: 'inline-block',
						'margin-left': '0.5em',
						'cursor': 'pointer'
					}).appendTo(_this.pagination);

					if (index == 0)
						li.css('margin-left', 0).addClass('current');
				});

				this.container.append(this.pagination);
			}

			// Resize
			$(this.imageContainer).css({
				width: this.width + 'px',
				height: this.height + 'px'
			});

			$(this.image1).css({
				width: this.width + 'px',
				height: this.height + 'px'
			});

			$(this.image2).css({
				width: this.width + 'px',
				height: this.height + 'px'
			});

			this.container.css({
				width: this.width + 'px',
				height: this.height + (this.options.pagination ? this.pagination.height() : 0) + 'px'
			});

			// Should we add prev/next controls?
			if (this.options.controls) {
				var css = {
					padding: '4px 10px 10px',
					'font-size': '60px',
					'font-family': 'arial, sans-serif',
					'line-height': '1em',
					'font-weight': 'bold',
					color: '#FFF',
					'text-decoration': 'none',
					background: 'rgba(0,0,0,0.5)',
					position: 'absolute',
					'z-index': 2000
				};

				this.nextButton = $('<a href="#">禄</a>').css(css).css3({
					'border-radius': '4px'
				}).appendTo(this.surface).bind('click', function (event) {
					event.preventDefault();
					_this.next();
				});

				this.prevButton = $('<a href="#">芦</a>').css(css).css3({
					'border-radius': '4px'
				}).appendTo(this.surface).bind('click', function (event) {
					event.preventDefault();
					_this.prev();
				});

				var top = (this.height - this.nextButton.height()) / 2;
				this.nextButton.css({
					top: top + 'px',
					right: '10px'
				});

				this.prevButton.css({
					top: top + 'px',
					left: '10px'
				});
			}

			// Should we use captions?
			if (this.options.captions) {
				this.captionBar = $('<div class="caption"></div>').css({
					background: 'rgba(0,0,0,0.6)',
					color: '#FFF',
					'font-size': '16px',
					'font-family': 'helvetica, arial, sans-serif',
					'text-decoration': 'none',
					'font-weight': 'bold',
					padding: '1.5em 1em',
					opacity: 0,
					position: 'absolute',
					'z-index': 110,
					width: '100%',
					bottom: 0
				}).css3({
					'transition-property': 'opacity',
					'transition-duration': '800ms',
					'box-sizing': 'border-box'
				}).prependTo(this.surface);
			}

			this.updateCaption();
		},
		setupImages: function () {
			var img1 = this.getImage(this.currentImageIndex),
				css1 = {
					'background-image': 'url("' + img1.src + '")',
					'z-index': 101,
					'cursor': 'auto'
				};

			// Does this image have an associated link?
			if ($(img1).data('href')) {
				css1.cursor = 'pointer';
				this.image1.addClass('hasLink');
				this.image1.data('href', $(img1).data('href'));
			} else {
				this.image1.removeClass('hasLink');
				this.image1.data('href', null);
			}

			this.image1.css(css1).children().remove();

			this.image2.css({
				'background-image': 'url("' + this.getImage(this.nextImageIndex).src + '")',
				'z-index': 100
			}).show();

			if (this.options.pagination && this.pagination) {
				this.pagination.find('li.current').removeClass('current');
				$(this.pagination.find('li')[this.currentImageIndex]).addClass('current');
			}
		},
		transition: function (transition, opts) {
			// Allow a transition to be picked from ALL available transitions (not just the reduced set)
			if (transition == undefined || !flux.transitions[transition]) {
				// Pick a transition at random from the (possibly reduced set of) transitions
				var index = Math.floor(Math.random() * (this.options.transitions.length));
				transition = this.options.transitions[index];
			}

			var tran = null;

			try {
				tran = new flux.transitions[transition](this, $.extend(this.options[transition] ? this.options[transition] : {}, opts));
			} catch (e) {
				// If an invalid transition has been provided then use the fallback (default is to just switch the image)
				tran = new flux.transition(this, {
					fallback: true
				});
			}

			tran.run();

			this.currentImageIndex = this.nextImageIndex;
			this.setNextIndex(this.currentImageIndex + 1);
			this.updateCaption();
		},
		updateCaption: function () {
			var str = $(this.getImage(this.currentImageIndex)).attr('title');
			if (this.options.captions && this.captionBar) {
				if (str !== "")
					this.captionBar.html(str);

				this.captionBar.css('opacity', str === "" ? 0 : 1);
			}
		},
		getImage: function (index) {
			index = index % this.images.length;

			return this.images[index];
		},
		setNextIndex: function (nextIndex) {
			if (nextIndex == undefined)
				nextIndex = this.currentImageIndex + 1;

			this.nextImageIndex = nextIndex;

			if (this.nextImageIndex > this.images.length - 1)
				this.nextImageIndex = 0;

			if (this.nextImageIndex < 0)
				this.nextImageIndex = this.images.length - 1;
		},
		increment: function () {
			this.currentImageIndex++;
			if (this.currentImageIndex > this.images.length - 1)
				this.currentImageIndex = 0;
		}
	};
})(window.jQuery || window.Zepto);

/**
 * Helper object to determine support for various CSS3 functions
 * @author Joe Lambert
 */

(function ($) {
	flux.browser = {
		init: function () {
			// Have we already been initialised?
			if (flux.browser.supportsTransitions !== undefined)
				return;

			var div = document.createElement('div'),
				prefixes = ['-webkit', '-moz', '-o', '-ms'],
				domPrefixes = ['Webkit', 'Moz', 'O', 'Ms'];

			// Does the current browser support CSS Transitions?
			if (window.Modernizr && Modernizr.csstransitions !== undefined)
				flux.browser.supportsTransitions = Modernizr.csstransitions;
			else {
				flux.browser.supportsTransitions = this.supportsCSSProperty('Transition');
			}

			// Does the current browser support 3D CSS Transforms?
			if (window.Modernizr && Modernizr.csstransforms3d !== undefined)
				flux.browser.supports3d = Modernizr.csstransforms3d;
			else {
				// Custom detection when Modernizr isn't available
				flux.browser.supports3d = this.supportsCSSProperty("Perspective");

				if (flux.browser.supports3d && 'webkitPerspective' in $('body').get(0).style) {
					// Double check with a media query (similar to how Modernizr does this)
					var div3D = $('<div id="csstransform3d"></div>');
					var mq = $('<style media="(transform-3d), (' + prefixes.join('-transform-3d),(') + '-transform-3d)">div#csstransform3d { position: absolute; left: 9px }</style>');

					$('body').append(div3D);
					$('head').append(mq);

					flux.browser.supports3d = div3D.get(0).offsetLeft == 9;

					div3D.remove();
					mq.remove();
				}
			}

		},
		supportsCSSProperty: function (prop) {
			var div = document.createElement('div'),
				prefixes = ['-webkit', '-moz', '-o', '-ms'],
				domPrefixes = ['Webkit', 'Moz', 'O', 'Ms'];

			var support = false;
			for (var i = 0; i < domPrefixes.length; i++) {
				if (domPrefixes[i] + prop in div.style)
					support = support || true;
			}

			return support;
		},
		translate: function (x, y, z) {
			x = (x != undefined) ? x : 0;
			y = (y != undefined) ? y : 0;
			z = (z != undefined) ? z : 0;

			return 'translate' + (flux.browser.supports3d ? '3d(' : '(') + x + 'px,' + y + (flux.browser.supports3d ? 'px,' + z + 'px)' : 'px)');
		},

		rotateX: function (deg) {
			return flux.browser.rotate('x', deg);
		},

		rotateY: function (deg) {
			return flux.browser.rotate('y', deg);
		},

		rotateZ: function (deg) {
			return flux.browser.rotate('z', deg);
		},

		rotate: function (axis, deg) {
			if (!axis in {
					'x': '',
					'y': '',
					'z': ''
				})
				axis = 'z';

			deg = (deg != undefined) ? deg : 0;

			if (flux.browser.supports3d)
				return 'rotate3d(' + (axis == 'x' ? '1' : '0') + ', ' + (axis == 'y' ? '1' : '0') + ', ' + (axis == 'z' ? '1' : '0') + ', ' + deg + 'deg)';
			else {
				if (axis == 'z')
					return 'rotate(' + deg + 'deg)';
				else
					return '';
			}
		}
	};

	$(function () {
		// To continue to work with legacy code, ensure that flux.browser is initialised on document ready at the latest
		flux.browser.init();
	});
})(window.jQuery || window.Zepto);

(function ($) {
	/**
	 * Helper function for cross-browser CSS3 support, prepends all possible prefixes to all properties passed in
	 * @param {Object} props Ker/value pairs of CSS3 properties
	 */
	$.fn.css3 = function (props) {
		var css = {};
		var prefixes = ['webkit', 'moz', 'ms', 'o'];

		for (var prop in props) {
			// Add the vendor specific versions
			for (var i = 0; i < prefixes.length; i++)
				css['-' + prefixes[i] + '-' + prop] = props[prop];

			// Add the actual version
			css[prop] = props[prop];
		}

		this.css(css);
		return this;
	};

	/**
	 * Helper function to bind to the correct transition end event
	 * @param {function} callback The function to call when the event fires
	 */
	$.fn.transitionEnd = function (callback) {
		var _this = this;

		var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd'];

		for (var i = 0; i < events.length; i++) {
			this.bind(events[i], function (event) {
				// Automatically stop listening for the event
				for (var j = 0; j < events.length; j++)
					$(this).unbind(events[j]);

				// Perform the callback function
				if (callback)
					callback.call(this, event);
			});
		}

		return this;
	};

	flux.transition = function (fluxslider, opts) {
		this.options = $.extend({
			requires3d: false,
			after: function () {
				// Default callback for after the transition has completed
			}
		}, opts);

		this.slider = fluxslider;

		// We need to ensure transitions degrade gracefully if the transition is unsupported or not loaded
		if ((this.options.requires3d && !flux.browser.supports3d) || !flux.browser.supportsTransitions || this.options.fallback === true) {
			var _this = this;

			this.options.after = undefined;

			this.options.setup = function () {
				//console.error("Fallback setup()");
				_this.fallbackSetup();
			};

			this.options.execute = function () {
				//console.error("Fallback execute()");
				_this.fallbackExecute();
			};
		}
	};

	flux.transition.prototype = {
		constructor: flux.transition,
		hasFinished: false, // This is a lock to ensure that the fluxTransitionEnd event is only fired once per tansition
		run: function () {
			var _this = this;

			// do something
			if (this.options.setup !== undefined)
				this.options.setup.call(this);

			// Remove the background image from the top image
			this.slider.image1.css({
				'background-image': 'none'
			});

			this.slider.imageContainer.css('overflow', this.options.requires3d ? 'visible' : 'hidden');

			// For some of the 3D effects using Zepto we need to delay the transitions for some reason
			setTimeout(function () {
				if (_this.options.execute !== undefined)
					_this.options.execute.call(_this);
			}, 5);
		},
		finished: function () {
			if (this.hasFinished)
				return;

			this.hasFinished = true;

			if (this.options.after)
				this.options.after.call(this);

			this.slider.imageContainer.css('overflow', 'hidden');

			this.slider.setupImages();

			// Trigger an event to signal the end of a transition
			this.slider.element.trigger('fluxTransitionEnd', {
				currentImage: this.slider.getImage(this.slider.currentImageIndex)
			});
		},
		fallbackSetup: function () {

		},
		fallbackExecute: function () {
			this.finished();
		}
	};

	flux.transitions = {};

	// Flux grid transition

	flux.transition_grid = function (fluxslider, opts) {
		return new flux.transition(fluxslider, $.extend({
			columns: 6,
			rows: 6,
			forceSquare: false,
			setup: function () {
				var imgWidth = this.slider.image1.width(),
					imgHeight = this.slider.image1.height();

				var colWidth = Math.floor(imgWidth / this.options.columns),
					rowHeight = Math.floor(imgHeight / this.options.rows);

				if (this.options.forceSquare) {
					rowHeight = colWidth;
					this.options.rows = Math.floor(imgHeight / rowHeight);
				}

				// Work out how much space remains with the adjusted barWidth
				var colRemainder = imgWidth - (this.options.columns * colWidth),
					colAddPerLoop = Math.ceil(colRemainder / this.options.columns),

					rowRemainder = imgHeight - (this.options.rows * rowHeight),
					rowAddPerLoop = Math.ceil(rowRemainder / this.options.rows),

					delayBetweenBars = 150,
					height = this.slider.image1.height(),
					totalLeft = 0,
					totalTop = 0,
					fragment = document.createDocumentFragment();

				for (var i = 0; i < this.options.columns; i++) {
					var thisColWidth = colWidth,
						totalTop = 0;

					if (colRemainder > 0) {
						var add = colRemainder >= colAddPerLoop ? colAddPerLoop : colRemainder;
						thisColWidth += add;
						colRemainder -= add;
					}

					for (var j = 0; j < this.options.rows; j++) {
						var thisRowHeight = rowHeight,
							thisRowRemainder = rowRemainder;

						if (thisRowRemainder > 0) {
							var add = thisRowRemainder >= rowAddPerLoop ? rowAddPerLoop : thisRowRemainder;
							thisRowHeight += add;
							thisRowRemainder -= add;
						}

						var tile = $('<div class="tile tile-' + i + '-' + j + '"></div>').css({
							width: thisColWidth + 'px',
							height: thisRowHeight + 'px',
							position: 'absolute',
							top: totalTop + 'px',
							left: totalLeft + 'px'
						});

						this.options.renderTile.call(this, tile, i, j, thisColWidth, thisRowHeight, totalLeft, totalTop);

						fragment.appendChild(tile.get(0));

						totalTop += thisRowHeight;
					}

					totalLeft += thisColWidth;
				}

				// Append the fragement to the surface
				this.slider.image1.get(0).appendChild(fragment);
			},
			execute: function () {
				var _this = this,
					height = this.slider.image1.height(),
					bars = this.slider.image1.find('div.barcontainer');

				this.slider.image2.hide();

				// Get notified when the last transition has completed
				bars.last().transitionEnd(function (event) {
					_this.slider.image2.show();

					_this.finished();
				});

				bars.css3({
					'transform': flux.browser.rotateX(-90) + ' ' + flux.browser.translate(0, height / 2, height / 2)
				});
			},
			renderTile: function (elem, colIndex, rowIndex, colWidth, rowHeight, leftOffset, topOffset) {

			}
		}, opts));
	};
})(window.jQuery || window.Zepto);


(function ($) {
	flux.transitions.blocks2 = function (fluxslider, opts) {
		return new flux.transition_grid(fluxslider, $.extend({
			cols: 12,
			forceSquare: true,
			delayBetweenDiagnols: 150,
			renderTile: function (elem, colIndex, rowIndex, colWidth, rowHeight, leftOffset, topOffset) {
				var delay = Math.floor(Math.random() * 10 * this.options.delayBetweenBars);

				$(elem).css({
					'background-image': this.slider.image1.css('background-image'),
					'background-position': '-' + leftOffset + 'px -' + topOffset + 'px'
				}).css3({
					'transition-duration': '350ms',
					'transition-timing-function': 'ease-in',
					'transition-property': 'all',
					'transition-delay': (colIndex + rowIndex) * this.options.delayBetweenDiagnols + 'ms',
					'backface-visibility': 'hidden' // trigger hardware acceleration
				});
			},
			execute: function () {
				var _this = this;

				var blocks = this.slider.image1.find('div.tile');

				// Get notified when the last transition has completed
				blocks.last().transitionEnd(function () {
					_this.finished();
				});

				setTimeout(function () {
					blocks.each(function (index, block) {
						$(block).css({
							'opacity': '0'
						}).css3({
							'transform': 'scale(0.8)'
						});
					});
				}, 50);
			}
		}, opts));
	};
})(window.jQuery || window.Zepto);