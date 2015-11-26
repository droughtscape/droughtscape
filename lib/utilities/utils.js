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
Utils = (function () {
	/**
	 * @namespace Utils
	 * getPosition function
	 * @param {object} element the item we want to compute the top-left position for
	 * @return {object} top-left position {x, y}
	 */
	var getPosition = function getPosition(element) {
		var xPosition = 0;
		var yPosition = 0;

		while (element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return {x: xPosition, y: yPosition};
	};

	/**
	 * @namespace Utils
	 * convertEnglishToMeters function to convert English units to metric
	 * @param {number} feet input English feet component
	 * @param {number} inches input English inches component
	 * @return {number} output conversion to meters
	 */
	var convertEnglishToMeters = function convertEnglishToMeters (feet, inches) {
		// Convert feet to inches
		inches = Number(inches);
		inches += (Number(feet) * 12.0);
		return 0.0254 * inches;
	};

	/**
	 * @namespace Utils
	 * convertMetersToInches function to convert meters to in
	 * @param {number} meters input metric measurement
	 * @return {object} output conversion to inches
	 */
	var convertMetersToInches = function convertMetersToInches (meters) {
		meters = Number(meters);
		return meters / 0.0254;
	};

	/**
	 * @namespace Utils
	 * convertMetersToFeetInches function to convert meters to ft/in
	 * @param {number} meters input metric measurement
	 * @return {object} output conversion to feet, inches
	 */
	var convertMetersToFeetInches = function convertMetersToFeetInches (meters) {
		var fi = {feet: 0, inches: convertMetersToInches(meters)};
		fi.feet = Math.floor(fi.inches/12);
		fi.inches = Math.round(fi.inches - (fi.feet * 12));
		return fi;
	};

	/**
	 * @namespace Utils
	 * getRadioVal function to extract the value associated with the currently checked
	 * radio button in a given form
	 * @param {object} form container of the radio buttons
	 * @param {string} name of the radio button group within the form
	 * @return {object} value associated with the checked radio button or undefined if nothing checked
	 */
	var getRadioVal = function getRadioVal(form, name) {
		var val;
		// get list of radio buttons with specified name
		var radios = form.elements[name];

		// loop through list of radio buttons
		for (var i=0, len=radios.length; i<len; i++) {
			if ( radios[i].checked ) { // radio checked?
				val = radios[i].value; // if so, hold its value in val
				break; // and break out of for loop
			}
		}
		return val; // return value of checked radio or undefined if none checked
	};

	/**
	 * @namespace Utils
	 * createDeferredFunction function factory to create a Meteor deferred wrapper around fn
	 * using partial function application
	 * Specific usage is when you need the window system to settle before running fn.
	 * For example, resize event handlers need to be done within the Meteor.defer() wrapper
	 * Optional parameters are passable as well
	 * @param {object} fn function to wrap
	 * @return {object} function object that wraps Meteor.defer around fn
	 */
	var createDeferredFunction = function createDeferredFunction (fn) {
		var slice = Array.prototype.slice;
		// Convert arguments object to an array, removing the first argument.
		var args = slice.call(arguments, 1);
		return function () {
			// Wrap with Meteor.defer
			Meteor.defer(function () {
				// Invoke the originally-specified function, passing in all originally-
				// specified arguments, followed by any just-specified arguments.
				return fn.apply(this, args.concat(slice.call(arguments, 0)));
			});
		}
	};

	/**
	 * @namespace Utils
	 * computeLayoutFrame function to determine the best fit from real coordinates
	 * into pixel coordinates
	 * @param {number} widthMeters real width in meters
	 * @param {number} lengthMeters real length in meters
	 * @param {number} maxPixelWidth display width available in pixels
	 * @param {number} maxPixelLength display length available in pixels
	 * @return {object} best fit in pixels
	 */
	var computeLayoutFrame = function computeLayoutFrame (widthMeters, lengthMeters, maxPixelWidth, maxPixelLength) {
		// First try to use maxPixelWidth and see if maxPixelLength
		var bestFit = {widthPixels: 0, lengthPixels: 0};
		var tryPixelLength = (lengthMeters * maxPixelWidth) / widthMeters;
		var tryPixelWidth = (widthMeters * maxPixelLength) / lengthMeters;
		if (tryPixelLength > maxPixelLength) {
			// use tryPixelWidth since tryPixelLength won't fit
			bestFit.widthPixels = tryPixelWidth;
			bestFit.lengthPixels = maxPixelLength;
		}
		else if (tryPixelWidth > maxPixelWidth) {
			// use tryPixelLength since tryPixelWidth won't fit
			bestFit.widthPixels = maxPixelWidth;
			bestFit.lengthPixels = tryPixelLength;
		}
		else {
			// Both fit, now find the best fit
			if ((tryPixelLength / maxPixelLength) > (tryPixelWidth / maxPixelWidth)) {
				bestFit.widthPixels = tryPixelWidth;
				bestFit.lengthPixels = maxPixelLength;
			}
			else {
				bestFit.widthPixels = maxPixelWidth;
				bestFit.lengthPixels = tryPixelLength;
			}
		}
		return bestFit;
	};
    /**
     * @namespace Utils
     * Utility to determine when a pt is in box.  Used in selection
     * @param {object} pt - x, y coordinates in pixels
     * @param {object} box - x, y, w, h in pixels
     * @returns {boolean}
     * @private
     */
    var pointInBox = function pointInBox (pt, box) {
		var outside = (pt.x < box.x ||
		pt.y < box.y ||
		pt.x > (box.x + box.w) ||
		pt.y > (box.y + box.h));
		return !outside;
	};
    /**
     * @namespace Utils
     * Utility to determine when a box intersects another box
     * @param {object} box1 - x, y, w, h in pixels
     * @param {object} box2 - x, y, w, h in pixels
     * @returns {boolean}
     * @private
     */
    var boxIntersectBox = function boxIntersectBox (box1, box2) {
        if ((box1.x + box1.w) < box2.x) {
            // box1 left of box2
            return false;
        }
        else if ((box1.y + box1.h) < box2.y) {
            // box1 above box2
            return false;
        }
        else if ((box2.x + box2.w) < box1.x) {
            // box2 left of box1
            return false;
        }
        else if ((box2.y + box2.h) < box1.y) {
            // box2 above box1
            return false;
        }
        return true;
    };
	var boxUnionBox = function boxUnionBox (box1, box2) {
		if (!box1 && box2) {
			return box2;
		}
		if (box1 && !box2) {
			return box1;
		}
		let ulx = Math.min(box1.x, box2.x);
		let uly = Math.min(box1.y, box2.y);
		let lrx = Math.max((box1.x + box1.w), (box2.x + box2.w));
		let lry = Math.max((box1.y + box1.h), (box2.y + box2.h));
		return {x: ulx, y: uly, w: lrx - ulx, h: lry - uly};
	};

	return {
		// Return true top left position of element
		getPosition: getPosition,
		convertEnglishToMeters: convertEnglishToMeters,
		convertMetersToInches: convertMetersToInches,
		convertMetersToFeetInches: convertMetersToFeetInches,
		getRadioVal: getRadioVal,
		createDeferredFunction: createDeferredFunction,
		computeLayoutFrame: computeLayoutFrame,
		pointInBox: pointInBox,
        boxIntersectBox: boxIntersectBox,
		boxUnionBox: boxUnionBox
	};
})();