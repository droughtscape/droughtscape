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
SignInUtils = (function () {
	var renderViewTargetStack = [];
	
	var pushRenderViewTarget = function pushRenderViewTarget (target) {
		renderViewTargetStack.push(target);
	};
	
	var popRenderViewTarget = function popRenderViewTarget () {
		return (renderViewTargetStack.length > 0) ? renderViewTargetStack.pop() : 'splash';
	};
	
	var clearRenderViewTargets = function clearRenderViewTargets () {
		renderViewTargetStack = [];
	};
	
	var getUserName = function getUserName () {
		var user = Meteor.user();
		return Meteor.userId() && user && user.emails ? user.emails[0].address : "";	
	};
	
	var _isAdmin = function _isAdmin (userName, hasAdminResult) {
		// See if we have a valid value, if not go get one from server, else just return valid value
		if (!Session.get('adminRights')) {
			var isAdminResult = false;
			// Server side isAdmin
			Meteor.call('isAdmin', function (error, result) {
				if (error) {
					alert('Error');
				}
				else {
					console.log('return from server: ' + result);
					isAdminResult = result;
				}
				hasAdminResult(isAdminResult);
			});
		}
		else {
			hasAdminResult(Session.get('adminRights'));
		}
	};
	
	var hasAdminRights = function hasAdminRights (hasAdminResult) {
		var userName = getUserName();
		_isAdmin(userName, hasAdminResult);
	};
	
	var getAdminRights = function getAdminRights () {
		console.log('getAdminRights: ENTRY');
		// See if we have a valid value, if not go get one from server and set into the session variable
		if (Session.get('adminRights') === undefined) {
			console.log('getAdminRights:adminRights is undefined, call isAdmin');
			// Server side isAdmin
			Meteor.call('isAdmin', function (error, result) {
				if (error) {
					alert('Error');
				}
				else {
					console.log('getAdminRights: return from server: ' + result);
					Session.set('adminRights', result);
					// Test security, validated
					//Meteor.call('insertAdmin', 'fubar@gmail.com');
				}
			});
		}
		else {
			console.log('getAdminRights:adminRights is defined: ' + Session.get('adminRights'));
		}
	};
	
	var insertAdmin = function insertAdmin (newAdmin) {
		hasAdminRights(function (isAdmin) {
			if (isAdmin) {
				Meteor.call('insertAdmin, newAdmin');
			}
		});
	};
	
	return {
		pushRenderViewTarget: pushRenderViewTarget,
		popRenderViewTarget: popRenderViewTarget,
		clearRenderViewTargets: clearRenderViewTargets,
		getUserName: getUserName,
		hasAdminRights: hasAdminRights,
		getAdminRights: getAdminRights,
		insertAdmin: insertAdmin
	};
})();

Template.signin.events({
	'click #dismiss-sign-in': function () {
		// Clear all targets, go to splash on all dismisses
		SignInUtils.clearRenderViewTargets();
		Session.set('renderView', 'splash');
	},
	'click #at-btn': function () {
		Session.set('renderView', SignInUtils.popRenderViewTarget());
	}
});
