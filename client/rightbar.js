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
		spacer.style.height = ((bottomTop > spacerPos.y) ? bottomTop - spacerPos.y : 0) + 'px';
	}
};

/**
 * _handleResizeEvent function to handle the resize event.
 * Dynamically resize rightBar height when window resizes.
 * Just use the Meteor.defer() so that the DOM is fully
 * rendered before we call _renderRightBar()
 */
var _handleResizeEvent = Utils.createDeferredFunction(_renderRightBar);

Template.right_bar.onCreated(function () {
	window.addEventListener('resize', _handleResizeEvent);
});

Template.right_bar.onDestroyed(function () {
	window.removeEventListener('resize', _handleResizeEvent);
});

Template.right_bar.onRendered(function () {
		console.log('right_bar.onRendered');
		_renderRightBar();
	}
);

var _checkInfoEnable = function _checkInfoEnable (rightButtons) {
	for (var i=0,len=rightButtons.length; i<len; ++i) {
		// look for string containing 'info_'
		if (rightButtons[i].name.indexOf('info_') > -1) {
			// Found, now check to see if we have a valid selection
			let rightButton = rightButtons[i];
			if (!Session.get('currentSelection')) {
				rightButton.disabled = 'disabled';
			}
			else {
				rightButton.disabled = '';
			}
		}
	}
};

Template.right_bar.helpers({
	dynamicTemplate: function () {
		// dynamically set the type of the button here
		if (this.name === 'divider') {
			return 'divider';
		}
		else if (this.name === 'navZoom') {
			return 'zoom';
		}
		else if (this.name === 'navCompass') {
			return 'compass';
		}
		else {
			return 'right_button';
		}
	},
	rightButtons: function () {
		// Key off navBarConfig, defer recalculating dom measurements until
		// after the vdom is rendered.  Since onRender now is only at startup,
		// use the defer() function allows us to accomplish this
		Meteor.defer(function () {
			_renderRightBar();
		});
		let rightButtons = NavConfig.getRightBarConfig(Session.get(Constants.rightBarConfig));
		_checkInfoEnable(rightButtons);
		return rightButtons;
	}
});

Template.right_bar.events({
	// We follow the convention that the currentTarget.id is the renderView target template
	'click .rightBarButton': function (event) {
		console.log('Template.right_bar.events: ' + event);
		// See if click item is active
		if (!this.hasOwnProperty('disabled') || this.disabled !== 'disabled') {
			// The way we get away with the fact that click events are 
			if (this.hasOwnProperty('target')) {
				ViewStack.pushTarget(this.target);
			}
			else if (this.hasOwnProperty('tagAction')) {
				console.log('take action: ' + this.action);
				MBus.publish(this.tagParent, new Message.Action(this.tagAction));
			}
		}
	},
	'click #about': function () {
		ViewStack.pushTarget(ViewTargetType.about);
	} 
});
/**
 * Supports general highlight of images.
 * @param {object} graphic - dom graphic element
 * @param {string} highlightImage - url of highlight image
 * @param {string} normalImage - url of normal image to return to after highlight
 * @private
 */
var _highlightGraphic = function _highlightGraphic (graphic, highlightImage, normalImage) {
    if (graphic) {
		graphic.src = highlightImage;
        setTimeout(function () {
			// TODO maybe animate or transition here
			graphic.src = normalImage;
        }, 200);
    }
};
Template.compass.events({
	'click': function (event) {
		console.log('Template.compass.events: ' + event);
		let target = event.currentTarget;
		let w = target.width;
		let h = target.height;
		let panelH = h / 3;
		let up = {x: 0, y: 0, w: w, h: panelH};
		let pt = {x: event.offsetX, y: event.offsetY};
		let graphic = document.getElementById(this.name);
		let normalImage = this.url;
		if (Utils.pointInBox(pt, up)) {
            MBus.publish(this.tagParent, new Message.Action(this.upAction));
			_highlightGraphic(graphic, 'rendernavup.png', normalImage);
            return;
		}
        let dn = {x: 0, y: (panelH * 2), w: w, h: panelH};
		if (Utils.pointInBox(pt, dn)) {
            MBus.publish(this.tagParent, new Message.Action(this.dnAction));
			_highlightGraphic(graphic, 'rendernavdown.png', normalImage);
            return;
		}
		let halfW = w / 2;
        let lt = {x: 0, y: panelH, w: halfW, h: panelH};
		if (Utils.pointInBox(pt, lt)) {
            MBus.publish(this.tagParent, new Message.Action(this.ltAction));
			_highlightGraphic(graphic, 'rendernavleft.png', normalImage);
            return;
		}
        let rt = {x: halfW, y: panelH, w: halfW, h: panelH};
		if (Utils.pointInBox(pt, rt)) {
            MBus.publish(this.tagParent, new Message.Action(this.rtAction));
			_highlightGraphic(graphic, 'rendernavright.png', normalImage);
            return;
		}
 	}
});

Template.zoom.events({
	'click': function (event) {
		console.log('Template.zoom.events: ' + event);
		let target = event.currentTarget;
		let w = target.width;
		let h = target.height;
		let halfWidth = w / 2;
		let zoomIn = {x: 0, y: 0, w: halfWidth, h: h};
		let pt = {x: event.offsetX, y: event.offsetY};
		let graphic = document.getElementById(this.name);
		let normalImage = this.url;
		if (Utils.pointInBox(pt, zoomIn)) {
			MBus.publish(this.tagParent, new Message.Action(this.inAction));
			_highlightGraphic(graphic, 'zoomin.png', normalImage);
			return;
		}
		let zoomOut = {x: halfWidth, y: 0, w: halfWidth, h: h};
		if (Utils.pointInBox(pt, zoomOut)) {
			MBus.publish(this.tagParent, new Message.Action(this.outAction));
			_highlightGraphic(graphic, 'zoomout.png', normalImage);
			return;
		}
	}
});

