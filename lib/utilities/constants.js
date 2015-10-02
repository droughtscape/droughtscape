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
	
	
	return {
		adminRights: adminRights,
		carouselMode: carouselMode,
		carouselSubMode: carouselSubMode,
		computedArea: computedArea,
		gridEnabled: gridEnabled,
		gridSpacing: gridSpacing,
		navBarConfig: navBarConfig,
		renderView: renderView,
		rightBar: rightBar,
		rightBarConfig: rightBarConfig,
		userUnitsOfMeasure: userUnitsOfMeasure
	};
})();
