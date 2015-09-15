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
// Common create content betwee various templates involved in
// creating a lawn.
// Currently the following templates:
// create
// lawn_info
// shape_lawn
// measure_lawn
// build_lawn
// layout_lawn
// render_lawn
// finish_lawn
CreateLawnData = (function () {
	var LawnShape = function (shapeType, edgeArray) {
		this.shapeType = shapeType;
		this.edgeArray = edgeArray;
		console.log('LawnShape: ' + shapeType);
	};
	LawnShape.prototype.printMe = function () {
		console.log('my shape: ' + this.shapeType);
	};

	var _currentLawn = null;
	var lawnData = {name: 'MyLawn', shapeName: 'rectangle', quickTemplate: 'none', width: 0, length: 0, slope: 0};
	var getCurrentLawn = function getCurrentLawn () {
		return _currentLawn;
	};
	var setCurrentLawn = function setCurrentLawn () {
		_currentLawn = lawnData;
	};
	var clearCurrentLawn = function clearCurrentLawn () {
		_currentLawn = null;
	};
	return {
		lawnData: lawnData,
		getCurrentLawn: getCurrentLawn,
		setCurrentLawn: setCurrentLawn,
		clearCurrentLawn: clearCurrentLawn,
		createRectLawnShape: function (width, length, slope) { return new LawnShape('rectangle', [{width: width, length: length, slope: slope}])},
		createLawnShape: function (shapeType, edgeArray) { return new LawnShape(shapeType, edgeArray)}
	}
})();