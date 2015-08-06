/**
 * Created by kishigo on 7/24/15.
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

Template.slick_slider.rendered = function () {
	$('.multiple-items').slick({
		dots: true,
		arrows: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		variableWidth: true
	});
};

var slideIndex = 0;

Template.test_slider_add.rendered = function () {
	$('.add-remove').slick({
		slidesToShow: 3,
		slidesToScroll: 3
	});
	$('.add-remove').slick('slickAdd','<div class="fubarItem"><img src="http://lorempixel.com/580/250/nature/1" width="100%" height="100%" /></div>');
	//$('.js-add-slide').on('click', function() {
	//	console.log('test_slider_add: js-add-slide: slideIndex: ' + slideIndex);
	//	slideIndex++;
	//	//$('.add-remove').slick('slickAdd','<div><h3>' + slideIndex + '</h3></div>');
	//	$('.add-remove').slick('slickAdd','<div class="fubarItem"><img src="http://lorempixel.com/580/250/nature/1" width="100%" height="100%" /></div>');
	//});
	//
	//$('.js-remove-slide').on('click', function() {
	//	$('.add-remove').slick('slickRemove',slideIndex - 1);
	//	if (slideIndex !== 0){
	//		slideIndex--;
	//	}
	//});
};

Template.test_slider_add.events({
	'click .fubarItem': function (e) {
		console.log('test_slider_add: click');
		$('.add-remove').slick('slickAdd','<div class="fubarItem"><img src="http://lorempixel.com/580/250/nature/1" width="100%" height="100%" /></div>');
	}
});