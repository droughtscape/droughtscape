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
var getPosition = Utils.getPosition;

Meteor.startup(function () {
	// Dynamically resize rightBar height when window resizes.
	// Just use the Meteor.defer() so that the DOM is fully
	// rendered before we adjust
	window.addEventListener('resize', function () {
		Meteor.defer(function () {
			_renderRightBar();
		});
	});
});

Template.rightBar.onRendered(function () {
		console.log('rightBar.onRendered');
		_renderRightBar();
	}
);

Template.rightBar.helpers({
	dynamicTemplate: function () {
		// Contents of session variable renderView will 
		// fill the content area
		return Session.get('renderView');
	},
	rightButtons: function () {
		// Key off navBarConfig, defer recalculating dom measurements until
		// after the vdom is rendered.  Since onRender now is only at startup,
		// use the defer() function allows us to accomplish this
		Meteor.defer(function () {
			_renderRightBar();
		});
		return NavConfig.getRightBarConfig(Session.get('rightBarConfig'));
	}
});

Template.rightBar.events({
	// We follow the convention that the currentTarget.id is the renderView target template
	'click': function (event) {
		console.log('Template.rightBar.events: ' + event);
		//Session.set('renderView', event.currentTarget.id);
		var id = event.currentTarget.id;
		switch (id) {
		default:
			if (NavConfig.validateRightBarId(Session.get('rightBarConfig'), id)) {
				Session.set('renderView', event.currentTarget.id);
			}
			break;
		}
	}
});

/**
 * _renderRightBar function
 * Dynamically adjusts the height of the rightBar part of the app to fit the visible window less the footer (if any)
 */
var _renderRightBar = function _renderRightBar () {
	var rightNav = document.getElementById('rightNav');
	if (rightNav) {
		var footer = document.getElementById('page-footer');
		var footerHeight = (footer) ? footer.offsetHeight : 0;
		var rightNavPos = getPosition(rightNav);
		var rightNavHeight = (window.innerHeight - footerHeight) - rightNavPos.y;
		rightNav.style.height = rightNavHeight + 'px';
		var bottomDiv = document.getElementById('bottom-nav');
		var aboutbtn = document.getElementById("about");
		// magic space to get the bottom-nav into a good position relative to the bottom of the content
		var magicSpacing = 45;
		var bottomTop = rightNavPos.y + (rightNavHeight - (bottomDiv.offsetHeight + aboutbtn.offsetHeight + magicSpacing));
		var spacer = document.getElementById('spacer');
		var spacerPos = getPosition(spacer);
		spacer.style.height = bottomTop - spacerPos.y + 'px';
	}
};
