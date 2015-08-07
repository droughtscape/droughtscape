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