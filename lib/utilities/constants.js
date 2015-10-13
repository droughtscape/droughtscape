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
	const rightBar = 'rightBar';
	const rightBarConfig = 'rightBarConfig';
	const userUnitsOfMeasure = 'userUnitsOfMeasure';
	
	// render targets
	const build_lawn = 'build_lawn';
	const create = 'create';
	const favorites = 'favorites';
	const layout_lawn = 'layout_lawn';
	const measure_lawn = 'measure_lawn';
	const parts = 'parts';
	const personalize = 'personalize';
	const shape_lawn = 'shape_lawn';
	const signin = 'signin';
	const splash = 'splash';
	
	// navBar targets
	const home = 'home';

	// right bar targets
	const finish_lawn = 'finish_lawn';
	const select_parts = 'select_parts';
	
	
	// measure constants
	const English = 'English';
	
	// MBus topics
	const mbus_carousel = 'carousel';
	const mbus_allPartsType = 'PartType:allParts';
	const mbus_allPartsCarousel = 'PartCarousel:allParts';
	const mbus_favoriteParts = 'PartType:favoriteParts';
	const mbus_favoriteParts_carousel = 'PartCarousel:favoriteParts';
	const mbus_layout = 'layout';
	const mbus_myPartsType = 'PartType:myParts';
	const mbus_myPartsCarousel = 'PartCarousel:myParts';
	const mbus_parts = 'PartType:parts';
	const mbus_parts_carousel = 'PartCarousel:parts';
	// MBus message types
	const mbus_add = 'add';
	const mbus_clear = 'clear';
	const mbus_render = 'render';
	const mbus_rendered = 'rendered';
	const mbus_selected = 'selected';
	const mbus_unselected = 'unselected';
	
	// Colors
	const color_teal = '#009688';
	const color_gray = '#9e9e9e';
	
	return {
		adminRights: adminRights,
		build_lawn: build_lawn,
		carouselMode: carouselMode,
		carouselSubMode: carouselSubMode,
		computedArea: computedArea,
		create: create,
		favorites: favorites,
		finish_lawn: finish_lawn,
		gridEnabled: gridEnabled,
		gridSpacing: gridSpacing,
		home: home,
		layout_lawn: layout_lawn,
		measure_lawn: measure_lawn,
		navBarConfig: navBarConfig,
		parts: parts,
		personalize: personalize,
		renderView: renderView,
		rightBar: rightBar,
		rightBarConfig: rightBarConfig,
		select_parts: select_parts,
		shape_lawn: shape_lawn,
		signin: signin,
		splash: splash,
		userUnitsOfMeasure: userUnitsOfMeasure,
		English: English,
		mbus_add: mbus_add,
		mbus_carousel: mbus_carousel,
		mbus_clear: mbus_clear,
		mbus_myPartsType: mbus_myPartsType,
		mbus_myPartsCarousel: mbus_myPartsCarousel,
		mbus_favoriteParts: mbus_favoriteParts,
		mbus_favoriteParts_carousel: mbus_favoriteParts_carousel,
		mbus_layout: mbus_layout,
		mbus_allPartsType: mbus_allPartsType,
		mbus_allPartsCarousel: mbus_allPartsCarousel,
		mbus_parts: mbus_parts,
		mbus_parts_carousel: mbus_parts_carousel,
		mbus_render: mbus_render,
		mbus_rendered: mbus_rendered,
		mbus_selected: mbus_selected,
		mbus_unselected: mbus_unselected,
		color_gray: color_gray,
		color_teal: color_teal
	};
})();
