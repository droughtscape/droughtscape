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
	var getCarouselFormat = function getCarouselFormat (id, dataType) {
		var carouselFormat = {};
		switch (dataType) {
		case 'allLawns':
		case 'allParts':
		case 'myParts':
		case 'favoriteParts':
		case 'favorite-parts':
		case 'parts':
		case 'gallery':
			carouselFormat = {
				slide: '#' + id,
				autoPlay: 3000,
				items: 8,
				itemsDesktop: [1199,3],
				itemsDesktopSmall: [979,3]
			};
			break;
		case 'myLawns':
		case 'lawnShapes':
		case 'buildLawnTemplates':
			carouselFormat = {
				slide: '#' + id,
				autoPlay: 3000,
				items: 4,
				itemsDesktop: [1199,3],
				itemsDesktopSmall: [979,3],
				centerMode: true
			};
			break;
		case 'infoPart':
			carouselFormat = {
				slide: '#' + id,
				autoPlay: 3000,
				items: 1,
				itemsDesktop: [1199,3],
				itemsDesktopSmall: [979,3],
				centerMode: true
			};
			break;
		default:
			throw 'ERROR, unexpected dataType: ' + dataType;
			break;
		}
		return carouselFormat;
	};
	
	var _getPartData = function _getPartData (partClass) {
		console.log('_getPartData: ' + partClass);
		var partData = [];
		switch (partClass) {
		case 'all':
		case 'pavers':
			partData = [{id: "foo", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "foo1", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "foo2", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
			break;
		default:
			partData = [{id: "foo", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
		}
		return partData;
	};

	var _getFavoritePartsData = function _getFavoritePartsData (partClass) {
		console.log('_getFavoritePartsData: ' + partClass);
		var partData = [];
		switch (partClass) {
		case 'all':
		case 'pavers':
			partData = [{id: "foo", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "foo1", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "foo2", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
			break;
		default:
			partData = [{id: "foo", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
		}
		return partData;
	};

	var getCarouselData = function getCarouselData (dataType) {
		var carouselData = [];
		switch (dataType.type) {
		case 'parts':
			carouselData = _getPartData(dataType.subType);
			break;
		case 'myLawns':
			carouselData = [{id: "bar", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar0", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar1", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar2", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"},
				{id: "bar3", src:"//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg", alt:"Owl Image"}];
			break;
		case 'favoriteParts':
			carouselData = _getFavoritePartsData(dataType.subType);
			break;
		}
		return carouselData;
	};
	return {
		getCarouselFormat : getCarouselFormat,
		getCarouselData : getCarouselData
	};
})();