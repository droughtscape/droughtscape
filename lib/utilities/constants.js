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
	const navBar = 'navBar';
	const navBarConfig = 'navBarConfig';
	const renderView = 'renderView';
	const rightBar = 'rightBar';
	const rightBarConfig = 'rightBarConfig';
	const userUnitsOfMeasure = 'userUnitsOfMeasure';
	
	// ViewStack targets
	const vsAbout = 'about';
	const vsHome = 'home';
	const vsCreate = 'create';
	const vsCreateBuildLawn = 'create.build_lawn';
	const vsCreateFinishLawn = 'create.finish_lawn';
	const vsCreateLayoutLawn = 'create.layout_lawn';
	const vsCreateLayoutSettings = 'create.layout_settings';
	const vsCreateMeasureLawn = 'create.measure_lawn';
	const vsCreateRenderLawn = 'create.render_lawn';
	const vsCreateSelectParts = 'create.select_parts';
	const vsCreateInfoPart = 'create.info_part';
	const vsCommunity = 'community';
	const vsFavorites = 'favorites';
	const vsInfoPart = 'info_part';
	const vsNewPart = 'newPart';
	const vsParts = 'parts';
	const vsPersonalize = 'personalize';
	const vsRebates = 'rebates';
	const vsSignIn = 'signin';
	const vsLawns = 'lawns';
	const vsWatersmart = 'watersmart';
	const vsWatercalc = 'watercalc';
	
	// render targets
	const about = 'about';
	const build_lawn = 'build_lawn';
	const community = 'community';
	const create = 'create';
	const favorites = 'favorites';
	const info_part = 'info_part';
	const lawns = 'lawns';
	const layout_lawn = 'layout_lawn';
	const layout_settings = 'layout_settings';
	const render_lawn = 'render_lawn';
	const measure_lawn = 'measure_lawn';
	const newPart = 'newPart';
	const parts = 'parts';
	const personalize = 'personalize';
	const rebates = 'rebates';
	const shape_lawn = 'shape_lawn';
	const signin = 'signin';
	const splash = 'splash';
	const watersmart = 'watersmart';
	const watercalc = 'watercalc';
	
	// navBar targets
	const home = 'home';
	const layout = 'layout';

	// right bar targets
	const finish_lawn = 'finish_lawn';
	const select_parts = 'select_parts';
	const new_parts = 'new_parts';
	const none = 'none';
	const create_parts = 'create.parts';
	
	
	// measure constants
	const English = 'English';
	
	// MBus topics
	const mbus_carousel = 'carousel';
	const mbus_allLawnsType = 'LawnType:allLawns';
	const mbus_allLawnsCarousel = 'LawnCarousel:allLawns';
	const mbus_allPartsType = 'PartType:allParts';
	const mbus_allPartsCarousel = 'PartCarousel:allParts';
	const mbus_favoriteParts = 'PartType:favoriteParts';
	const mbus_favoriteParts_carousel = 'PartCarousel:favoriteParts';
	const mbus_infoPart_carousel = 'PartCarousel:infoPart';
	const mbus_layout = 'layout';
	const mbus_myLawnsType = 'PartType:myLawns';
	const mbus_myLawnsCarousel = 'PartCarousel:myLawns';
	const mbus_myPartsType = 'PartType:myParts';
	const mbus_myPartsCarousel = 'PartCarousel:myParts';
	const mbus_parts = 'PartType:parts';
	const mbus_parts_carousel = 'PartCarousel:parts';
	const mbus_selectParts = 'Create:selectParts';
	const mbus_slickCarousel = 'slickCarousel';
	const mbus_selection = 'selection';
	// MBus message types
	const mbus_add = 'add';
	const mbus_clear = 'clear';
	const mbus_render = 'render';
	const mbus_rendered = 'rendered';
	const mbus_selected = 'selected';
	const mbus_setBorderColor = 'mbus_setBorderColor';
	const mbus_unselected = 'unselected';
	const mbus_slickEvent = 'slickEvent';
	
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
		about: about,
		adminRights: adminRights,
		build_lawn: build_lawn,
		carouselMode: carouselMode,
		carouselSubMode: carouselSubMode,
		community: community,
		computedArea: computedArea,
		create: create,
		dataPart: dataPart,
		favorites: favorites,
		finish_lawn: finish_lawn,
		gridEnabled: gridEnabled,
		gridSpacing: gridSpacing,
		home: home,
		info_part: info_part,
		itemId: itemId,
		lawns: lawns,
		layout: layout,
		layout_lawn: layout_lawn,
		layout_settings: layout_settings,
		measure_lawn: measure_lawn,
		navBar: navBar,
		navBarConfig: navBarConfig,
		newPart: newPart,
		new_parts: new_parts,
		none: none,
		parts: parts,
		personalize: personalize,
		rebates: rebates,
		render_lawn: render_lawn,
		renderView: renderView,
		rightBar: rightBar,
		rightBarConfig: rightBarConfig,
		select_parts: select_parts,
		shape_lawn: shape_lawn,
		signin: signin,
		splash: splash,
		userUnitsOfMeasure: userUnitsOfMeasure,
		watersmart: watersmart,
		watercalc: watercalc,
		English: English,
		mbus_add: mbus_add,
		mbus_carousel: mbus_carousel,
		mbus_slickCarousel: mbus_slickCarousel,
		mbus_clear: mbus_clear,
		mbus_myLawnsType: mbus_myLawnsType,
		mbus_myLawnsCarousel: mbus_myLawnsCarousel,
		mbus_myPartsType: mbus_myPartsType,
		mbus_myPartsCarousel: mbus_myPartsCarousel,
		mbus_favoriteParts: mbus_favoriteParts,
		mbus_favoriteParts_carousel: mbus_favoriteParts_carousel,
		mbus_infoPart_carousel: mbus_infoPart_carousel,
		mbus_layout: mbus_layout,
		mbus_allLawnsType: mbus_allLawnsType,
		mbus_allLawnsCarousel: mbus_allLawnsCarousel,
		mbus_allPartsType: mbus_allPartsType,
		mbus_allPartsCarousel: mbus_allPartsCarousel,
		mbus_parts: mbus_parts,
		mbus_parts_carousel: mbus_parts_carousel,
		mbus_render: mbus_render,
		mbus_rendered: mbus_rendered,
		mbus_selected: mbus_selected,
		mbus_selection: mbus_selection,
		mbus_selectParts: mbus_selectParts,
		mbus_setBorderColor: mbus_setBorderColor,
		mbus_slickEvent: mbus_slickEvent,
		mbus_unselected: mbus_unselected,
		color_black: color_black,
		color_gray: color_gray,
		color_highlight: color_highlight,
		color_teal: color_teal,
		color_white: color_white,
		vsHome: vsHome,
		vsAbout: vsAbout,
		vsCommunity: vsCommunity,
		vsCreate: vsCreate,
		vsCreateBuildLawn: vsCreateBuildLawn,
		vsCreateFinishLawn: vsCreateFinishLawn,
		vsCreateInfoPart: vsCreateInfoPart,
		vsCreateLayoutLawn: vsCreateLayoutLawn,
		vsCreateLayoutSettings: vsCreateLayoutSettings,
		vsCreateMeasureLawn: vsCreateMeasureLawn,
		vsCreateRenderLawn: vsCreateRenderLawn,
		vsCreateSelectParts: vsCreateSelectParts,
		vsFavorites: vsFavorites,
		vsInfoPart: vsInfoPart,
		vsNewPart: vsNewPart,
		vsParts: vsParts,
		vsPersonalize: vsPersonalize,
		vsLawns: vsLawns,
		vsRebates: vsRebates,
		vsSignIn: vsSignIn,
		vsWatercalc: vsWatercalc,
		vsWatersmart: vsWatersmart
	};
})();
