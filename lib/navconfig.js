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
	// These are private module POJOs which
	// are keyed by configKey, e.g. home, plant, gallery
	// and will have button configuration base on the configKey
	// Buttons are tuples { name: <button name>, class: <materializecss button spec> }
	// For now, create in place here but we can later use DB or whatever
	var _navBarConfigs = {
		'home': [
			{name: 'personalize', buttonType: 'nav_button', icon: 'mdi-action-face-unlock right', friendlyName: 'personalize', target: ViewTargetType.personalize},
			{name: 'lawns', buttonType: 'nav_button', icon: 'mdi-image-photo-library right', friendlyName: 'lawns', target: ViewTargetType.lawns},
			{name: 'parts', buttonType: 'nav_button', icon: 'mdi-image-collections right', friendlyName: 'parts', target: ViewTargetType.parts},
			{name: 'community', buttonType: 'nav_button', icon: 'mdi-social-group right', friendlyName: 'community', target: ViewTargetType.community},
			{name: 'rebates', buttonType: 'nav_button', icon: 'mdi-editor-attach-money right', friendlyName: 'rebates', target: ViewTargetType.rebates},
			{name: 'watersmart', buttonType: 'nav_button', icon: 'mdi-social-share right', friendlyName: 'watersmart', target: ViewTargetType.waterSmart}
		],
		'create': [
		],
		'layout': [
			{
				name: 'zoom-layout',
				buttonType: 'dropdown_button',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'zoom',
				dataActivates: 'dropdown-data-zoom-layout',
				dropdownTags: [
					{tagType: 'dropdown_tag', tagName: 'fit', tagParent: 'layout', tagAction: NavBarTagActionType.Fit},
					{tagType: 'dropdown_tag', tagName: 'fit width', tagParent: 'layout', tagAction: NavBarTagActionType.FitWidth},
					{tagType: 'dropdown_tag', tagName: 'fit height', tagParent: 'layout', tagAction: NavBarTagActionType.FitHeight},
					{tagType: 'dropdown_tag', tagName: 'fit to box', tagParent: 'layout', tagAction: NavBarTagActionType.FitToBox},
					{tagType: 'dropdown_divider'},
					{tagType: 'dropdown_tag', tagName: '400%', tagParent: 'layout', tagAction: NavBarTagActionType.Zoom400},
					{tagType: 'dropdown_tag', tagName: '300%', tagParent: 'layout', tagAction: NavBarTagActionType.Zoom300},
					{tagType: 'dropdown_tag', tagName: '200%', tagParent: 'layout', tagAction: NavBarTagActionType.Zoom200},
					{tagType: 'dropdown_tag', tagName: '100%', tagParent: 'layout', tagAction: NavBarTagActionType.Zoom100}
				]
			},
			{
				name: 'edit-layout',
				buttonType: 'dropdown_button',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'edit',
				dataActivates: 'dropdown-data-edit-layout',
				dropdownTags: [
					{tagType: 'dropdown_tag', tagName: 'delete', tagParent: 'layout', tagAction: NavBarTagActionType.Delete},
					{tagType: 'dropdown_tag', tagName: 'move', tagParent: 'layout', tagAction: NavBarTagActionType.Move},
					{tagType: 'dropdown_tag', tagName: 'copy', tagParent: 'layout', tagAction: NavBarTagActionType.Copy},
					{tagType: 'dropdown_tag', tagName: 'paste', tagParent: 'layout', tagAction: NavBarTagActionType.Paste}
				]
			},
			{
				name: 'arrange-layout',
				buttonType: 'dropdown_button',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'arrange',
				dataActivates: 'dropdown-data-arrange-layout',
				dropdownTags: [
					{tagType: 'dropdown_tag', tagName: 'move to back', tagParent: 'layout', tagAction: NavBarTagActionType.MoveToBack},
					{tagType: 'dropdown_tag', tagName: 'move to front', tagParent: 'layout', tagAction: NavBarTagActionType.MoveToFront},
					{tagType: 'dropdown_tag', tagName: 'move backward', tagParent: 'layout', tagAction: NavBarTagActionType.MoveBackward},
					{tagType: 'dropdown_tag', tagName: 'move forward', tagParent: 'layout', tagAction: NavBarTagActionType.MoveForward}
				]
			},
			{name: 'select-layout', buttonType: 'action_button', icon: 'mdi-action-done-all right', friendlyName: 'select', 
				tagParent: 'layout', tagAction: NavBarTagActionType.SelectMode}
		],
		'render': [
			{
				name: 'zoom-render',
				buttonType: 'dropdown_button',
				icon: 'mdi-navigation-arrow-drop-down right right',
				friendlyName: 'zoom',
				dataActivates: 'dropdown-data-zoom-render',
				dropdownTags: [
					{tagType: 'dropdown_tag', tagName: 'fit', tagParent: 'render', tagAction: NavBarTagActionType.Fit},
					{tagType: 'dropdown_tag', tagName: 'fit width', tagParent: 'render', tagAction: NavBarTagActionType.FitWidth},
					{tagType: 'dropdown_tag', tagName: 'fit height', tagParent: 'render', tagAction: NavBarTagActionType.FitHeight},
					{tagType: 'dropdown_tag', tagName: 'fit to box', tagParent: 'render', tagAction: NavBarTagActionType.FitToBox},
					{tagType: 'dropdown_divider'},
					{tagType: 'dropdown_tag', tagName: '400%', tagParent: 'render', tagAction: NavBarTagActionType.Zoom400},
					{tagType: 'dropdown_tag', tagName: '300%', tagParent: 'render', tagAction: NavBarTagActionType.Zoom300},
					{tagType: 'dropdown_tag', tagName: '200%', tagParent: 'render', tagAction: NavBarTagActionType.Zoom200},
					{tagType: 'dropdown_tag', tagName: '100%', tagParent: 'render', tagAction: NavBarTagActionType.Zoom100}
				]
			}
		]
	};
	// Right side bar configs - TBD
	var _rightSideBarConfigs = {
		'lawns': [
			{name: 'info_item', icon: 'mdi-content-link right', friendlyName: 'info lawn', target: ViewTargetType.infoLawn}
		],
		'none': [
			
		],
		'create.info_item': [
			{name: 'layout_lawn', icon: 'mdi-action-explore right', friendlyName: 'layout view', target: ViewTargetType.createLayoutLawn},
			{name: 'new_part', icon: 'mdi-content-add-circle right', friendlyName: 'new part', target: ViewTargetType.newPart},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts', target: ViewTargetType.createSelectParts}
		],
		'part.info_item': [
			{name: 'new_part', icon: 'mdi-content-add-circle right', friendlyName: 'new part', target: ViewTargetType.newPart},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts', target: ViewTargetType.partSelectParts}
		],
		'home': [
			{name: 'create', icon: 'mdi-content-add-circle right', friendlyName: 'create', target: ViewTargetType.create},
			{name: 'favorites', icon: 'mdi-action-favorite-outline right', friendlyName: 'favorites', target: ViewTargetType.favorites},
			{name: 'watercalc', icon: 'mdi-editor-attach-money right', friendlyName: 'watercalc', target: ViewTargetType.waterCalc}
		],
		'create.parts': [
			{name: 'new_part', icon: 'mdi-content-add-circle right', friendlyName: 'new part', target: ViewTargetType.newPart},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts', target: ViewTargetType.createSelectParts},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part', target: ViewTargetType.createInfoPart}
		],
		'parts': [
			{name: 'new_part', icon: 'mdi-content-add-circle right', friendlyName: 'new part', target: ViewTargetType.newPart},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts', target: ViewTargetType.partSelectParts},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part', target: ViewTargetType.infoPart}
		],
		'new_parts': [
			{name: 'new_part', icon: 'mdi-content-add-circle right', friendlyName: 'new part', target: ViewTargetType.newPart},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part', target: ViewTargetType.infoPart}
		],
		'layout_lawn': [
			{name: 'render_lawn', icon: 'mdi-action-3d-rotation right', friendlyName: 'render view', target: ViewTargetType.createRenderLawn},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts', target: ViewTargetType.createSelectParts},
			{name: 'finish_lawn', icon: 'mdi-action-done-all right', friendlyName: 'finish lawn', target: ViewTargetType.createFinishLawn},
			{name: 'layout_settings', icon: 'mdi-action-assessment right', friendlyName: 'settings', target: ViewTargetType.createLayoutSettings}
		],
		'render_lawn': [
			{name: 'layout_lawn', icon: 'mdi-action-explore right', friendlyName: 'layout view', target: ViewTargetType.createLayoutLawn},
			{name: 'select_parts', icon: 'mdi-action-favorite-outline right', friendlyName: 'my parts', target: ViewTargetType.createSelectParts},
			{name: 'finish_lawn', icon: 'mdi-action-done-all right', friendlyName: 'finish lawn', target: ViewTargetType.createFinishLawn},
			{name: 'divider', color: 'red'},
			{name: 'navZoom', url: 'zoom.png', tagParent: 'render', inAction: RightBarTagActionType.ZoomIn, outAction: RightBarTagActionType.ZoomOut},
			{name: 'navCompass', url: 'rendernav.png', tagParent: 'render',
				upAction: RightBarTagActionType.MoveCameraUp,
				dnAction: RightBarTagActionType.MoveCameraDn,
				ltAction: RightBarTagActionType.RotateCameraLt,
				rtAction: RightBarTagActionType.RotateCameraRt}
		],
		'select_parts': [
			{name: 'layout_lawn', icon: 'mdi-action-explore right', friendlyName: 'layout view', target: ViewTargetType.createLayoutLawn},
			{name: 'render_lawn', icon: 'mdi-action-3d-rotation right', friendlyName: 'render view', target: ViewTargetType.createRenderLawn},
			{name: 'new_part', icon: 'mdi-content-add-circle right', friendlyName: 'new part', target: ViewTargetType.newPart},
			{name: 'info_part', icon: 'mdi-content-link right', friendlyName: 'info part', target: ViewTargetType.createInfoPart}
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
	 * @function getNavBarTarget - function to validate a given id as a button member of a given navBar
	 * @param {string} configKey name of the content view to customize nav bar for
	 * @param {string} id name of the button to validate
	 * @return {string} target template
	 */
	var getNavBarTarget = function getNavBarTarget (configKey, id) {
		let navBarConfig = _navBarConfigs[configKey];
		let target = null;
		if (navBarConfig) {
			for (var i=0, len=navBarConfig.length; i<len; ++i) {
				if (navBarConfig[i].name === id) {
					target = navBarConfig[i].target;
					break;
				}
			}
		}
		return target;
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

	return {
		getNavBarConfig: getNavBarConfig,
		getNavBarTarget: getNavBarTarget,
		getRightBarConfig: getRightSideBarConfig,
		getRightBarTarget: _getRightBarTarget,
		getRightBarTargetViewState: _getRightBarTargetViewState
	};
})();