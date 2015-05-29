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
NavConfig = (function () {
	var getPosition = Utils.getPosition;
	// These are private module POJOs which
	// are keyed by configKey, e.g. home, plant, gallery
	// and will have button configuration base on the configKey
	// Buttons are tuples { name: <button name>, class: <materializecss button spec> }
	// For now, create in place here but we can later use DB or whatever
	var _navBarConfigs = {
		'home': [
			{name: 'personalize', class: 'mdi-action-face-unlock right', friendlyName: 'personalize'},
			{name: 'gallery', class: 'mdi-image-photo-library right', friendlyName: 'gallery'},
			{name: 'parts', class: 'mdi-content-add-box right', friendlyName: 'parts'},
			{name: 'community', class: 'mdi-social-group right', friendlyName: 'community'},
			{name: 'rebates', class: 'mdi-editor-attach-money right', friendlyName: 'rebates'},
			{name: 'watersmart', class: 'mdi-social-share right', friendlyName: 'watersmart'}
		]
	};
	// Right side bar configs - TBD
	var _rightSideBarConfigs = {
		'home': [
			{name: 'create', class: 'mdi-action-face-unlock right', friendlyName: 'create'},
			{name: 'favorites', class: 'mdi-action-favorite-outline right', friendlyName: 'favorites'},
			{name: 'watercalc', class: 'mdi-editor-attach-money right', friendlyName: 'watercalc'}
		],
		'parts': [
			{name: 'newPart', class: 'mdi-action-face-unlock right', friendlyName: 'new part'},
			{name: 'favoriteParts', class: 'mdi-action-favorite-outline right', friendlyName: 'favorite parts'}
		]
	};
	
	var _mapNavBarConfigKey = function _mapNavBarConfigKey (configKey) {
		// Since the a particular nav bar config might be common to several keys
		// provide a mapping here.  Do it functionally so we can handle out of bound keys
		var mappedKey = 'home';
		if (typeof configKey !== 'undefined') {
			// variable is defined
			if (_navBarConfigs.hasOwnProperty(configKey)) {
				mappedKey = configKey;
			}
		}
		return mappedKey;
	};

	var _mapRightBarConfigKey = function _mapRightBarConfigKey (configKey) {
		// Since the a particular right bar config might be common to several keys
		// provide a mapping here.  Do it functionally so we can handle out of bound keys
		var mappedKey = 'home';
		if (typeof configKey !== 'undefined') {
			// variable is defined
			if (_rightSideBarConfigs.hasOwnProperty(configKey)) {
				mappedKey = configKey;
			}
		}
		return mappedKey;
	};

	/**
	 * @namespace NavConfig
	 * getNavBarConfig function
	 * @param {string} configKey name of the content view to customize nav bar for
	 * @return {array} array of button names and materializecss class definitions
	 */
	var getNavBarConfig = function getNavBarConfig (configKey) {
		return _navBarConfigs[_mapNavBarConfigKey(configKey)];
	};

	/**
	 * @namespace NavConfig
	 * getRightSideBarConfig function
	 * @param {string} configKey name of the content view to customize right side bar for
	 * @return {array} array of button names and materializecss class definitions
	 */
	var getRightSideBarConfig = function getRightSideBarConfig (configKey) {
		return _rightSideBarConfigs[_mapRightBarConfigKey(configKey)];
	};

	var rightBarStack = [];
	
	/**
	 * @namespace NavConfig
	 * pushRightBar function Push a new rightBar onto the rightBarStack
	 *                       Also sets the appropriate Session variables
	 * @param {string} rightBar new right bar state (can be '' for no right bar)
	 * @param {string} rightBarConfig new rightBarConfig state [optional]
	 * @return {array} array of button names and materializecss class definitions
	 */
	var pushRightBar = function pushRightBar (rightBar, rightBarConfig) {
		var newRightBar = {rightBar: rightBar, rightBarConfig: rightBarConfig};
		rightBarStack.push(newRightBar);
		Session.set('rightBar', rightBar);
		Session.set('rightBarConfig', rightBarConfig);
	};

	/**
	 * @namespace NavConfig
	 * popRightBar function Pop the current rightBar from the rightBarStack and restore previous
	 *                      Also sets the appropriate Session variables
	 *                      Error if last on stack => no pop
	 * @return {array} array of button names and materializecss class definitions
	 */
	var popRightBar = function popRightBar () {
		rightBarStack.pop();
		if (rightBarStack.length > 0) {
			var restoreRightBar = rightBarStack[rightBarStack.length-1];
			Session.set('rightBar', restoreRightBar.rightBar);
			Session.set('rightBarConfig', restoreRightBar.rightBarConfig);
		}
	};
	
	return {
		getNavBarConfig: getNavBarConfig,
		getRightBarConfig: getRightSideBarConfig,
		pushRightBar: pushRightBar,
		popRightBar: popRightBar
	};
})();