/**
 * Created by kishigo on 8/2/15.
 * Copyright (c) 2015 DirecTV LLC, All Rights Reserved
 *
 * This software and its documentation may not be used, copied, modified or distributed, in whole or in part, without express
 * written permission of DirecTV LLC.
 *
 * The source code is the confidential and proprietary information of DirecTV, Inc. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement
 * you entered into with DirecTV LLC.
 *
 */

var setupSlick = function setupSlick () {
	$('.multiple-items').slick({
		dots: true,
		arrows: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		variableWidth: true
	});
};

Template.slickcarousel.rendered = function () {
	setupSlick();
};

Template.slickcarousel.helpers({
	items : function () {
		console.log('items');
		//$('#owl-carousel').data.reinit(CarouselData.getCarouselFormat(this.context));
		//Meteor.defer(function () {
		//	$('#owl-carousel').data.reinit(CarouselData.getCarouselFormat(this.context));
		//});
		Session.set('carouselMode',this.context.type);
		Session.set('carouselSubMode',this.context.subType);
		Meteor.defer(setupSlick());
		return CarouselData.getCarouselData({type: Session.get('carouselMode'), subType: Session.get('carouselSubMode')});
	}
});

Template.slickcarousel.events({
	'click .item': function (e) {
		console.log('carousel: ' + e);
	}
});

