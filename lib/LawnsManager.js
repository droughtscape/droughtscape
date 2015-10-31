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
LawnsManager = (function () {

	var _allLawns = [];
	var _lawnShapes = [];
	var _lawnTemplates = [];
	var _emptyLawn = [];

	var _initLawnConstants = function _initLawnConstants () {
		console.log('_initLawnConstants: ENTRY');
		_lawnShapes = [
			new AbstractLawnShape('rectangle.png', 'rectangle', LawnShapeType.rectangle),
			new AbstractLawnShape('corner.png', 'corner', LawnShapeType.corner),
			new AbstractLawnShape('custom.png', 'custom', LawnShapeType.custom)
		];
		_lawnTemplates = [
			new AbstractLawnTemplate('custom.png', 'none', LawnTemplateType.custom),
			new AbstractLawnTemplate('template1.jpg', 'template1', LawnShapeType.template1),
			new AbstractLawnTemplate('template2.png', 'template2', LawnShapeType.template2),
			new AbstractLawnTemplate('template3.jpg', 'template3', LawnShapeType.template3)
		];
		_allLawns = [
			new AbstractLawn('http://lorempixel.com/580/250/nature/1', 
				'lawn_1', 
				LawnShapeType.rectangle, 
				LawnTemplateType.custom, 
				10, 
				4, 'LawnId-1'),
			new AbstractLawn('http://lorempixel.com/580/250/nature/2',
				'lawn_2',
				LawnShapeType.rectangle,
				LawnTemplateType.custom,
				10,
				4, 'LawnId-2'),
			new AbstractLawn('http://lorempixel.com/580/250/nature/3',
				'lawn_3',
				LawnShapeType.rectangle,
				LawnTemplateType.custom,
				10,
				4, 'LawnId-3'),
			new AbstractLawn('http://lorempixel.com/580/250/nature/4',
				'lawn_4',
				LawnShapeType.rectangle,
				LawnTemplateType.custom,
				10,
				4, 'LawnId-4'),
			new AbstractLawn('http://lorempixel.com/580/250/nature/5',
				'lawn_5',
				LawnShapeType.rectangle,
				LawnTemplateType.custom,
				10,
				4, 'LawnId-5')
		];
		
		_emptyLawn = [new AbstractLawnShape('nolawns.png', 'nullLawn', LawnShapeType.nullLawn)];
	};
	
	var _getLawnShapes = function _getLawnShapes () {
		return _lawnShapes;
	};
	
	var _getLawnTemplates = function _getLawnTemplates () {
		return _lawnTemplates;
	};

	var _getLawnsByMatch = function _getLawnsByMatch (lawnsList, matchFn) {
		let foundLawns = [];
		for (var i=0, len=lawnsList.length; i<len; ++i) {
			if (matchFn(lawnsList[i])) {
				foundLawns.push(lawnsList[i]);
			}
		}
		return foundLawns;
	};

	var _getAllLawnsByShape = function _getAllLawnsByShape (shapeType) {
		return _getLawnsByMatch(_allLawns, function (candidateLawn) {
			return candidateLawn.lawnShape === shapeType || shapeType === LawnShapeType.all;
		});
	};

	var _getLawnByItemId = function _getLawnByItemId (itemId) {
		let lawns = _getLawnsByMatch(_allLawns, function (candidateLawn) {
			return candidateLawn.itemId === itemId;
		});
		return (lawns.length === 1) ? lawns[0] : null;
	};

	var _getEmptyLawn = function _getEmptyLawn () {
		return _emptyLawn;
	};
	
	return {
		initLawnConstants: _initLawnConstants,
		getLawnShapes: _getLawnShapes,
		getLawnTemplates: _getLawnTemplates,
		getAllLawnsByShape: _getAllLawnsByShape,
		getLawnByItemId: _getLawnByItemId,
		getEmptyLawn: _getEmptyLawn
	};
})();
