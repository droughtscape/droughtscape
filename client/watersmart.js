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

var tipIndex = new ReactiveVar(0);
var mySub;
var tips;
var tipsArray;
var watersmartTipCard = new ReactiveVar(true);
var centerMe = new ReactiveVar(0);
var author = new ReactiveVar(null);

var centerCard = function centerCard (id) {
	var tipCard = document.getElementById(id);
	if (tipCard) {
		// Center the card
		var width = tipCard.clientWidth;
		var height = tipCard.clientHeight;
		var render = document.getElementById('render');
		if (render) {
			var renderWidth = render.clientWidth;
			var renderHeight = render.clientHeight;
			var left = renderWidth / 2 - (width/2);
			var top = renderHeight / 2 - (height/2);
			tipCard.style.position = 'absolute';
			tipCard.style.left = left + 'px';
			tipCard.style.top = top + 'px';
		}
	}
};

var tickleCenterMe = function tickleCenterMe () {
	// Force reactivity
	centerMe.set(centerMe.get() + 1);
};

Template.watersmart.onCreated(function () {
	NavConfig.pushRightBar('', '');
});

Template.watersmart.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.watersmart.onRendered(function () {
	centerCard('watersmart-card');
});

Template.watersmart.helpers({
	watersmartTip: function () {
		return watersmartTipCard.get();
	}
});

Template.watersmarttipcard.helpers({
	centerMe: function () {
		centerMe.get();
		// use defer to allow template to modify DOM before centerCard
		Meteor.defer(function () {
			centerCard('watersmart-card');
		});
	},
	nextTip: function () {
		tips = WatersaverTips.find({});
		tipsArray = tips.fetch();
		if (tipsArray.length > 0) {
			author.set(tipsArray[tipIndex.get()].createdBy);
			return tipsArray[tipIndex.get()].tip;
		}
		else {
			return 'no tips found';
		}
	},
	author: function () {
		return author.get();
	}
});

Template.watersmarttipcard.events({
	'click #dismiss-watersmart-btn': function () {
		Session.set('renderView','home');
	},
	'click #next-tip-btn': function () {
		if (tipsArray && tipsArray.length > 0) {
			i = tipIndex.get();
			i++;
			if (i === tipsArray.length) {
				i = 0;
			}
			tipIndex.set(i);
		}
	},
	'click #add-tip-btn': function () {
		console.log('add a tip');
		watersmartTipCard.set(false);
		tickleCenterMe();
	}
});

Template.addtipcard.helpers({
	centerMe: function () {
		centerMe.get();
		Meteor.defer(function () {
			centerCard('watersmart-add-tip-card');
		});
	}
});

Template.addtipcard.events({
	'click #save-new-tip-btn': function () {
		// Save to collection
		var value = document.getElementById('new-tip').value;
		var author = document.getElementById('new-tip-author').value;
		// Convert any line returns to <br>
		value = value.replace(/(?:\r\n|\r|\n)/g, '<br />');
		console.log('tip: ' + value + ', author: ' + author);
		WatersaverTips.insert({tip: value, createdAt: new Date(), createdBy: author});
		watersmartTipCard.set(true);
		tickleCenterMe();

	},
	'click #cancel-add-btn': function () {
		watersmartTipCard.set(true);
		tickleCenterMe();

	}
})