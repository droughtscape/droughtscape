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
// _partTypeList allows us to use the part_type template to filter different part configurations
// depending on the context within which it is used.
var _partTypeList = {
	'newPart':  [
		{value: 'plants', friendlyName: 'Plants', checked: 'checked'},
		{value: 'groundcovers', friendlyName: 'Groundcovers'},
		{value: 'borders', friendlyName: 'Borders'},
		{value: 'pavers', friendlyName: 'Pavers'},
		{value: 'irrigation', friendlyName: 'Irrigation'},
		{value: 'lighting', friendlyName: 'Lighting'},
		{value: 'decorative', friendlyName: 'Decorative'},
		{value: 'other', friendlyName: 'Other'}
	],
	'favoriteParts': [
		{value: 'plants', friendlyName: 'Plants'},
		{value: 'groundcovers', friendlyName: 'Groundcovers'},
		{value: 'borders', friendlyName: 'Borders'},
		{value: 'pavers', friendlyName: 'Pavers'},
		{value: 'irrigation', friendlyName: 'Irrigation'},
		{value: 'lighting', friendlyName: 'Lighting'},
		{value: 'decorative', friendlyName: 'Decorative'},
		{value: 'all', friendlyName: 'All', checked: 'checked'}
	],
	'parts': [
		{value: 'plants', friendlyName: 'Plants', checked: 'checked'},
		{value: 'groundcovers', friendlyName: 'Groundcovers', checked: ''},
		{value: 'borders', friendlyName: 'Borders'},
		{value: 'pavers', friendlyName: 'Pavers'},
		{value: 'irrigation', friendlyName: 'Irrigation'},
		{value: 'lighting', friendlyName: 'Lighting'},
		{value: 'decorative', friendlyName: 'Decorative'},
		{value: 'other', friendlyName: 'Other'}
	]
};

var _getPartTypeList = function _getPartTypeList (partType, selected) {
	var partsList = _partTypeList[partType];
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

Template.part_type.helpers({
	// Template must set the context when instantiating this template fragment
	partsList: function () {
		return _getPartTypeList(this.context, this.selected.get());
	}
});

Template.part_type.events({
	'click .part-select': function (e, template) {
		var clickedButton = e.currentTarget;
		template.data.selected.set(clickedButton.id);
		console.log( 'data.selected: ' + template.data.selected.get());
	}
});

Template.require_signin.events({
	'click #dismiss-alert': function () {
		// Clear all targets, go to splash on all dismisses
		SignInUtils.clearRenderViewTargets();
		Session.set('renderView', 'splash');
	}
});

Template.display_user.helpers({
	userName: function () {
		return SignInUtils.getUserName();
	}
});