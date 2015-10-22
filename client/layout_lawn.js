/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 kishigo
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// For layout, we use pixijs since we want a true 2D view to simplify the layout.
// We will use a top view, looking down on the lawn area from above to simplify
// the actual layout activity.
var pixiContainer = null;
var pixiRenderer = null;
var runAnimation = false;
Session.setDefault(Constants.gridEnabled, true);
// this is always in cm
Session.setDefault(Constants.gridSpacing, 24);

var MOUSE_MODE = {Select: 0, Create: 1};

/**
 * pixiAnimate function to furnish animation energy using requestAnimationFrame()
 * Currently this just animates a test case.
 */
var pixiAnimate = function pixiAnimate () {
	if (runAnimation) {
		requestAnimationFrame(pixiAnimate);
		watersave.rotation += 0.1;
		pixiRenderer.render(pixiContainer);
	}
	else {
		console.log('pixiAnimate: stopping animation');
	}
};

// Test stuff
var texture = PIXI.Texture.fromImage('watersave.jpg');
var watersave = new PIXI.Sprite(texture);
watersave.anchor.x = 0.5;
watersave.anchor.y = 0.5;
watersave.position.x = 200;
watersave.position.y = 200;
var layoutFrame = new PixiLayout.LayoutFrame();
var testMode = false;
var testFit = false;
var defaultFitMode = PixiLayout.FitType.FitTypeXY;

/**
 * @var {array} _lawnParts - current working set of lawn parts
 */
var _lawnParts = null;

class TestAbstractPartLL {
	constructor () {
		// dimensions in meters
		this.width = .50;
		this.height = .50;
		this.url = 'watersave.jpg';
	}

	getWidth () { return this.width; }
	getHeight () { return this.height; }
	getImageUrl () { return this.url; }
}

var testAbstractPart = new TestAbstractPartLL();
var _currentLayoutPart = null;
var _currentMouseMode = MOUSE_MODE.Select;

// Mouse handlers
var _mouseDnSelectHandler = function _mouseDnSelectHandler (pixelPt) {
	PixiLayout.setMouseMvHandler(_mouseMvSelectHandler);
	PixiLayout.enableSelectBox(true);
};
var _mouseMvSelectHandler = function _mouseMvSelectHandler (pixelPt) {
	PixiLayout.drawSelectBox();
};
var _mouseUpSelectHandler = function _mouseUpSelectHandler (pixelPt) {
	PixiLayout.setMouseMvHandler(null);
	PixiLayout.finishSelectBox();
};
var _mouseMvCreateHandler = function _mouseMvCreateHandler (noop, pixelPt) {
	PixiLayout.moveMouseSprite(pixelPt);
};
var _mouseEnterCreateHandler = function _mouseEnterCreateHandler (pixelPt) {
	console.log('_mouseEnterCreateHandler: ' + pixelPt);
	PixiLayout.setMouseMvHandler(_mouseMvCreateHandler);
	PixiLayout.enableMouseSprite(true, pixelPt, _currentLayoutPart.getUrl());
};
var _mouseLeaveCreateHandler = function _mouseLeaveCreateHandler () {
	console.log('_mouseLeaveCreateHandler');
	PixiLayout.setMouseMvHandler(null);
	PixiLayout.enableMouseSprite(false);
};
var _mouseUpTestHandler = function _testHandler (pixelPt) {
	if (PixiLayout.isMouseUpDnSame() && _currentLayoutPart) {
		PixiLayout.createLayoutPart(_currentLayoutPart, pixelPt.x, pixelPt.y);
	}
};

var _setMouseMode = function _setMouseMode (mouseMode) {
	var targetEnterHandler = null;
	var targetLeaveHandler = null;
	var targetDnHandler = null;
	var targetUpHandler = null;
	var targetMvHandler = null;
	switch (mouseMode) {
	default:
	case MOUSE_MODE.Select:
		targetDnHandler = _mouseDnSelectHandler;
		targetUpHandler = _mouseUpSelectHandler;
		targetMvHandler = _mouseMvSelectHandler;
		break;
	case MOUSE_MODE.Create:
		targetEnterHandler = _mouseEnterCreateHandler;
		targetLeaveHandler = _mouseLeaveCreateHandler;
		targetUpHandler = _mouseUpTestHandler;
		break;
	}
	PixiLayout.setMouseDnHandler(targetDnHandler);
	PixiLayout.setMouseMvHandler(targetMvHandler);
	PixiLayout.setMouseUpHandler(targetUpHandler);
	PixiLayout.setMouseEnterHandler(targetEnterHandler);
	PixiLayout.setMouseLeaveHandler(targetLeaveHandler);
};

/**
 * _renderLayout function to redraw the layout
 * typically called from Meteor.defer so that window dimensions
 * are already finalized and usable for scaling
 */
var _renderLayout = function _renderLayout () {
	var layoutContainer = document.getElementById('layout-div-container');
	var width = (layoutContainer) ? layoutContainer.clientWidth : 800;
	var height = (layoutContainer) ? layoutContainer.clientHeight : 600;
	console.log('_renderLayout: width: ' + width + ', height: ' + height);
	if (pixiRenderer) {
		pixiRenderer.resize(width, height);
		console.log('_renderLayout: resize: ');
	}
	layoutFrame.fit(defaultFitMode);
	// Test mousehandler
	if (_currentLayoutPart = CreateLawnData.getCurrentLayoutPart()) {
		_currentMouseMode = MOUSE_MODE.Create;
	}
	else {
		_currentMouseMode = MOUSE_MODE.Select;
	}
	_setMouseMode(_currentMouseMode);
	if (testFit) {
		switch (defaultFitMode) {
		case PixiLayout.FitType.FitTypeX:
			defaultFitMode = PixiLayout.FitType.FitTypeY;
			break;
		case PixiLayout.FitType.FitTypeXY:
			defaultFitMode = PixiLayout.FitType.FitTypeX;
			break;
		case PixiLayout.FitType.FitTypeY:
			defaultFitMode = PixiLayout.FitType.FitTypeXY;
		}
	}
};

/**
 * _handleResizeEvent function to handle the resize event.
 * Dynamically resize rightBar height when window resizes.
 * Just use the Meteor.defer() so that the DOM is fully
 * rendered before we call _renderRightBar()
 */
var _handleResizeEvent = Utils.createDeferredFunction(_renderLayout);

var unsubscribe = null;

var _handleLayoutMessages = function _handleLayoutMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case 'select':
			console.log('_handleLayoutMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			CreateLawnData.setCurrentLayoutPart(null);
			if (_currentMouseMode != MOUSE_MODE.Select) {
				_currentMouseMode = MOUSE_MODE.Select;
				_setMouseMode(_currentMouseMode);
			}
			break;
		}
	}
	else {
		console.log('_handleLayoutMessages:ERROR, invalid message: ' + message);
	}
};

Template.layout_lawn.onCreated(function () {
	runAnimation = true;
	window.addEventListener('resize', _handleResizeEvent);
	
	// Test code
	//CreateLawnData.createLayoutPart(testAbstractPart);
	unsubscribe = MBus.subscribe(Constants.mbus_layout, _handleLayoutMessages);
});

Template.layout_lawn.onDestroyed(function () {
	// Have to stop animation and renderer
	runAnimation = false;
	pixiRenderer = null;
	// disable select box on exit to handle timing issues when this template is 
	// reentered.  We reenable on first mouse down which ensures graphic state is ok
	PixiLayout.enableSelectBox(false);
	window.removeEventListener('resize', _handleResizeEvent);
	unsubscribe.remove();
});

Template.layout_lawn.onRendered(function () {
	// Start dropdowns
	$(".dropdown-button").dropdown();

	var lawnShape = CreateLawnData.lawnData.shape;
	lawnShape.printMe();
	
	var infoContainer = document.getElementById('info-container');
	var offset = infoContainer.offsetTop + infoContainer.clientHeight;
	
	// The pixiContainer state is kept between entries here but
	// must be managed at a meta level above the create context so that we
	// can distinguish between:
	// 1. entering a new lawn create/open sequence
	// 2. bouncing between layout/render of the current lawn sequence
	if (pixiContainer === null) {
		if (!testMode) {
			pixiContainer = layoutFrame.getLayoutFrame();
		}
		else {
			pixiContainer = new PIXI.Container();
			pixiContainer.addChild(watersave);
		}
	}
	// See onDestroyed() which is stopping animation and clearing pixiRenderer
	// => every time we enter onRendered(), pixiRenderer should be null
	if (pixiRenderer === null) {
		var layout = document.getElementById('layout-canvas');
		var layoutContainer = document.getElementById('layout-div-container');
		var width = (layoutContainer) ? layoutContainer.clientWidth : 800;
		var height = (layoutContainer) ? layoutContainer.clientHeight : 600;
		height -= offset;
		pixiRenderer = PIXI.autoDetectRenderer(width,
			height,
			{view:layout}
		);
		PixiLayout.setRenderer(pixiRenderer);
		// By here the pixiRenderer is set and has the correct pixel render area
		_renderLayout();
		
		requestAnimationFrame(pixiAnimate);
	}
	console.log('layout_lawn.onRendered, pixiRenderer: ' + pixiRenderer);
});

var testLayoutCreate = function testLayoutCreate () {
	console.log('testLayoutCreate: ENTRY');
};

var _settings = {
	gridEnabled: Session.get(Constants.gridEnabled),
	gridSpacing: Session.get(Constants.gridSpacing),
	gridUnits: (Session.get(Constants.userUnitsOfMeasure) === Constants.English) ? 'inches' : 'cm'
};

Template.layout_settings.onCreated(function () {
	_settings.gridEnabled = Session.get(Constants.gridEnabled);
	_settings.gridSpacing = Session.get(Constants.gridSpacing);
	_settings.gridUnits = (Session.get(Constants.userUnitsOfMeasure) === Constants.English) ? 'inches' : 'cm';

});

Template.layout_settings.onDestroyed(function () {
});

Template.layout_settings.helpers({
	gridSpacing: function () {
		var spacing = _settings.gridSpacing;
		spacing = (Session.get(Constants.userUnitsOfMeasure) === Constants.English) ? Utils.convertMetersToInches(spacing/100) : spacing;
		spacing = Math.round(spacing);
		return spacing;
	},
	gridUnits: function () {
		return (Session.get(Constants.userUnitsOfMeasure) === Constants.English) ? 'inches' : 'cm';
	},
	gridStateOn: function () {
		return (Session.get(Constants.gridEnabled)) ? 'checked' : '';
	},
	gridStateOff: function () {
		return (Session.get(Constants.gridEnabled)) ? '' : 'checked';
	}
});

Template.layout_settings.events({
	'click #grid-on': function () {
		_settings.gridEnabled = true;
	},
	'click #grid-off': function () {
		_settings.gridEnabled = false;
	},
	'click #layout-settings-cancel': function () {
		ViewStack.popState(true);
		//Session.set(Constants.renderView, Constants.layout_lawn);
	},
	'click #layout-settings-accept': function () {
		Session.set(Constants.gridEnabled, _settings.gridEnabled);
		var temp = document.getElementById('grid-spacing').value;
		if (_settings.gridUnits === 'inches') {
			// convert to cm
			temp = Utils.convertEnglishToMeters(0, temp);
			temp *= 100;
		}
		Session.set(Constants.gridSpacing, temp);
		ViewStack.popState(true);
		//Session.set(Constants.renderView, Constants.layout_lawn);
	}
});

