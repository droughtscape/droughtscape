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
// Generic carousel data collection getter
CarouselData = (function () {
	var getCarouselFormat = function getCarouselFormat (dataType) {
		var carouselFormat = {};
		switch (dataType.context) {
		case 'parts':
			carouselFormat = {autoPlay: 3000,
				items: 8,
				itemsDesktop: [1199,3],
				itemsDesktopSmall: [979,3]
			};
			break;
		case 'myLawns':
			carouselFormat = {autoPlay: 3000,
				items: 4,
				itemsDesktop: [1199,3],
				itemsDesktopSmall: [979,3]
			};
			break;
		}
		return carouselFormat;
	};
	var getCarouselData = function getCarouselData (dataType) {
		var carouselData = [];
		switch (dataType) {
		case 'parts':
			carouselData = [{id: "foo", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "foo1", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "foo2", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
			break;
		case 'myLawns':
			carouselData = [{id: "bar", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar0", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar1", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar2", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar3", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
			break;
		}
		return carouselData;
	};
	return {
		getCarouselFormat : getCarouselFormat,
		getCarouselData : getCarouselData
	};
})();