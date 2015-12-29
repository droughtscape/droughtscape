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
var unsubscribeSlickCarousel;

var currentSelectedCarousel = new ReactiveVar(null);

var _unselectFromId = function _unselectFromId (carouselId) {
	currentSelectedCarousel.set(carouselId);
	switch (carouselId) {
	case Template.all_parts.getCarouselId():
		Template.my_parts.clearBorderColor();
		break;
	case Template.my_parts.getCarouselId():
		Template.all_parts.clearBorderColor();
		break;
	default:
		return null;
		break;
	}
};

var _handleSelectCarouselMessage = function _handleSelectCarouselMessage(message) {
	if (MBus.validateMessage(message)) {
		console.log('_handleSelectCarouselMessage[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
		// message.value => {topic, html}
		let itemId = message.value.getDataPart();
		let abstractPart = PartsManager.getPartByItemId(itemId);
		console.log('selected item: ' + itemId + ', abstractPart: ' + abstractPart);
		LayoutManager.setCurrentAbstractPart(abstractPart);
		Dispatcher.dispatch('layout', new Message.ActionNewPart(LayoutActionType.SetAbstractPart, abstractPart));
		_unselectFromId(message.value.carouselId);
	}
	else {
		console.log('handleSelectPartsMessages:ERROR, invalid message');
	}
};

Template.select_parts.onRendered(function () {
	// Since we are positing a single active selection between the two carousels, we will set border style to none
	// and manage it manually
	// We might not be logged in so check first, if not, the all_parts and my_parts templates will not
	// be instantiated
	if (Meteor.userId()) {
		console.log('TEST: Template.all_parts.partsCarouselIdElt: ' + Template.all_parts.getCarouselId());
		Meteor.defer(function() {
			Template.all_parts.clearBorderColor();
			Template.my_parts.clearBorderColor();
			SelectionManager.clearSelection();
		});
	}
});

Template.select_parts.onCreated(function () {
	unsubscribeSlickCarousel = MBus.subscribe(Constants.mbus_carousel_selected, _handleSelectCarouselMessage);
});

Template.select_parts.onDestroyed(function () {
	unsubscribeSlickCarousel.remove();
});

Template.select_parts.helpers({
	topic: function () {
		return Constants.mbus_selectParts;
	}
});

Template.select_parts.helpers({
	disableAddToMyParts: function () {
		return (_enableClick(Template.all_parts.getCarouselId())) ? '' : 'disabled';
	},
	disableDeleteFromMyParts: function () {
		return (_enableClick(Template.my_parts.getCarouselId())) ? '' : 'disabled';
	}
});

var _enableClick = function _enableClick (targetCarousel) {
	return Session.get('currentSelection') && 
			currentSelectedCarousel.get() === targetCarousel;
};

Template.select_parts.events({
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget(ViewTargetType.createSelectParts);
		ViewStack.pushTarget(ViewTargetType.signIn);
	},
	'click #favorite-parts-add': function () {
		if (_enableClick(Template.all_parts.getCarouselId())) {
			console.log('Add to My Parts clicked');
			PartsManager.addToMyParts(SelectionManager.getSelection());
		}
	},
	'click #favorite-parts-del': function () {
		if (_enableClick(Template.my_parts.getCarouselId())) {
			console.log('Delete from My Parts clicked');
			PartsManager.delFromMyParts(SelectionManager.getSelection());
		}
	}
});
