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
class TestAbstractPartSP {
	constructor () {
		// dimensions in meters
		this.width = .60;
		this.height = .60;
		this.url = 'custom.png';
	}

	getWidth () { return this.width; }
	getHeight () { return this.height; }
	getImageUrl () { return this.url; }
}

var testAbstractPart = new TestAbstractPartSP();
var unsubscribeSelectParts;
var unsubscribeSlickCarousel;
var selectPartSelection = null;

// TODO Remove this singleton once we implement collections
var _testLoader = getTestLoader();

var _validateSelectPartSelection = function _validateSelectPartSelection (source) {
	return typeof(source !== 'undefined') &&
		(selectPartSelection.hasAttribute(topic)) &&
		(source === selectPartSelection.topic);
};

var _getUnselectedTopic = function _getUnselectedTopic (selectedTopic) {
	return (selectedTopic === Constants.mbus_allPartsCarousel) ? Constants.mbus_myPartsCarousel :
		Constants.mbus_allPartsCarousel;
};

var _getUnselectedTopicFromId = function _getUnselectedTopicFromId (carouselId) {
	switch (carouselId) {
	case Template.allParts.getCarouselId():
		return Constants.mbus_myPartsCarousel;
		break;
	case Template.myParts.getCarouselId():
		return Constants.mbus_allPartsCarousel;
		break;
	default:
		return null;
		break;
	}
};

var _handleSelectPartsMessages = function _handleSelectPartsMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('_handleSelectPartsMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// message.value => {topic, html}
			selectPartSelection = {topic: message.topic, target: message.value};
			let itemId = message.value.html.getAttribute(Constants.dataPart);
			let abstractPart = _testLoader.getItem(itemId);
			console.log('selected item: ' + itemId + ', abstractPart: ' + abstractPart);
			CreateLawnData.setCurrentLayoutPart(abstractPart);
		{
			let unselectTopic = _getUnselectedTopic(message.value.topic);
			MBus.publish(unselectTopic, Constants.mbus_unselected, null);
		}
			break;
		case Constants.mbus_slickEvent:
			console.log('_handleSelectPartsMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value +
				', on carousel: ' + message.value.carouselId);
		{
			let unselectTopic = _getUnselectedTopicFromId(message.value.carouselId);
			MBus.publish(unselectTopic, Constants.mbus_unselected, null);
		}
			break;
		}
	}
	else {
		console.log('handleSelectPartsMessages:ERROR, invalid message');
	}
};

Template.select_parts.onRendered(function () {
	// Since we are positing a single active selection between the two carousels, we will set border style to none
	// and manage it manually
	// We might not be logged in so check first, if not, the allParts and myParts templates will not
	// be instantiated
	if (Meteor.userId()) {
		console.log('TEST: Template.allParts.partsCarouselIdElt: ' + Template.allParts.getCarouselId());
		Meteor.defer(function() {
			Template.allParts.clearBorderColor();
			Template.myParts.clearBorderColor();
			SelectionManager.clearSelection();
		});
	}
});

Template.select_parts.onCreated(function () {
	//CreateLawnData.createLayoutPart(testAbstractPart);
	unsubscribeSelectParts = MBus.subscribe(Constants.mbus_selectParts, _handleSelectPartsMessages);
	unsubscribeSlickCarousel = MBus.subscribe(Constants.mbus_slickCarousel, _handleSelectPartsMessages);
});

Template.select_parts.onDestroyed(function () {
	unsubscribeSelectParts.remove();
	unsubscribeSlickCarousel.remove();
});

Template.select_parts.helpers({
	topic: function () {
		return Constants.mbus_selectParts;
	}
});

Template.select_parts.events({
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget(Constants.vsCreateSelectParts);
		ViewStack.pushTarget(Constants.vsSignIn);
	},
	'click #favorite-parts-add': function () {
		console.log('Add to My Parts clicked');
	},
	'click #favorite-parts-del': function () {
		console.log('Delete from My Parts clicked');
	}
});
