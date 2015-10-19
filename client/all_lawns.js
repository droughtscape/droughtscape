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
var lawnMode = new ReactiveVar('plants');
// Build a parameterized name we can use both for html and jquery (JQ)
var lawnsCarouselId = 'all-lawns-carousel';
var lawnsCarouselIdElt = '#' + lawnsCarouselId;
var parentTemplateTopic = null;
var sharedSelectionMode = false;

Template.partMode.getCarouselId = function getCarouselId () { return lawnsCarouselId; };
Template.all_lawns.clearBorderColor = function clearBorderColor () {
	Template.carousel.setBorderColor($(lawnsCarouselIdElt), Constants.color_white);
};

Template.all_lawns.clickEvent = function clickEvent (e) {
	console.log('Template.all_lawns.clickEvent');
};

var setSelectedCarouselImages = function setSelectedCarouselImages (carouselId, selection) {
	MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: lawnsCarouselIdElt});
	let testLoader = getTestLoader();
	var testParts;

	switch (selection) {
	case 'irrigation':
		testParts = testLoader.createTestParts([
			'http://lorempixel.com/580/250/nature/1',
			'http://lorempixel.com/580/250/nature/2',
			'http://lorempixel.com/580/250/nature/3',
			'http://lorempixel.com/580/250/nature/4',
			'http://lorempixel.com/580/250/nature/5'
		]);
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: lawnsCarouselIdElt, imgWidth: '200px', imgHeight: '200px',
			imgArray: testParts});
		break;
	default:
		testParts = testLoader.createTestParts(['http://lorempixel.com/580/250/nature/1']);
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: lawnsCarouselIdElt, imgWidth: '200px', imgHeight: '200px', imgArray: testParts});
		break;
	}
};

var _handleLawnCarouselMessages = function _handleLawnCarouselMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('_handleLawnCarouselMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			if (parentTemplateTopic) {
				MBus.publish(parentTemplateTopic, message.type, message.topic);
			}
			break;
		case Constants.mbus_unselected:
			console.log('_handleLawnCarouselMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			Template.allParts.clearBorderColor();
			break;
		}
	}
	else {
		console.log('_handleLawnCarouselMessages:ERROR, invalid message');
	}
};

var _unsubscribeLawnCarouselHandler = null;

// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button PARTS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.all_lawns.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	_unsubscribeLawnCarouselHandler = MBus.subscribe(Constants.mbus_allPartsCarousel, _handleLawnCarouselMessages);
});

Template.all_lawns.onRendered(function () {
	if (this.data) {
		if (this.data.parentTemplateTopic) {
			parentTemplateTopic = this.data.parentTemplateTopic;
		}
		if (this.data.sharedSelectionMode) {
			sharedSelectionMode = this.data.sharedSelectionMode;
		}
	}
});

Template.all_lawns.onDestroyed(function () {
	// Support carousel lifecycle
	unsubscribePartTypeHandler.remove();
	_unsubscribeLawnCarouselHandler.remove();
});

Template.all_lawns.helpers({
	carouselId: function () {
		return lawnsCarouselId;
	},
	partsMode: function () {
		return {topic: Constants.mbus_allPartsCarousel, type: "allParts", subType: lawnMode.get()};
	},
	selected: function () {
		return lawnMode;
	}
});

