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
			{name: 'personalize', buttonType: 'navButton', icon: 'mdi-action-face-unlock right', friendlyName: 'personalize'},
			{name: 'gallery', buttonType: 'navButton', icon: 'mdi-image-photo-library right', friendlyName: 'gallery'},
			{name: 'parts', buttonType: 'navButton', icon: 'mdi-image-collections right', friendlyName: 'parts'},
			{name: 'community', buttonType: 'navButton', icon: 'mdi-social-group right', friendlyName: 'community'},
			{name: 'rebates', buttonType: 'navButton', icon: 'mdi-editor-attach-money right', friendlyName: 'rebates'},
			{name: 'watersmart', buttonType: 'navButton', icon: 'mdi-social-share right', friendlyName: 'watersmart'}
		],
		'create': [
			{
				name: 'zoom-create',
				buttonType: 'dropdownButton',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'zoom',
				dataActivates: 'dropdown-data-zoom-create',
				dropdownTags: [
					{tagType: 'dropdownTag', tagName: 'fit', tagParent: 'create'},
					{tagType: 'dropdownTag', tagName: 'fit width', tagParent: 'create'},
					{tagType: 'dropdownTag', tagName: 'fit height', tagParent: 'create'},
					{tagType: 'dropdownTag', tagName: 'fit to box', tagParent: 'create'},
					{tagType: 'dropdownDivider'},
					{tagType: 'dropdownTag', tagName: '400%', tagParent: 'create'},
					{tagType: 'dropdownTag', tagName: '300%', tagParent: 'create'},
					{tagType: 'dropdownTag', tagName: '200%', tagParent: 'create'},
					{tagType: 'dropdownTag', tagName: '100%', tagParent: 'create'}
				]
			}
		],
		'layout': [
			{
				name: 'zoom-layout',
				buttonType: 'dropdownButton',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'zoom',
				dataActivates: 'dropdown-data-zoom-layout',
				dropdownTags: [
					{tagType: 'dropdownTag', tagName: 'fit', tagParent: 'layout'},
					{tagType: 'dropdownTag', tagName: 'fit width', tagParent: 'layout'},
					{tagType: 'dropdownTag', tagName: 'fit height', tagParent: 'layout'},
					{tagType: 'dropdownTag', tagName: 'fit to box', tagParent: 'layout'},
					{tagType: 'dropdownDivider'},
					{tagType: 'dropdownTag', tagName: '400%', tagParent: 'layout'},
					{tagType: 'dropdownTag', tagName: '300%', tagParent: 'layout'},
					{tagType: 'dropdownTag', tagName: '200%', tagParent: 'layout'},
					{tagType: 'dropdownTag', tagName: '100%', tagParent: 'layout'}
				]
			},
			{name: 'select-layout', buttonType: 'actionButton', icon: 'mdi-action-done-all right', friendlyName: 'select'}
		],
		'render': [
			{
				name: 'zoom-render',
				buttonType: 'dropdownButton',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'zoom',
				dataActivates: 'dropdown-data-zoom-render',
				dropdownTags: [
					{tagType: 'dropdownTag', tagName: 'fit', tagParent: 'render'},
					{tagType: 'dropdownTag', tagName: 'fit width', tagParent: 'render'},
					{tagType: 'dropdownTag', tagName: 'fit height', tagParent: 'render'},
					{tagType: 'dropdownTag', tagName: 'fit to box', tagParent: 'render'},
					{tagType: 'dropdownDivider'},
					{tagType: 'dropdownTag', tagName: '400%', tagParent: 'render'},
					{tagType: 'dropdownTag', tagName: '300%', tagParent: 'render'},
					{tagType: 'dropdownTag', tagName: '200%', tagParent: 'render'},
					{tagType: 'dropdownTag', tagName: '100%', tagParent: 'render'}
				]
			}
		]
	};
	// Right side bar configs - TBD
	var _rightSideBarConfigs = {
		'none': [
			
		],
		'home': [
			{name: 'create', icon: 'mdi-content-add-circle right', friendlyName: 'create', 
				target: 'create'},
			{name: 'favorites', icon: 'mdi-action-favorite-outline right', friendlyName: 'favorites'},
			{name: 'watercalc', icon: 'mdi-editor-attach-money right', friendlyName: 'watercalc'}
		],
		'parts': [
			{name: 'newPart', icon: 'mdi-content-add-circle right', friendlyName: 'new part'},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts'},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part'}
		],
		'new_parts': [
			{name: 'newPart', icon: 'mdi-content-add-circle right', friendlyName: 'new part'},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part'}
		],
		'layout_lawn': [
			{name: 'render_lawn', icon: 'mdi-action-3d-rotation right', friendlyName: 'render view'},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts'},
			{name: 'finish_lawn', icon: 'mdi-action-done-all right', friendlyName: 'finish lawn'},
			{name: 'layout_settings', icon: 'mdi-action-settings_applications right', friendlyName: 'settings'}
		],
		'render_lawn': [
			{name: 'layout_lawn', icon: 'mdi-action-explore right', friendlyName: 'layout view'},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts'},
			{name: 'finish_lawn', icon: 'mdi-action-done-all right', friendlyName: 'finish lawn'}
		],
		'select_parts': [
			{name: 'layout_lawn', icon: 'mdi-action-explore right', friendlyName: 'layout view'},
			{name: 'render_lawn', icon: 'mdi-action-3d-rotation right', friendlyName: 'render view'},
			{name: 'newPart', icon: 'mdi-content-add-circle right', friendlyName: 'new part'},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part'}
		],
		'finish_lawn': [
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
	 * @return {object[]} array of button names and materializecss class definitions
	 */
	var getNavBarConfig = function getNavBarConfig (configKey) {
		return _navBarConfigs[_mapNavBarConfigKey(configKey)];
	};

	var _getRightBarViewState = function _getRightBarViewState (bar, id) {
		var status = false;
		if (bar) {
			for (var i=0, len=bar.length; i<len; ++i) {
				if (bar[i].name === id) {
					status = true;
					break;
				}
			}
		}
		return status;
	};
	
	var _getRightBarTargetViewState = function _getRightBarTargetViewState (currentRightBar, nextRightBar) {
		let configKey = _mapRightBarConfigKey(currentRightBar);
		let rightBarConfig = _rightSideBarConfigs[configKey];
		let viewState = null;
		if (rightBarConfig) {
			for (var i=0, len=rightBarConfig.length; i<len; ++i) {
				if (rightBarConfig[i].name === nextRightBar) {
					viewState = rightBarConfig[i].viewState;
					break;
				}
			}
		}
		return viewState;
	};

	var _getRightBarTarget = function _getRightBarTarget (currentRightBar, nextRightBar) {
		let configKey = _mapRightBarConfigKey(currentRightBar);
		let rightBarConfig = _rightSideBarConfigs[configKey];
		let target = null;
		if (rightBarConfig) {
			for (var i=0, len=rightBarConfig.length; i<len; ++i) {
				if (rightBarConfig[i].name === nextRightBar) {
					target = rightBarConfig[i].target;
					break;
				}
			}
		}
		return target;
	};

	/**
	 * @namespace NavConfig
	 * validateNavBarId function to validate a given id as a button member of a given navBar
	 * @param {string} configKey name of the content view to customize nav bar for
	 * @param {string} id name of the button to validate
	 * @return {boolean} true if a member
	 */
	var validateNavBarId = function validateNavBarId (configKey, id) {
		return _validateBar(getNavBarConfig(configKey), id);
	};

	/**
	 * @namespace NavConfig
	 * getRightSideBarConfig function
	 * @param {string} configKey name of the content view to customize right side bar for
	 * @return {object[]} array of button names and materializecss class definitions
	 */
	var getRightSideBarConfig = function getRightSideBarConfig (configKey) {
		return _rightSideBarConfigs[_mapRightBarConfigKey(configKey)];
	};

	/**
	 * @namespace NavConfig
	 * validateRightBarId function to validate a given id as a button member of a given rightBar
	 * @param {string} configKey name of the content view to customize nav bar for
	 * @param {string} id name of the button to validate
	 * @return {boolean} true if a member
	 */
	var validateRightBarId = function validateRightBarId (configKey, id) {
		return _validateBar(getRightSideBarConfig(configKey), id);
	};

	/**
	 * @namespace private
	 * _validateBar function to validate a given id as a button member of a given rightBar
	 * @param {object[]} bar - array of items in a given menu bar
	 * @param {string} id - name of the button to validate
	 * @return {boolean} true if a member
	 */
	var _validateBar = function _validateBar (bar, id) {
		var status = false;
		if (bar) {
			for (var i=0, len=bar.length; i<len; ++i) {
				if (bar[i].name === id) {
					status = true;
					break;
				}
			}
		}
		return status;
	};
	
	var navBarStack = [];

	/**
	 * @namespace NavConfig
	 * pushNavBar function Push a new nav bar onto the navBarStack
	 *                       Also sets the appropriate Session variables
	 * @param {string} navBar new navBar
	 */
	var pushNavBar = function pushNavBar (navBar) {
		var newNavBar = {navBar: navBar};
		navBarStack.push(newNavBar);
		Session.set(Constants.navBarConfig, navBar);
	};

	/**
	 * @namespace NavConfig
	 * popNavBar function Pop the current navBar from the navBarStack and restore previous
	 *                      Also sets the appropriate Session variables
	 *                      Error if last on stack => no pop
	 */
	var popNavBar = function popNavBar () {
		navBarStack.pop();
		if (navBarStack.length > 0) {
			var restoreNavBar = navBarStack[navBarStack.length-1];
			Session.set(Constants.navBarConfig, restoreNavBar.navBar);
		}
	};


	var rightBarStack = [];
	
	/**
	 * @namespace NavConfig
	 * pushRightBar function Push a new rightBar onto the rightBarStack
	 *                       Also sets the appropriate Session variables
	 * @param {string} rightBar new right bar state (can be '' for no right bar)
	 * @param {string} rightBarConfig new rightBarConfig state [optional]
	 */
	var pushRightBar = function pushRightBar (rightBar, rightBarConfig) {
		var newRightBar = {rightBar: rightBar, rightBarConfig: rightBarConfig};
		rightBarStack.push(newRightBar);
		Session.set(Constants.rightBar, rightBar);
		Session.set(Constants.rightBarConfig, rightBarConfig);
	};

	/**
	 * @namespace NavConfig
	 * pushEmptyRightBar function Basically clears the right bar by pushing
	 * an unnamed bar onto the stack.
	 * Also sets the appropriate Session variables
	 * IMPORTANT, you still have to pop this bar off the stack
	 */
	var pushEmptyRightBar = function pushEmptyRightBar () {
		var newRightBar = {rightBar: '', rightBarConfig: ''};
		rightBarStack.push(newRightBar);
		Session.set(Constants.rightBar, '');
		Session.set(Constants.rightBarConfig, '');
	};

	/**
	 * @namespace NavConfig
	 * popRightBar function Pop the current rightBar from the rightBarStack and restore previous
	 *                      Also sets the appropriate Session variables
	 *                      Error if last on stack => no pop
	 */
	var popRightBar = function popRightBar () {
		rightBarStack.pop();
		if (rightBarStack.length > 0) {
			var restoreRightBar = rightBarStack[rightBarStack.length-1];
			Session.set(Constants.rightBar, restoreRightBar.rightBar);
			Session.set(Constants.rightBarConfig, restoreRightBar.rightBarConfig);
		}
	};
	
	return {
		getNavBarConfig: getNavBarConfig,
		validateNavBarId: validateNavBarId,
		getRightBarConfig: getRightSideBarConfig,
		getRightBarTarget: _getRightBarTarget,
		getRightBarTargetViewState: _getRightBarTargetViewState,
		validateRightBarId: validateRightBarId,
		pushNavBar: pushNavBar,
		popNavBar: popNavBar,
		pushRightBar: pushRightBar,
		pushEmptyRightBar: pushEmptyRightBar,
		popRightBar: popRightBar
	};
})();