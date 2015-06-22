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
	
	return {
		pushRenderViewTarget: pushRenderViewTarget,
		popRenderViewTarget: popRenderViewTarget,
		clearRenderViewTargets: clearRenderViewTargets,
		getUserName: getUserName
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
