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
FitType = {
	FitTypeXY: 0,
	FitTypeX: 1,
	FitTypeY: 2
};
/**
 * Layout Instance of abstractPart
 * @type {LayoutPart}
 * @parameter {object} abstractPart - underlying abstractPart
 * @parameter {number} x - center x in real world units (meters)
 * @parameter {number} y - center y in real world units (meters)
 * @parameter {number} z - z order, not real world units
 * @parameter {number} rotation - clockwise in degrees
 */
LayoutPart = class LayoutPart {
	constructor (abstractPart, x, y, z, rotation) {
		this.abstractPart = abstractPart;
		this.locus = new AbstractLayoutLocus(x, y, z, rotation);
		this.width = abstractPart.width;
		this.height = abstractPart.height;
		this.imageUrl = abstractPart.url;
		this.locus.x = this.locus.x - (this.width / 2);
		this.locus.y = this.locus.y - (this.height / 2);
	}
	
	copyMe (x, y, rotation) {
		let copy = new AbstractPart(_abstractPart, x, y, rotation);
		return copy;
	}
};

/**
 * Encapsulates the singleton proxy between layout and layout(s) => persistent data
 * Manages things that are related to laying out a lawn, assumes the lawn is already configured
 * For layout, we use pixijs since we want a true 2D view to simplify the layout.
 * We will use a top view, looking down on the lawn area from above to simplify
 * the actual layout activity.
 * @class LayoutManager
 */
LayoutManager = (function () {
	const MOUSE_MODE = {Select: 0, Create: 1};
	var _pluginRenderer = null;
	var _setPluginRenderer = function _setPluginRenderer (renderer) {
		_pluginRenderer = renderer;
	};
	var _activeLayoutPart = null;
	var _setActiveLayoutPart = function _setActiveLayoutPart (part) {
		_activeLayoutPart = part;
		return _activeLayoutPart;
	};
	var _currentAbstractPart = null;
	
	var _currentLayout = [];
	var _actionStack = [];
	var _currentLawnItemId = null;
	var _currentLayoutPart = null;
	
	// Forwarding functions for _pluginRenderer stuff.  Cannot be called from global frames
	var _isValid = function _isValid () {
		return _pluginRenderer.isValid();
	};
	var _createLayout = function _createLayout (canvas, w, h) {
		return _pluginRenderer.createLayout(canvas, w, h);
	};
	var _destroyLayout = function _destroyLayout () {
		return _pluginRenderer.destroyLayout();
	};
	var _resizeLayout = function _resizeLayout (newWidth, newHeight, fitMode) {
		_pluginRenderer.resizeLayout(newWidth, newHeight, fitMode);
	};
	var _startAnimation = function _startAnimation () {
		_pluginRenderer.startAnimation();
	};
	var _enableAnimation = function _enableAnimation (enable) {
		_pluginRenderer.enableAnimation(enable);
	};
	
	// Mouse handlers
	var _mouseDnSelectHandler = function _mouseDnSelectHandler (pixelPt) {
		_pluginRenderer.setMouseMvHandler((pixelPt) => _mouseMvSelectHandler(pixelPt));
		_pluginRenderer.enableSelectBox(true);
	};
	var _mouseMvSelectHandler = function _mouseMvSelectHandler (pixelPt) {
		_pluginRenderer.drawSelectBox();
	};
	var _mouseUpSelectHandler = function _mouseUpSelectHandler (pixelPt) {
		_pluginRenderer.setMouseMvHandler(null);
		_pluginRenderer.finishSelectBox();
	};
	var _mouseMvCreateHandler = function _mouseMvCreateHandler (noop, pixelPt) {
		_pluginRenderer.moveMouseSprite(pixelPt);
	};
	var _mouseEnterCreateHandler = function _mouseEnterCreateHandler (pixelPt) {
		_pluginRenderer.setMouseMvHandler((noop, pixelPt) => _mouseMvCreateHandler(noop, pixelPt));
		_pluginRenderer.enableMouseSprite(true, pixelPt, _activeLayoutPart);
	};
	var _mouseLeaveCreateHandler = function _mouseLeaveCreateHandler () {
		_pluginRenderer.setMouseMvHandler(null);
		_pluginRenderer.enableMouseSprite(false);
	};
	var _mouseUpCreateHandler = function _testHandler (pixelPt) {
		if (_pluginRenderer.isMouseUpDnSame() && _activeLayoutPart) {
			var scalePixelToReal = _pluginRenderer.getScalePixelToReal();
			_pluginRenderer.createLayoutPart(_addItem(_activeLayoutPart, pixelPt.x * scalePixelToReal, pixelPt.y * scalePixelToReal), 
				pixelPt.x, pixelPt.y);
		}
	};

	var _setMouseMode = function _setMouseMode (mouseMode) {
		var targetEnterHandler = null;
		var targetLeaveHandler = null;
		var targetDnHandler = null;
		var targetUpHandler = null;
		var targetMvHandler = null;
		// fat arrow (=>) function syntax to ensure bind correct this
		switch (mouseMode) {
		default:
		case LayoutManager.MOUSE_MODE.Select:
			targetDnHandler = (pixelPt) => _mouseDnSelectHandler(pixelPt);
			targetUpHandler = (pixelPt) => _mouseUpSelectHandler(pixelPt);
			targetMvHandler = (pixelPt) => _mouseMvSelectHandler(pixelPt);
			break;
		case LayoutManager.MOUSE_MODE.Create:
			targetEnterHandler = (pixelPt) => _mouseEnterCreateHandler(pixelPt);
			targetLeaveHandler = () => _mouseLeaveCreateHandler();
			targetUpHandler = (pixelPt) => _mouseUpCreateHandler(pixelPt);
			break;
		}
		_pluginRenderer.setMouseDnHandler(targetDnHandler);
		_pluginRenderer.setMouseMvHandler(targetMvHandler);
		_pluginRenderer.setMouseUpHandler(targetUpHandler);
		_pluginRenderer.setMouseEnterHandler(targetEnterHandler);
		_pluginRenderer.setMouseLeaveHandler(targetLeaveHandler);
	};
	
	var _getDefaultFitMode = function _getDefaultFitMode () {
		return FitType.FitTypeXY;
	};
	
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
		_currentLayoutPart = layoutPart;
		return layoutPart;
	};
	var _delItem = function _delItem(item) {
		let foundIndex = -1;
		for (var i=0, len=_currentLayout.length; i<len; ++i) {
			if (_currentLayout[i] === item) {
				foundIndex = i;
				break;
			}
		}
		if (foundIndex >= 0) {
			let removedPart = _currentLayout.splice(foundIndex, 1);
			if (removedPart && removedPart.length === 1) {
				// part is removed
			}
		}
		return null;
	};
	var _selectItem = function _selectItem(item) {
		_currentLayoutPart = item;
		return item;
	};
	var _copyItem = function _copyItem(item) {
		let copy = item.copyMe();
		return copy;
	};
	var _moveItem = function _moveItem(item, x, y, rotation) {
		item._x = x || item._x;
		item._y = y || item._y;
		item._rotation = rotation || item._rotation;
		_currentLayoutPart = item;
		return item;
	};
	// proxy to plugin
	var _validSelection = function _validSelection () {
		return _pluginRenderer.validSelection();
	};
	var _moveForward = function _moveForward () {
		_pluginRenderer.moveForward();
	};
	var _moveToFront = function _moveToFront () {
		_pluginRenderer.moveToFront();
	};
	var _moveBackward = function _moveBackward () {
		_pluginRenderer.moveBackward();
	};
	var _moveToBack = function _moveToBack () {
		_pluginRenderer.moveToBack();
	};
	
	var _undoLastAction = function _undoLastAction() {

	};
	var _setCurrentAbstractPart = function _setCurrentAbstractPart (abstractPart) {
		_currentAbstractPart = abstractPart;
	};
	var _getCurrentAbstractPart = function _getCurrentAbstractPart () {
		return _currentAbstractPart;
	};
	var _enumerateLayout = function (callback) {
		_pluginRenderer.enumerateLayoutParts(callback);
	};
	return {
		MOUSE_MODE: MOUSE_MODE,
		setPluginRenderer: _setPluginRenderer,
		setActiveLayoutPart: _setActiveLayoutPart,
		isValid: _isValid,
		createLayout: _createLayout,
		destroyLayout: _destroyLayout,
		enumerateLayout: _enumerateLayout,
		resizeLayout: _resizeLayout,
		startAnimation: _startAnimation,
		enableAnimation: _enableAnimation,
		setMouseMode: _setMouseMode,
		getDefaultFitMode: _getDefaultFitMode,
		loadLayout: _loadLayout,
		saveAsLayout: _saveAsLayout,
		saveLayout: _saveLayout,
		clearCurrentLayout: _clearCurrentLayout,
		addItem: _addItem,
		delItem: _delItem,
		selectItem: _selectItem,
		validSelection: _validSelection,
		copyItem: _copyItem,
		moveItem: _moveItem,
		moveForward: _moveForward,
		moveToFront: _moveToFront,
		moveBackward: _moveBackward,
		moveToBack: _moveToBack,
		undoLastAction: _undoLastAction,
		setCurrentAbstractPart: _setCurrentAbstractPart,
		getCurrentAbstractPart: _getCurrentAbstractPart
	};
})();

