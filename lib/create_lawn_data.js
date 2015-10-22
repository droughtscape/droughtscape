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
// Common create content between various templates involved in
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
	/**
	 * @namespace CreateLawnData
	 * LawnShape object constructor
	 * @param {string} shapeType name of shape
	 * @param {object} dims contains width, length, slope(overall) of shape
	 * @param {array} edgeArray array of edges or optimized values depending on the shapeType
 	 */
	var LawnShape = function (shapeType, dims, edgeArray) {
		// Internal units are metric meters
		this.shapeType = shapeType;
		this.dims = dims;
		this.edgeArray = edgeArray;
		console.log('LawnShape: ' + shapeType);
	};
	/**
	 * @namespace CreateLawnData
	 * prototype.printMe function
	 * debug info to console on the LawnShape object
	 */
	LawnShape.prototype.printMe = function () {
		console.log('my shape: ' + this.shapeType + ', dims: [' + 
			this.dims.width + ', ' + this.dims.length + ', ' + this.dims.slope + ']');
		switch (this.shapeType) {
		case 'rectangle':
			break;
		}
	};

	// currently active lawn
	var _currentLawn = null;
	// shape field in lawnData should be filled with new LawnShape()
	var lawnData = {
		name: 'MyLawn',
		shape: null,
		quickTemplate: 'none'
	};
	/**
	 * @namespace CreateLawnData
	 * getCurrentLawn function
	 * gets the _currentLawn
	 * @return {object} _currentLawn value
	 */
	var getCurrentLawn = function getCurrentLawn () {
		return _currentLawn;
	};
	/**
	 * @namespace CreateLawnData
	 * setCurrentLawn function
	 * sets the _currentLawn to the lawnData working value
	 */
	var setCurrentLawn = function setCurrentLawn () {
		_currentLawn = lawnData;
	};
	/**
	 * @namespace CreateLawnData
	 * clearCurrentLawn function
	 * clears the _currentLawn
	 */
	var clearCurrentLawn = function clearCurrentLawn () {
		_currentLawn = null;
	};
	/**
	 * @namespace CreateLawnData
	 * _createRectLawnShape function
	 * Helper to create common lawn shape
	 * @param {number} width metric width of lawn from one side of house to the other
	 * @param {number} length metric distance from curb/sidewalk to house
	 * @param {number} slope metric rise/fall from curb/sidewalk to house, positive or negative
	 * @return {object} new LawnShape
	 */
	var _createRectLawnShape = function _createRectLawnShape (width, length, slope) {
		return new LawnShape('rectangle', {width: width, length: length, slope: slope}, []);
	};
	/**
	 * @namespace CreateLawnData
	 * _createLawnShapeTemplate function
	 * Creates default lawn shape objects
	 * @param {string} shapeName
	 * @return {object} new LawnShape without values
	 */
	var _createLawnShapeTemplate = function _createLawnShapeTemplate (shapeName) {
		switch (shapeName) {
		case 'rectangle':
			lawnData.shape = _createRectLawnShape(0, 0, 0);
			break;
		case 'corner':
		case 'custom':
			lawnData.shape = {shapeType: shapeName, edges: []};
			break;
		default:
			console.log('WARNING: Unsupported shape: ' + shapeName);
			break;
		}
		return lawnData.shape;
	};
	// Current part
	var _currentLayoutPart = null;
	
	var _createLayoutPart = function _createLayoutPart (abstractPart) {
		_currentLayoutPart = abstractPart;
	};
	
	var _setCurrentLayoutPart = function _setCurrentLayoutPart (abstractPart) {
		_currentLayoutPart = abstractPart;
	};
	
	var _getCurrentLayoutPart = function _getCurrentLayoutPart () {
		return _currentLayoutPart;
	};
	return {
		lawnData: lawnData,
		getCurrentLawn: getCurrentLawn,
		setCurrentLawn: setCurrentLawn,
		clearCurrentLawn: clearCurrentLawn,
		createLawnShapeTemplate: _createLawnShapeTemplate,
		createRectLawnShape: _createRectLawnShape,
		createLawnShape: function (shapeType, edgeArray) { return new LawnShape(shapeType, edgeArray)},
		setCurrentLayoutPart: _setCurrentLayoutPart,
		getCurrentLayoutPart: _getCurrentLayoutPart
	}
})();