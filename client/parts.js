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

var handlePartTypeMessages = function handlePartTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case 'selected':
			console.log('handlePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// clear carousel
			Meteor.defer(function () {
				$('#parts-carousel').slick('slickRemove', 0, false, true);
				$('#parts-carousel').slick('slickAdd','<div class="carouselItem"><img src="http://lorempixel.com/580/250/nature/1" width="100%" height="100%" /></div>');
			});
			break;
		}
	}
	else {
		console.log('handlePartTypeMessages:ERROR, invalid message');
	}
};

var unsubscribe = null;

Template.parts.rendered = function () {
	console.log('Template.parts.rendered');
};
// Not sure why this works but onCreated and onDestroyed are called whenever the 
// navBar button PARTS is clicked which sets the renderView Session variable.
// I guess that since these are "subtemplates", the get created anew every time, similar to a route.
// In any case, this is the desired effect.
Template.parts.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'parts');
	unsubscribe = MBus.subscribe('PartType:parts', handlePartTypeMessages)
});

Template.parts.onDestroyed(function () {
	NavConfig.popRightBar();
	unsubscribe.remove();
});

Template.parts.helpers({
	partsMode: function () {
		return {type: "parts", subType: partMode.get()};
	},
	selected: function () {
		return partMode;
	}
});

Template.parts.events({
	'click #plants-mwd-top-50': function () {
		window.open('http://bewaterwise.com/pdf/50_Faves.pdf', '_blank');
	},
	'click #turf-terminators-plant-catalog': function () {
		window.open('http://turfterminators.com/how-turf-terminators-works/plant-and-groundcover-catalog/', '_blank');
	},
});

