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
Session.setDefault('carouselMode', '');
Session.setDefault('carouselSubMode', '');
Template.carousel.onRendered(function () {
	var options = CarouselData.getCarouselFormat(this.data.context);
	this.$("#owl-carousel").owlCarousel(options);
});

Template.carousel.helpers({
	items : function () {
		console.log('items');
		//$('#owl-carousel').data.reinit(CarouselData.getCarouselFormat(this.context));
		//Meteor.defer(function () {
		//	$('#owl-carousel').data.reinit(CarouselData.getCarouselFormat(this.context));
		//});
		Session.set('carouselMode',this.context.type);
		Session.set('carouselSubMode',this.context.subType);
		return CarouselData.getCarouselData({type: Session.get('carouselMode'), subType: Session.get('carouselSubMode')});
	}
});

Template.carousel.events({
	'click .item': function (e) {
		console.log('carousel: ' + e);
	}
});