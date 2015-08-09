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
	var _setupSlick = function _setupSlick () {
		$('.carousel').slick({
			infinite: false,
			dots: true,
			arrows: true,
			//centerMode: true,
			//centerPadding: '60px',
			//slidesToShow: 3,
			//adaptiveHeight: true,
			slidesToScroll: 3,
			variableWidth: true
		});
	};
	
	var _buildSlickImage = function _buildSlickImage (imageString) {
		var img = '<div class="carouselItem"><img src="' + imageString + '" width="100%" height="100%" /></div>';
		return img;
	};
	
	var _addSlickImages = function _addSlickImages (carousel, images) {
		for (var i= 0, len=images.length; i<len; ++i) {
			var img = _buildSlickImage(images[i]);
			$(carousel).slick('slickAdd', img);
		}
	};

	var _handleCarouselMessages = function _handleCarouselMessages (message) {
		switch (message.type) {
		case 'render':
			_setupSlick();
			MBus.publish('carousel', 'rendered', null);
			break;
		case 'clear':
			$(message.value.carousel).slick('slickRemove', 0, false, true);
			break;
		case 'add':
			_addSlickImages(message.value.carousel, message.value.imgArray);
			break;
		}
	};
	
	var unsubscribe = MBus.subscribe('carousel', _handleCarouselMessages);
	return {
		
	}
})();