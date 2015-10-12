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
// slick specific implementation of carousel
SlickCarousel = (function () {
	var _renderSlick = function _renderSlick (format) {
		var centerMode = (format.hasOwnProperty('centerMode')) ? format.centerMode : false;
		//$('.carousel').slick({
		$(format.slide).slick({
			infinite: false,
			dots: true,
			arrows: true,
			centerMode: centerMode,
			//centerPadding: '60px',
			//slidesToShow: 3,
			//adaptiveHeight: true,
			slidesToScroll: 3,
			variableWidth: true,
			focusOnSelect: true
		});
		$('.carousel').on('reInit', function (event, slick) {
			console.log('init:currentSlide: ' + slick.currentSlide);
		});
		$('.carousel').on('afterChange', function (event, slick, currentSlide) {
			console.log('afterChange: currentSlide: ' + currentSlide);
		});
	};
	
	var _buildSlickImage = function _buildSlickImage (image, width, height) {
		// image might be just a string, or an object of form: {id: <idstring>, img: <imgstring>}
		var img;
		if (image !== null) {
			switch (typeof image) {
			case 'object':
				if (image.hasOwnProperty('id')) {
					img = '<div id="' + image.id + '" class="carouselItem"><img src="' + image.img + '" width="' + width + '" height="' + height + '" /></div>';
				}
				else {
					img = '<div class="carouselItem"><img src="' + image.img + '" width="' + width + '" height="' + height + '" /></div>';
				}
				break;
			case 'string':
				img = '<div class="carouselItem"><img src="' + image + '" width="' + width + '" height="' + height + '" /></div>';
				break;
			}
		}
		//var img = '<div class="carouselItem"><img src="' + imageString + '" width="' + width + '" height="' + height + '" /></div>';
		return img;
	};
	
	var _addSlickImages = function _addSlickImages (messageValue) {
		if (messageValue.hasOwnProperty('carousel')) {
			var carousel = messageValue.carousel;
			if (messageValue.hasOwnProperty('imgArray')) {
				var images = messageValue.imgArray;
				var height = (messageValue.hasOwnProperty('imgHeight')) ? messageValue.imgHeight : '100%';
				var width = (messageValue.hasOwnProperty('imgWidth')) ? messageValue.imgWidth : '100%';
				for (var i= 0, len=images.length; i<len; ++i) {
					var img = _buildSlickImage(images[i], width, height);
					$(carousel).slick('slickAdd', img);
				}
			}
		}
	};

	var _handleCarouselMessages = function _handleCarouselMessages (message) {
		switch (message.type) {
		case Constants.mbus_render:
			var format = CarouselData.getCarouselFormat(message.value.id, message.value.dataType);
			_renderSlick(format);
			MBus.publish(Constants.mbus_carousel, Constants.mbus_rendered, null);
			break;
		case Constants.mbus_clear:
			$(message.value.carousel).slick('slickRemove', 0, false, true);
			break;
		case Constants.mbus_add:
			_addSlickImages(message.value);
			break;
		}
	};
	
	var unsubscribe = MBus.subscribe(Constants.mbus_carousel, _handleCarouselMessages);
	return {
		
	}
})();