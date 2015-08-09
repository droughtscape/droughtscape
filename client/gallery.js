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

var handleCarouselMessages = function handleCarouselMessages (message) {
	console.log('handleCarouselMessages');
	switch (message.type) {
	case 'rendered':
		MBus.publish('carousel', 'clear', {carousel: '#gallery-carousel'});
		MBus.publish('carousel', 'add', {carousel: '#gallery-carousel', imgArray: ['http://lorempixel.com/580/250/nature/1']});
		break;
	}
};

var unsubscribe = null;

Template.gallery.onRendered(function () {
});

Template.gallery.onCreated(function () {
	// Support carousel lifecycle.  Subscribe returns the ability to unsubscribe.
	unsubscribe = MBus.subscribe('carousel', handleCarouselMessages);
});

Template.gallery.onDestroyed(function () {
	// Support carousel lifecycle
	unsubscribe.remove();
});

Template.gallery.events({
});