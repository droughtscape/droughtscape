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
// Generic carousel template
// Emits render message.
// Implementors of carousel must emit rendered when complete
// Implementors of carousel must support the following messages:
//   render - render setup
//   clear - clear all images from carousel - {carousel: <carouselId>}
//   add - add an image to carousel {carousel: <carouselId>, img: [<url of image>]}
//   even-click - click on carousel item
Session.setDefault('carouselMode', '');
Session.setDefault('carouselSubMode', '');
Template.carousel.onRendered(function () {
	// This just starts the render initialization.
	// The actual component will do any implementation specific setup
	// and then emit the rendered message
	MBus.publish('carousel', 'render', null);
});

Template.carousel.events({
	'click .carouselItem': function (e) {
		console.log('carousel: ' + e);
		MBus.publish('carousel', 'event-click', e);
	}
});