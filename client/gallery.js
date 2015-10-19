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

var galleryCarouselId = 'gallery-carousel';
var galleryCarouselIdElt = '#' + galleryCarouselId;

var handleCarouselMessages = function handleCarouselMessages (message) {
	console.log('handleCarouselMessages');
	switch (message.type) {
	case 'rendered':
		MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: galleryCarouselIdElt});
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: galleryCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: ['http://lorempixel.com/580/250/nature/1']});
		break;
	}
};

var unsubscribe = null;

Template.gallery.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	unsubscribe = MBus.subscribe(Constants.mbus_carousel, handleCarouselMessages);
});

Template.gallery.onDestroyed(function () {
	// Support carousel lifecycle
	unsubscribe.remove();
});

Template.gallery.helpers({
	carouselId: function () {
		return galleryCarouselId;
	},
	galleryMode: function () {
		return {type: "gallery", subType: null};
	}
});

var testItem = 1;
Template.gallery.events({
/*	'click .carouselItem': function (e) {
		console.log('Template.gallery.events - carousel: ' + e);
		testItem++;
		if (testItem > 5) {
			testItem = 1;
		}
		var img = 'http://lorempixel.com/580/250/nature/' + testItem;
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: '#gallery-carousel', imgWidth: '300px', imgHeight: '200px', imgArray: [img]});
	}*/
});