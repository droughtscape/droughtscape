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
var setupSlick = function setupSlick () {
	$('.slick-carousel').slick({
		dots: true,
		arrows: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		variableWidth: true
	});
};

var slideIndex = 0;

Template.slickcarousel.rendered = function () {
	setupSlick();
	MBus.publish('slickcarousel', 'rendered', null);
	//$('.slick-carousel').slick('slickAdd','<div class="carouselItem"><img src="http://lorempixel.com/580/250/nature/1" width="100%" height="100%" /></div>');
};

Template.slickcarousel.created = function () {
	console.log('slickcarousel.created');
};

Template.slickcarousel.helpers({
	items : function () {
		console.log('items');
		Session.set('carouselMode',this.context.type);
		Session.set('carouselSubMode',this.context.subType);
		return CarouselData.getCarouselData({type: Session.get('carouselMode'), subType: Session.get('carouselSubMode')});
	}
});

Template.slickcarousel.events({
	'click .carouselItem': function (e) {
		console.log('slick-carousel: ' + e);
		$('.slick-carousel').slick('slickAdd','<div class="carouselItem"><img src="http://lorempixel.com/580/250/nature/1" width="100%" height="100%" /></div>');
	}
});

