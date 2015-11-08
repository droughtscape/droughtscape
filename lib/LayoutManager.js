/**
 * Created by kishigo on 11/6/15.
 * Copyright (c) 2015 DirecTV LLC, All Rights Reserved
 *
 * This software and its documentation may not be used, copied, modified or distributed, in whole or in part, without express
 * written permission of DirecTV LLC.
 *
 * The source code is the confidential and proprietary information of DirecTV, LLC. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement
 * you entered into with DirecTV LLC.
 *
 */

/**
 * Layout Instance of abstractPart
 * @type {Function}
 * @parameter {object} abstractPart - underlying abstractPart
 * @parameter {number} x - center x in real world units (meters)
 * @parameter {number} y - center y in real world units (meters)
 * @parameter {number} rotation - clockwise in degrees
 */
LayoutPart = (function (abstractPart, x, y, rotation) {
	var _abstractPart = abstractPart;
	var _x = x || 0;
	var _y = y || 0;
	var _rotation = rotation || 0;
	// These are real world units (meters)
	var _width = _abstractPart.width;
	var _height = _abstractPart.height;
	var _imageUrl = _abstractPart.url;
	// Translate to Upper Left corner
	_x = _x - (_width / 2);
	_y = _y - (_height / 2);

	return {
		x: _x,
		y: _y,
		rotation: _rotation,
		width: _width,
		height: _height,
		imageUrl: _imageUrl
	}
});
/**
 * Encapsulates the singleton proxy between layout and layout(s) => persistent data
 * @class LayoutManager
 */
LayoutManager = (function () {
	var _currentLayout = [];
	var _actionStack = [];
	var _currentLawnItemId = null;

	var _loadLayout = function _loadLayout(lawnItemId) {
		_currentLawnItemId = lawnItemId;
		return false;
	};
	var _saveLayout = function _saveLayout() {
		return false;
	};
	var _saveAsLayout = function _saveAsLayout (lawnItemId) {
		
	};
	var _clearCurrentLayout = function _clearCurrentLayout() {
		_currentLayout = [];
		_actionStack = [];
	};
	var _addItem = function _addItem(abstractPart, x, y, rotation) {
		var layoutPart = new LayoutPart(abstractPart, x, y, rotation);
		_currentLayout.push(layoutPart);
		return layoutPart;
	};
	var _delItem = function _delItem(item) {
		return null;
	};
	var _selectItem = function _selectItem(x, y) {
		return null;
	};
	var _copyItem = function _copyItem(item) {
		return null;
	};
	var _moveItem = function _moveItem(item, x, y, rotation) {
		return null;
	};
	var _placeItem = function _placeItem(item, x, y, rotation) {
		return null;
	};
	var _undoLastAction = function _undoLastAction() {

	};
	return {
		loadLayout: _loadLayout,
		saveAsLayout: _saveAsLayout,
		saveLayout: _saveLayout,
		clearCurrentLayout: _clearCurrentLayout,
		addItem: _addItem,
		delItem: _delItem,
		selectItem: _selectItem,
		copyItem: _copyItem,
		moveItem: _moveItem,
		placeItem: _placeItem,
		undoLastAction: _undoLastAction

	};
})();