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
//   add - add an array of images to carousel {carousel: <carouselId>, img: [<url of image>]}
//   even-click - click on carousel item
// Users of carousel should subscribe to 'carousel' and handle
// the rendered message.
// Each unique carousel should have a unique html element id
// User lifecycle:
//   onCreated - MBus.subscribe
//   onDestroyed - remove
//   Example:
//   onCreated -
//	   var unsubscribe = MBus.subscribe('carousel', handleCarouselMessages);
//   onDestroyed - 
//     unsubscribe.remove(); // to remove the subscription
// User messages:
//   Inbound -
//     rendered - indicating the carousel is rendered and ready
//   Outbound - 
//     clear - clear all images from the carousel
//       MBus.publish('carousel', 'clear', {carousel: <carouselElementId>});
//     add - add an array of images to carousel {carousel: <carouselId>, imgHeight: <optional height>, imgWidth: <optional width>, imgArray: [<url of image>]}
Session.setDefault(Constants.carouselMode, '');
Session.setDefault(Constants.carouselSubMode, '');

Template.carousel.setBorderColor = function setBorderColor (carousel, borderColor) {
	MBus.publishSimple(Constants.mbus_carousel_setBorderColor, {carousel: carousel, color: borderColor});
	//let slick = carousel[0].slick;
	//for (i=0, len=slick.$slides.length; i<len; ++i) {
	//	let slide = slick.$slides.get(i);
	//	slide.style.borderColor = borderColor;
	//}
};

Template.carousel.onRendered(function () {
	// This just starts the render initialization.
	// The actual component will do any implementation specific setup
	// and then emit the rendered message
	MBus.publishSimple(Constants.mbus_carousel_render, {id: this.data.id, dataType: this.data.context.type});
});

Template.carousel.events({
	'click .carouselItem': function (e, template) {
		console.log('carousel: ' + e + ', template: ' + template);
		//e.currentTarget.style.borderColor = Constants.color_teal;
		SelectionManager.sendSelection(e.currentTarget);
		MBus.publishSimple(Constants.mbus_carousel_selected, new Selection(this.id, e.currentTarget));
		//MBus.publish(this.context.topic, Constants.mbus_selected, e.currentTarget);
	}
});