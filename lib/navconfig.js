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
			{name: 'personalize', class: 'mdi-action-face-unlock right'},
			{name: 'plants', class: 'mdi-image-photo-library right'},
			{name: 'gallery', class: 'mdi-image-photo-library right'},
			{name: 'community', class: 'mdi-social-group right'},
			{name: 'rebates', class: 'mdi-editor-attach-money right'},
			{name: 'watersmart', class: 'mdi-social-share right'}
		]
	};
	// Right side bar configs - TBD
	var _rightSideBarConfigs = {};
	
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
	
	return {
		getNavBarConfig: getNavBarConfig,
		getRightBarConfig: getRightSideBarConfig
	};
})();