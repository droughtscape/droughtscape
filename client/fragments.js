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
		// Target topic is dynamic depending on this.context to indicate any related item like a carousel that
		// will be listening on that topic tuple: PartType:<related template>
		var topic = 'PartType:' + this.context;
		MBus.publish(topic, new Message.TypeSelection(this.selected.get()));
		return PartTypeData.getPartTypeList(this.context, this.selected.get());
	},
	labelColor: function () {
		// set label text color to match either select or not for better visual feedback to user
		return (this.checked) ? Constants.color_highlight : Constants.color_gray;
	}
});

Template.part_type.events({
	'click .part-select': function (e, template) {
		var clickedButton = e.currentTarget;
		console.log('RADIO: target: ' + e.currentTarget + ', template: ' + template);
		// selected is reactive so partsList helper will fire as a result
		// We know the value is a number for force it with unary +
		template.data.selected.set(+clickedButton.value);
	}
});

Template.lawn_type.helpers({
	// Template must set the context when instantiating this template fragment
	lawnsList: function () {
		// Target topic is dynamic depending on this.context to indicate any related item like a carousel that
		// will be listening on that topic tuple: PartType:<related template>
		var topic = 'LawnType:' + this.context;
		MBus.publish(topic, new Message.TypeSelection(this.selected.get()));
		return LawnTypeData.getLawnTypeList(this.context, this.selected.get());
	},
	labelColor: function () {
		// set label text color to match either select or not for better visual feedback to user
		return (this.checked) ? Constants.color_highlight : Constants.color_gray;
	}
});

Template.lawn_type.events({
	'click .lawn-select': function (e, template) {
		var clickedButton = e.currentTarget;
		console.log('RADIO: target: ' + e.currentTarget + ', template: ' + template);
		// selected is reactive so partsList helper will fire as a result
		// We know the value is a number for force it with unary +
		template.data.selected.set(+clickedButton.value);
	}
});

Template.require_signin.events({
	'click #dismiss-alert': function () {
		// Clear all targets, go to splash on all dismisses
		SignInUtils.clearRenderViewTargets();
		ViewStack.pushTarget(ViewTargetType.home);
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