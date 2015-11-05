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
// Constants so we don't have to use string literals or numbers
// Helps with tracing as well
// Note: Meteor 1.2 still does not support export/import ES6 syntax but we do have const keyword support
Constants = (function () {
	// ES6 syntax
	// session variable names
	const adminRights = 'adminRights';
	const carouselMode = 'carouselMode';
	const carouselSubMode = 'carouselSubMode';
	const computedArea = 'computedArea';
	const gridEnabled = 'gridEnabled';
	const gridSpacing = 'gridSpacing';
	const navBarConfig = 'navBarConfig';
	const renderView = 'renderView';
	const rightBarConfig = 'rightBarConfig';
	const userUnitsOfMeasure = 'userUnitsOfMeasure';
	
	const home = 'home';

	// Template names
	const right_bar = 'right_bar';
	const nav_bar = 'nav_bar';
	
	// measure constants
	const English = 'English';
	
	// MBus topics
	const mbus_carousel_add = 'carousel:add';
	const mbus_carousel_clear = 'carousel:clear';
	const mbus_carousel_render = 'carousel:render';
	const mbus_carousel_selected = 'carousel:selected';
	const mbus_carousel_unselected = 'carousel:unselected';
	const mbus_carousel_setBorderColor = 'carousel:setBorderColor';
	const mbus_allLawnsType = 'LawnType:allLawns';
	const mbus_allLawnsCarousel = 'LawnCarousel:allLawns';
	const mbus_allPartsType = 'PartType:allParts';
	const mbus_allPartsCarousel = 'PartCarousel:allParts';
	const mbus_layout = 'layout';
	const mbus_myPartsType = 'PartType:myParts';
	const mbus_myPartsCarousel = 'PartCarousel:myParts';
	const mbus_selectParts = 'Create:selectParts';
	// MBus message types
	const mbus_selected = 'selected';
	
	// Colors
	const color_teal = '#009688';
	const color_gray = '#9e9e9e';
	const color_black = '#000000';
	const color_white = '#ffffff';
	const color_highlight = color_teal;
	
	// HTML private data field
	const dataPart = 'data-part';
	const itemId = 'itemId';
	
	return {
		adminRights: adminRights,
		carouselMode: carouselMode,
		carouselSubMode: carouselSubMode,
		computedArea: computedArea,
		dataPart: dataPart,
		gridEnabled: gridEnabled,
		gridSpacing: gridSpacing,
		home: home,
		nav_bar: nav_bar,
		navBarConfig: navBarConfig,
		renderView: renderView,
		right_bar: right_bar,
		rightBarConfig: rightBarConfig,
		userUnitsOfMeasure: userUnitsOfMeasure,
		English: English,
		mbus_allLawnsType: mbus_allLawnsType,
		mbus_allLawnsCarousel: mbus_allLawnsCarousel,
		mbus_allPartsType: mbus_allPartsType,
		mbus_allPartsCarousel: mbus_allPartsCarousel,
		mbus_carousel_add: mbus_carousel_add,
		mbus_carousel_clear: mbus_carousel_clear,
		mbus_carousel_render: mbus_carousel_render,
		mbus_carousel_selected: mbus_carousel_selected,
		mbus_carousel_unselected: mbus_carousel_unselected,
		mbus_carousel_setBorderColor: mbus_carousel_setBorderColor,
		mbus_layout: mbus_layout,
		mbus_myPartsType: mbus_myPartsType,
		mbus_myPartsCarousel: mbus_myPartsCarousel,
		mbus_selected: mbus_selected,
		mbus_selectParts: mbus_selectParts,
		color_black: color_black,
		color_gray: color_gray,
		color_highlight: color_highlight,
		color_teal: color_teal,
		color_white: color_white
	};
})();
