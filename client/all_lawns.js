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

Template.all_lawns.getCarouselId = function getCarouselId () { return lawnsCarouselId; };
Template.all_lawns.clearBorderColor = function clearBorderColor () {
	Template.carousel.setBorderColor($(lawnsCarouselIdElt), Constants.color_white);
};

Template.all_lawns.clickEvent = function clickEvent (e) {
	console.log('Template.all_lawns.clickEvent');
};

var _setSelectedCarouselImages = function _setSelectedCarouselImages (carouselId, selection) {
	MBus.publish(Constants.mbus_carousel_clear, new Message.Clear(lawnsCarouselIdElt));
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
		MBus.publish(Constants.mbus_carousel_add, new Message.Add(lawnsCarouselIdElt, '200px', '200px', testLawns));
		break;
	default:
		testLawns = testLoader.createTestItems([
			{id: 'lawn_6', img: 'http://lorempixel.com/580/250/nature/1'}], 'lawnId');
		MBus.publish(Constants.mbus_carousel_add, new Message.Add(lawnsCarouselIdElt, '200px', '200px', testLawns));
		break;
	}
};

var _handleLawnTypeMessages = function _handleLawnTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		console.log('_handleLawnTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value.typeSelection);
		// init carousel
		Meteor.defer(function () {
			_setSelectedCarouselImages(lawnsCarouselIdElt, message.value.typeSelection);
		});
	}
	else {
		console.log('_handleLawnTypeMessages:ERROR, invalid message');
	}
};

var _unsubscribeLawnTypeHandler = null;

// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button LAWNS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.all_lawns.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	_unsubscribeLawnTypeHandler = MBus.subscribe(Constants.mbus_allLawnsType, _handleLawnTypeMessages);
});

Template.all_lawns.onRendered(function () {
});

Template.all_lawns.onDestroyed(function () {
	// Support carousel lifecycle
	_unsubscribeLawnTypeHandler.remove();
});

Template.all_lawns.helpers({
	carouselId: function () {
		return lawnsCarouselId;
	},
	lawnsMode: function () {
		return {topic: Constants.mbus_allLawnsCarousel, html: lawnsCarouselIdElt, type: "allLawns", subType: lawnMode.get()};
	},
	selected: function () {
		return lawnMode;
	}
});

