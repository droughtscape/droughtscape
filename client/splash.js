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
var timer;
/**
 * firstSlide defaults to true, one time flag per view activation, ensures the 
 * initial splash is immediately visible.
 * @type {boolean}
 */
var firstSlide = true;

Template.splash.onCreated(function () {
	// Load up the splashLawns
	let splashLawns = SplashManager.getSplashLawns();
	if (splashLawns) {
		let splashIdx = 0;
		Meteor.defer(function () {
			// This interval will switch images every 5 seconds
			timer = setInterval(function () {
				if (splashLawns.length > 1) {
					SplashManager.bringToFront(splashLawns[splashIdx].id);
					splashIdx++;
					if (splashIdx == splashLawns.length) {
						splashIdx = 0;
					}
				}
			}, 5000);
		})
	}
});

Template.splash.onDestroyed(function () {
	// When leaving the view, if interval active, clear it, reset firstSlide
	if (timer) {
		clearInterval(timer);
		firstSlide = true;
	}
});

Template.splash.helpers({
	opaque: function () {
		if (firstSlide) {
			firstSlide = false;
			return 'opaque';
		}
		else {
			return '';
		}
	},
	splashLawns: function () {
		return SplashManager.getSplashLawns();
	}
});

