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
var partMode = new ReactiveVar(PartType.plants);

Template.new_part.onCreated(function () {
});

Template.new_part.helpers({
	selected: function () {
		return partMode;
	},
	createItemTemplate: function () {
		var template = Template.create_other;
		switch (partMode.get()) {
		case PartType.plants:
			template = Template.create_plant;
			break;
		case PartType.groundcovers:
			template = Template.create_groundcover;
			break;
		case PartType.borders:
			template = Template.create_border;
			break;
		case PartType.pavers:
			template = Template.create_paver;
			break;
		case PartType.largerocks:
			template = Template.create_large_rock;
			break;
		case PartType.irrigation:
			template = Template.create_irrigation;
			break;
		case PartType.lighting:
			template = Template.create_lighting;
			break;
		case PartType.decorative:
			template = Template.create_decorative;
			break;
		}
		return template;
	}
});

// Expect this template event to be invoked with context=<string>
// Where <string> := "parts" | "new_part" | ...
// The event comes from a subtemplate part_type
Template.new_part.events({
	'click #cancel-part': function () {
		console.log('dismiss-part: ' + partMode.get());
		ViewStack.popState(true);
	},
	'click #create-part': function () {
		console.log('create-part: ' + partMode.get());
		ViewStack.popState(true);
	}
});

Template.new_part.onDestroyed(function () {
});

Template.new_part.onRendered(function () {
	$(document).ready(function () {
		$('select').material_select();
	})
});
