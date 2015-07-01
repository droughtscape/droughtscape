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
	this.autorun(_.bind(function(){
		// this is how we "listen" for databases change : we setup a reactive computation
		// and inside we reference a cursor (query) from the database and register
		// dependencies on it by calling cursor.forEach, so whenever the documents found
		// by the cursor are modified on the server, the computation is rerun with
		// updated content, note that we use the SAME CURSOR that we fed our #each with
		//var items=CarouselData.getCarouselData(this.data.context);
		// forEach registers dependencies on the cursor content exactly like #each does
		//items.forEach(function(imageItem){...});
		// finally we need to reinit the carousel so it take into account our newly added
		// HTML elements as carousel items, but we can only do that AFTER the #each block
		// has finished inserting in the DOM, this is why we have to use Deps.afterFlush
		// the #each block itself setup another computation and Deps.afterFlush makes sure
		// this computation is done before executing our callback
		Tracker.afterFlush(_.bind(function(){
			this.$(".owl-carousel").data("owlCarousel").reinit(options);
		},this));
	},this));
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