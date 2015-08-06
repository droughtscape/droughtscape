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

Template.part_type.helpers({
	// Template must set the context when instantiating this template fragment
	partsList: function () {
		return PartTypeData.getPartTypeList(this.context, this.selected.get());
	}
});

Template.part_type.events({
	'click .part-select': function (e, template) {
		var clickedButton = e.currentTarget;
		template.data.selected.set(clickedButton.id);
		console.log( 'data.selected: ' + template.data.selected.get());
		var callback = PartTypeData.getPartTypeCallback(template.data.context);
		if (callback) {
			callback(template.data.selected.get());
		}
	}
});

Template.require_signin.events({
	'click #dismiss-alert': function () {
		// Clear all targets, go to splash on all dismisses
		SignInUtils.clearRenderViewTargets();
		Session.set('renderView', 'splash');
	}
});

Template.display_user.helpers({
	userName: function () {
		return SignInUtils.getUserName();
	}
});