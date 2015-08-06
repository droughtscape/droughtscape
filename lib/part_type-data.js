/**
 * Created by kishigo on 8/6/15.
 * Copyright (c) 2015 DirecTV LLC, All Rights Reserved
 *
 * This software and its documentation may not be used, copied, modified or distributed, in whole or in part, without express
 * written permission of DirecTV LLC.
 *
 * The source code is the confidential and proprietary information of DirecTV, LLC. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement
 * you entered into with DirecTV LLC.
 *
 */
// Generic part_type data getter.  Put into lib so it resolves before client calls
PartTypeData = (function () {
// _partTypeList allows us to use the part_type template to filter different part configurations
// depending on the context within which it is used.
	var _partTypeList = {
		'newPart':  { callback: null, vArray: [
			{value: 'plants', friendlyName: 'Plants', checked: 'checked'},
			{value: 'groundcovers', friendlyName: 'Groundcovers'},
			{value: 'borders', friendlyName: 'Borders'},
			{value: 'pavers', friendlyName: 'Pavers'},
			{value: 'irrigation', friendlyName: 'Irrigation'},
			{value: 'lighting', friendlyName: 'Lighting'},
			{value: 'decorative', friendlyName: 'Decorative'},
			{value: 'other', friendlyName: 'Other'}
		]},
		'favoriteParts': { callback: null, vArray: [
			{value: 'plants', friendlyName: 'Plants'},
			{value: 'groundcovers', friendlyName: 'Groundcovers'},
			{value: 'borders', friendlyName: 'Borders'},
			{value: 'pavers', friendlyName: 'Pavers'},
			{value: 'irrigation', friendlyName: 'Irrigation'},
			{value: 'lighting', friendlyName: 'Lighting'},
			{value: 'decorative', friendlyName: 'Decorative'},
			{value: 'all', friendlyName: 'All', checked: 'checked'}
		]},
		'parts': { callback: null, vArray: [
			{value: 'plants', friendlyName: 'Plants', checked: 'checked'},
			{value: 'groundcovers', friendlyName: 'Groundcovers', checked: ''},
			{value: 'borders', friendlyName: 'Borders'},
			{value: 'pavers', friendlyName: 'Pavers'},
			{value: 'irrigation', friendlyName: 'Irrigation'},
			{value: 'lighting', friendlyName: 'Lighting'},
			{value: 'decorative', friendlyName: 'Decorative'},
			{value: 'other', friendlyName: 'Other'}
		]}
	};
	
	var _setPartTypeCallback = function _setPartTypeCallback (partType, callback) {
		_partTypeList[partType].callback = callback;
	};

	var _getPartTypeList = function _getPartTypeList (partType, selected) {
		var partObject = _partTypeList[partType];
		var partsList = partObject.vArray;
		for (var part in partsList) {
			var partItem = partsList[part];
			if (partItem.value === selected) {
				partItem.checked = 'checked';
			}
			else {
				delete partItem.checked;
			}
		}
		return partsList;
	};
	
	var _getPartTypeCallback = function _getPartTypeCallback (partType) {
		return _partTypeList[partType].callback;
	};

	return {
		getPartTypeList: _getPartTypeList,
		getPartTypeCallback: _getPartTypeCallback,
		setPartTypeCallback: _setPartTypeCallback
	};
})();