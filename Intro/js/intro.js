/**
 * Created by chinghsu on 16/2/26.
 */

var regExp = {
	empty: {
		reg: /\S/,
		warning: "此处不能为空"
	},
	mobile: {
		reg: /^1[3|4|5|7|8]\d{9}$/,
		warning: "你填写的电话号码为空或不符合格式!"
	},
	telephone: {
		reg: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
		warning: "你填写的电话号码为空或不符合格式!"
	},
	ip: {
		reg: /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
		warning: "你填写的ip为空或者不符合格式:127.0.0.1!"
	},
	email: {
		reg: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
		warning: "你填写的Email为空或者不符合格式:Jack.Li@gmail.com!"
	},
	zipCode: {
		reg: /[1-9]{1}(\d+){5}/,
		warning: "你填写的邮政编码为空或者不符合格式!"
	},
	IDCard: {
		reg: /\d{18}|\d{15}/,
		warning: "你填写的身份证号码为空或者不符合格式!"
	},
	name: {
		reg: /[\u4E00-\u9FA5]{2,5}/,
		warning: "你填写的中文名字为空或者不是汉字!"
	},
	nickName: {
		reg: /^[s]{0,}$|^[ws]{7,}$/,
		warning: "你填写的昵称为空或者超过6个字符了!"
	}
}

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
		showSkip: true,
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

			if (currentItem.element != null) {
				introItems.push(currentItem);
			}
		}

	}

	var tempIntroItems = [];
	for (var z = 0; z < introItems.length; z++) {
		introItems[z] && tempIntroItems.push(introItems[z]);  // copy non-empty values to the end of the array
	}

	introItems = tempIntroItems;


	//Ok, sort all items with given steps
	introItems.sort(function (a, b) {
		return a.step - b.step;
	});

	//set it to the intro object
	self._introItems = introItems;

	//add overlay layer to the page
	if (_addOverlayLayer.call(self, targetElm)) {
		//then, start the show
		_nextStep.call(self);

		var skipButton = targetElm.querySelector('.intro-skipbutton'),
			nextStepButton = targetElm.querySelector('.intro-nextbutton');


		self._onResize = function (e) {
			_setHelperLayerPosition.call(self, document.querySelector('.intro-helperLayer'));
			_setHelperLayerPosition.call(self, document.querySelector('.intro-tooltipReferenceLayer'));
		};

		if (window.addEventListener) {
			//for window resize
			window.addEventListener('resize', self._onResize, true);
		} else if (document.attachEvent) { //IE
			//for window resize
			document.attachEvent('onresize', self._onResize);
		}
	}
	return false;
}

function _cloneObject(object) {
	if (object == null || typeof (object) != 'object' || typeof (object.nodeType) != 'undefined') {
		return object;
	}
	var temp = {};
	for (var key in object) {
		temp[key] = _cloneObject(object[key]);
	}
	return temp;
}
function _mergeOptions(obj1, obj2) {
	var obj3 = {};
	for (var attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
}

function _isFixed(element) {
	var p = element.parentNode;

	if (p.nodeName === 'HTML') {
		return false;
	}

	if (_getPropValue(element, 'position') == 'fixed') {
		return true;
	}

	return _isFixed(p);
};
function _getWinSize() {
	if (window.innerWidth != undefined) {
		return {width: window.innerWidth, height: window.innerHeight};
	} else {
		var D = document.documentElement;
		return {width: D.clientWidth, height: D.clientHeight};
	}
}

function _checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer) {
	if (targetOffset.left + tooltipLayerStyleLeft + tooltipOffset.width > windowSize.width) {
		// off the right side of the window
		tooltipLayer.style.left = (windowSize.width - tooltipOffset.width - targetOffset.left) + 'px';
		return false;
	}
	tooltipLayer.style.left = tooltipLayerStyleLeft + 'px';
	return true;
}

/**
 * Set tooltip right so it doesn't go off the left side of the window
 *
 * @return boolean true, if tooltipLayerStyleRight is ok.  false, otherwise.
 */
function _checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer) {
	if (targetOffset.left + targetOffset.width - tooltipLayerStyleRight - tooltipOffset.width < 0) {
		// off the left side of the window
		tooltipLayer.style.left = (-targetOffset.left) + 'px';
		return false;
	}
	tooltipLayer.style.right = tooltipLayerStyleRight + 'px';
	return true;
}


function _getProgress() {
	// Steps are 0 indexed
	var currentStep = parseInt((this._currentStep + 1), 10);
	return ((currentStep / this._introItems.length) * 100);
};


function _setHelperLayerPosition(helperLayer) {
	if (helperLayer) {
		//prevent error when `this._currentStep` in undefined
		if (!this._introItems[this._currentStep]) return;

		var currentElement = this._introItems[this._currentStep],
			elementPosition = _getOffset(currentElement.element),
			widthHeightPadding = 10;

		// if the target element is fixed, the tooltip should be fixed as well.
		if (_isFixed(currentElement.element)) {
			helperLayer.className += ' intro-fixedTooltip';
		}

		if (currentElement.position == 'floating') {
			widthHeightPadding = 0;
		}

		//set new position to helper layer
		helperLayer.setAttribute('style', 'width: ' + (elementPosition.width + widthHeightPadding) + 'px; ' +
			'height:' + (elementPosition.height + widthHeightPadding) + 'px; ' +
			'top:' + (elementPosition.top - 5) + 'px;' +
			'left: ' + (elementPosition.left - 5) + 'px;');

	}
}

function _one(type, fn) {
	var self = this;
	if (document.addEventListener) {
		self.addEventListener(type, function () {
			self.removeEventListener(type, arguments.callee, false);
			fn();
		}, false);
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

	var self = this;
	if (this._introItems[this._currentStep].jNext || nextStep.element.tagName == "BUTTON") {
		_one.bind(nextStep.element)("click", _nextStep.bind(self));
		//nextStep.element.onclick = function(){
		//	_nextStep.call(self);
		//
		//}
		//nextStep.element.addEventListener("click",_nextStep.bind(this));
	}
	_showElement.call(this, nextStep);
}

function _showElement(targetElement) {

	if (typeof (this._introChangeCallback) !== 'undefined') {
		this._introChangeCallback.call(this, targetElement.element);
	}

	var self = this,
		oldHelperLayer = document.querySelector('.intro-helperLayer'),
		oldReferenceLayer = document.querySelector('.intro-tooltipReferenceLayer'),
		highlightClass = 'intro-helperLayer',
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
		var oldHelperNumberLayer = oldReferenceLayer.querySelector('.intro-helperNumberLayer'),
			oldtooltipLayer = oldReferenceLayer.querySelector('.intro-tooltiptext'),
			oldArrowLayer = oldReferenceLayer.querySelector('.intro-arrow'),
			oldtooltipContainer = oldReferenceLayer.querySelector('.intro-tooltip'),
			skipTooltipButton = oldReferenceLayer.querySelector('.intro-skipbutton'),
			prevTooltipButton = oldReferenceLayer.querySelector('.intro-prevbutton'),
			nextTooltipButton = oldReferenceLayer.querySelector('.intro-nextbutton');

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

		//remove `intro-fixParent` class from the elements
		var fixParents = document.querySelectorAll('.intro-fixParent');
		if (fixParents && fixParents.length > 0) {
			for (var i = fixParents.length - 1; i >= 0; i--) {
				fixParents[i].className = fixParents[i].className.replace(/intro-fixParent/g, '').replace(/^\s+|\s+$/g, '');
			}
			;
		}

		//remove old classes
		var oldShowElement = document.querySelector('.intro-showElement');
		oldShowElement.className = oldShowElement.className.replace(/intro-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, '');

		//we should wait until the CSS3 transition is competed (it's 0.3 sec) to prevent incorrect `height` and `width` calculation
		if (self._lastShowElementTimer) {
			clearTimeout(self._lastShowElementTimer);
		}
		self._lastShowElementTimer = setTimeout(function () {
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
			oldReferenceLayer.querySelector('.intro-bullets li > a.active').className = '';
			oldReferenceLayer.querySelector('.intro-bullets li > a[data-stepnumber="' + targetElement.step + '"]').className = 'active';

			oldReferenceLayer.querySelector('.intro-progress .intro-progressbar').setAttribute('style', 'width:' + _getProgress.call(self) + '%;');

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
		var helperLayer = document.createElement('div'),
			referenceLayer = document.createElement('div'),
			arrowLayer = document.createElement('div'),
			tooltipLayer = document.createElement('div'),
			tooltipTextLayer = document.createElement('div'),
			bulletsLayer = document.createElement('div'),
			progressLayer = document.createElement('div'),
			buttonsLayer = document.createElement('div');

		helperLayer.className = highlightClass;
		referenceLayer.className = 'intro-tooltipReferenceLayer';

		//set new position to helper layer
		_setHelperLayerPosition.call(self, helperLayer);
		_setHelperLayerPosition.call(self, referenceLayer);

		//add helper layer to target element
		this._targetElement.appendChild(helperLayer);
		this._targetElement.appendChild(referenceLayer);

		arrowLayer.className = 'intro-arrow';

		tooltipTextLayer.className = 'intro-tooltiptext';
		tooltipTextLayer.innerHTML = targetElement.intro;

		bulletsLayer.className = 'intro-bullets';

		if (this._options.showBullets === false) {
			bulletsLayer.style.display = 'none';
		}

		var ulContainer = document.createElement('ul');

		for (var i = 0, stepsLength = this._introItems.length; i < stepsLength; i++) {
			var innerLi = document.createElement('li');
			var anchorLink = document.createElement('a');

			anchorLink.onclick = function () {
				self.goToStep(this.getAttribute('data-stepnumber'));
			};

			if (i === (targetElement.step - 1)) anchorLink.className = 'active';

			anchorLink.href = 'javascript:void(0);';
			anchorLink.innerHTML = "&nbsp;";
			anchorLink.setAttribute('data-stepnumber', this._introItems[i].step);

			innerLi.appendChild(anchorLink);
			ulContainer.appendChild(innerLi);
		}

		bulletsLayer.appendChild(ulContainer);

		progressLayer.className = 'intro-progress';

		if (this._options.showProgress === false) {
			progressLayer.style.display = 'none';
		}
		var progressBar = document.createElement('div');
		progressBar.className = 'intro-progressbar';
		progressBar.setAttribute('style', 'width:' + _getProgress.call(this) + '%;');

		progressLayer.appendChild(progressBar);

		buttonsLayer.className = 'intro-tooltipbuttons';
		if (this._options.showButtons === false) {
			buttonsLayer.style.display = 'none';
		}

		tooltipLayer.className = 'intro-tooltip';
		tooltipLayer.appendChild(tooltipTextLayer);
		tooltipLayer.appendChild(bulletsLayer);
		tooltipLayer.appendChild(progressLayer);

		//add helper layer number
		if (this._options.showStepNumbers == true) {
			var helperNumberLayer = document.createElement('span');
			helperNumberLayer.className = 'intro-helperNumberLayer';
			helperNumberLayer.innerHTML = targetElement.step;
			referenceLayer.appendChild(helperNumberLayer);
		}

		tooltipLayer.appendChild(arrowLayer);
		referenceLayer.appendChild(tooltipLayer);

		//next button
		var nextTooltipButton = document.createElement('a');

		nextTooltipButton.onclick = function () {
			if (self._introItems.length - 1 != self._currentStep) {
				var correct = (!self._introItems[self._currentStep].condition && !self._introItems[self._currentStep].subdomCondition) || _regJudge(regExp, self._introItems[self._currentStep]).tfHint;
				if (correct) {
					_nextStep.call(self);
				} else {
					var introToolText = document.querySelector('.intro-tooltiptext');
					introToolText.innerHTML = _regJudge(regExp, self._introItems[self._currentStep]).warnings;
				}
			}
		};

		nextTooltipButton.href = 'javascript:void(0);';
		nextTooltipButton.innerHTML = this._options.nextLabel;

		//previous button
		var prevTooltipButton = document.createElement('a');

		prevTooltipButton.onclick = function () {
			if (self._currentStep != 0) {
				_previousStep.call(self);
			}
		};

		prevTooltipButton.href = 'javascript:void(0);';
		prevTooltipButton.innerHTML = this._options.prevLabel;

		//skip button
		var skipTooltipButton;
		if (self._options.showSkip) {
			skipTooltipButton = document.createElement('a');
			skipTooltipButton.className = 'intro-button intro-skipbutton';
			skipTooltipButton.href = 'javascript:void(0);';
			skipTooltipButton.innerHTML = this._options.skipLabel;

			skipTooltipButton.onclick = function () {
				if (self._introItems.length - 1 == self._currentStep && typeof (self._introCompleteCallback) === 'function') {
					self._introCompleteCallback.call(self);
				}

				if (self._introItems.length - 1 != self._currentStep && typeof (self._introExitCallback) === 'function') {
					self._introExitCallback.call(self);
				}

				_exitIntro.call(self, self._targetElement);
			};

			buttonsLayer.appendChild(skipTooltipButton);
		}

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
		prevTooltipButton.className = 'intro-button intro-prevbutton intro-disabled';
		prevTooltipButton.tabIndex = '-1';
		nextTooltipButton.className = 'intro-button intro-nextbutton';
		if (this._options.showSkip) {
			skipTooltipButton.innerHTML = this._options.skipLabel;
		}
	} else if (this._introItems.length - 1 == this._currentStep || this._introItems.length == 1) {
		if (this._options.showSkip) {
			skipTooltipButton.innerHTML = this._options.doneLabel;
		}
		prevTooltipButton.className = 'intro-button intro-prevbutton';
		nextTooltipButton.className = 'intro-button intro-nextbutton intro-disabled';
		nextTooltipButton.tabIndex = '-1';
	} else {
		prevTooltipButton.className = 'intro-button intro-prevbutton';
		nextTooltipButton.className = 'intro-button intro-nextbutton';
		if (this._options.showSkip) {
			skipTooltipButton.innerHTML = this._options.skipLabel;
		}
	}

	//Set focus on "next" button, so that hitting Enter always moves you onto the next step
	nextTooltipButton.focus();

	//add target element position style
	targetElement.element.className += ' intro-showElement';

	var currentElementPosition = _getPropValue(targetElement.element, 'position');
	if (currentElementPosition !== 'absolute' &&
		currentElementPosition !== 'relative') {
		//change to new intro item
		targetElement.element.className += ' intro-relativePosition';
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
			parentElm.className += ' intro-fixParent';
		}

		parentElm = parentElm.parentNode;
	}


	if (typeof (this._introAfterChangeCallback) !== 'undefined') {
		this._introAfterChangeCallback.call(this, targetElement.element);
	}
}

function _regJudge(regTerm, currentElement) {
	var judgeResult = {
		tfHint: true,
		warnings: []
	};
	if (currentElement.condition) {
		if (currentElement.element) {
			var pattern = regTerm[currentElement.condition];
			if (!pattern.reg.test(currentElement.element.innerHTML)) {
				judgeResult.tfHint = false;
				judgeResult.warnings.push(pattern.warning);
			}
		}
	}
	if (currentElement.subdomCondition) {
		for (var index in currentElement.subdomCondition) {
			var child = currentElement.subdomCondition[index];
			var pattern = regTerm[child.condition];
			if (currentElement.element.querySelector(child.dom) && !pattern.reg.test(currentElement.element.querySelector(child.dom).innerHTML)) {
				judgeResult.tfHint = false;
				judgeResult.warnings.push(pattern.warning);
			}
		}
	}
	judgeResult.warnings = judgeResult.warnings.join(" ");
	return judgeResult;
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
	var overlayLayer = targetElement.querySelector('.intro-overlay');

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
	var helperLayer = targetElement.querySelector('.intro-helperLayer');
	if (helperLayer) {
		helperLayer.parentNode.removeChild(helperLayer);
	}

	var referenceLayer = targetElement.querySelector('.intro-tooltipReferenceLayer');
	if (referenceLayer) {
		referenceLayer.parentNode.removeChild(referenceLayer);
	}
	//remove disableInteractionLayer
	var disableInteractionLayer = targetElement.querySelector('.intro-disableInteraction');
	if (disableInteractionLayer) {
		disableInteractionLayer.parentNode.removeChild(disableInteractionLayer);
	}

	//remove intro floating element
	var floatingElement = document.querySelector('.introFloatingElement');
	if (floatingElement) {
		floatingElement.parentNode.removeChild(floatingElement);
	}

	//remove `intro-showElement` class from the element
	var showElement = document.querySelector('.intro-showElement');
	if (showElement) {
		showElement.className = showElement.className.replace(/intro-[a-zA-Z]+/g, '').replace(/^\s+|\s+$/g, ''); // This is a manual trim.
	}

	//remove `intro-fixParent` class from the elements
	var fixParents = document.querySelectorAll('.intro-fixParent');
	if (fixParents && fixParents.length > 0) {
		for (var i = fixParents.length - 1; i >= 0; i--) {
			fixParents[i].className = fixParents[i].className.replace(/intro-fixParent/g, '').replace(/^\s+|\s+$/g, '');
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

function _placeTooltip(targetElement, tooltipLayer, arrowLayer, helperNumberLayer, hintMode) {
	var tooltipCssClass = '',
		currentStepObj,
		tooltipOffset,
		targetOffset,
		windowSize,
		currentTooltipPosition;

	hintMode = hintMode || false;

	//reset the old style
	tooltipLayer.style.top = null;
	tooltipLayer.style.right = null;
	tooltipLayer.style.bottom = null;
	tooltipLayer.style.left = null;
	tooltipLayer.style.marginLeft = null;
	tooltipLayer.style.marginTop = null;

	arrowLayer.style.display = 'inherit';

	if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
		helperNumberLayer.style.top = null;
		helperNumberLayer.style.left = null;
	}

	//prevent error when `this._currentStep` is undefined
	if (!this._introItems[this._currentStep]) return;

	//if we have a custom css class for each step
	currentStepObj = this._introItems[this._currentStep];
	if (typeof (currentStepObj.tooltipClass) === 'string') {
		tooltipCssClass = currentStepObj.tooltipClass;
	} else {
		tooltipCssClass = this._options.tooltipClass;
	}

	tooltipLayer.className = ('intro-tooltip ' + tooltipCssClass).replace(/^\s+|\s+$/g, '');

	currentTooltipPosition = this._introItems[this._currentStep].position;
	if ((currentTooltipPosition == "auto" || this._options.tooltipPosition == "auto")) {
		if (currentTooltipPosition != "floating") { // Floating is always valid, no point in calculating
			currentTooltipPosition = _determineAutoPosition.call(this, targetElement, tooltipLayer, currentTooltipPosition);
		}
	}
	targetOffset = _getOffset(targetElement);
	tooltipOffset = _getOffset(tooltipLayer);
	windowSize = _getWinSize();

	switch (currentTooltipPosition) {
		case 'top':
			arrowLayer.className = 'intro-arrow bottom';

			if (hintMode) {
				var tooltipLayerStyleLeft = 0;
			} else {
				var tooltipLayerStyleLeft = 15;
			}

			_checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
			tooltipLayer.style.bottom = (targetOffset.height + 20) + 'px';
			break;
		case 'right':
			tooltipLayer.style.left = (targetOffset.width + 20) + 'px';
			if (targetOffset.top + tooltipOffset.height > windowSize.height) {
				// In this case, right would have fallen below the bottom of the screen.
				// Modify so that the bottom of the tooltip connects with the target
				arrowLayer.className = "intro-arrow left-bottom";
				tooltipLayer.style.top = "-" + (tooltipOffset.height - targetOffset.height - 20) + "px";
			} else {
				arrowLayer.className = 'intro-arrow left';
			}
			break;
		case 'left':
			if (!hintMode && this._options.showStepNumbers == true) {
				tooltipLayer.style.top = '15px';
			}

			if (targetOffset.top + tooltipOffset.height > windowSize.height) {
				// In this case, left would have fallen below the bottom of the screen.
				// Modify so that the bottom of the tooltip connects with the target
				tooltipLayer.style.top = "-" + (tooltipOffset.height - targetOffset.height - 20) + "px";
				arrowLayer.className = 'intro-arrow right-bottom';
			} else {
				arrowLayer.className = 'intro-arrow right';
			}
			tooltipLayer.style.right = (targetOffset.width + 20) + 'px';

			break;
		case 'floating':
			arrowLayer.style.display = 'none';

			//we have to adjust the top and left of layer manually for intro items without element
			tooltipLayer.style.left = '50%';
			tooltipLayer.style.top = '50%';
			tooltipLayer.style.marginLeft = '-' + (tooltipOffset.width / 2) + 'px';
			tooltipLayer.style.marginTop = '-' + (tooltipOffset.height / 2) + 'px';

			if (typeof(helperNumberLayer) != 'undefined' && helperNumberLayer != null) {
				helperNumberLayer.style.left = '-' + ((tooltipOffset.width / 2) + 18) + 'px';
				helperNumberLayer.style.top = '-' + ((tooltipOffset.height / 2) + 18) + 'px';
			}

			break;
		case 'bottom-right-aligned':
			arrowLayer.className = 'intro-arrow top-right';

			var tooltipLayerStyleRight = 0;
			_checkLeft(targetOffset, tooltipLayerStyleRight, tooltipOffset, tooltipLayer);
			tooltipLayer.style.top = (targetOffset.height + 20) + 'px';
			break;

		case 'bottom-middle-aligned':
			arrowLayer.className = 'intro-arrow top-middle';

			var tooltipLayerStyleLeftRight = targetOffset.width / 2 - tooltipOffset.width / 2;

			// a fix for middle aligned hints
			if (hintMode) {
				tooltipLayerStyleLeftRight += 5;
			}

			if (_checkLeft(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, tooltipLayer)) {
				tooltipLayer.style.right = null;
				_checkRight(targetOffset, tooltipLayerStyleLeftRight, tooltipOffset, windowSize, tooltipLayer);
			}
			tooltipLayer.style.top = (targetOffset.height + 20) + 'px';
			break;

		case 'bottom-left-aligned':
		// Bottom-left-aligned is the same as the default bottom
		case 'bottom':
		// Bottom going to follow the default behavior
		default:
			arrowLayer.className = 'intro-arrow top';

			var tooltipLayerStyleLeft = 0;
			_checkRight(targetOffset, tooltipLayerStyleLeft, tooltipOffset, windowSize, tooltipLayer);
			tooltipLayer.style.top = (targetOffset.height + 20) + 'px';
			break;
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

function _getPropValue(element, propName) {
	var propValue = '';
	if (element.currentStyle) { //IE
		propValue = element.currentStyle[propName];
	} else if (document.defaultView && document.defaultView.getComputedStyle) { //Others
		propValue = document.defaultView.getComputedStyle(element, null).getPropertyValue(propName);
	}

	//Prevent exception in IE
	if (propValue && propValue.toLowerCase) {
		return propValue.toLowerCase();
	} else {
		return propValue;
	}
};


var intro = function (targetElm) {
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


intro.fn = Intro.prototype = {
	clone: function () {
		return new Intro(this);
	},
	setOption: function (option, value) {
		this._options[option] = value;
		return this;
	},
	setOptions: function (options) {
		this._options = _mergeOptions(this._options, options);
		return this;
	},
	start: function () {
		_introForElement.call(this, this._targetElement);
		return this;
	},
	goToStep: function (step) {
		//_goToStep.call(this, step);
		//return this;
	},
	nextStep: function () {
		_nextStep.call(this);
		return this;
	},
	previousStep: function () {
		_previousStep.call(this);
		return this;
	},
	oncomplete: function (providedCallback) {
		if (typeof (providedCallback) === 'function') {
			this._introCompleteCallback = providedCallback;
		} else {
			throw new Error('Provided callback for oncomplete was not a function.');
		}
		return this;
	},
	exit: function () {
		_exitIntro.call(this, this._targetElement);
		//return this;
	}
}
