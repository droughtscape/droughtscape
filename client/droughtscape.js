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
Router.map(function () {
	this.route(Constants.home, {path: '/'});
});
// The navBarConfig Session variable controls contents of the navBar
// => see navconfig.js
// The rightBar Session variable controls presence or absence of the rightBar
// The rightBarConfig Session variable controls contents of the rightBar (if present)
// The renderView Session variable controls what the render area template is currently
// set to.  We use this to avoid routing.
// => see ViewState.js
// Admin rights of logged in user
Session.setDefault(Constants.adminRights, undefined);
Session.setDefault(Constants.currentSelection, false);
Session.setDefault(Constants.userUnitsOfMeasure, Constants.Metric);
Session.setDefault(Constants.layoutSelection, 0);

// TestLoader
testLoader = new TestLoader();
PartsManager.testInitParts();
LawnsManager.initLawnConstants();
SplashManager.initSplashLawns();

// init the targets for ViewStack
ViewStack.initTargets();

ViewStack.pushTarget(ViewTargetType.home);

/**
 * _renderContent function
 * Dynamically adjusts the content part of the app to fit the visible window less the footer (if any)
 */
var _renderContent = function _renderContent() {
	var content = document.getElementById("content");
	if (content) {
		var footer = document.getElementById('page-footer');
		var footerHeight = (footer) ? footer.offsetHeight : 0;
		var contentPos = getPosition(content);
		var contentHeight = (window.innerHeight - footerHeight) - contentPos.y;
		content.style.height = contentHeight + 'px';
		//console.log('content: ' + content + ', w x h: ' + screen.width + ':' + screen.height);
		var render = document.getElementById('render');
		render.style.height = contentHeight + 'px';
	}
};

var _handleResizeEvent = Utils.createDeferredFunction(_renderContent);

Meteor.startup(function () {
	// Dynamically resize content when window resizes.
	// Just use the Meteor.defer() so that the DOM is fully
	// rendered before we adjust
	window.addEventListener('resize', _handleResizeEvent);
	Accounts.onLogin(SignInUtils.getAdminRights);
	Meteor.autorun(function () {
		if (Meteor.userId()) {
			// we are logged in, find out if we are admin
			SignInUtils.getAdminRights();
		}
		else {
			Session.set(Constants.adminRights, undefined);
		}
	});
});

// Shorten call chain
var getPosition = Utils.getPosition;

Template.home.onCreated(function () {
	window.onbeforeunload = function () {
		return 'Your work will be lost';
	};
	ViewStack.pushTarget(ViewTargetType.home);
});

Template.home.onDestroyed(function () {
	window.onbeforeunload = null;
});

Template.home.helpers({
	dynamicNavBar: function () {
		return Constants.nav_bar;
	},
	dynamicTemplate: function () {
		// Contents of session variable renderView will 
		// fill the content area
		return Session.get(Constants.renderView);
	},
	dynamicRightBar: function () {
		// The right bar is an optional bar but is a singleton
		// and always parked in the home frame
		// Different contexts running in the home frame can set
		// the Session rightBar to either a particular template, usually rightBar
		// or the empty string to remove the rightBar from that context.
		// The exact buttons on the bar are programmed via the rightBarConfig
		// global Session variable and that is handled within the right bar component
		return Constants.right_bar;
	}
});

Template.home.onRendered(function () {
	$(document).ready(function () {
		console.log('ready');
		$(".button-collapse").sideNav();
		$('.modal-trigger').leanModal();
	});
	_renderContent();
});

Template.home.events({
});

