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

Template.create.onCreated(function(){
	console.log('Template.create.onCreated');
});

Template.create.helpers({
	unitsOfMeasure: function () {
		return (Session.get('userUnitsOfMeasure') === 'English') ? 'Feet and Inches' : 'Meters';
	},
	unitsOfMeasureAre: function (unitString) {
		return Session.get('userUnitsOfMeasure') === unitString;
	}
});

Template.create.events({
	'click .unit-select': function (e) {
		var clickedButton = e.currentTarget;
		Session.set('userUnitsOfMeasure', clickedButton.id);
	}
});
