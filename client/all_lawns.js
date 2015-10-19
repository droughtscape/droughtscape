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
// values for lawnMode are the various shapes for lawns [rectangle, corner, custom]
var lawnMode = new ReactiveVar('rectangle');
// Build a parameterized name we can use both for html and jquery (JQ)
var lawnsCarouselId = 'all-lawns-carousel';
var lawnsCarouselIdElt = '#' + lawnsCarouselId;
var parentTemplateTopic = null;
var sharedSelectionMode = false;

Template.all_lawns.getCarouselId = function getCarouselId () { return lawnsCarouselId; };
Template.all_lawns.clearBorderColor = function clearBorderColor () {
	Template.carousel.setBorderColor($(lawnsCarouselIdElt), Constants.color_white);
};

Template.all_lawns.clickEvent = function clickEvent (e) {
	console.log('Template.all_lawns.clickEvent');
};

var _setSelectedCarouselImages = function _setSelectedCarouselImages (carouselId, selection) {
	MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: lawnsCarouselIdElt});
	let testLoader = getTestLoader();
	var testLawns;

	switch (selection) {
	case 'rectangle':
		testLawns = testLoader.createTestItems([
			{id: 'lawn_1', img: 'http://lorempixel.com/580/250/nature/1'},
			{id: 'lawn_2', img: 'http://lorempixel.com/580/250/nature/2'},
			{id: 'lawn_3', img: 'http://lorempixel.com/580/250/nature/3'},
			{id: 'lawn_4', img: 'http://lorempixel.com/580/250/nature/4'},
			{id: 'lawn_5', img: 'http://lorempixel.com/580/250/nature/5'}
		], 'lawnId');
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: lawnsCarouselIdElt, imgWidth: '200px', imgHeight: '200px',
			imgArray: testLawns});
		break;
	default:
		testLawns = testLoader.createTestItems([
			{id: 'lawn_6', img: 'http://lorempixel.com/580/250/nature/1'}], 'lawnId');
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: lawnsCarouselIdElt, imgWidth: '200px', imgHeight: '200px', imgArray: testLawns});
		break;
	}
};

var _handleLawnTypeMessages = function _handleLawnTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('_handleLawnTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// init carousel
			Meteor.defer(function () {
				_setSelectedCarouselImages(lawnsCarouselIdElt, message.value);
			});
			break;
		case Constants.mbus_unselected:
			console.log('_handleLawnTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			break;
		}
	}
	else {
		console.log('_handleLawnTypeMessages:ERROR, invalid message');
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
			Template.all_lawns.clearBorderColor();
			break;
		}
	}
	else {
		console.log('_handleLawnCarouselMessages:ERROR, invalid message');
	}
};

var _unsubscribeLawnTypeHandler = null;
var _unsubscribeLawnCarouselHandler = null;

// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button LAWNS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.all_lawns.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	_unsubscribeLawnTypeHandler = MBus.subscribe(Constants.mbus_allLawnsType, _handleLawnTypeMessages);
	_unsubscribeLawnCarouselHandler = MBus.subscribe(Constants.mbus_allLawnsCarousel, _handleLawnCarouselMessages);
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
	_unsubscribeLawnTypeHandler.remove();
	_unsubscribeLawnCarouselHandler.remove();
});

Template.all_lawns.helpers({
	carouselId: function () {
		return lawnsCarouselId;
	},
	lawnsMode: function () {
		return {topic: Constants.mbus_allLawnsCarousel, type: "allLawns", subType: lawnMode.get()};
	},
	selected: function () {
		return lawnMode;
	}
});

