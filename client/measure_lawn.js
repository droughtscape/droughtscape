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
var lawnDataDisplay = {name: 'MyLawn', w1: 0, w2: 0, l1: 0, l2: 0, s: 0};

var _insertFirstItem = function _insertFirstItem(userEmail, lawnData) {
	var item = {user: userEmail, myLawns: []};
	item.myLawns.push(CreateLawnData.lawnData);
	DroughtscapeUsers.insert(item);
};

var _updateLawns = function _updateLawns(myLawns, lawn) {
	var lawnUpdated = false;
	for (var i = 0, len = myLawns.length; i < len; ++i) {
		// if lawn is already present, just update any values
		if (myLawns[i].name === lawn.name) {
			myLawns[i] = lawn;
			lawnUpdated = true;
		}
	}
	if (!lawnUpdated) {
		// Not found, just push it
		myLawns.push(lawn);
	}
};

/**
 * _updateShapeDims function var with the generic behavior to update shape dimensions
 * as appropriate to the given shape.  We assign shape specific functions to this
 * @return {boolean} true if ok, false if there is a problem
 */
var _updateShapeDims;

Template.measure_lawn.onCreated(function () {
});

Template.measure_lawn.onDestroyed(function () {
});

Template.measure_lawn.helpers({
	measureLawnShape: function () {
		var lawnTemplate = null;
		switch (CreateLawnData.lawnData.shape.shapeType) {
		case 'rectangle':
			_updateShapeDims = _updateRectDims;
			lawnTemplate = 'measure_rectangle_lawn';
			break;
		case 'corner':
			_updateShapeDims = _updateCornerDims;
			lawnTemplate = 'measure_corner_lawn';
			break;
		case 'custom':
			_updateShapeDims = _updateCustomDims;
			lawnTemplate = 'measure_custom_lawn';
			break;
		}
		return lawnTemplate;
	},
	englishDefault: function () {
		var units = Session.get(Constants.userUnitsOfMeasure);
		return (units === 'English') ? 'checked' : '';
	},
	metricDefault: function () {
		var units = Session.get(Constants.userUnitsOfMeasure);
		return (units === 'Metric') ? 'checked' : '';
	},
	englishLabelColor: function () {
		var units = Session.get(Constants.userUnitsOfMeasure);
		return (units === 'English') ? Constants.color_highlight : Constants.color_gray;
	},
	metricLabelColor: function () {
		var units = Session.get(Constants.userUnitsOfMeasure);
		return (units === 'Metric') ? Constants.color_highlight : Constants.color_gray;
	},
	disabled: function () {
		// enable/disable the Accept button based on valid area
		this.enabled = (Session.get(Constants.computedArea) > 0);
		return (this.enabled) ? '' : 'disabled';
	}
});

var _checkEnabled = function _checkEnabled (item) {
	for (var i=0,len=item.classList.length; i<len; ++i) {
		if (item.classList[i] === 'disabled') {
			return fasle;
		}
	}
	return true;
};

Template.measure_lawn.events({
	'click #measure-lawn-cancel': function () {
		ViewStack.clearState();
		ViewStack.pushTarget(ViewTargetType.home);
	},
	'click #measure-lawn-back': function () {
		ViewStack.popState(true);
	},
	'click #name-lawn': function () {
		CreateLawnData.lawnData.name = document.getElementById('lawn_name').value;
	},
	'click #open-lawn': function () {
		ViewStack.pushTarget(ViewTargetType.favorites);
	},
	'click .unit-select': function (e) {
		var clickedButton = e.currentTarget;
		Session.set(Constants.userUnitsOfMeasure, clickedButton.id);
	},
	'click #measure-lawn-accept': function (e) {
		if (_checkEnabled(e.currentTarget)) {
			console.log('lawn-measure clicked');
			console.log('lawnData: ' + CreateLawnData.lawnData);
			if (_updateShapeDims()) {
				var user = Meteor.user();
				var userEmail = user.emails[0].address;
				// See if we already have a profile, if so, look for myLawns, if not create one
				var dsUsers = DroughtscapeUsers.find({});
				var dsUsersArray = dsUsers.fetch();
				if (dsUsersArray.length > 0) {
					var updated = null;
					for (var i = 0, len = dsUsersArray.length; i < len; ++i) {
						if (dsUsersArray[i].user === userEmail) {
							// found us, update
							if (!dsUsersArray[i].myLawns) {
								dsUsersArray[i].myLawns = [];
							}
							_updateLawns(dsUsersArray[i].myLawns, CreateLawnData.lawnData);
							updated = dsUsersArray[i];
							break;
						}
					}
					if (!updated) {
						// user not found, add
						_insertFirstItem(userEmail, CreateLawnData.lawnData);
					}
					else {
						DroughtscapeUsers.update(updated._id, updated);
					}
				}
				else {
					// No users so add us here
					_insertFirstItem(userEmail, CreateLawnData.lawnData);
				}
				ViewStack.pushTarget(ViewTargetType.createBuildLawn);
			}
			else {
				// send an alert toast and stay here.  If the user wants to abort or go back, 
				// they can use the appropriate buttons
				Materialize.toast('Zero width or length!', 3000, 'rounded red-text');
			}
		}
	}
});

var _getRectDims = function _getRectDims() {
	var rectShape = CreateLawnData.lawnData.shape;
	return rectShape.dims;
};

/**
 * _updateRectDims function specific to rectangular lawns, updates shape dimensions
 * @return {boolean} true if ok, false if there is a problem, like 0 width, 0 length
 */
var _updateRectDims = function _updateRectDims () {
	var rectDims = _getRectDims();
	if (Session.get(Constants.userUnitsOfMeasure) === Constants.English) {
		rectDims.width = Utils.convertEnglishToMeters(document.getElementById('lawn_width_feet').value,
			document.getElementById('lawn_width_inches').value);
		rectDims.length = Utils.convertEnglishToMeters(document.getElementById('lawn_length_feet').value,
			document.getElementById('lawn_length_inches').value);
		rectDims.slope = Utils.convertEnglishToMeters(0, document.getElementById('lawn_slope_inches').value);
	}
	else {
		rectDims.width = document.getElementById('lawn_width_meters').value;
		rectDims.length = document.getElementById('lawn_length_meters').value;
		rectDims.slope = document.getElementById('lawn_slope_meters').value;
	}
	Session.set(Constants.computedArea, Number(rectDims.width) * Number(rectDims.length));
	return !(rectDims.width == 0 || rectDims.length == 0);
};

Template.measure_rectangle_lawn.helpers({
	unitsOfMeasure: function () {
		return (Session.get(Constants.userUnitsOfMeasure) === Constants.English) ? 'Feet and Inches' : 'Meters';
	},
	unitsOfMeasureAre: function (unitString) {
		return Session.get(Constants.userUnitsOfMeasure) === unitString;
	},
	lawnData: function () {
		return CreateLawnData.lawnData;
	},
	lawnDataDisplay: function () {
		// Fill in appropriately
		var rectDims = _getRectDims();
		if (Session.get(Constants.userUnitsOfMeasure) === Constants.English) {
			// feet, inches
			var fi = Utils.convertMetersToFeetInches(rectDims.width);
			lawnDataDisplay.w1 = fi.feet;
			lawnDataDisplay.w2 = fi.inches;
			fi = Utils.convertMetersToFeetInches(rectDims.length);
			lawnDataDisplay.l1 = fi.feet;
			lawnDataDisplay.l2 = fi.inches;
			lawnDataDisplay.s = Math.round(Utils.convertMetersToInches(rectDims.slope));
		}
		else {
			// meters
			lawnDataDisplay.w1 = rectDims.width;
			lawnDataDisplay.l1 = rectDims.length;
			lawnDataDisplay.s = rectDims.slope;
		}
		return lawnDataDisplay;
	},
	computedArea: function () {
		var rectDims = _getRectDims();
		Session.set(Constants.computedArea, Number(rectDims.width) * Number(rectDims.length));
		var sqMeters = Session.get(Constants.computedArea);
		var sqInches = Utils.convertMetersToInches(sqMeters);
		var sqFeet = sqInches / 12.0;
		return (Session.get(Constants.userUnitsOfMeasure) === Constants.English) ? Math.round(sqFeet) + ' sq ft' : Math.round(sqMeters) + ' sq m';
	}
});

Template.measure_rectangle_lawn.events({
	'input .input-field': function () {
		console.log('input-field change event');
		_updateShapeDims();
	}
});

var _updateCornerDims = function _updateCornerDims () {
	// TBD
	return false;
};

var _updateCustomDims = function _updateCustomDims () {
	// TBD
	return false;
};
