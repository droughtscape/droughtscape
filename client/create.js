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

var lawnData = {width: 0, length: 0, slope: 0};
var lawnDataEnglish = {widthFeet: 0, widthInches: 0, lengthFeet: 0, lengthInches: 0, slopeInches: 0};
Session.setDefault('computedArea', 0);

Template.create.onCreated(function(){
	console.log('Template.create.onCreated');
});

Template.create.helpers({
	unitsOfMeasure: function () {
		return (Session.get('userUnitsOfMeasure') === 'English') ? 'Feet and Inches' : 'Meters';
	},
	unitsOfMeasureAre: function (unitString) {
		return Session.get('userUnitsOfMeasure') === unitString;
	},
	lawnDataEnglish: function () {
		return lawnDataEnglish;
	},
	lawnData: function () {
		return lawnData;
	},
	computedArea: function () {
		var sqMeters = Session.get('computedArea');
		var sqInches = Utils.convertMetersToEnglish(sqMeters);
		var sqFeet = sqInches / 12.0;
		return (Session.get('userUnitsOfMeasure') === 'English') ? sqFeet + ' sq ft' : sqMeters + ' sq m';
	}
});

Template.create.events({
	'click .unit-select': function (e) {
		var clickedButton = e.currentTarget;
		Session.set('userUnitsOfMeasure', clickedButton.id);
	},
	'click #lawn-measure': function (e) {
		console.log('lawn-measure clicked');
		if (Session.get('userUnitsOfMeasure') === 'English') {
			lawnDataEnglish.widthFeet = document.getElementById('lawn_width_feet').value;
			lawnDataEnglish.widthInches = document.getElementById('lawn_width_inches').value;
			lawnDataEnglish.lengthFeet = document.getElementById('lawn_length_feet').value;
			lawnDataEnglish.lengthInches = document.getElementById('lawn_length_inches').value;
			lawnDataEnglish.slopeInches = document.getElementById('lawn_slope_inches').value;
			lawnData.width = Utils.convertEnglishToMeters(lawnDataEnglish.widthFeet, lawnDataEnglish.widthInches);
			lawnData.length = Utils.convertEnglishToMeters(lawnDataEnglish.lengthFeet, lawnDataEnglish.lengthInches);
			lawnData.slope = Utils.convertEnglishToMeters(0, lawnDataEnglish.slopeInches);
		}
		else {
			lawnData.width = document.getElementById('lawn_width_meters').value;
			lawnData.length = document.getElementById('lawn_length_meters').value;
			lawnData.slope = document.getElementById('lawn_slope_meters').value;
			
			lawnDataEnglish.widthFeet = 0;
			lawnDataEnglish.widthInches = Utils.convertMetersToEnglish(lawnData.width);
			lawnDataEnglish.lengthFeet = 0;
			lawnDataEnglish.lengthInches = Utils.convertMetersToEnglish(lawnData.length);
			lawnDataEnglish.slopeInches = Utils.convertMetersToEnglish(lawnData.slope);
		}
		Session.set('computedArea', Number(lawnData.width) * Number(lawnData.length));
		console.log('lawnData: ' + lawnData);
	}
});
