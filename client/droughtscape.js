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
	this.route('home', {path: '/'});
});

Session.setDefault("resize", null);
Session.setDefault('navBarConfig', 'home');
Session.setDefault('rightBar', 'rightBar');
Session.setDefault('rightBarConfig', 'home');

// counter starts at 0
Session.setDefault('counter', 0);
Session.setDefault('renderView', 'splash');

Meteor.startup(function () {
	window.addEventListener('resize', function () {
		Session.set("resize", new Date());
	});
});

if (typeof THREE !== 'undefined') {
	var scene = new THREE.Scene();
	console.log('THREE: scene: ' + scene);
}
else {
	console.log('THREE is undefined');
}

window.addEventListener("resize", myFunction);
var x = 0;

function myFunction() {
	x += 1;
}

// Shorten call chain
var getPosition = Utils.getPosition;

Template.home.onCreated(function () {
	Session.set('renderView', 'splash');
	Session.set('rightBar', 'rightBar');
});

Template.home.helpers({
	resize: function () {
		//console.log('resize');
		renderContent();
		return Session.get("resize");
	},
	dynamicTemplate: function () {
		// Contents of session variable renderView will 
		// fill the content area
		return Session.get('renderView');
	},
	dynamicRightBar: function () {
		// The right bar is an optional bar but is a singleton
		// and always parked in the home frame
		// Different contexts running in the home frame can set
		// the Session rightBar to either a particular template, usually rightBar
		// or the empty string to remove the rightBar from that context.
		// The exact buttons on the bar are programmed via the rightBarConfig
		// global Session variable and that is handled within the right bar component
		return Session.get('rightBar');
	}
});

/**
 * renderContent function
 * Dynamically adjusts the content part of the app to fit the visible window less the footer (if any)
 */
var renderContent = function renderContent() {
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
		// Check for right bar present
		//var rightNav = document.getElementById('rightNav');
		//if (!rightNav) {
		//	var renderWidth = window.innerWidth;
		//	render.style.width = renderWidth + 'px';
		//}
	}
};

Template.home.rendered = function () {
	$(document).ready(function () {
		console.log('ready');
		$(".button-collapse").sideNav();
	});
	renderContent();
};

Template.home.events({
	//'click #aboutbtn': function () {
	//	Session.set('renderView', 'about');
	//}
});

