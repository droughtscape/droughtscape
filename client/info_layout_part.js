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
var carouselId = 'info-item-carousel';
var carouselIdElt = '#' + carouselId;

var _selectedItem = null;
var unsubscribeSelectItems;
var unsubscribeInfoItem;

var _handleInfoPartCarouselMessages = function _handleInfoPartCarouselMessages (message) {
	if (MBus.validateMessage(message)) {
		console.log('_handleInfoPartCarouselMessages:TODO, message.type: ' + message.type);
	}
	else {
		console.log('_handleInfoPartCarouselMessages:ERROR, invalid message');
	}
};

Template.info_layout_part.onCreated(function () {
	_selectedItem = PixiJSViewActionStore.getSelectedPart();
	unsubscribeInfoItem = MBus.subscribe(Constants.mbus_infoItem_carousel, _handleInfoPartCarouselMessages);
	// if we have a valid part, load it up into the carousel
	if (_selectedItem) {
		let part = PartsManager.getPartByItemId(_selectedItem.abstractPart.itemId);
		if (part) {
			Meteor.defer(function () {
				MBus.publish(Constants.mbus_carousel_add, new Message.Add(carouselIdElt, '500px', '500px', [part]));
			});
		}
	}
});

Template.info_layout_part.onDestroyed(function () {
	unsubscribeInfoItem.remove();
});

Template.info_layout_part.helpers({
	location: function () {
		console.log('location');
		return {x: _selectedItem.locus.x, y: _selectedItem.locus.y};
	},
	carouselId: function () {
		return carouselId;
	},
	validItem: function () {
		return _selectedItem !== null;
	},
	infoItemMode: function () {
		return {topic: Constants.mbus_infoItem_carousel, html: carouselIdElt, type: 'infoItem', subType: null};
	},
	alertNoItem: function () {
		swal({
			title: 'Oops!',
			text: 'No part selected!',
			timer: 2000,
			showConfirmButton: true });
		ViewStack.popState(true);
	},
	itemType: function () {
		let itemId = _selectedItem.abstractPart.itemId
		let part = PartsManager.getPartByItemId(itemId);
		return { itemId: itemId, url: (part) ? part.url : ''};
	}
});