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

// Units of measure global setting to work across any create submenus.
// Note, within the system, we will translate to metric and do all calculations in metric and
// convert back out to the current setting.  Valid settings: English, Metric
Session.setDefault('userUnitsOfMeasure', 'English');

var lawnData = {name: 'MyLawn', width: 0, length: 0, slope: 0};
var lawnDataEnglish = {widthFeet: 0, widthInches: 0, lengthFeet: 0, lengthInches: 0, slopeInches: 0};
var lawnDataDisplay = {name: 'MyLawn', w1: 0, w2: 0, l1: 0, l2: 0, s: 0};
Session.setDefault('computedArea', 0);
Session.setDefault('currentLawn', 'MyLawn');

Template.create.onCreated(function(){
	console.log('Template.create.onCreated');
	Session.set('computedArea', 0);
});

Template.create.helpers({
	signInMessage: function () {
		return 'Sign in so we can track your design(s)';
	}
});

Template.create.events({
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget('create');
		Session.set('renderView', 'signin');
	},
	'click #lawn-create': function () {
		lawnData.name = lawnDataDisplay.name;
	}
});

Template.name_lawn.helpers({
	lawnDataDisplay: function () {
		return lawnDataDisplay;
	}
});

Template.measure_lawn.helpers({
	unitsOfMeasure: function () {
		return (Session.get('userUnitsOfMeasure') === 'English') ? 'Feet and Inches' : 'Meters';
	},
	unitsOfMeasureAre: function (unitString) {
		return Session.get('userUnitsOfMeasure') === unitString;
	},
	lawnName: function () {
		return Session.get('currentLawn');
	},
	lawnDataDisplay: function () {
		// Fill in appropriately
		if (Session.get('userUnitsOfMeasure') === 'English') {
			// feet, inches
			var fi = Utils.convertMetersToFeetInches(lawnData.width);
			lawnDataDisplay.w1 = fi.feet;
			lawnDataDisplay.w2 = fi.inches;
			fi = Utils.convertMetersToFeetInches(lawnData.length);
			lawnDataDisplay.l1 = fi.feet;
			lawnDataDisplay.l2 = fi.inches;
			lawnDataDisplay.s = Math.round(Utils.convertMetersToInches(lawnData.slope));
		}
		else {
			// meters
			lawnDataDisplay.w1 = lawnData.width;
			lawnDataDisplay.l1 = lawnData.length;
			lawnDataDisplay.s = lawnData.slope;
		}
		return lawnDataDisplay;
	},
	computedArea: function () {
		Session.set('computedArea', Number(lawnData.width) * Number(lawnData.length));
		var sqMeters = Session.get('computedArea');
		var sqInches = Utils.convertMetersToInches(sqMeters);
		var sqFeet = sqInches / 12.0;
		return (Session.get('userUnitsOfMeasure') === 'English') ? Math.round(sqFeet) + ' sq ft' : Math.round(sqMeters) + ' sq m';
	}
});

Template.measure_lawn.onRendered(function () {
	$('#modal-name').openModal();
});

var _insertFirstItem = function _insertFirstItem (userEmail, lawnData) {
	var item = {user: userEmail, myLawns: []};
	item.myLawns.push(lawnData);
	DroughtscapeUsers.insert(item);
};

var _updateLawns = function _updateLawns (myLawns, lawn) {
	var lawnUpdated = false;
	for (var i= 0, len= myLawns.length; i<len; ++i) {
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

Template.measure_lawn.events({
	'click #name-lawn': function () {
		lawnData.name = document.getElementById('lawn_name').value;
		Session.set('currentLawn', lawnData.name);
	},
	'click #open-lawn': function () {
		Session.set('renderView', 'favorites');
	},
	'click .unit-select': function (e) {
		var clickedButton = e.currentTarget;
		Session.set('userUnitsOfMeasure', clickedButton.id);
	},
	'click #lawn-measure': function (e) {
		console.log('lawn-measure clicked');
		if (Session.get('userUnitsOfMeasure') === 'English') {
			lawnData.width = Utils.convertEnglishToMeters(document.getElementById('lawn_width_feet').value,
				document.getElementById('lawn_width_inches').value);
			lawnData.length = Utils.convertEnglishToMeters(document.getElementById('lawn_length_feet').value,
				document.getElementById('lawn_length_inches').value);
			lawnData.slope = Utils.convertEnglishToMeters(0, document.getElementById('lawn_slope_inches').value);
		}
		else {
			lawnData.width = document.getElementById('lawn_width_meters').value;
			lawnData.length = document.getElementById('lawn_length_meters').value;
			lawnData.slope = document.getElementById('lawn_slope_meters').value;
		}
		Session.set('computedArea', Number(lawnData.width) * Number(lawnData.length));
		console.log('lawnData: ' + lawnData);

		var user = Meteor.user();
		var userEmail = user.emails[0].address;
		// See if we already have a profile, if so, look for myLawns, if not create one
		var dsUsers = DroughtscapeUsers.find({});
		var dsUsersArray = dsUsers.fetch();
		if (dsUsersArray.length > 0) {
			var updated = null;
			for (var i= 0, len= dsUsersArray.length; i < len; ++i) {
				if (dsUsersArray[i].user === userEmail) {
					// found us, update
					if (!dsUsersArray[i].myLawns) {
						dsUsersArray[i].myLawns = [];
					}
					_updateLawns(dsUsersArray[i].myLawns, lawnData);
					updated = dsUsersArray[i];
					break;
				}
			}
			if (!updated) {
				// user not found, add
				_insertFirstItem(userEmail, lawnData);
			}
			else {
				DroughtscapeUsers.update(updated._id, updated);
			}
		}
		else {
			// No users so add us here
			_insertFirstItem(userEmail, lawnData);
		}
	}
});