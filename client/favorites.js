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

Template.favorites.helpers({
	myLawns: function () {
		return {type: 'myLawns', subType: 'none'};
	},
	hasFavorites: function () {
		var user = Meteor.user();
		var userEmail = user.emails[0].address;
		var dsUser = DroughtscapeUsers.findOne({user: userEmail});
		return dsUser.myLawns.length > 0;
	},
	favoriteLawns: function () {
		var user = Meteor.user();
		var userEmail = user.emails[0].address;
		var dsUser = DroughtscapeUsers.findOne({user: userEmail});
		return dsUser.myLawns;
	},
	signInMessage: function () {
		return 'Sign in to view your favorites'
	}
});

Template.favorites.events({
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget('favorites');
		Session.set(Constants.renderView, 'signin');
	}
});