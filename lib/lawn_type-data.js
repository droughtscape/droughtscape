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
// Generic lawn_type data getter.  Put into lib so it resolves before client calls
LawnTypeData = (function () {
// _lawnTypeList allows us to use the lawn_type template to filter different part configurations
// depending on the context within which it is used.
	var _lawnTypeList = {
		'newLawn':  { callback: null, vArray: [
			{value: 'rectangle', friendlyName: 'Rectangle', checked: 'checked'},
			{value: 'corner', friendlyName: 'Corner'},
			{value: 'custom', friendlyName: 'Custom'}
		]},
		'favoriteLawns': { callback: null, vArray: [
			{value: 'rectangle', friendlyName: 'Rectangle', checked: 'checked'},
			{value: 'corner', friendlyName: 'Corner'},
			{value: 'custom', friendlyName: 'Custom'},
			{value: 'all', friendlyName: 'All', checked: 'checked'}
		]},
		'allLawns': { callback: null, vArray: [
			{value: 'rectangle', friendlyName: 'Rectangle', checked: 'checked'},
			{value: 'corner', friendlyName: 'Corner'},
			{value: 'custom', friendlyName: 'Custom'}
		]},
		'myLawns': { callback: null, vArray: [
			{value: 'rectangle', friendlyName: 'Rectangle', checked: 'checked'},
			{value: 'corner', friendlyName: 'Corner'},
			{value: 'custom', friendlyName: 'Custom'},
			{value: 'all', friendlyName: 'All', checked: 'checked'}
		]}
	};
	
	var _setLawnTypeCallback = function _setLawnTypeCallback (lawnType, callback) {
		_lawnTypeList[lawnType].callback = callback;
	};

	var _getLawnTypeList = function _getLawnTypeList (lawnType, selected) {
		var lawnObject = _lawnTypeList[lawnType];
		var lawnsList = lawnObject.vArray;
		for (var lawn in lawnsList) {
			if (lawnsList.hasOwnProperty(lawn)) {
				var lawnItem = lawnsList[lawn];
				lawnItem.id = lawnItem.value + '.' + lawnType;
				if (lawnItem.value === selected) {
					lawnItem.checked = 'checked';
				}
				else {
					delete lawnItem.checked;
				}
			}
		}
		return lawnsList;
	};
	
	var _getLawnTypeCallback = function _getLawnTypeCallback (lawnType) {
		return _lawnTypeList[lawnType].callback;
	};

	return {
		getLawnTypeList: _getLawnTypeList,
		getLawnTypeCallback: _getLawnTypeCallback,
		setLawnTypeCallback: _setLawnTypeCallback
	};
})();