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
var partMode = new ReactiveVar('plants');

Template.newPart.onCreated(function () {
});

Template.newPart.helpers({
	partsMode: function () {
		return {type: "newParts", subType: partMode.get()};
	},
	selected: function () {
		return partMode;
	},
	createItemTemplate: function () {
		var template = Template.createOther;
		switch (partMode.get()) {
		case 'plants':
			template = Template.createPlant;
			break;
		case 'groundcovers':
			template = Template.createGroundcover;
			break;
		case 'borders':
			template = Template.createBorder;
			break;
		case 'pavers':
			template = Template.createPaver;
			break;
		case 'largerocks':
			template = Template.createLargeRock;
			break;
		case 'irrigation':
			template = Template.createIrrigation;
			break;
		case 'lighting':
			template = Template.createLighting;
			break;
		case 'decorative':
			template = Template.createDecorative;
			break;
		}
		return template;
	}
});

// Expect this template event to be invoked with context=<string>
// Where <string> := "parts" | "newPart" | ...
// The event comes from a subtemplate part_type
Template.newPart.events({
	'click #cancel-part': function () {
		var val = Utils.getRadioVal(document.getElementById('parts-select'), 'part-type');
		console.log('dismiss-part: ' + val);
		Session.set(Constants.renderView, Constants.parts);
	},
	'click #create-part': function () {
		var val = Utils.getRadioVal(document.getElementById('parts-select'), 'part-type');
		console.log('create-part: ' + val);
		Session.set(Constants.renderView, Constants.parts);
	}
});

Template.newPart.onDestroyed(function () {
});
