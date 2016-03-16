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

// Units of measure global setting to work across any create submenus.
// Note, within the system, we will translate to metric and do all calculations in metric and
// convert back out to the current setting.  Valid settings: English, Metric
Session.setDefault(Constants.userUnitsOfMeasure, Constants.English);

Session.setDefault(Constants.computedArea, 0);

Template.create.onCreated(function(){
	console.log('Template.create.onCreated');
	// Cannot set onbeforeunload here since when we transition to shape_lawn,
	// we call create.onDestroyed would immediately unload.  Best place so far
	// is in the home.onCreated, home.onDestroyed template since that contains the renderView
	//window.onbeforeunload = function () {
	//	return 'Your work will be lost';
	//};
	LayoutManager.setCurrentAbstractPart(null);
	Session.set(Constants.computedArea, 0);
	console.log('history.state: ' + history.state);
	// On initial entry reset the state to shape_lawn
	if (Meteor.userId()) {
		ViewStack.pushTarget(ViewTargetType.createShapeLawn);
	}
});

Template.create.onDestroyed(function () {
	//window.onbeforeunload = null;
	console.log('Template.create.onDestroyed');
});

Template.create.helpers({
	signInMessage: function () {
		return 'Sign in so we can track your design(s)';
	}
});

Template.create.events({
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget(ViewTargetType.create);
		ViewStack.pushTarget(ViewTargetType.signIn);
	}
});

Template.lawn_info.helpers({
	lawnData: function () {
		return CreateLawnData.lawnData;
	},
	createLawnMode: function () {
		return CreateLawnData.getCurrentLawn() != null;
	}
});

var unsubscribe = null;
var shapeLawnCarouselId = 'shape-lawn-carousel';
var shapeLawnCarouselIdElt = '#' + shapeLawnCarouselId;

var handleLawnShapeMessages = function handleLawnShapeMessages (message) {
	if (MBus.validateMessage(message)) {
		MBus.publish(Constants.mbus_carousel_clear, new Message.Clear(shapeLawnCarouselIdElt));
		let shapes = LawnsManager.getLawnShapes();
		MBus.publish(Constants.mbus_carousel_add, new Message.Add(shapeLawnCarouselIdElt, '300px', '200px', shapes));
	}
	else {
		console.log('handleLawnShapeMessages:ERROR, invalid message');
	}
};

Template.shape_lawn.onCreated(function () {
	CreateLawnData.createLawnShapeTemplate('rectangle');
	unsubscribe = MBus.subscribe(Constants.mbus_carousel_rendered, handleLawnShapeMessages);
});

Template.shape_lawn.onRendered(function () {
	$(".dropdown-button").dropdown({hover: true});
});

Template.shape_lawn.onDestroyed(function () {
	unsubscribe.remove();
});

Template.shape_lawn.helpers({
	carouselId: function () {
		return shapeLawnCarouselId;
	},
	lawnMode: function () {
		return {type: "lawnShapes", subType: null};
	},
	lawnData: function () {
		return CreateLawnData.lawnData;
	}
});

Template.shape_lawn.events({
	'click .carouselItem': function (e) {
		console.log('Template.shape_lawn.events - item: ' + e.target.id);
		CreateLawnData.createLawnShapeTemplate(e.target.id);
	},
	'click #shape-lawn-cancel': function (e) {
		console.log('Template.shape_lawn.events cancel: ' + e.target.id);
		CreateLawnData.clearCurrentLawn();
		ViewStack.pushTarget(ViewTargetType.home);
	},
	'click #shape-lawn-accept': function (e) {
		console.log('Template.shape_lawn.events accept: ' + e.target.id);
		var inputElt = document.getElementById('lawn_name');
		if (inputElt) {
			console.log('Template.shape_lawn.events lawnName: ' + inputElt.value);
			CreateLawnData.lawnData.name = inputElt.value;
			CreateLawnData.setCurrentLawn();
			ViewStack.pushTarget(ViewTargetType.createMeasureLawn);
		}
	}
});

// build_lawn stuff
var buildLawnUnsubscribe;
var buildLawnTemplateCarouselId = 'build-lawn-template-carousel';
var buildLawnTemplateCarouselIdElt = '#' + buildLawnTemplateCarouselId;

var handleBuildLawnTemplateMessages = function handleBuildLawnTemplateMessages (message) {
	if (MBus.validateMessage(message)) {
		let templates = LawnsManager.getLawnTemplates();
		console.log('handleBuildLawnTemplateMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
		MBus.publish(Constants.mbus_carousel_clear, new Message.Clear(buildLawnTemplateCarouselIdElt));
		// Here we will use a filter based on standard shapes to select a set of templates
		// What about custom shape?  Nothing to filter => no templates
		MBus.publish(Constants.mbus_carousel_add, new Message.Add(buildLawnTemplateCarouselIdElt, '300px', '200px', templates));
	}
	else {
		console.log('handleBuildLawnTemplateMessages:ERROR, invalid message');
	}
};

Template.build_lawn.onCreated(function () {
	buildLawnUnsubscribe = MBus.subscribe(Constants.mbus_carousel_rendered, handleBuildLawnTemplateMessages);
});

Template.build_lawn.onDestroyed(function() {
	buildLawnUnsubscribe.remove();
});

Template.build_lawn.helpers({
	carouselId: function () {
		return buildLawnTemplateCarouselId;
	},
	lawnData: function () {
		return CreateLawnData.lawnData;
	},
	lawnTemplateMode: function () {
		return {type: 'buildLawnTemplates', subType: null};
	}
});

Template.build_lawn.events ({
	'click .carouselItem': function (e) {
		CreateLawnData.lawnData.quickTemplate = e.target.id;
	},
	'click #build-lawn-cancel': function () {
		CreateLawnData.clearCurrentLawn();
		ViewStack.clearState();
		ViewStack.pushTarget(ViewTargetType.home);
	},
	'click #build-lawn-back': function () {
		ViewStack.popState(true);
	},
	'click #build-lawn-accept': function () {
		ViewStack.pushTarget(ViewTargetType.createLayoutLawn);
		CreateLawnData.setCurrentLawn();
	}
});

Template.finish_lawn.onCreated(function () {
});

Template.finish_lawn.onDestroyed(function () {
});

Template.finish_lawn.events({
	'click #finish-lawn-cancel': function () {
		ViewStack.pushTarget(ViewTargetType.home);
		CreateLawnData.clearCurrentLawn();
	},
	'click #finish-lawn-back': function () {
		ViewStack.popState(true);
	},
	'click #finish-lawn-accept': function () {
		ViewStack.clearState();
		ViewStack.pushTarget(ViewTargetType.create);
		CreateLawnData.clearCurrentLawn();
	}
});
