/**
 * Created by chinghsu on 16/2/26.
 */

function Intro(obj) {
	this._targetElement = obj;
	this._introItems = [];
	this._options = {
		/* Next button label in tooltip box */
		nextLabel: 'Next &rarr;',
		/* Previous button label in tooltip box */
		prevLabel: '&larr; Back',
		/* Skip button label in tooltip box */
		skipLabel: 'Skip',
		/* Done button label in tooltip box */
		doneLabel: 'Done',
		/* Default tooltip box position */
		tooltipPosition: 'bottom',
		/* Next CSS class for tooltip boxes */
		tooltipClass: '',
		/* CSS class that is added to the helperLayer */
		highlightClass: '',
		/* Close introduction when pressing Escape button? */
		exitOnEsc: true,
		/* Close introduction when clicking on overlay layer? */
		exitOnOverlayClick: true,
		/* Show step numbers in introduction? */
		showStepNumbers: true,
		/* Let user use keyboard to navigate the tour? */
		keyboardNavigation: true,
		/* Show tour control buttons? */
		showButtons: true,
		/* Show tour bullets? */
		showBullets: true,
		/* Show tour progress? */
		showProgress: false,
		/* Scroll to highlighted element? */
		scrollToElement: true,
		/* Set the overlay opacity */
		overlayOpacity: 0.8,
		/* Precedence of positions, when auto is enabled */
		positionPrecedence: ["bottom", "top", "right", "left"],
		/* Disable an interaction with element? */
		disableInteraction: false,
		/* Default hint position */
		hintPosition: 'top-middle',
		/* Hint button label */
		hintButtonLabel: 'Got it'
	};
}

var introJs = function (targetElm) {
	if (typeof (targetElm) === 'object') {
		//Ok, create a new instance
		return new Intro(targetElm);

	} else if (typeof (targetElm) === 'string') {
		//select the target element with query selector
		var targetElement = document.querySelector(targetElm);

		if (targetElement) {
			return new Intro(targetElement);
		} else {
			throw new Error('There is no element with given selector.');
		}
	} else {
		return new Intro(document.body);
	}
};


function _introForElement(targetElm) {
	var introItems = [],
		self = this;

	if (this._options.steps) {
		//use steps passed programmatically
		for (var i = 0, stepsLength = this._options.steps.length; i < stepsLength; i++) {
			var currentItem = _cloneObject(this._options.steps[i]);
			//set the step
			currentItem.step = introItems.length + 1;
			//use querySelector function only when developer used CSS selector
			if (typeof(currentItem.element) === 'string') {
				//grab the element with given selector from the page
				currentItem.element = document.querySelector(currentItem.element);
			}

			//intro without element
			if (typeof(currentItem.element) === 'undefined' || currentItem.element == null) {
				var floatingElementQuery = document.querySelector(".introFloatingElement");

				if (floatingElementQuery == null) {
					floatingElementQuery = document.createElement('div');
					floatingElementQuery.className = 'introFloatingElement';

					document.body.appendChild(floatingElementQuery);
				}

				currentItem.element = floatingElementQuery;
				currentItem.position = 'floating';
			}

			if (currentItem.element != null) {
				introItems.push(currentItem);
			}
		}

	}

	//Ok, sort all items with given steps
	introItems.sort(function (a, b) {
		return a.step - b.step;
	});

	//set it to the introJs object
	self._introItems = introItems;

	//add overlay layer to the page
	if (_addOverlayLayer.call(self, targetElm)) {
		//then, start the show
		_nextStep.call(self);

		var skipButton = targetElm.querySelector('.introjs-skipbutton'),
			nextStepButton = targetElm.querySelector('.introjs-nextbutton');
	}

}


function _cloneObject(object) {
	if (object == null || typeof (object) != 'object' || typeof (object.nodeType) != 'undefined') {
		return object;
	}
	var temp = {};
	for (var key in object) {
		if (typeof (jQuery) != 'undefined' && object[key] instanceof jQuery) {
			temp[key] = object[key];
		} else {
			temp[key] = _cloneObject(object[key]);
		}
	}
	return temp;
}

function _goToStep(step) {
	//because steps starts with zero
	this._currentStep = step - 2;
	if (typeof (this._introItems) !== 'undefined') {
		_nextStep.call(this);
	}
}

function _nextStep() {
	this._direction = 'forward';

	if (typeof (this._currentStep) === 'undefined') {
		this._currentStep = 0;
	} else {
		++this._currentStep;
	}

	if ((this._introItems.length) <= this._currentStep) {
		//end of the intro
		//check if any callback is defined
		if (typeof (this._introCompleteCallback) === 'function') {
			this._introCompleteCallback.call(this);
		}
		_exitIntro.call(this, this._targetElement);
		return;
	}

	var nextStep = this._introItems[this._currentStep];
	if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
		this._introBeforeChangeCallback.call(this, nextStep.element);
	}

	_showElement.call(this, nextStep);
}


function _previousStep() {
	this._direction = 'backward';

	if (this._currentStep === 0) {
		return false;
	}

	var nextStep = this._introItems[--this._currentStep];
	if (typeof (this._introBeforeChangeCallback) !== 'undefined') {
		this._introBeforeChangeCallback.call(this, nextStep.element);
	}

	_showElement.call(this, nextStep);
}


function _exitIntro(targetElement) {
	//remove overlay layer from the page
	var overlayLayer = targetElement.querySelector('.introjs-overlay');

	//return if intro already completed or skipped
	if (overlayLayer == null) {
		return;
	}

	//for fade-out animation
	overlayLayer.style.opacity = 0;
	setTimeout(function () {
		if (overlayLayer.parentNode) {
			overlayLayer.parentNode.removeChild(overlayLayer);
		}
	}, 500);

	//remove all helper layers
	var helperLayer = targetElement.querySelector('.introjs-helperLayer');
	if (helperLayer) {
		helperLayer.parentNode.removeChild(helperLayer);
	}

	var referenceLayer = targetElement.querySelector('.introjs-tooltipReferenceLayer');
	if (referenceLayer) {
		referenceLayer.parentNode.removeChild(referenceLayer);
	}
	//remove disableInteractionLayer
	var disableInteractionLayer = targetElement.querySelector('.introjs-disableInteraction');
	if (disableInteractionLayer) {
		disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
	}

	//remove intro floating element
	var floatingElement = document.querySelector('.introjsFloatingElement');
	if (floatingElement) {
		floatingElement.parentNode.removeChild(floatingElement);
	}

	//remove `introjs-showElement` class from the element
	var showElement = document.querySelector('.introjs-showElement');
	if (showElement) {
		showElement.className = showElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
	}

	//remove `introjs-fixParent` class from the elements
	var fixParents = document.querySelectorAll('.introjs-fixParent');
	if (fixParents && fixParents.length > 0) {
		for (var i = fixParents.length - 1; i >= 0; i--) {
			fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
		}
	}

	//clean listeners
	if (window.removeEventListener) {
		window.removeEventListener('keydown', this._onKeyDown, true);
	} else if (document.detachEvent) { //IE
		document.detachEvent('onkeydown', this._onKeyDown);
	}

	//set the step to zero
	this._currentStep = undefined;
}


function _showElement(targetElement) {

	if (typeof (this._introChangeCallback) !== 'undefined') {
		this._introChangeCallback.call(this, targetElement.element);
	}

	var self = this,
		oldHelperLayer = document.querySelector('.introjs-helperLayer'),
		oldReferenceLayer = document.querySelector('.introjs-tooltipReferenceLayer'),
		highlightClass = 'introjs-helperLayer',
		elementPosition = _getOffset(targetElement.element);

	//check for a current step highlight class
	if (typeof (targetElement.highlightClass) === 'string') {
		highlightClass += (' ' + targetElement.highlightClass);
	}
	//check for options highlight class
	if (typeof (this._options.highlightClass) === 'string') {
		highlightClass += (' ' + this._options.highlightClass);
	}

	if (oldHelperLayer != null) {
		var oldHelperNumberLayer = oldReferenceLayer.querySelector('.introjs-helperNumberLayer'),
			oldtooltipLayer      = oldReferenceLayer.querySelector('.introjs-tooltiptext'),
			oldArrowLayer        = oldReferenceLayer.querySelector('.introjs-arrow'),
			oldtooltipContainer  = oldReferenceLayer.querySelector('.introjs-tooltip'),
			skipTooltipButton    = oldReferenceLayer.querySelector('.introjs-skipbutton'),
			prevTooltipButton    = oldReferenceLayer.querySelector('.introjs-prevbutton'),
			nextTooltipButton    = oldReferenceLayer.querySelector('.introjs-nextbutton');

		//update or reset the helper highlight class
		oldHelperLayer.className = highlightClass;
		//hide the tooltip
		oldtooltipContainer.style.opacity = 0;
		oldtooltipContainer.style.display = "none";

		if (oldHelperNumberLayer != null) {
			var lastIntroItem = this._introItems[(targetElement.step - 2 >= 0 ? targetElement.step - 2 : 0)];

			if (lastIntroItem != null && (this._direction == 'forward' && lastIntroItem.position == 'floating') || (this._direction == 'backward' && targetElement.position == 'floating')) {
				oldHelperNumberLayer.style.opacity = 0;
			}
		}

		//set new position to helper layer
		_setHelperLayerPosition.call(self, oldHelperLayer);
		_setHelperLayerPosition.call(self, oldReferenceLayer);

		//remove `introjs-fixParent` class from the elements
		var fixParents = document.querySelectorAll('.introjs-fixParent');
		if (fixParents && fixParents.length > 0) {
			for (var i = fixParents.length - 1; i >= 0; i--) {
				fixParents[i].className = fixParents[i].className.replace(/introjs-fixParent/g, '').replace(/^\s+|\s+$/g, '');
			};
		}

		//remove old classes
		var oldShowElement = document.querySelector('.introjs-showElement');
		oldShowElement.className = oldShowElement.className.replace(/introjs-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');

		//we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
		if (self._lastShowElementTimer) {
			clearTimeout(self._lastShowElementTimer);
		}
		self._lastShowElementTimer = setTimeout(function() {
			//set current step to the label
			if (oldHelperNumberLayer != null) {
				oldHelperNumberLayer.innerHTML = targetElement.step;
			}
			//set current tooltip text
			oldtooltipLayer.innerHTML = targetElement.intro;
			//set the tooltip position
			oldtooltipContainer.style.display = "block";
			_placeTooltip.call(self, targetElement.element, oldtooltipContainer, oldArrowLayer, oldHelperNumberLayer);

			//change active bullet
			oldReferenceLayer.querySelector('.introjs-bullets li > a.active').className = '';
			oldReferenceLayer.querySelector('.introjs-bullets li > a[data-stepnumber="' + targetElement.step + '"]').className = 'active';

			oldReferenceLayer.querySelector('.introjs-progress .introjs-progressbar').setAttribute('style', 'width:' + _getProgress.call(self) + '%;');

			//show the tooltip
			oldtooltipContainer.style.opacity = 1;
			if (oldHelperNumberLayer) oldHelperNumberLayer.style.opacity = 1;

			//reset button focus
			if (nextTooltipButton.tabIndex === -1) {
				//tabindex of -1 means we are at the end of the tour - focus on skip / done
				skipTooltipButton.focus();
			} else {
				//still in the tour, focus on next
				nextTooltipButton.focus();
			}
		}, 350);

	} else {
		var helperLayer       = document.createElement('div'),
			referenceLayer    = document.createElement('div'),
			arrowLayer        = document.createElement('div'),
			tooltipLayer      = document.createElement('div'),
			tooltipTextLayer  = document.createElement('div'),
			bulletsLayer      = document.createElement('div'),
			progressLayer     = document.createElement('div'),
			buttonsLayer      = document.createElement('div');

		helperLayer.className = highlightClass;
		referenceLayer.className = 'introjs-tooltipReferenceLayer';

		//set new position to helper layer
		_setHelperLayerPosition.call(self, helperLayer);
		_setHelperLayerPosition.call(self, referenceLayer);

		//add helper layer to target element
		this._targetElement.appendChild(helperLayer);
		this._targetElement.appendChild(referenceLayer);

		arrowLayer.className = 'introjs-arrow';

		tooltipTextLayer.className = 'introjs-tooltiptext';
		tooltipTextLayer.innerHTML = targetElement.intro;

		bulletsLayer.className = 'introjs-bullets';

		if (this._options.showBullets === false) {
			bulletsLayer.style.display = 'none';
		}

		var ulContainer = document.createElement('ul');

		for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
			var innerLi    = document.createElement('li');
			var anchorLink = document.createElement('a');

			anchorLink.onclick = function() {
				self.goToStep(this.getAttribute('data-stepnumber'));
			};

			if (i === (targetElement.step-1)) anchorLink.className = 'active';

			anchorLink.href = 'javascript:void(0);';
			anchorLink.innerHTML = "&nbsp;";
			anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);

			innerLi.appendChild(anchorLink);
			ulContainer.appendChild(innerLi);
		}

		bulletsLayer.appendChild(ulContainer);

		progressLayer.className = 'introjs-progress';

		if (this._options.showProgress === false) {
			progressLayer.style.display = 'none';
		}
		var progressBar = document.createElement('div');
		progressBar.className = 'introjs-progressbar';
		progressBar.setAttribute('style', 'width:' + _getProgress.call(this) + '%;');

		progressLayer.appendChild(progressBar);

		buttonsLayer.className = 'introjs-tooltipbuttons';
		if (this._options.showButtons === false) {
			buttonsLayer.style.display = 'none';
		}

		tooltipLayer.className = 'introjs-tooltip';
		tooltipLayer.appendChild(tooltipTextLayer);
		tooltipLayer.appendChild(bulletsLayer);
		tooltipLayer.appendChild(progressLayer);

		//add helper layer number
		if (this._options.showStepNumbers == true) {
			var helperNumberLayer = document.createElement('span');
			helperNumberLayer.className = 'introjs-helperNumberLayer';
			helperNumberLayer.innerHTML = targetElement.step;
			referenceLayer.appendChild(helperNumberLayer);
		}

		tooltipLayer.appendChild(arrowLayer);
		referenceLayer.appendChild(tooltipLayer);

		//next button
		var nextTooltipButton = document.createElement('a');

		nextTooltipButton.onclick = function() {
			if (self._introItems.length - 1 != self._currentStep) {
				_nextStep.call(self);
			}
		};

		nextTooltipButton.href = 'javascript:void(0);';
		nextTooltipButton.innerHTML = this._options.nextLabel;

		//previous button
		var prevTooltipButton = document.createElement('a');

		prevTooltipButton.onclick = function() {
			if (self._currentStep != 0) {
				_previousStep.call(self);
			}
		};

		prevTooltipButton.href = 'javascript:void(0);';
		prevTooltipButton.innerHTML = this._options.prevLabel;

		//skip button
		var skipTooltipButton = document.createElement('a');
		skipTooltipButton.className = 'introjs-button introjs-skipbutton';
		skipTooltipButton.href = 'javascript:void(0);';
		skipTooltipButton.innerHTML = this._options.skipLabel;

		skipTooltipButton.onclick = function() {
			if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
				self._introCompleteCallback.call(self);
			}

			if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
				self._introExitCallback.call(self);
			}

			_exitIntro.call(self, self._targetElement);
		};

		buttonsLayer.appendChild(skipTooltipButton);

		//in order to prevent displaying next/previous button always
		if (this._introItems.length > 1) {
			buttonsLayer.appendChild(prevTooltipButton);
			buttonsLayer.appendChild(nextTooltipButton);
		}

		tooltipLayer.appendChild(buttonsLayer);

		//set proper position
		_placeTooltip.call(self, targetElement.element, tooltipLayer, arrowLayer, helperNumberLayer);
	}

	//disable interaction
	if (this._options.disableInteraction === true) {
		_disableInteraction.call(self);
	}

	prevTooltipButton.removeAttribute('tabIndex');
	nextTooltipButton.removeAttribute('tabIndex');

	if (this._currentStep == 0 && this._introItems.length > 1) {
		prevTooltipButton.className = 'introjs-button introjs-prevbutton introjs-disabled';
		prevTooltipButton.tabIndex = '-1';
		nextTooltipButton.className = 'introjs-button introjs-nextbutton';
		skipTooltipButton.innerHTML = this._options.skipLabel;
	} else if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
		skipTooltipButton.innerHTML = this._options.doneLabel;
		prevTooltipButton.className = 'introjs-button introjs-prevbutton';
		nextTooltipButton.className = 'introjs-button introjs-nextbutton introjs-disabled';
		nextTooltipButton.tabIndex = '-1';
	} else {
		prevTooltipButton.className = 'introjs-button introjs-prevbutton';
		nextTooltipButton.className = 'introjs-button introjs-nextbutton';
		skipTooltipButton.innerHTML = this._options.skipLabel;
	}

	//Set focus on "next" button, so that hitting Enter always moves you onto the next step
	nextTooltipButton.focus();

	//add target element position style
	targetElement.element.className += ' introjs-showElement';

	var currentElementPosition = _getPropValue(targetElement.element, 'position');
	if (currentElementPosition !== 'absolute' &&
		currentElementPosition !== 'relative') {
		//change to new intro item
		targetElement.element.className += ' introjs-relativePosition';
	}

	var parentElm = targetElement.element.parentNode;
	while (parentElm != null) {
		if (parentElm.tagName.toLowerCase() === 'body') break;

		//fix The Stacking Contenxt problem.
		//More detail: https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context
		var zIndex = _getPropValue(parentElm, 'z-index');
		var opacity = parseFloat(_getPropValue(parentElm, 'opacity'));
		var transform = _getPropValue(parentElm, 'transform') || _getPropValue(parentElm, '-webkit-transform') || _getPropValue(parentElm, '-moz-transform') || _getPropValue(parentElm, '-ms-transform') || _getPropValue(parentElm, '-o-transform');
		if (/[0-9]+/.test(zIndex) || opacity < 1 || (transform !== 'none' && transform !== undefined)) {
			parentElm.className += ' introjs-fixParent';
		}

		parentElm = parentElm.parentNode;
	}


	if (typeof (this._introAfterChangeCallback) !== 'undefined') {
		this._introAfterChangeCallback.call(this, targetElement.element);
	}
}






//增加蒙层
function _addOverlayLayer(targetElm) {
	var overlayLayer = document.createElement('div'),
		styleText = '',
		self = this;

	//set css class name
	overlayLayer.className = 'intro-overlay';

	//check if the target element is body, we should calculate the size of overlay layer in a better way
	if (targetElm.tagName.toLowerCase() === 'body') {
		styleText += 'top: 0;bottom: 0; left: 0;right: 0;position: fixed;';
		overlayLayer.setAttribute('style', styleText);
	} else {
		//set overlay layer position
		var elementPosition = _getOffset(targetElm);
		if (elementPosition) {
			styleText += 'width: ' + elementPosition.width + 'px; height:' + elementPosition.height + 'px; top:' + elementPosition.top + 'px;left: ' + elementPosition.left + 'px;';
			overlayLayer.setAttribute('style', styleText);
		}
	}

	targetElm.appendChild(overlayLayer);

	overlayLayer.onclick = function () {
		if (self._options.exitOnOverlayClick == true) {

			//check if any callback is defined
			if (self._introExitCallback != undefined) {
				self._introExitCallback.call(self);
			}
			_exitIntro.call(self, targetElm);
		}
	};

	setTimeout(function () {
		styleText += 'opacity: ' + self._options.overlayOpacity.toString() + ';';
		overlayLayer.setAttribute('style', styleText);
	}, 10);

	return true;
};

//计算元素位置,大小
function _getOffset(element) {
	var elementPosition = {};

	//set width
	elementPosition.width = element.offsetWidth;

	//set height
	elementPosition.height = element.offsetHeight;

	//calculate element top and left
	var _x = 0;
	var _y = 0;
	while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
		_x += element.offsetLeft;
		_y += element.offsetTop;
		element = element.offsetParent;
	}
	//set top
	elementPosition.top = _y;
	//set left
	elementPosition.left = _x;

	return elementPosition;
};


//Prototype
introJs.fn = Intro.prototype = {
	clone: function () {
		return new Intro(this);
	},
	setOption: function (option, value) {
		this._options[option] = value;
		return this;
	},
	setOptions: function (options) {
		//this._options = _mergeOptions(this._options, options);
		//return this;
	},
	start: function () {
		//_introForElement.call(this, this._targetElement);
		//return this;
	},
	goToStep: function (step) {
		//_goToStep.call(this, step);
		//return this;
	},
	nextStep: function () {
		//_nextStep.call(this);
		//return this;
	},
	previousStep: function () {
		//_previousStep.call(this);
		//return this;
	},
	exit: function () {
		//_exitIntro.call(this, this._targetElement);
		//return this;
	},
	//refresh: function() {
	//	//_setHelperLayerPosition.call(this, document.querySelector('.introjs-helperLayer'));
	//	//_setHelperLayerPosition.call(this, document.querySelector('.introjs-tooltipReferenceLayer'));
	//	//return this;
	//},
	//onbeforechange: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._introBeforeChangeCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onbeforechange was not a function');
	//	}
	//	return this;
	//},
	//onchange: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._introChangeCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onchange was not a function.');
	//	}
	//	return this;
	//},
	//onafterchange: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._introAfterChangeCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onafterchange was not a function');
	//	}
	//	return this;
	//},
	//oncomplete: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._introCompleteCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for oncomplete was not a function.');
	//	}
	//	return this;
	//},
	//onhintsadded: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._hintsAddedCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onhintsadded was not a function.');
	//	}
	//	return this;
	//},
	//onhintclick: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._hintClickCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onhintclick was not a function.');
	//	}
	//	return this;
	//},
	//onhintclose: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._hintCloseCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onhintclose was not a function.');
	//	}
	//	return this;
	//},
	//onexit: function(providedCallback) {
	//	if (typeof (providedCallback) === 'function') {
	//		this._introExitCallback = providedCallback;
	//	} else {
	//		throw new Error('Provided callback for onexit was not a function.');
	//	}
	//	return this;
	//},
	//addHints: function() {
	//	_populateHints.call(this, this._targetElement);
	//	return this;
	//}
};