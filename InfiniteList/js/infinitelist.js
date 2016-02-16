/**
 * Created by chinghsu on 16/2/16.
 */
var applyElementStyle = function (element, styleObj) {
		Object.keys(styleObj).forEach(function (key) {
			if (element.style[key] != styleObj[key]) {
				element.style[key] = styleObj[key];
			}
		})
	},

	applyTransformStyle = function(element, transformValue){
		var styleObject = {};
		['webkit', 'Moz', 'O', 'ms'].forEach(function(prefix){
				styleObject[prefix + 'Transform'] = transformValue;
			}
		);
		applyElementStyle(element, styleObject);
	};

var needsRender = true;
var topOffset;
function attachInfiniteList(id_Dom, direction, touchProvider) {
	var scroller = new InfiniteList(
		document.getElementById(id_Dom),
		function (top) {
			topOffset = (top || 0);
			needsRender = true;
		},
		touchProvider
	);

	scroller.setDimensions(
		Number.MIN_SAFE_INTEGER,
		Number.MAX_SAFE_INTEGER
	);

	//window.addEventListener('resize', refresh.bind(this));
	runAnimationLoop();
	//refresh();
}

var measuredFPS = 60,
	runAnimation = false;


function runAnimationLoop() {
	startAnimationLoop(function () {
		if (needsRender) {
			render();
		}
	});
}

function render() {
	var renderedItems;

	//updateScroller();
	var scrollElement = document.querySelector("#wrapped");
	applyTransformStyle(scrollElement, 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0' + ',' + (-topOffset) + ', 0, 1)');
	//needsRender = itemsRenderer.render(topOffset, scrollToIndex, topItemOffset);
	//renderedItems = itemsRenderer.getRenderedItems();

	//scrollToIndex = null;
	//topItemOffset = null;


	//renderedItems.forEach(function(item){
	//	listItemsHeights[item.getItemIndex()] = item.getItemHeight();
	//});

	//var avarageItemHeight = 0,
	//	itemsCount = 0;
	//for (var i=0; i<listItemsHeights.length; ++i) {
	//	if (typeof listItemsHeights[i] == 'number') {
	//
	//		avarageItemHeight += listItemsHeights[i];
	//		itemsCount++;
	//	}
	//}
	//avarageItemHeight = avarageItemHeight / itemsCount;
	//scrollbarRenderer.render(avarageItemHeight * renderedItems[0].getItemIndex() + topOffset - renderedItems[0].getItemOffset(), avarageItemHeight * config.itemsCount);
}

function startAnimationLoop(step) {
	var lastStepTime = new Date().getTime(),
		frames = 0;
	runAnimation = true;
	var animationStep = function () {
		var currentTime = new Date().getTime();
		frames++;
		if (currentTime - lastStepTime > 200) {
			measuredFPS = Math.min(60, 1000 * frames / (currentTime - lastStepTime));
			lastStepTime = currentTime;
			frames = 0;
		}
		step();
		if (runAnimation) {
			requestAnimationFrame(animationStep);
		}
	}
	requestAnimationFrame(animationStep);
}

function stopAnimationLoop() {
	runAnimation = false;
}

function getFPS() {
	return measuredFPS;
}


var InfiniteList = function (parentElement, direction, callback) {
	var SCROLLING_TIME_CONSTANT = 525;
	var timestamp = 0,
		minOffset = 0,
		maxOffset = 0,
		frame = 0,
		velocity = 0,
		amplitude = 0,
		pressed = 0,
		reference = 0,
		offset = 0,
		target = 0,
		touchPositions = [];

	parentElement.addEventListener('touchstart', tap);
	parentElement.addEventListener('touchmove', drag);
	parentElement.addEventListener('touchend', release);
	parentElement.addEventListener('mousedown', tap);
	parentElement.addEventListener('mousemove', drag);
	parentElement.addEventListener('mouseup', release);

	function ypos(e) {
		// touch event
		if (e.targetTouches && (e.targetTouches.length >= 1)) {
			return e.targetTouches[0].clientY;
		}

		// mouse event
		return e.clientY;
	}

	function scroll(y) {
		offset = y;//Math.min( Math.max(y, minOffset), maxOffset);
		callback(y);
	}

	function autoScroll() {
		var elapsed, delta, newOffset;

		if (amplitude) {
			elapsed = Date.now() - timestamp;
			delta = amplitude * Math.exp(-elapsed / SCROLLING_TIME_CONSTANT);
			newOffset = target - delta;

			if (newOffset < minOffset) {
				if (target - delta >= minOffset - 2) {
					scroll(minOffset);
					return;
				}

				bounce(true);

			} else if (newOffset > maxOffset) {
				if (target - delta <= maxOffset + 2) {
					scroll(maxOffset);
					return;
				}
				bounce(false);

			} else if (delta > 2 || delta < -2) {
				scroll(target - delta);
				requestAnimationFrame(autoScroll);
			} else {
				scroll(target);
			}
		}
	}

	function bounce(top) {

		var finalDestination = top ? minOffset : maxOffset,
			isBouncingBack = top && amplitude > 0 || !top && amplitude < 0;

		if (amplitude == 0) {
			return;
		}

		var elapsed = Date.now() - timestamp;
		var delta = amplitude * Math.exp(-elapsed / (target == finalDestination ? 125 : SCROLLING_TIME_CONSTANT));

		if (isBouncingBack && Math.abs(delta) < 2) {
			scroll(top ? minOffset : maxOffset);
			return;
		}

		scroll(target - delta);

		if (isBouncingBack) {
			if (target != finalDestination) {
				target = finalDestination;
				amplitude = target - offset;
				timestamp = new Date();
			}

		} else {
			target = finalDestination - (finalDestination - target) * 0.1;
			amplitude = target - offset;

		}

		requestAnimationFrame(function () {
			bounce(top);
		});
		return;
	}

	function tap(e) {
		pressed = true;
		reference = ypos(e);

		velocity = amplitude = 0;
		frame = offset;
		timestamp = Date.now();
		recordTouches(e);

		e.preventDefault();
		e.stopPropagation();
	}

	function drag(e) {
		var y, delta, scaleFactor = offset < minOffset || offset > maxOffset ? 0.5 : 1;
		if (pressed) {
			recordTouches(e);
			y = ypos(e);
			delta = reference - y;
			if (delta > 2 || delta < -2) {
				reference = y;
				scroll(offset + delta * scaleFactor);
			}
		}
		e.preventDefault();
		e.stopPropagation();
	}

	function recordTouches(e) {
		var touches = e.touches || [{pageX: e.pageX, pageY: e.pageY}],
			timestamp = e.timeStamp,
			currentTouchTop = touches[0].pageY;

		if (touches.length === 2) {
			currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
		}

		touchPositions.push({offset: currentTouchTop, timestamp: timestamp});
		if (touchPositions.length > 60) {
			touchPositions.splice(0, 30);
		}
	}

	function release(e) {
		pressed = false;

		var endPos = touchPositions.length - 1;
		var startPos = endPos - 1;

		// Move pointer to position measured 100ms ago
		for (var i = endPos - 1; i > 0 && touchPositions[i].timestamp > (touchPositions[endPos].timestamp - 100); i -= 1) {
			startPos = i;
		}

		var elapsed = touchPositions[endPos].timestamp - touchPositions[startPos].timestamp;
		var delta = touchPositions[endPos].offset - touchPositions[startPos].offset;

		var v = -1000 * delta / (1 + elapsed);
		velocity = 0.8 * v + 0.2 * velocity;

		amplitude = 1.0 * velocity;
		target = Math.round(offset + amplitude);
		timestamp = Date.now();
		requestAnimationFrame(autoScroll);

		e.preventDefault();
		e.stopPropagation();
	}

	function scrollTo(y, animate) {
		var maxAnimateDelta = 4000;
		if (animate) {
			if (y - offset > maxAnimateDelta) {
				offset = y - maxAnimateDelta;
			} else if (offset - y > maxAnimateDelta) {
				offset = y + maxAnimateDelta;
			}

			amplitude = y - offset;
			target = y;
			timestamp = Date.now();
			requestAnimationFrame(autoScroll);
		} else {
			amplitude = 0;
			scroll(y);
		}
	}

	function changeScrollPosition(y) {
		scroll(y);
	}

	function setDimensions(min, max) {
		minOffset = min;
		maxOffset = max;
	}

	return {
		setDimensions: setDimensions,
		scrollTo: scrollTo
	}
};


