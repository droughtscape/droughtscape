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
	MBus.publish('carousel', 'clear', {carousel: favoritePartsCarouselIdElt});
	switch (selection) {
	case 'irrigation':
		MBus.publish('carousel', 'add', {carousel: favoritePartsCarouselIdElt, imgWidth: '200px', imgHeight: '200px',
			imgArray: [
				'http://lorempixel.com/580/250/nature/1',
				'http://lorempixel.com/580/250/nature/2',
				'http://lorempixel.com/580/250/nature/3',
				'http://lorempixel.com/580/250/nature/4',
				'http://lorempixel.com/580/250/nature/5'
			]});
		break;
	default:
		MBus.publish('carousel', 'add', {carousel: favoritePartsCarouselIdElt, imgWidth: '200px', imgHeight: '200px', imgArray: ['http://lorempixel.com/580/250/nature/1']});
		break;
	}
};

var handlePartTypeMessages = function handlePartTypeMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case 'selected':
			console.log('handlePartTypeMessagess[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			// init carousel
			Meteor.defer(function () {
				setSelectedCarouselImages(favoritePartsCarouselIdElt, message.value);
			});
			break;
		}
	}
	else {
		console.log('handlePartTypeMessages:ERROR, invalid message');
	}
};

var unsubscribe = null;

Template.favoriteParts.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'parts');
	unsubscribe = MBus.subscribe('PartType:favoriteParts', handlePartTypeMessages)
});

Template.favoriteParts.onDestroyed(function () {
	NavConfig.popRightBar();
	unsubscribe.remove();
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
		Session.set('renderView', 'signin');
	},
	'click #dismiss-alert': function () {
		Session.set('renderView', 'parts');
	}
});