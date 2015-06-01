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
WatersaverTips = new Mongo.Collection('watersavertips');
var defaultWatersaverTips = [
	"When you run the hot water tap, save the water that isn't hot yet to use for plants or pets!",
	"Watering the average lawn takes about 800 gallons of water each time you do it." + "<br>" +
	"One year = 150,000 gallons or around $900.00"
];
Parts = new Mongo.Collection('parts');

if (Meteor.isServer) {
	var foo = WatersaverTips.find({}).count();
	if (foo === null || foo === 0) {
		for (var i = 0, len = defaultWatersaverTips.length; i<len; i++) {
			WatersaverTips.insert({tip: defaultWatersaverTips[i], createdAt: new Date(), createdBy: 'droughtscape'});
		}
	}
	Meteor.publish("all-watersavertips", function () {
		return WatersaverTips.find(); // everything
	});
	Meteor.publish("all-parts", function () {
		return Parts.find();
	});
}

if (Meteor.isClient) {
	WaterSaverTipsSub = Meteor.subscribe("watersavertips");
	PartsSub = Meteor.subscribe("parts");
	Tips = WatersaverTips.find().fetch();
	console.log('ready: ' + WaterSaverTipsSub.ready() + ', tips: ' + Tips.length);
}



