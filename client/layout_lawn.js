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

Template.layout_lawn.onCreated(function () {
});

Template.layout_lawn.onDestroyed(function () {
});

Template.layout_lawn.onRendered(function () {
	// Start dropdowns
	$(".dropdown-button").dropdown();

	var lawnShape = CreateLawnData.lawnData.shape;
	lawnShape.printMe();
	
	var infoContainer = document.getElementById('info-container');
	var offset = infoContainer.offsetTop + infoContainer.clientHeight;

	Dispatcher.dispatch('layout', new Message.ActionInit(LayoutActionType.Init, offset));
	console.log('layout_lawn.onRendered');
});

Template.layout_lawn.helpers({
	PixiJSView: function () {
		return PixiJSView;
	},
	store: function () {
		return PixiJSViewActionStore;
	}
});

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

