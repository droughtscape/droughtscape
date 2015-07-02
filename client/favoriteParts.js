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
var partMode = new ReactiveVar('all');

Template.favoriteParts.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'parts');
});

Template.favoriteParts.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.favoriteParts.helpers({
	partsMode: function () {
		return {type: "favoriteParts", subType: partMode.get()};
	},
	selected: function () {
		return partMode.get();
	}
});

Template.favoriteParts.events({
	'click .part-select': function (e) {
		var clickedButton = e.currentTarget;
		partMode.set(clickedButton.value);
		console.log( 'partMode: ' + partMode.get());
	},
	'click #signin': function () {
		Session.set('renderView', 'signin');
	},
	'click #dismiss-alert': function () {
		Session.set('renderView', 'parts');
	}
});