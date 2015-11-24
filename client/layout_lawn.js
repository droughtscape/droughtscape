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
Session.setDefault(Constants.gridEnabled, true);
// this is always in cm
Session.setDefault(Constants.gridSpacing, 24);

var defaultFitMode = LayoutManager.getDefaultFitMode();

/**
 * @var {array} _lawnParts - current working set of lawn parts
 */
var _currentMouseMode = LayoutManager.MOUSE_MODE.Select;



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
	LayoutManager.resizeLayout(width, height, defaultFitMode);
	// Test mousehandler
	if (LayoutManager.setActiveLayoutPart(LayoutManager.getCurrentAbstractPart())) {
		_currentMouseMode = LayoutManager.MOUSE_MODE.Create;
	}
	else {
		_currentMouseMode = LayoutManager.MOUSE_MODE.Select;
	}
	LayoutManager.setMouseMode(_currentMouseMode);
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
		switch (message.value.action) {
		case NavBarTagActionType.SelectMode:
			LayoutManager.setCurrentAbstractPart(null);
			if (_currentMouseMode != LayoutManager.MOUSE_MODE.Select) {
				_currentMouseMode = LayoutManager.MOUSE_MODE.Select;
				LayoutManager.setMouseMode(_currentMouseMode);
			}
			break;
		case NavBarTagActionType.MoveToBack:
			LayoutManager.moveToBack();
			break;
		case NavBarTagActionType.MoveToFront:
			LayoutManager.moveToFront();
			break;
		case NavBarTagActionType.MoveBackward:
			LayoutManager.moveBackward();
			break;
		case NavBarTagActionType.MoveForward:
			LayoutManager.moveForward();
			break;
		case NavBarTagActionType.Delete:
			LayoutManager.deleteItems();
			break;
		case NavBarTagActionType.Move:
			break;
		case NavBarTagActionType.Copy:
			break;
		case NavBarTagActionType.Paste:
			break;
		default :
			console.log('_handleLayoutMessages: action: ' + message.value.action);
			break;
		}
	}
	else {
		console.log('_handleLayoutMessages:ERROR, invalid message: ' + message);
	}
};

Template.layout_lawn.onCreated(function () {
	LayoutManager.enableAnimation(true);
	window.addEventListener('resize', _handleResizeEvent);
	// NavBar events
	unsubscribe = MBus.subscribe(Constants.mbus_layout, _handleLayoutMessages);
});

Template.layout_lawn.onDestroyed(function () {
	// Have to stop animation and renderer
	LayoutManager.enableAnimation(false);
	LayoutManager.destroyLayout();
	// disable select box on exit to handle timing issues when this template is 
	// reentered.  We reenable on first mouse down which ensures graphic state is ok
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
	
	// See onDestroyed() which is stopping animation and destroys layout
	// => every time we enter onRendered(), create layout again
	if (!LayoutManager.isValid()) {
		var layout = document.getElementById('layout-canvas');
		var layoutContainer = document.getElementById('layout-div-container');
		var width = (layoutContainer) ? layoutContainer.clientWidth : 800;
		var height = (layoutContainer) ? layoutContainer.clientHeight : 600;
		height -= offset;
		LayoutManager.createLayout(layout, width, height);
		// By here the layout is set up and has the correct pixel render area
		_renderLayout();
		
		LayoutManager.startAnimation();
	}
	console.log('layout_lawn.onRendered');
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
	}
});

