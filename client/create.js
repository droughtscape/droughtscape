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
Session.setDefault('userUnitsOfMeasure', 'English');

var lawnData = {name: 'MyLawn', shapeName: 'rectangle', quickTemplate: 'none', width: 0, length: 0, slope: 0};
var lawnDataEnglish = {widthFeet: 0, widthInches: 0, lengthFeet: 0, lengthInches: 0, slopeInches: 0};
var lawnDataDisplay = {name: 'MyLawn', w1: 0, w2: 0, l1: 0, l2: 0, s: 0};
Session.setDefault('computedArea', 0);
Session.setDefault('currentLawn', 'MyLawn');
var currentCreateState = new ReactiveVar('shape_lawn');

Template.create.onCreated(function(){
	console.log('Template.create.onCreated');
	//NavConfig.pushRightBar('rightBar', 'parts');
	// Cannot set onbeforeunload here since when we transition to shape_lawn,
	// we call create.onDestroyed would immediately unload.  Best place so far
	// is in the home.onCreated, home.onDestroyed template since that contains the renderView
	//window.onbeforeunload = function () {
	//	return 'Your work will be lost';
	//};
	Session.set('computedArea', 0);
	console.log('history.state: ' + history.state);
	// On initial entry reset the state to shape_lawn
	if (Meteor.userId()) {
		Session.set('renderView', 'shape_lawn');
	}
	//currentCreateState.set('shape_lawn');
});

Template.create.onDestroyed(function () {
	//window.onbeforeunload = null;
});

Template.create.helpers({
	signInMessage: function () {
		return 'Sign in so we can track your design(s)';
	}/*,
	currentCreate: function () {
		// Use a reactive state to figure out where we are
		return currentCreateState.get();
	}*/
});

Template.create.events({
	'click #signin': function () {
		SignInUtils.pushRenderViewTarget('create');
		Session.set('renderView', 'signin');
	},
	'click #lawn-create': function () {
		lawnData.name = lawnDataDisplay.name;
	}
});

Template.lawn_info.helpers({
	lawnData: function () {
		return lawnData;
	},
	userName: function () {
		return SignInUtils.getUserName();
	}
});

Template.measure_lawn.helpers({
	unitsOfMeasure: function () {
		return (Session.get('userUnitsOfMeasure') === 'English') ? 'Feet and Inches' : 'Meters';
	},
	unitsOfMeasureAre: function (unitString) {
		return Session.get('userUnitsOfMeasure') === unitString;
	},
	lawnName: function () {
		return Session.get('currentLawn');
	},
	lawnData: function () {
		return lawnData;
	},
	lawnDataDisplay: function () {
		// Fill in appropriately
		if (Session.get('userUnitsOfMeasure') === 'English') {
			// feet, inches
			var fi = Utils.convertMetersToFeetInches(lawnData.width);
			lawnDataDisplay.w1 = fi.feet;
			lawnDataDisplay.w2 = fi.inches;
			fi = Utils.convertMetersToFeetInches(lawnData.length);
			lawnDataDisplay.l1 = fi.feet;
			lawnDataDisplay.l2 = fi.inches;
			lawnDataDisplay.s = Math.round(Utils.convertMetersToInches(lawnData.slope));
		}
		else {
			// meters
			lawnDataDisplay.w1 = lawnData.width;
			lawnDataDisplay.l1 = lawnData.length;
			lawnDataDisplay.s = lawnData.slope;
		}
		return lawnDataDisplay;
	},
	computedArea: function () {
		Session.set('computedArea', Number(lawnData.width) * Number(lawnData.length));
		var sqMeters = Session.get('computedArea');
		var sqInches = Utils.convertMetersToInches(sqMeters);
		var sqFeet = sqInches / 12.0;
		return (Session.get('userUnitsOfMeasure') === 'English') ? Math.round(sqFeet) + ' sq ft' : Math.round(sqMeters) + ' sq m';
	}
});

Template.measure_lawn.onRendered(function () {
	//$('#modal-name').openModal();
});

var _insertFirstItem = function _insertFirstItem (userEmail, lawnData) {
	var item = {user: userEmail, myLawns: []};
	item.myLawns.push(lawnData);
	DroughtscapeUsers.insert(item);
};

var _updateLawns = function _updateLawns (myLawns, lawn) {
	var lawnUpdated = false;
	for (var i= 0, len= myLawns.length; i<len; ++i) {
		// if lawn is already present, just update any values
		if (myLawns[i].name === lawn.name) {
			myLawns[i] = lawn;
			lawnUpdated = true;
		}
	}
	if (!lawnUpdated) {
		// Not found, just push it
		myLawns.push(lawn);
	}
};

Template.measure_lawn.events({
	'click #measure-lawn-cancel': function () {
		Session.set('renderView', 'splash');
	},
	'click #measure-lawn-back': function () {
		Session.set('renderView', 'shape_lawn');
		//currentCreateState.set('measure_lawn');
	},
	'click #name-lawn': function () {
		lawnData.name = document.getElementById('lawn_name').value;
		Session.set('currentLawn', lawnData.name);
	},
	'click #open-lawn': function () {
		Session.set('renderView', 'favorites');
	},
	'click .unit-select': function (e) {
		var clickedButton = e.currentTarget;
		Session.set('userUnitsOfMeasure', clickedButton.id);
	},
	'click #lawn-measure': function (e) {
		console.log('lawn-measure clicked');
		if (Session.get('userUnitsOfMeasure') === 'English') {
			lawnData.width = Utils.convertEnglishToMeters(document.getElementById('lawn_width_feet').value,
				document.getElementById('lawn_width_inches').value);
			lawnData.length = Utils.convertEnglishToMeters(document.getElementById('lawn_length_feet').value,
				document.getElementById('lawn_length_inches').value);
			lawnData.slope = Utils.convertEnglishToMeters(0, document.getElementById('lawn_slope_inches').value);
		}
		else {
			lawnData.width = document.getElementById('lawn_width_meters').value;
			lawnData.length = document.getElementById('lawn_length_meters').value;
			lawnData.slope = document.getElementById('lawn_slope_meters').value;
		}
		Session.set('computedArea', Number(lawnData.width) * Number(lawnData.length));
		console.log('lawnData: ' + lawnData);

		var user = Meteor.user();
		var userEmail = user.emails[0].address;
		// See if we already have a profile, if so, look for myLawns, if not create one
		var dsUsers = DroughtscapeUsers.find({});
		var dsUsersArray = dsUsers.fetch();
		if (dsUsersArray.length > 0) {
			var updated = null;
			for (var i= 0, len= dsUsersArray.length; i < len; ++i) {
				if (dsUsersArray[i].user === userEmail) {
					// found us, update
					if (!dsUsersArray[i].myLawns) {
						dsUsersArray[i].myLawns = [];
					}
					_updateLawns(dsUsersArray[i].myLawns, lawnData);
					updated = dsUsersArray[i];
					break;
				}
			}
			if (!updated) {
				// user not found, add
				_insertFirstItem(userEmail, lawnData);
			}
			else {
				DroughtscapeUsers.update(updated._id, updated);
			}
		}
		else {
			// No users so add us here
			_insertFirstItem(userEmail, lawnData);
		}
		Session.set('renderView', 'build_lawn');
		//currentCreateState.set('build_lawn');
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
			MBus.publish('carousel', 'clear', {carousel: shapeLawnCarouselIdElt});
			MBus.publish('carousel', 'add', {carousel: shapeLawnCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'rectangle', img:'rectangle.png'}]});
			MBus.publish('carousel', 'add', {carousel: shapeLawnCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'corner', img:'corner.png'}]});
			MBus.publish('carousel', 'add', {carousel: shapeLawnCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'custom', img:'custom.png'}]});
			break;
		}
	}
	else {
		console.log('handleLawnShapeMessages:ERROR, invalid message');
	}
};

Template.shape_lawn.onCreated(function () {
	lawnData.shapeName='rectangle';
	unsubscribe = MBus.subscribe('carousel', handleLawnShapeMessages);
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
	lawnDataDisplay: function () {
		return lawnDataDisplay;
	}
});

Template.shape_lawn.events({
	'click .carouselItem': function (e) {
		console.log('Template.shape_lawn.events - item: ' + e.target.id);
		lawnData.shapeName = e.target.id;
	},
	'click #shape-lawn-cancel': function (e) {
		console.log('Template.shape_lawn.events cancel: ' + e.target.id);
		Session.set('renderView', 'splash');
	},
	'click #shape-lawn-accept': function (e) {
		console.log('Template.shape_lawn.events accept: ' + e.target.id);
		var inputElt = document.getElementById('lawn_name');
		if (inputElt) {
			console.log('Template.shape_lawn.events lawnName: ' + inputElt.value);
			lawnData.name = inputElt.value;
			Session.set('currentLawn', lawnData.name);
			Session.set('renderView', 'measure_lawn');
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
			MBus.publish('carousel', 'clear', {carousel: buildLawnTemplateCarouselIdElt});
			// Here we will use a filter based on standard shapes to select a set of templates
			// What about custom shape?  Nothing to filter => no templates
			MBus.publish('carousel', 'add', {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'none', img:'rectangle.png'}]});
			MBus.publish('carousel', 'add', {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'template1', img:'corner.png'}]});
			MBus.publish('carousel', 'add', {carousel: buildLawnTemplateCarouselIdElt, imgWidth: '300px', imgHeight: '200px', imgArray: [{id: 'template2', img:'custom.png'}]});
			break;
		}
	}
	else {
		console.log('handleBuildLawnTemplateMessages:ERROR, invalid message');
	}
};

Template.build_lawn.onCreated(function () {
	buildLawnUnsubscribe = MBus.subscribe('carousel', handleBuildLawnTemplateMessages);
});

Template.build_lawn.onDestroyed(function() {
	buildLawnUnsubscribe.remove();
});

Template.build_lawn.helpers({
	carouselId: function () {
		return buildLawnTemplateCarouselId;
	},
	lawnName: function () {
		return Session.get('currentLawn');
	},
	lawnData: function () {
		return lawnData;
	},
	lawnTemplateMode: function () {
		return {type: 'buildLawnTemplates', subType: null};
	}
});

Template.build_lawn.events ({
	'click .carouselItem': function (e) {
		lawnData.quickTemplate = e.target.id;
	},
	'click #build-lawn-cancel': function () {
		Session.set('renderView', 'splash');
	},
	'click #build-lawn-back': function () {
		Session.set('renderView', 'measure_lawn');
		//currentCreateState.set('measure_lawn');
	},
	'click #build-lawn-accept': function () {
		Session.set('renderView', 'layout_lawn');
		//currentCreateState.set('layout_lawn');
	}
});

var pixiRenderer = null;

Template.layout_lawn.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'layout_lawn');
	if (pixiRenderer === null) {
		pixiRenderer = new PIXI.autoDetectRenderer(800, 600);
	}
	console.log('layout_lawn.onCreated, pixiRenderer: ' + pixiRenderer);
});

Template.layout_lawn.onDestroyed(function () {
	NavConfig.popRightBar();
});

var threeScene = null;

Template.render_lawn.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'render_lawn');
	if (threeScene === null) {
		threeScene = new THREE.Scene();
	}
	console.log('render_lawn.onCreated, threeScene: ' + threeScene);
});

Template.render_lawn.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.select_parts.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'select_parts');
});

Template.select_parts.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.finish_lawn.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'finish_lawn');
});

Template.finish_lawn.onDestroyed(function () {
	NavConfig.popRightBar();
});

Template.finish_lawn.events({
	'click #finish-lawn-cancel': function () {
		Session.set('renderView', 'splash');
	},
	'click #finish-lawn-back': function () {
		Session.set('renderView', 'layout_lawn');
	},
	'click #finish-lawn-accept': function () {
		Session.set('renderView', 'create');
	}
});
