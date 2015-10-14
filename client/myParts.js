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
// Build a parameterized name we can use both for html and jquery (JQ)
var partsCarouselId = 'my-parts-carousel';
var partsCarouselIdElt = '#' + partsCarouselId;
var parentTemplateTopic = null;
var sharedSelectionMode = false;

Template.myParts.getCarouselId = function getCarouselId () { return partsCarouselIdElt; };
Template.myParts.clearBorderColor = function clearBorderColor () {
	Template.carousel.setBorderColor($(partsCarouselIdElt), Constants.color_white);
};

Template.myParts.clickEvent = function clickEvent (e) {
	console.log('Template.myParts.clickEvent');
};

var setSelectedCarouselImages = function setSelectedCarouselImages (carouselId, selection) {
	MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: partsCarouselIdElt});
	switch (selection) {
	case 'irrigation':
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: partsCarouselIdElt, imgWidth: '200px', imgHeight: '200px',
			imgArray: [
				'http://lorempixel.com/580/250/nature/1',
				'http://lorempixel.com/580/250/nature/2',
				'http://lorempixel.com/580/250/nature/3',
				'http://lorempixel.com/580/250/nature/4',
				'http://lorempixel.com/580/250/nature/5'
			]});
		break;
	default:
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: partsCarouselIdElt, imgWidth: '200px', imgHeight: '200px', imgArray: ['http://lorempixel.com/580/250/nature/1']});
		break;
	}
};

var handlePartTypeMessages = function handlePartTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('handlePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// init carousel
			Meteor.defer(function () {
				setSelectedCarouselImages(partsCarouselIdElt, message.value);
			});
			break;
		case Constants.mbus_unselected:
			console.log('handlePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			break;
		}
	}
	else {
		console.log('handlePartTypeMessages:ERROR, invalid message');
	}
};

var borderStyle = 'solid';

var handlePartCarouselMessages = function handlePartCarouselMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('handlePartCarouselMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			if (parentTemplateTopic) {
				MBus.publish(parentTemplateTopic, message.type, message.topic);
			}
			break;
		case Constants.mbus_unselected:
			console.log('handlePartCarouselMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			Template.myParts.clearBorderColor();
			break;
		}
	}
	else {
		console.log('handlePartCarouselMessages:ERROR, invalid message');
	}
};

var unsubscribePartTypeHandler = null;
var unsubscribePartCarouselHandler = null;

// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button PARTS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.myParts.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	unsubscribePartTypeHandler = MBus.subscribe(Constants.mbus_myPartsType, handlePartTypeMessages);
	unsubscribePartCarouselHandler = MBus.subscribe(Constants.mbus_myPartsCarousel, handlePartCarouselMessages);
});

Template.myParts.onRendered(function () {
	if (this.data) {
		if (this.data.parentTemplateTopic) {
			parentTemplateTopic = this.data.parentTemplateTopic;
		}
		if (this.data.sharedSelectionMode) {
			sharedSelectionMode = this.data.sharedSelectionMode;
		}
	}
});

Template.myParts.onDestroyed(function () {
	// Support carousel lifecycle
	unsubscribePartTypeHandler.remove();
	unsubscribePartCarouselHandler.remove();
});

Template.myParts.helpers({
	carouselId: function () {
		if (this.parentTemplateTopic) {
			parentTemplateTopic = this.parentTemplateTopic;
		}
		return partsCarouselId;
	},
	partsMode: function () {
		return {topic: Constants.mbus_myPartsCarousel, type: "myParts", subType: partMode.get()};
	},
	selected: function () {
		return partMode;
	}
});

Template.myParts.events({
	'click .part-select.myParts': function (e, template) {
		console.log('RADIO.myParts: e: ' + e + ', template: ' + template);
	}
});
