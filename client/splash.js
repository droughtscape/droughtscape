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
var carouselId = 'splash-item-carousel';
var carouselIdElt = '#' + carouselId;
Session.setDefault('splashItem', '//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg');
Session.setDefault('splashId', 'splash-1');
var timer;

Template.splash.onCreated(function () {
	// Load up the carousel
	let splashLawns = SplashManager.getSplashLawns();
	if (splashLawns) {
		let splashIdx = 0;
		let testSlick = false;
		Meteor.defer(function () {
			if (testSlick) {
				MBus.publish(Constants.mbus_carousel_add, new Message.Add(carouselIdElt, '100%', '100%', splashLawns));
				
			}
			else {
				timer = setInterval(function () {
					if (splashLawns.length > 1) {
						Session.set('splashItem', splashLawns[splashIdx].url);
						Session.set('splashId', splashLawns[splashIdx].id);
						splashIdx++;
						if (splashIdx == splashLawns.length) {
							splashIdx = 0;
						}
					}
				}, 5000);
			}
		})
	}
});

Template.splash.onDestroyed(function () {
});

Template.splash.helpers({
	carouselId: function () {
		return carouselId;
	},
	splashId: function () {
		return Session.get('splashId');
	},
	splashItem: function () {
		return Session.get('splashItem');
	},
	splashMode: function () {
		return {topic: Constants.mbus_splashCarousel, html: carouselIdElt, type: 'splashItem', subType: null}
	},
	items: function () {
		return [{pic: 'custom.png', email: 'junk@gmail.com', fullname: 'joe schmo'}];
	}
});

Template.splash.animations({
	".item": {
		container: ".container-items", // container of the ".item" elements
		in: "animated fast fadeIn", // class applied to inserted elements (animations courtesy of animate.css)
		out: "animated fast fadeOut", // class applied to removed elements
		inCallback: function () {
			var title = $(this).find(".title").text();
			console.log("Inserted " + title + " to the DOM");

		},
		outCallback: function () {
			var title = $(this).find(".title").text();
			console.log("Removed " + title + " from the DOM");
		},
		animateInitial: true, // animate the elements already rendered
		animateInitialStep: 200, // Step between animations for each initial item
		animateInitialDelay: 500 // Delay before the initial items animate
	}
});
