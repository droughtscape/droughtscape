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

var partMode = new ReactiveVar('plants');
// Build a parameterized name we can use both for html and jquery (JQ)
var partsCarouselId = 'parts-carousel';
var partsCarouselIdElt = '#' + partsCarouselId;

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
		case 'selected':
			console.log('handlePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// init carousel
			Meteor.defer(function () {
				setSelectedCarouselImages(partsCarouselIdElt, message.value);
			});
			break;
		}
	}
	else {
		console.log('handlePartTypeMessages:ERROR, invalid message');
	}
};

var unsubscribe = null;

// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button PARTS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.parts.onCreated(function () {
	if (CreateLawnData.getCurrentLawn()) {
		NavConfig.pushRightBar('rightBar', 'select_parts');
	}
	else {
		NavConfig.pushRightBar('rightBar', 'parts');
	}
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	unsubscribe = MBus.subscribe(Constants.mbus_parts, handlePartTypeMessages);
});

Template.parts.onDestroyed(function () {
	NavConfig.popRightBar();
	// Support carousel lifecycle
	unsubscribe.remove();
});

Template.parts.helpers({
	carouselId: function () {
		return partsCarouselId;
	},
	partsMode: function () {
		return {type: "parts", subType: partMode.get()};
	},
	selected: function () {
		return partMode;
	},
	notCreateMode: function () {
		// KKI, TBD just a hack, return false so we can work on parts directly from main page
		return false;
		var currentLawn = CreateLawnData.getCurrentLawn();
		return currentLawn === null;
	}
});

Template.parts.events({
	'click #favorite-parts-add': function () {
		console.log('Add to Favorites clicked');
	},
	'click #favorite-parts-del': function () {
		console.log('Delete from Favorites clicked');
	},
	'click #plants-mwd-top-50': function () {
		window.open('http://bewaterwise.com/pdf/50_Faves.pdf', '_blank');
	},
	'click #turf-terminators-plant-catalog': function () {
		window.open('http://turfterminators.com/how-turf-terminators-works/plant-and-groundcover-catalog/', '_blank');
	},
	'click .part-select.parts': function (e, template) {
		console.log('RADIO: e: ' + e + ', template: ' + template)
	}
});

