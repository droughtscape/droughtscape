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
	
	var convertEnglishToMeters = function convertEnglishToMeters (feet, inches) {
		// Convert feet to inches
		inches = Number(inches);
		inches += (Number(feet) * 12.0);
		return 0.0254 * inches;
	};
	
	var convertMetersToInches = function convertMetersToInches (meters) {
		meters = Number(meters);
		return meters / 0.0254;
	};
	
	var convertMetersToFeetInches = function convertMetersToFeetInches (meters) {
		var fi = {feet: 0, inches: convertMetersToInches(meters)};
		fi.feet = Math.floor(fi.inches/12);
		fi.inches = Math.round(fi.inches - (fi.feet * 12));
		return fi;
	};

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
	
	return {
		// Return true top left position of element
		getPosition: getPosition,
		convertEnglishToMeters: convertEnglishToMeters,
		convertMetersToInches: convertMetersToInches,
		convertMetersToFeetInches: convertMetersToFeetInches,
		getRadioVal: getRadioVal
	};
})();