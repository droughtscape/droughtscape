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
var partMode = new ReactiveVar(PartType.all);
// Build a parameterized name we can use both for html and jquery (JQ)
var partsCarouselId = 'my-parts-carousel';
var partsCarouselIdElt = '#' + partsCarouselId;

Template.myParts.getCarouselId = function getCarouselId () { return partsCarouselId; };
Template.myParts.clearBorderColor = function clearBorderColor () {
	Template.carousel.setBorderColor($(partsCarouselIdElt), Constants.color_white);
};

Template.myParts.clickEvent = function clickEvent (e) {
	console.log('Template.myParts.clickEvent');
};

var setSelectedCarouselImages = function setSelectedCarouselImages (carouselId, selection) {
	MBus.publish(Constants.mbus_carousel_clear, new Message.Clear(partsCarouselIdElt));
	let myParts = PartsManager.getMyPartsByType(selection);
	MBus.publish(Constants.mbus_carousel_add, new Message.Add(partsCarouselIdElt, '200px', '200px', myParts));
};

var handlePartTypeMessages = function handlePartTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		console.log('handlePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value.typeSelection);
		// init carousel
		Meteor.defer(function () {
			setSelectedCarouselImages(partsCarouselIdElt, message.value.typeSelection);
		});
	}
	else {
		console.log('handlePartTypeMessages:ERROR, invalid message');
	}
};

var unsubscribePartTypeHandler = null;

// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button PARTS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.myParts.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	unsubscribePartTypeHandler = MBus.subscribe(Constants.mbus_myPartsType, handlePartTypeMessages);
});

Template.myParts.onRendered(function () {
});

Template.myParts.onDestroyed(function () {
	// Support carousel lifecycle
	unsubscribePartTypeHandler.remove();
});

Template.myParts.helpers({
	carouselId: function () {
		return partsCarouselId;
	},
	partsMode: function () {
		return {topic: Constants.mbus_myPartsCarousel, html: partsCarouselIdElt, type: "myParts", subType: partMode.get()};
	},
	selected: function () {
		return partMode;
	}
});

