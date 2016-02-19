/**
 * Created by chinghsu on 16/2/16.
 */

var needsRender = true;
var topOffset;

//dataGetter
var dataGetter = (function () {

	function injectScript(url) {
		var script = document.createElement('script');
		script.async = true;
		script.src = url;
		document.body.appendChild(script);
	}

	return {
		getDataPage: function (pageNum, callbackName) {
			dataCallback();
		}
	};
})();

//template
var template = (function () {

	var getInitialState = function () {

	};

	var render = function (index, domElement) {
		var el = document.createElement('div');
		//el.classList.add("item");
		StyleHelpers.applyElementStyle(el, {});
		domElement.appendChild(el);
	};

	return {
		initialState: getInitialState,
		render: render
	}

})();

LayersPool = function () {
	var layersByIdentifier = {};

	function addLayer(layer, hide) {
		var layerIdentifier = layer.getIdentifier();
		if (layersByIdentifier[layerIdentifier] == null) {
			layersByIdentifier[layerIdentifier] = [];
		}
		layersByIdentifier[layerIdentifier].push(layer);
		layer.setItemOffset(-10000);
		StyleHelpers.applyElementStyle(layer.getDomElement(), {display: 'none'});
		if (hide) {
			StyleHelpers.applyElementStyle(layer.getDomElement(), {display: 'none'})
		}
	}

	function borrowLayerWithIdentifier(identifier) {
		if (layersByIdentifier[identifier] == null) {
			return null;
		}
		var layer = layersByIdentifier[identifier].pop();
		if (layer != null) {
			StyleHelpers.applyElementStyle(layer.getDomElement(), {display: 'block'})
		}
		return layer;
	}

	return {
		addLayer: addLayer,
		borrowLayerWithIdentifier: borrowLayerWithIdentifier
	}
}

var MIN_FPS = 30, MAX_TIME_PER_FRAME = 1000 / MIN_FPS;
var Layer = function (parentElement) {
	var listItemElement = null,
		identifier = "",
		currentOffset = -1,
		itemIndex = -1,
		itemHeight = 0;

	listItemElement = createListItemWrapperElement();
	parentElement.appendChild(listItemElement);

	function attach(index, width, height, itemIdentifier) {
		itemIndex = index;
		itemHeight = height;
		StyleHelpers.applyElementStyle(listItemElement, {
			width: width + 'px',
			height: height + 'px',
			overflow: 'hidden'
		});
		itemHeight = height;
		// setItemOffset(topOffset);
		identifier = itemIdentifier;
		return this;
	}

	function getItemIndex() {
		return itemIndex;
	}

	function getDomElement() {
		return listItemElement;
	}

	function getIdentifier() {
		return identifier;
	}

	function getItemOffset() {
		return currentOffset;
	}

	function setItemOffset(offset) {
		StyleHelpers.applyTransformStyle(listItemElement, 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0' + ',' + offset + ', 0, 1)');
		currentOffset = offset;
	}

	function getItemHeight() {
		return itemHeight || (itemHeight = getDomElement().clientHeight);
	}

	function setItemHeight(newHeight) {
		itemHeight = newHeight;
	}

	function createListItemWrapperElement() {
		var el = document.createElement('div');
		el.classList.add("item");
		StyleHelpers.applyElementStyle(el, {
			position: 'absolute',
			top: 0,
			left: 0
		});
		return el;
	}

	return {
		attach: attach,
		getItemIndex: getItemIndex,
		getDomElement: getDomElement,
		getItemOffset: getItemOffset,
		setItemOffset: setItemOffset,
		getItemHeight: getItemHeight,
		setItemHeight: setItemHeight,
		getIdentifier: getIdentifier
	}
};


//	StyleHelpers

var StyleHelpers = (function () {
	var applyElementStyle = function (element, styleObj) {
			Object.keys(styleObj).forEach(function (key) {
				if (element.style[key] != styleObj[key]) {
					element.style[key] = styleObj[key];
				}
			})
		},

		applyTransformStyle = function (element, transformValue) {
			var styleObject = {};
			['webkit', 'Moz', 'O', 'ms'].forEach(function (prefix) {
					styleObject[prefix + 'Transform'] = transformValue;
				}
			);
			applyElementStyle(element, styleObject);
		};

	return {
		applyElementStyle: applyElementStyle,
		applyTransformStyle: applyTransformStyle
	}
})();


//AnimationFrameHelper
var AnimationFrameHelper = (function () {
	var measuredFPS = 60,
		runAnimation = false;

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

	return {
		startAnimationLoop: startAnimationLoop,
		stopAnimationLoop: stopAnimationLoop,
		getFPS: getFPS
	}
})();


//ScrollbarRenderer
var ScrollbarRenderer = function (rootElement) {
	var scrollbar = document.createElement('div'),
		clientHeight = rootElement.parentElement.clientHeight;

	StyleHelpers.applyElementStyle(scrollbar, {
		position: 'absolute',
		top: '0px',
		right: '0px',
		marginRight: '3px',
		opacity: 0.3,
		width: '5px',
		backgroundColor: "#333"
	});
	rootElement.appendChild(scrollbar);

	function render(topOffset, listHeight) {
		var attachedElement = rootElement.parentElement,
		//var attachedElement = rootElement,
			scrollbarHeight = Math.max(10, Math.floor(clientHeight / listHeight * clientHeight)),
			scrollbarPos = Math.floor(topOffset / (listHeight - clientHeight) * (clientHeight - scrollbarHeight)),
			heightInPx = scrollbarHeight + 'px';

		StyleHelpers.applyElementStyle(scrollbar, {
			height: heightInPx
		});
		StyleHelpers.applyTransformStyle(scrollbar, 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0' + ',' + ( scrollbarPos) + ', 0, 1)');
	}

	function refresh() {
		clientHeight = rootElement.parentElement.clientHeight;
		//clientHeight = rootElement.clientHeight;
	}

	return {
		render: render,
		refresh: refresh
	}
};

//ScrollerContainer
var Scroller = function (parentElement, direction, callback) {
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
		SCROLLING_TIME_CONSTANT = 525,
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

//ListItems
var ListItemsRenderer = function (attachedElement, scrollElement, listConfig, pageCallback) {

	var visibleHeight = attachedElement.clientHeight,
		itemWidth = attachedElement.clientWidth,
		renderedListItems = [],
		layersPool = new LayersPool();

	function render(topOffset, atIndex, offsetFromTop) {
		var startRenderTime = new Date().getTime();

		if (typeof atIndex == 'number' && atIndex >= 0) {
			while (renderedListItems.length > 0) {
				layersPool.addLayer(renderedListItems.pop());
			}

			var onlyRenderedItem = renderListItem(atIndex);
			onlyRenderedItem.setItemOffset(topOffset - (offsetFromTop || 0));
			renderedListItems.push(onlyRenderedItem);
		}


		var topRenderedItem = renderedListItems[0],
			bottomRenderedItem = renderedListItems[renderedListItems.length - 1];

		while (topRenderedItem && topRenderedItem.getItemOffset() > topOffset && topRenderedItem.getItemIndex() > 0) {
			topRenderedItem = renderBefore(topRenderedItem);
			if (new Date().getTime() - startRenderTime > MAX_TIME_PER_FRAME) {
				return true;
			}
		}

		if (bottomRenderedItem.getItemIndex() < listConfig.itemsCount && bottomRenderedItem.getIdentifier() == "$LoadMore") {
			var bottomIndex = bottomRenderedItem.getItemIndex();
			layersPool.addLayer(renderedListItems.pop());
			if (renderedListItems.length > 0) {
				bottomRenderedItem = renderedListItems[renderedListItems.length - 1];
			} else {
				return render(topOffset, bottomIndex);
			}
		}
		while (bottomRenderedItem && bottomRenderedItem.getItemOffset() + bottomRenderedItem.getItemHeight() < topOffset + visibleHeight && bottomRenderedItem.getItemIndex() < listConfig.itemsCount) {
			bottomRenderedItem = renderAfter(bottomRenderedItem);
			if (new Date().getTime() - startRenderTime > MAX_TIME_PER_FRAME) {
				return true;
			}
		}

		while (renderedListItems.length > 1 && topRenderedItem && topRenderedItem.getItemOffset() + topRenderedItem.getItemHeight() < topOffset) {
			layersPool.addLayer(renderedListItems.shift());
			topRenderedItem = renderedListItems[0];
		}

		while (renderedListItems.length > 1 && bottomRenderedItem && bottomRenderedItem.getItemOffset() > topOffset + visibleHeight) {
			layersPool.addLayer(renderedListItems.pop());
			bottomRenderedItem = renderedListItems[renderedListItems.length - 1];
		}

		return false;
	}

	function renderBefore(listItem) {
		var newItem = renderListItem(listItem.getItemIndex() - 1);
		if (newItem) {
			newItem.setItemOffset(listItem.getItemOffset() - newItem.getItemHeight());
			renderedListItems.unshift(newItem);
		}
		return newItem;
	}

	function renderAfter(listItem) {
		var newItem = renderListItem(listItem.getItemIndex() + 1);
		if (newItem) {
			newItem.setItemOffset(listItem.getItemOffset() + listItem.getItemHeight());
			renderedListItems.push(newItem);
		}
		return newItem;
	}

	function renderListItem(index) {
		if (index == listConfig.itemsCount) {
			if (!listConfig.hasMore) {
				return null;
			}
			return renderLoadMore();
		}

		var itemIdentifier = (listConfig.itemTypeGetter ? listConfig.itemTypeGetter(index) : ''),
			height = listConfig.itemHeightGetter && listConfig.itemHeightGetter(index),
			layer = borrowLayerForIndex(index, itemIdentifier, height);
		listConfig.itemRenderer(index, layer.getDomElement());
		return layer;
	}

	/*
	 Borrow a layer from the LayersPool and attach it to a certain item at index.
	 */
	function borrowLayerForIndex(index, identifier, height) {
		var layerIdentifier = identifier || (listConfig.itemTypeGetter ? listConfig.itemTypeGetter(index) : '');
		var layer = layersPool.borrowLayerWithIdentifier(layerIdentifier);
		if (layer == null) {
			layer = new Layer(scrollElement);
		}
		//index, topOffset, renderer, width, height, itemIdentifier
		var itemHeight = height || listConfig.itemHeightGetter && listConfig.itemHeightGetter(index);
		layer.attach(index, itemWidth - 9, itemHeight, layerIdentifier);
		//listItems.push(layer);
		return layer;
	}

	function renderLoadMore() {
		if (renderedListItems.length == 0 || renderedListItems[renderedListItems.length - 1].getIdentifier() != '$LoadMore') {
			var loadMoreLayer = borrowLayerForIndex(listConfig.itemsCount, '$LoadMore');
			listConfig.loadMoreRenderer(listConfig.itemsCount, loadMoreLayer.getDomElement());
			pageCallback();
			return loadMoreLayer;
		}

		return renderedListItems[renderedListItems.length - 1];
	}

	function refresh() {
		visibleHeight = attachedElement.clientHeight;
		itemWidth = attachedElement.clientWidth;
		renderedListItems.forEach(function (layer) {
			layersPool.addLayer(layer, true)
		});
		renderedListItems = [];
	}

	function getRenderedItems() {
		return renderedListItems;
	}

	return {
		render: render,
		refresh: refresh,
		getRenderedItems: getRenderedItems
	};
};

var listCallback = null;
var dataResults = [];
window.dataCallback = function (results) {
	for (var i = 0; i < 30; i++) {
		dataResults.push(i + 1);
	}
	//dataResults = dataResults.concat(results);
	//for (var i = 0; i < dataResults.length; ++i) {
	//	dataResults[i].index = i;
	//}
	//listCallback(results.length, true);
	setTimeout(function () {
		// f1的任务代码
		listCallback(dataResults.length, true);
	}, 1000);

}

var InfiniteList = function (listConfig) {

	var config = {
			itemHeightGetter: null,
			itemRenderer: function (index, domElement) {
				template.render(dataResults[index], domElement);
				//ReactDOM.render(React.createElement(template, listData[index]), domElement);
			},
			itemTypeGetter: null,
			dataFetch: function (fromIndex, callback) {
				//if (fromIndex == ITEMS_COUNT) {
				//	callback(0, false);
				//	return;
				//}
				//
				//setTimeout(function () {
				//	callback(100, true);
				//}, 2000);
				listCallback = callback;
				dataGetter.getDataPage(fromIndex / itemCount + 1, 'dataCallback');
			},
			loadMoreRenderer: function (index, domElement) {
				domElement.innerHTML = '<div style="margin-left:14px;height:50px">Loading...</div>';
			},
			//hasMore: false,
			hasMore: true,
			itemsCount: 100
			//itemsCount: 0
		},
		parentElement = null,
		parentElementHeight,
		rootElement = null,
		scrollElement = null,
		scrollbarRenderer = null,
		itemsRenderer = null,
		scroller = null,
		listItemsHeights = [],
		topOffset = 0,
		scrollToIndex = 0,
		topItemOffset = 0,
		itemCount = 20,
		needsRender = true;


	for (key in listConfig) {
		if (listConfig.hasOwnProperty(key)) {
			config[key] = listConfig[key];
		}
	}

	var initialPageConfig = listConfig.initialPage;
	if (initialPageConfig) {
		config.itemsCount = initialPageConfig.itemsCount || 0;
		config.hasMore = initialPageConfig.hasMore || false;
	}


	function attach(id_Dom, touchProvider) {
		parentElement = document.getElementById(id_Dom);
		initializeRootElement(parentElement);
		scrollbarRenderer = new ScrollbarRenderer(rootElement);
		itemsRenderer = new ListItemsRenderer(parentElement, scrollElement, config, loadMoreCallback);
		scroller = new Scroller(
			parentElement,
			"Vertical",
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

		window.addEventListener('resize', refresh.bind(this));
		runAnimationLoop();
		refresh();
		return this;
	}

	function detach() {
		AnimationFrameHelper.stopAnimationLoop();
		//parentElement.removeChild(rootElement);
		window.removeEventListener('resize', refresh.bind(this));
	}

	function runAnimationLoop() {
		AnimationFrameHelper.startAnimationLoop(function () {
			if (needsRender) {
				render();
			}
		});
	}

	function calculateHeights(fromIndex) {
		if (config.itemHeightGetter) {
			for (var i = fromIndex || 0; i <= config.itemsCount || 0; ++i) {
				listItemsHeights[i] = config.itemHeightGetter(i);
			}
		}
	}

	function initializeRootElement(parentElement) {
		scrollElement = document.createElement('div');
		StyleHelpers.applyElementStyle(scrollElement, {
			position: 'absolute',
			top: 0,
			bottom: 0
		});
		scrollElement.id="scrollContainer";

		rootElement = document.createElement('div');
		StyleHelpers.applyElementStyle(rootElement, {
			position: 'relative',
			height: parentElement.clientHeight + 'px',
			width: parentElement.clientWidth + 'px',
			overflow: 'hidden'
		});
		rootElement.appendChild(scrollElement);
		parentElement.appendChild(
			rootElement);
	};

	function refresh() {
		var topListItem = itemsRenderer.getRenderedItems()[0],
			topListItemIndex = topListItem && topListItem.getItemIndex() || 0,
			topItemStartsAt = topListItem && topListItem.getItemOffset() || 0,
			differenceFromTop = topOffset - topItemStartsAt;

		parentElementHeight = parentElement.clientHeight;
		StyleHelpers.applyElementStyle(rootElement, {
			height: parentElement.clientHeight + 'px',
			width: parentElement.clientWidth + 'px'
		});
		itemsRenderer.refresh();
		calculateHeights();
		scrollbarRenderer.refresh();
		scrollToItem(topListItemIndex, false, differenceFromTop);
	}

	function updateScroller() {
		var maxIndexToRender = config.itemsCount - 1 + (config.hasMore ? 1 : 0),
			renderedItems = itemsRenderer.getRenderedItems(),
			lastRenderedItem = renderedItems[renderedItems.length - 1],
			minScrollerOffset = Number.MIN_SAFE_INTEGER,
			maxScrollerOffset = Number.MAX_SAFE_INTEGER;

		if (renderedItems.length > 0 && renderedItems[0].getItemIndex() == 0) {
			minScrollerOffset = renderedItems[0].getItemOffset();
		}

		if (lastRenderedItem && lastRenderedItem.getItemIndex() == maxIndexToRender) {
			maxScrollerOffset = lastRenderedItem.getItemOffset() + lastRenderedItem.getItemHeight() - parentElementHeight;
		}

		scroller.setDimensions(minScrollerOffset, maxScrollerOffset);
	}

	function render() {
		var renderedItems;

		updateScroller();
		StyleHelpers.applyTransformStyle(scrollElement, 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0' + ',' + (-topOffset) + ', 0, 1)');
		needsRender = itemsRenderer.render(topOffset, scrollToIndex, topItemOffset);
		renderedItems = itemsRenderer.getRenderedItems();

		scrollToIndex = null;
		topItemOffset = null;


		renderedItems.forEach(function (item) {
			listItemsHeights[item.getItemIndex()] = item.getItemHeight();
		});

		var avarageItemHeight = 0,
			itemsCount = 0;
		for (var i = 0; i < listItemsHeights.length; ++i) {
			if (typeof listItemsHeights[i] == 'number') {

				avarageItemHeight += listItemsHeights[i];
				itemsCount++;
			}
		}
		avarageItemHeight = avarageItemHeight / itemsCount;
		scrollbarRenderer.render(avarageItemHeight * renderedItems[0].getItemIndex() + topOffset - renderedItems[0].getItemOffset(), avarageItemHeight * config.itemsCount);
	}

	function loadMoreCallback() {
		config.dataFetch(config.itemsCount, function (pageItemsCount, hasMore) {
			config.hasMore = hasMore;
			config.itemsCount += pageItemsCount;
			calculateHeights(config.itemsCount - pageItemsCount);
			scroller.scrollTo(itemsRenderer.getRenderedItems()[itemsRenderer.getRenderedItems().length - 1].getItemOffset() - parentElementHeight);
		});
	}

	function scrollToItem(index, animate, relativeOffset) {
		var targetPosition = 0;
		if (config.itemHeightGetter) {
			for (var i = 0; i < index; ++i) {
				targetPosition += config.itemHeightGetter(i);
			}
		} else {
			scrollToIndex = index;
		}
		topItemOffset = relativeOffset || 0;
		scroller.scrollTo(targetPosition, config.itemHeightGetter && animate);
	}

	function refreshItemHeight(index) {

		var renderedItems = itemsRenderer.getRenderedItems();
		var renderedListItem = renderedItems.filter(function (rItem) {
			return rItem.getItemIndex() == index;
		})[0];

		//we only need to do something if the index points to a rendered item.
		if (renderedListItem) {
			var newHeight = config.itemHeightGetter && config.itemHeightGetter(index),
				startOffset = renderedListItem.getItemOffset();

			if (!newHeight) {
				newHeight = renderedListItem.getDomElement().clientHeight
			}

			renderedListItem.setItemHeight(newHeight);

			var itemRenderIndex = renderedListItem.getItemIndex() - renderedItems[0].getItemIndex();
			var nextItem = renderedItems[itemRenderIndex + 1];
			if (renderedListItem.getItemOffset() < topOffset) {
				while (nextItem && renderedListItem) {
					renderedListItem.setItemOffset(nextItem.getItemOffset() - renderedListItem.getItemHeight());
					nextItem = renderedListItem;
					renderedListItem = renderedItems[--itemRenderIndex];
				}
			} else {
				while (nextItem && renderedListItem) {
					nextItem.setItemOffset(renderedListItem.getItemOffset() + renderedListItem.getItemHeight());
					renderedListItem = nextItem;
					nextItem = renderedItems[++itemRenderIndex + 1];
				}
			}
		}
	}

	return {
		attach: attach,
		detach: detach,
		scrollToItem: scrollToItem,
		refresh: refresh,
		refreshItemHeight: refreshItemHeight
	}

};




