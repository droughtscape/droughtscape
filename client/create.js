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
	Session.set(Constants.computedArea, 0);
	console.log('history.state: ' + history.state);
	// On initial entry reset the state to shape_lawn
	if (Meteor.userId()) {
		Session.set(Constants.renderView, Constants.shape_lawn);
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
		SignInUtils.pushRenderViewTarget(Constants.create);
		Session.set(Constants.renderView, Constants.signin);
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
		switch (message.type) {
		case 'rendered':
			console.log('handleLawnShapeMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: shapeLawnCarouselIdElt});
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: shapeLawnCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'rectangle', img:'rectangle.png'}]});
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: shapeLawnCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'corner', img:'corner.png'}]});
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: shapeLawnCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'custom', img:'custom.png'}]});
			break;
		}
	}
	else {
		console.log('handleLawnShapeMessages:ERROR, invalid message');
	}
};

Template.shape_lawn.onCreated(function () {
	CreateLawnData.createLawnShapeTemplate('rectangle');
	// remove right bar from this frame
	NavConfig.pushNavBar('create');
	NavConfig.pushEmptyRightBar();
	unsubscribe = MBus.subscribe(Constants.mbus_carousel, handleLawnShapeMessages);
});

Template.shape_lawn.onRendered(function () {
	$(".dropdown-button").dropdown();
});

Template.shape_lawn.onDestroyed(function () {
	NavConfig.popNavBar();
	NavConfig.popRightBar();
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
		Session.set(Constants.renderView, Constants.splash);
	},
	'click #shape-lawn-accept': function (e) {
		console.log('Template.shape_lawn.events accept: ' + e.target.id);
		var inputElt = document.getElementById('lawn_name');
		if (inputElt) {
			console.log('Template.shape_lawn.events lawnName: ' + inputElt.value);
			CreateLawnData.lawnData.name = inputElt.value;
			Session.set(Constants.renderView, Constants.measure_lawn);
			//currentCreateState.set('measure_lawn');
		}
	}
});

// build_lawn stuff
var buildLawnUnsubscribe;
var buildLawnTemplateCarouselId = 'build-lawn-template-carousel';
var buildLawnTemplateCarouselIdElt = '#' + buildLawnTemplateCarouselId;

var handleBuildLawnTemplateMessages = function handleBuildLawnTemplateMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.type) {
		case 'rendered':
			console.log('handleBuildLawnTemplateMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
			MBus.publish(Constants.mbus_carousel, Constants.mbus_clear, {carousel: buildLawnTemplateCarouselIdElt});
			// Here we will use a filter based on standard shapes to select a set of templates
			// What about custom shape?  Nothing to filter => no templates
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'none', img:'custom.png'}]});
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'template1', img:'template1.jpg'}]});
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'template2', img:'template2.png'}]});
			MBus.publish(Constants.mbus_carousel, Constants.mbus_add, {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'template3', img:'template3.jpg'}]});
			break;
		}
	}
	else {
		console.log('handleBuildLawnTemplateMessages:ERROR, invalid message');
	}
};

Template.build_lawn.onCreated(function () {
	NavConfig.pushNavBar('create');
	NavConfig.pushEmptyRightBar();
	buildLawnUnsubscribe = MBus.subscribe(Constants.mbus_carousel, handleBuildLawnTemplateMessages);
});

Template.build_lawn.onDestroyed(function() {
	NavConfig.popNavBar();
	NavConfig.popRightBar();
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
		Session.set(Constants.renderView, Constants.splash);
	},
	'click #build-lawn-back': function () {
		Session.set(Constants.renderView, Constants.measure_lawn);
		//currentCreateState.set('measure_lawn');
	},
	'click #build-lawn-accept': function () {
		Session.set(Constants.renderView, Constants.layout_lawn);
		CreateLawnData.setCurrentLawn();
		//Session.set('currentLawn', CreateLawnData.lawnData);
		//currentCreateState.set('layout_lawn');
	}
});

Template.finish_lawn.onCreated(function () {
	NavConfig.pushRightBar(Constants.rightBar, Constants.finish_lawn);
});

Template.finish_lawn.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.finish_lawn.events({
	'click #finish-lawn-cancel': function () {
		Session.set(Constants.renderView, Constants.splash);
		CreateLawnData.clearCurrentLawn();
	},
	'click #finish-lawn-back': function () {
		Session.set(Constants.renderView, Constants.layout_lawn);
	},
	'click #finish-lawn-accept': function () {
		Session.set(Constants.renderView, Constants.create);
		CreateLawnData.clearCurrentLawn();
	}
});
