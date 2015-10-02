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

Template.layout_lawn.onCreated(function () {
	NavConfig.pushNavBar('layout');
	NavConfig.pushRightBar('rightBar', 'layout_lawn');
	runAnimation = true;
	window.addEventListener('resize', _handleResizeEvent);
});

Template.layout_lawn.onDestroyed(function () {
	NavConfig.popNavBar();
	NavConfig.popRightBar();
	// Have to stop animation and renderer
	runAnimation = false;
	pixiRenderer = null;
	window.removeEventListener('resize', _handleResizeEvent);
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

var _settings = {
	gridEnabled: Session.get(Constants.gridEnabled),
	gridSpacing: Session.get(Constants.gridSpacing),
	gridUnits: (Session.get(Constants.userUnitsOfMeasure) === 'English') ? 'inches' : 'cm'
};

Template.layout_settings.onCreated(function () {
	NavConfig.pushEmptyRightBar();
	_settings.gridEnabled = Session.get(Constants.gridEnabled);
	_settings.gridSpacing = Session.get(Constants.gridSpacing);
	_settings.gridUnits = (Session.get(Constants.userUnitsOfMeasure) === 'English') ? 'inches' : 'cm';

});

Template.layout_settings.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.layout_settings.helpers({
	gridSpacing: function () {
		var spacing = _settings.gridSpacing;
		spacing = (Session.get(Constants.userUnitsOfMeasure) === 'English') ? Utils.convertMetersToInches(spacing/100) : spacing;
		spacing = Math.round(spacing);
		return spacing;
	},
	gridUnits: function () {
		return (Session.get(Constants.userUnitsOfMeasure) === 'English') ? 'inches' : 'cm';
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
		Session.set(Constants.renderView, 'layout_lawn');
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
		Session.set(Constants.renderView, 'layout_lawn');
	}
});

