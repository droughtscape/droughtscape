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
var carouselId = 'info-lawn-carousel';
var carouselIdElt = '#' + carouselId;

var _selectedItem = null;
var unsubscribeSelectItems;
var unsubscribeInfoItem;

var _handleInfoLawnCarouselMessages = function _handleInfoLawnCarouselMessages (message) {
	if (MBus.validateMessage(message)) {
		console.log('_handleInfoLawnCarouselMessages:TODO, message.type: ' + message.type);
	}
	else {
		console.log('_handleInfoLawnCarouselMessages:ERROR, invalid message');
	}
};

Template.info_lawn.onCreated(function () {
	_selectedItem = SelectionManager.getSelection();
	unsubscribeInfoItem = MBus.subscribe(Constants.mbus_infoItem_carousel, _handleInfoLawnCarouselMessages);
	// if we have a valid part, load it up into the carousel
	if (_selectedItem) {
		let lawn = LawnsManager.getLawnByItemId(_selectedItem.itemId);
		if (lawn) {
			Meteor.defer(function () {
				MBus.publish(Constants.mbus_carousel_add, new Message.Add(carouselIdElt, '500px', '500px', [lawn]));
			});
		}
	}
});

Template.info_lawn.onDestroyed(function () {
	unsubscribeInfoItem.remove();
});

Template.info_lawn.helpers({
	carouselId: function () {
		return carouselId;
	},
	validItem: function () {
		return _selectedItem !== null;
	},
	infoItemMode: function () {
		return {topic: Constants.mbus_infoItem_carousel, html: carouselIdElt, type: "infoItem", subType: null};
	},
	alertNoItem: function () {
		Materialize.toast('No lawn selected!', 3000, 'rounded red-text');
		ViewStack.popState(true);
	},
	itemType: function () {
		let lawn = LawnsManager.getLawnByItemId(_selectedItem.itemId);
		return { itemId: _selectedItem.itemId, url: (lawn) ? lawn.url : ''};
	}
});