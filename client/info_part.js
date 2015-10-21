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
var partsCarouselId = 'info-part-carousel';
var partsCarouselIdElt = '#' + partsCarouselId;

var _selectedPart = null;
var unsubscribeSelectParts;
var unsubscribeInfoPart;
var _testLoader = getTestLoader();

var _handleInfoPartCarouselMessages = function _handleInfoPartCarouselMessages (message) {
	if (MBus.validateMessage(message)) {
		console.log('_handleInfoPartCarouselMessages:TODO, message.type: ' + message.type);
	}
	else {
		console.log('_handleInfoPartCarouselMessages:ERROR, invalid message');
	}
};

Template.info_part.onCreated(function () {
	_selectedPart = SelectionManager.getSelection();
	unsubscribeInfoPart = MBus.subscribe(Constants.mbus_infoPart_carousel, _handleInfoPartCarouselMessages);
	// if we have a valid part, load it up into the carousel
	if (_selectedPart) {
		let partCore = _testLoader.getItem(_selectedPart.itemId);
		let testPart = _testLoader.createTestPart(partCore.getUrl());
		Meteor.defer(function () {
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add,
				{carousel: partsCarouselIdElt, imgWidth: '500px', imgHeight: '500px', imgArray: [testPart]});
		});
	}
});

Template.info_part.onDestroyed(function () {
});

Template.info_part.helpers({
	carouselId: function () {
		return partsCarouselId;
	},
	validPart: function () {
		return _selectedPart !== null;
	},
	infoPartMode: function () {
		return {topic: Constants.mbus_infoPart_carousel, html: partsCarouselIdElt, type: "infoPart", subType: null};
	},
	alertNoPart: function () {
		Materialize.toast('No part selected!', 3000, 'rounded red-text');
		ViewStack.popState(true);
	},
	partType: function () {
		let partCore = _testLoader.getItem(_selectedPart.itemId);
		return { itemId: _selectedPart.itemId, url: partCore.getUrl()};
	}
});