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
Template.personalize.onCreated(function () {
	console.log('currentUser: ' + Meteor.userId());
});

Template.personalize.onDestroyed(function () {
});

Template.personalize.helpers({
	signInMessage: function () {
		return 'Personalization allows droughtscape to more closely tailor the design to match your preferences';
	},
	englishDefault: function () {
		var units = Session.get(Constants.userUnitsOfMeasure);
		return (units === 'English') ? 'checked' : '';
	},
	metricDefault: function () {
		var units = Session.get(Constants.userUnitsOfMeasure);
		return (units === 'Metric') ? 'checked' : '';
	}
});

Template.personalize.events({
	'click .unit-select': function (e) {
		var clickedButton = e.currentTarget;
		Session.set(Constants.userUnitsOfMeasure, clickedButton.id);
	},
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget(ViewTargetType.personalize);
		ViewStack.pushTarget(ViewTargetType.signIn);
	}
});
