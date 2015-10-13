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
		var topic = 'PartType:' + this.context;
		MBus.publish(topic, Constants.mbus_selected, this.selected.get());
		return PartTypeData.getPartTypeList(this.context, this.selected.get());
	}
});

Template.part_type.events({
	'click .part-select': function (e, template) {
		var clickedButton = e.currentTarget;
		console.log('RADIO: target: ' + e.currentTarget + ', template: ' + template);
		// selected is reactive so partsList helper will fire as a result
		template.data.selected.set(clickedButton.value);
	}
});

Template.require_signin.events({
	'click #dismiss-alert': function () {
		// Clear all targets, go to splash on all dismisses
		SignInUtils.clearRenderViewTargets();
		Session.set(Constants.renderView, Constants.splash);
	}
});

Template.display_user.helpers({
	userName: function () {
		return SignInUtils.getUserName();
	},
	userColor: function () {
		var color = 'black';
		if (Session.get(Constants.adminRights)) {
			color = 'red';
		}
		return 'color: ' + color;
	}
});