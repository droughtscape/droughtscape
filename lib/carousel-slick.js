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
		var carouselSelector = $('.carousel');
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
		carouselSelector.on('init', function (event, slick) {
			console.log('init:currentSlide: ' + slick.currentSlide);
			let slide = slick.$slides.get(slick.currentSlide);
			if (slide && slide.style) {
				slide.style.borderColor = 'teal';
			}
		});
		carouselSelector.on('reInit', function (event, slick) {
			console.log('reInit:currentSlide: ' + slick.currentSlide);
			let slide = slick.$slides.get(slick.currentSlide);
			if (slide) {
				if (slide.style) {
					slide.style.borderColor = 'teal';
				}
				SelectionManager.sendSelection(slide);
			}
			MBus.publishSimple(Constants.mbus_carousel_selected, new Message.Selection(this.id, slide));
		});
		carouselSelector.on('afterChange', function (event, slick, currentSlide) {
			console.log('afterChange: currentSlide: ' + currentSlide + ', carousel: ' + this.id);
			let slide = slick.$slides.get(currentSlide);
			slide.style.borderColor = 'teal';
			SelectionManager.sendSelection(slide);
			MBus.publishSimple(Constants.mbus_carousel_selected, new Message.Selection(this.id, slide));
		});
		carouselSelector.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
			console.log('beforeChange[' + this.id +']: currentSlide: ' + currentSlide + ', nextSlide: ' + nextSlide);
			// Try to handle unexpected case where currentSlide and nextSlide are the same
			if (currentSlide === nextSlide) {
				// Ok, slickGoTo is a no go.  Breaks everything
				//slick.$slides.slickGoTo(nextSlide);
				console.log('slick.beforeChange: Unexpected??? currentSlide: ' + currentSlide + ', nextSlide: ' + nextSlide);
			}
			else {
				slick.$slides.get(currentSlide).style.borderColor = 'white';
				slick.$slides.get(nextSlide).style.borderColor = 'teal';
			}
		});
	};
	
	var _buildSlickImage = function _buildSlickImage (image, width, height) {
		// image might be just a string, or an object of form: {id: <idstring>, img: <imgstring>}
		var img;
		if (image !== null) {
			switch (typeof image) {
			case 'object':
				if (image.hasOwnProperty('id')) {
					img = '<div id="' + image.id + '" class="carouselItem", data-part=' + image.itemId + '><img src="' + image.url + '" width="' + width + '" height="' + height + '" /></div>';
				}
				else {
					img = '<div class="carouselItem", data-part=' + image.itemId + '><img src="' + image.url + '" width="' + width + '" height="' + height + '" /></div>';
				}
				break;
			case 'string':
				img = '<div class="carouselItem", data-part="fubar-fubar"><img src="' + image + '" width="' + width + '" height="' + height + '" /></div>';
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
					$(img).data('foo', messageValue);
					let testData = $(img).data('foo');
					console.log('testData: ' + testData);
					$(carousel).slick('slickAdd', img);
				}
			}
		}
	};

	var _setBorderColor = function _setBorderColor (carousel, borderColor) {
		let slick = carousel[0].slick;
		for (i=0, len=slick.$slides.length; i<len; ++i) {
			let slide = slick.$slides.get(i);
			slide.style.borderColor = borderColor;
		}
	};
	
	var _handleCarouselRender = function _handleCarouselRender (message) {
		let format = CarouselData.getCarouselFormat(message.value.id, message.value.dataType);
		_renderSlick(format);
		MBus.publishSimple(Constants.mbus_carousel_rendered, null);
	};
	
	var _handleClearSlickImages = function _handleClearSlickImages (message) {
		$(message.value.carousel).slick('slickRemove', 0, false, true);
	};
	
	var _handleAddSlickImages = function _handleAddSlickImages (message) {
		_addSlickImages(message.value);
	};
	
	var _handleSetBorderColor = function _handleSetBorderColor (message) {
		_setBorderColor(message.value.carousel, message.value.color);
	};

	var _handleCarouselSelectedMessages = function _handleCarouselSelectedMessages(message) {
		// Just highlight?
		message.value.htmlItem.style.borderColor = Constants.color_highlight;
	};

	// These never unsubscribe
	//MBus.subscribe(Constants.mbus_carousel, _handleCarouselMessages);
	MBus.subscribe(Constants.mbus_carousel_selected, _handleCarouselSelectedMessages);
	MBus.subscribe(Constants.mbus_carousel_setBorderColor, _handleSetBorderColor);
	MBus.subscribe(Constants.mbus_carousel_add, _handleAddSlickImages);
	MBus.subscribe(Constants.mbus_carousel_clear, _handleClearSlickImages);
	MBus.subscribe(Constants.mbus_carousel_render, _handleCarouselRender);
	return {
		
	};
})();