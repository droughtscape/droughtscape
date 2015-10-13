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
var partMode = new ReactiveVar('all');
var favoritePartsCarouselId = 'favorite-parts-carousel';
var favoritePartsCarouselIdElt = '#' + favoritePartsCarouselId;

var setSelectedCarouselImages = function setSelectedCarouselImages (carouselId, selection) {
	MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: favoritePartsCarouselIdElt});
	switch (selection) {
	case 'irrigation':
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: favoritePartsCarouselIdElt, imgWidth: '200px', imgHeight: '200px',
			imgArray: [
				'http://lorempixel.com/580/250/nature/1',
				'http://lorempixel.com/580/250/nature/2',
				'http://lorempixel.com/580/250/nature/3',
				'http://lorempixel.com/580/250/nature/4',
				'http://lorempixel.com/580/250/nature/5'
			]});
		break;
	default:
		MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: favoritePartsCarouselIdElt, imgWidth: '200px', imgHeight: '200px', imgArray: ['http://lorempixel.com/580/250/nature/1']});
		break;
	}
};

var handleFavoritePartTypeMessages = function handleFavoritePartTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('handleFavoritePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// init carousel
			Meteor.defer(function () {
				setSelectedCarouselImages(favoritePartsCarouselIdElt, message.value);
			});
			break;
		case Constants.mbus_unselected:
			console.log('handleFavoritePartTypeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			break;
		}
	}
	else {
		console.log('handleFavoritePartTypeMessages:ERROR, invalid message');
	}
};

var handleFavoritePartCarouselMessages = function handlePartCarouselMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case Constants.mbus_selected:
			console.log('handleFavoritePartCarouselMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			break;
		case Constants.mbus_unselected:
			console.log('handleFavoritePartCarouselMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			break;
		}
	}
	else {
		console.log('handleFavoritePartCarouselMessages:ERROR, invalid message');
	}
};

var unsubscribePartTypeHandler = null;
var unsubscribePartCarouselHandler = null;

Template.favoriteParts.onCreated(function () {
	let rightBarConfig = (CreateLawnData.getCurrentLawn()) ? Constants.select_parts : Constants.parts;
	NavConfig.pushRightBar(Constants.rightBar, rightBarConfig);
	unsubscribePartTypeHandler = MBus.subscribe(Constants.mbus_favoriteParts, handleFavoritePartTypeMessages);
	unsubscribePartCarouselHandler = MBus.subscribe(Constants.mbus_favoriteParts_carousel, handleFavoritePartCarouselMessages);
});

Template.favoriteParts.onDestroyed(function () {
	NavConfig.popRightBar();
	unsubscribePartTypeHandler.remove();
	unsubscribePartCarouselHandler.remove();
});

Template.favoriteParts.helpers({
	carouselId: function () {
		return favoritePartsCarouselId;
	},
	partsMode: function () {
		console.log('id: ' + Meteor.userId() + ', username: ' + SignInUtils.getUserName());
		SignInUtils.hasAdminRights(function(result) {
			console.log('isAdmin: ' + result);
		});
		return {type: "favoriteParts", subType: partMode.get()};
	},
	selected: function () {
		return partMode;
	}
});

Template.favoriteParts.events({
	'click #signin': function () {
		Session.set(Constants.renderView, Constants.signin);
	},
	'click #dismiss-alert': function () {
		Session.set(Constants.renderView, Constants.splash);
	},
	'click .part-select.favorite-parts': function (e, template) {
		console.log('RADIO.favoriteParts: e: ' + e + ', template: ' + template);
	}
});