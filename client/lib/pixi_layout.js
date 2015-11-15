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
PixiLayout = (function () {

	/** @enum {number} */
	this.FitType = {
		FitTypeXY: 0,
		FitTypeX: 1,
		FitTypeY: 2
	};
	var _pixiRenderer = null;
	var _pixiContainer = null;
	var _layoutFrame = null;
	var _runAnimation = false;
	
	var _getLayoutFrame = function _getLayoutFrame () {
		if (_layoutFrame === null) {
			_layoutFrame = new LayoutFrame();
		}
		return _layoutFrame;
	};

	var _getPixiContainer = function _getPixiContainer () {
		if (_pixiContainer === null) {
			_pixiContainer = _getLayoutFrame().getLayoutFrame();
		}
		return _pixiContainer;
	};
	var _pixiAnimate = function _pixiAnimate () {
		if (_runAnimation) {
			requestAnimationFrame(_pixiAnimate);
			if (_pixiRenderer) {
				_pixiRenderer.render(_getPixiContainer());
			}
		}
		else {
			console.log('_pixiAnimate: stopping animation');
		}
	};
	var _isValid = function _isValid () {
		return _pixiRenderer !== null;
	};

	var _createLayout = function _createLayout (canvas, w, h) {
		_getPixiContainer();
		if (_pixiRenderer === null) {
			_pixiRenderer = PIXI.autoDetectRenderer(w, h, {view:canvas});
		}
		return _pixiRenderer;
	};

	var _destroyLayout = function _destroyLayout () {
		_pixiRenderer = null;
		// disable select box on exit to handle timing issues when this template is 
		// reentered.  We reenable on first mouse down which ensures graphic state is ok
		_enableSelectBox(false);
		return _pixiRenderer;
	};

	var _resizeLayout = function _resizeLayout (newWidth, newHeight, fitMode) {
		if (_pixiRenderer) {
			_pixiRenderer.resize(newWidth, newHeight);
		}
		_getLayoutFrame().fit(fitMode);
	};

	var _startAnimation = function _startAnimation () {
		_runAnimation = true;
		requestAnimationFrame(_pixiAnimate);
	};

	var _enableAnimation = function _enableAnimation (enable) {
		_runAnimation = enable;
	};


	var _background;
	var _grid;
	var _selectBox;
	var _houseText;
	var _curbText;
	var _parts;

	var _gridEnabled = false;
	var _gridSpacing;

	var _scaleRealToPixel;
	var _scalePixelToReal;

	// Mouse/touch support
	var _mouseDownPt;
	var _mouseMovePt;
	var _mouseUpPt;
	var _currentMoveState = false;
	/**
	 * _computeRelativeMouseLocation function - returns point location relative to background by
	 *  computing offset point from background to _pixiRenderer
	 * @param {object} absPt - object, point {x, y} - location relative to _pixiRenderer
	 * @return {object} - point relative to background, valid if within the _background
	 */
	var _computeRelativeMouseLocation = function _computeRelativeMouseLocation(absPt) {
		let point = {x: absPt.x - _pixiRenderer.bgndOffX, y: absPt.y - _pixiRenderer.bgndOffY, valid: true};
		point.valid = (point.x <= _background.width) && (point.y <= _background.height) &&
			(point.x >= 0) && (point.y >= 0);
		return point;
	};

	/**
	 * _mouseOut function - callback from PIXI.InteractiveManager on mouse entering render area
	 */
	var _mouseOver = function _mouseOver(interactionData) {
		console.log('_mouseOver');
		let mouseOverPt = _computeRelativeMouseLocation(interactionData.data.global);
		mouseOverPt = _snapToGrid(mouseOverPt.x, mouseOverPt.y);
		if (_mouseEnterHandler) {
			_mouseEnterHandler(mouseOverPt);
		}
	};

	/**
	 * _mouseOut function - callback from PIXI.InteractiveManager on mouse leaving render area
	 */
	/**
	 * 
	 * @param interactionData
	 * @private
	 */
	var _mouseOut = function _mouseOut(interactionData) {
		console.log('_mouseOut');
		if (_mouseLeaveHandler) {
			_mouseLeaveHandler();
		}
	};

	/**
	 * _mouseDown function - callback from PIXI.InteractiveManager on mouse button down
	 * @param {object} interactionData - object, contains current point relative to render surface
	 */
	var _mouseDown = function _mouseDown(interactionData) {
		_mouseDownPt = _computeRelativeMouseLocation(interactionData.data.global);
		_mouseDownPt = _snapToGrid(_mouseDownPt.x, _mouseDownPt.y);
		//console.log('_mouseDown: ' + currentMouseLoc.x + ', ' + currentMouseLoc.y);
		if (_mouseDownHandler) {
			_mouseDownHandler(_mouseDownPt);
		}
	};
	
	/**
	 * _isSame function - determines if two points are identical
	 * @param {object} p1 - object, point {x, y}
	 * @param {object} p2 - object, point {x, y}
	 * @return {boolean} - true if same
	 */
	var _isSame = function _isSame(p1, p2) {
		return p1.x === p2.x && p1.y === p2.y;
	};

	/**
	 * _isMouseUpDnSame function - determines if mouse up/dn points are the same
	 * Mainly for external usage
	 * @return {boolean} - true if same
	 */
	var _isMouseUpDnSame = function _isMouseUpDnSame() {
		return _isSame(_mouseDownPt, _mouseUpPt);
	};
	
	/**
	 * _computeRect function - takes two arbitrary points and computes {ulx, uly, w, h)
	 * @param {object} p1 - object, point {x, y}
	 * @param {object} p2 - object, point {x, y}
	 * @return {object} - {x: ulx, y: uly, w: lrx - ulx, h: lry - uly}
	 */
	var _computeRect = function _computeRect(p1, p2) {
		var ulx, uly, lrx, lry;
		if (p1.x < p2.x) {
			ulx = p1.x;
			lrx = p2.x;
		}
		else {
			ulx = p2.x;
			lrx = p1.x;
		}
		if (p1.y < p2.y) {
			uly = p1.y;
			lry = p2.y;
		}
		else {
			uly = p2.y;
			lry = p1.y;
		}

		return {x: ulx, y: uly, w: lrx - ulx, h: lry - uly};
	};

	/**
	 * _enableSelectBox function - enable/disable the graphic _selectBox.  Used to avoid any
	 * timing issues when switching between windows
	 * @param {boolean} enable - true to turn on, false to turn off..
	 */
	var _enableSelectBox = function _enableSelectBox(enable) {
		_selectBox.visible = enable;
		_selectBox.clear();
		_selectBox.startSelect = _mouseDownPt;
		//console.log('_mouseDown: x: ' + _selectBox.startSelect.x + ', y: ' + _selectBox.startSelect.y + 
		//	', background.x: ' + background.innerX + ', background.y: ' + background.innerY);
		_selectBox.currentBox = null;
	};

	/**
	 * _drawSelectBox function - if in select mode, clear and redraw selection box if toPt != fromPt
	 * @param {object} fromPt - x, y location we were at
	 * @param {object} toPt - x, y location we are now at
	 */
	var _drawSelectBox = function _drawSelectBox(fromPt, toPt) {
		if (_selectBox.visible) {
			if (!_isSame(fromPt, toPt)) {
				// Clear last box
				_selectBox.clear();
				// Draw outline of final box
				_selectBox.currentBox = _computeRect(fromPt, toPt);
				_selectBox.beginFill(0xFF0000, 0.5);
				_selectBox.drawRect(_selectBox.currentBox.x, _selectBox.currentBox.y, _selectBox.currentBox.w, _selectBox.currentBox.h);
			}
		}
	};

	/**
	 * _drawSelectBoxPublic function - public for callback from outside.  Uses local mouse locations
	 */
	var _drawSelectBoxPublic = function _drawSelectBoxPublic () {
		_drawSelectBox(_mouseDownPt, _mouseMovePt);
	};

	/**
	 * _finishSelectBox function - draws final select box or a point if fromPt === toPt
	 * @param {object} fromPt - x, y location we were at
	 * @param {object} toPt - x, y location we are now at
	 */
	var _finishSelectBox = function _finishSelectBox(fromPt, toPt) {
		if (!_isSame(fromPt, toPt)) {
			_drawSelectBox(fromPt, toPt);
		}
		else {
			_selectBox.beginFill(0xFF0000);
			toPt = _snapToGrid(toPt.x, toPt.y);
			_selectBox.drawCircle(toPt.x, toPt.y, 3);
			// Store a select point, indicate with w, h == 0
			_selectBox.currentBox = {x: toPt.x, y: toPt.y, w: 0, h: 0};
		}
	};

	/**
	 * _finishSelectBoxPublic function - public for callback from outside.  Uses local mouse locations
	 */
	var _finishSelectBoxPublic = function _finishSelectBoxPublic() {
		_finishSelectBox(_mouseDownPt, _mouseUpPt);
	};

	var _mouseSprite = null;
	var _mouseMask = null;
	var _unitW = 50;
	
	var _computeCenterPt = function _computeCenterPt (pixelPt) {
		let centerPt = {};
		centerPt.x = pixelPt.x - (_unitW / 2);
		centerPt.y = pixelPt.y - (_mouseSprite.height / 2);
		return centerPt;
	};
	
	/**
	 * _enableMouseSprite function - enable/disable the graphic cursor sprite.  Used to avoid any
	 * timing issues when switching between windows
	 * @param {boolean} enable - true to turn on, false to turn off..
	 * @param {object} pixelPt - mandatory if enable is true
	 * @param {object} abstractPart - the part we have selected to create, currently of type TestAbstractPart
	 */
	var _enableMouseSprite = function _enableMouseSprite (enable, pixelPt, abstractPart) {
		_selectBox.visible = enable;
		// _unitW is currently 50, height of mouse sprite is relative to the ratio of w:h in the abstractPart.  
		if (enable) {
			if (!_mouseSprite) {
				var url = abstractPart.url;
				_mouseSprite = PIXI.Sprite.fromImage(url);
				_mouseSprite.width = _unitW;
				_mouseSprite.height = (_unitW * abstractPart.height) / abstractPart.width;
				// Center the sprite
				_mouseSprite.position = _computeCenterPt(pixelPt);
				// For rectangular masking, just adjust the height and compute center point
				// For ellipse, center point is computed identically but we have to make a mask
				if (abstractPart.footprint === LayoutFootprintType.ellipse) {
					// have to mask
					_mouseMask = new PIXI.Graphics();
					_mouseMask.beginFill();
					_mouseMask.drawEllipse(_mouseSprite.width / 2, _mouseSprite.height.y / 2, _mouseSprite.width, _mouseSprite.height);
					_mouseMask.endFill();
					_mouseMask.position.x = _mouseSprite.position.x;
					_mouseMask.position.y = _mouseSprite.position.y;

					_selectBox.addChild(_mouseMask);
					_mouseSprite.mask = _mouseMask;
				}
				else {
					_mouseMask = null;
					_mouseSprite.mask = null;
				}
				_selectBox.addChild(_mouseSprite);
			}
		}
		else {
			if (_mouseSprite) {
				// Remove from the 
				_selectBox.removeChild(_mouseSprite);
				_mouseSprite = null;
			}
		}
	};

	/**
	 * _moveMouseSprite function - Set xy loc of sprite to pixelPt
	 * @param {object} pixelPt - location to place sprite if active
	 */
	var _moveMouseSprite = function _moveMouseSprite (pixelPt) {
		if (_selectBox.visible && _mouseSprite) {
			// Center the sprite
			_mouseSprite.position = _computeCenterPt(pixelPt);
			if (_mouseMask) {
				_mouseMask.position.x = _mouseSprite.position.x;
				_mouseMask.position.y = _mouseSprite.position.y;
			}
		}
	};
	
	// Mouse handler functions and setters for them
	var _mouseEnterHandler = null;
	var _setMouseEnterHandler = function _setMouseEnterHandler(handler) {
		_mouseEnterHandler = handler;
	};
	var _mouseLeaveHandler = null;
	var _setMouseLeaveHandler = function _setMouseLeaveHandler (handler) {
		_mouseLeaveHandler = handler;
	};
	var _mouseDownHandler = null;
	var _setMouseDownHandler = function _setMouseDownHandler(handler) {
		_mouseDownHandler = handler;
	};

	var _mouseMoveHandler = null;
	var _setMouseMoveHandler = function _setMouseMoveHandler(handler) {
		_mouseMoveHandler = handler;
	};

	var _mouseUpHandler = null;
	var _setMouseUpHandler = function _setMouseUpHandler(handler) {
		_mouseUpHandler = handler;
	};

	/**
	 * _mouseUp function - callback from PIXI.InteractiveManager on mouse button up
	 * @param {object} interactionData - object, contains current point relative to render surface
	 */
	var _mouseUp = function _mouseUp(interactionData) {
		_mouseUpPt = _computeRelativeMouseLocation(interactionData.data.global);
		_mouseUpPt = _snapToGrid(_mouseUpPt.x, _mouseUpPt.y);
		//console.log('console: ' + _mouseUpPt);
		if (_mouseUpHandler) {
			_mouseUpHandler(_mouseUpPt);
		}
		//_addTestItem(_mouseUpPt.x, _mouseUpPt.y, 100, 100);
		console.log('mouseup: xreal: ' + _mouseUpPt.x * _scalePixelToReal + ', yreal: ' + _mouseUpPt.y * _scalePixelToReal);
		//}
	};

	/**
	 * _mouseMove function - callback from PIXI.InteractiveManager on mouse motion
	 * @param {object} interactionData - object, contains current point relative to render surface
	 */
	var _mouseMove = function _mouseMove(interactionData) {
		// Rule out Infinity which seems to be a PIXI bug if mouse move is active
		// and then we move out to a different window and then back into this one.
		// Even though we reset the mouse handlers, there seems to be some state bug.
		if (interactionData.data.global.x !== Infinity) {
			let {x, y, valid} = _computeRelativeMouseLocation(interactionData.data.global);
			_mouseMovePt = _snapToGrid(x, y);
			//console.log('_mouseMove: ' + _mouseMovePt.x + ', ' + _mouseMovePt.y + ' : valid: ' + valid);
			
			// Try to detect mouseover, mouseout
			if (_currentMoveState) {
				// The last state was inside
				if (!valid) {
					console.log('_mouseMove: LEAVE');
					// We just moved out, fire handler, set _currentMoveState to out
					if (_mouseLeaveHandler) {
						_mouseLeaveHandler();
					}
					_currentMoveState = valid;
				}
			}
			else {
				// The last state was outside
				if (valid) {
					console.log('_mouseMove: ENTER');
					// We just moved in, fire handler, set _currentMoveState to in
					if (_mouseEnterHandler) {
						_mouseEnterHandler(_mouseMovePt);
					}
					_currentMoveState = valid;
				}
			}

			//console.log('_mouseMove: ' + _mouseMovePt);
			if (_mouseMoveHandler) {
				_mouseMoveHandler(_mouseDownPt, _mouseMovePt);
			}
		}
	};

	/**
	 * _rectangle function - Creates initial rectangle
	 * @param {number} x - x pixel position of frame - Allows centering
	 * @param {number} y - y pixel position of frame - Allows centering
	 * @param {number} width - pixel width of frame
	 * @param {number} height - pixel height of frame
	 * @param {number} backgroundColor - Color of background, e.g. 0xFFFFFF (white)
	 * @param {number} borderColor - Color of border, e.g. 0xFF0000 (red)
	 * @param {number} borderWidth - pixel width of border
	 */
	var _rectangle = function _rectangle(x, y, width, height, backgroundColor, borderColor, borderWidth) {
		console.log('PixiLayout._rectangle(' + x + ', ' + y + ', ' + width + ', ' + height +
			', ' + backgroundColor + ', ' + borderColor + ', ' + borderWidth);
		var box = new PIXI.Container();
		// Set interactivity
		box.interactive = true;
		//box.mouseover = _mouseOver;
		//box.mouseout = _mouseOut;
		box.mousedown = _mouseDown;
		box.mouseup = _mouseUp;
		box.mousemove = _mouseMove;

		// When drawing, background will contain the drawn border
		// as well as the background
		_background = new PIXI.Graphics();
		box.addChild(_background);
		// gridding?
		_grid = new PIXI.Graphics();
		box.addChild(_grid);
		box.position.x = x;
		box.position.y = y;
		// text to orient lawn to house
		_houseText = new PIXI.Text('house');
		box.addChild(_houseText);
		_curbText = new PIXI.Text('curb');
		box.addChild(_curbText);
		// Parts
		_parts = new PIXI.Container();
		box.addChild(_parts);
		// Selection box
		_selectBox = new PIXI.Graphics();
		_selectBox.visible = false;
		box.addChild(_selectBox);
		return box;
	};

	/**
	 * _modifyRectangle function - Does the heavy lifting for fit, scale to modify the frame
	 * Also draws any gridding
	 * @param {object} rectangle - rectangle of type created by _rectangle, really a LayoutFrame type data
	 * @param {number} x - x pixel position of frame - Allows centering
	 * @param {number} y - y pixel position of frame - Allows centering
	 * @param {number} width - pixel width of frame
	 * @param {number} height - pixel height of frame
	 * @param {number} borderWidth - pixel width of border
	 */
	var _modifyRectangle = function _modifyRectangle(rectangle, x, y, width, height, borderWidth) {
		_background.clear();
		// Now store positional info into background, even though we still have to explicitly draw
		_background.innerWidth = width - (2 * borderWidth);
		_background.innerHeight = height - (2 * borderWidth);
		_background.innerX = borderWidth;
		_background.innerY = borderWidth;
		_background.width = width;
		_background.height = height;
		_background.position.x = 0;
		_background.position.y = 0;
		_background.beginFill(0xFF0000);
		_background.drawRect(0, 0, width, height);
		_background.beginFill(0xFFFFFF);
		_background.drawRect(borderWidth, borderWidth, _background.innerWidth, _background.innerHeight);
		rectangle.position.x = x;
		rectangle.position.y = y;
		// Safest to use the real session variables to determine _grid
		_gridEnabled = Session.get(Constants.gridEnabled);
		_gridSpacing = Session.get(Constants.gridSpacing);
		_drawGrid(_gridEnabled, _gridSpacing);
		// center text horizontally, stick to top and bottom, house and curb respectively
		let midX = width / 2;
		_houseText.x = midX - (_houseText.width / 2);
		_houseText.y = borderWidth;
		_curbText.x = midX - (_curbText.width / 2);
		_curbText.y = _background.height - _curbText.height;
		_pixiRenderer.bgndOffX = x;
		_pixiRenderer.bgndOffY = y;
	};

	/**
	 * _setGridEnabled function - Allows us to optimize setting local _grid control
	 * without having to examine Session variables
	 * @param {boolean} gridEnabled - draw or clear _grid
	 * @param {number} gridSpacing - _grid spacing in cm
	 */
	var _setGridEnabled = function _setGridEnabled(gridEnabled, gridSpacing) {
		_gridEnabled = gridEnabled;
		_gridSpacing = (gridEnabled) ? gridSpacing : 0;
	};

	/**
	 * _drawGrid function - draws a _grid with xy spacing in the frame.  spacing is in cm
	 * @param {boolean} gridEnabled - draw or clear _grid
	 * @param {number} gridSpacing - _grid spacing in cm
	 */
	var _drawGrid = function _drawGrid(gridEnabled, gridSpacing) {
		console.log('_drawGrid: ENTRY');
		// Clear the _grid before we draw it so we don't accumulate graphics
		// Always clear since it handles the !gridEnabled case too.
		_grid.clear();
		if (gridEnabled) {
			console.log('_drawGrid, drawing _grid');
			// pixel positions
			var startX = _background.position.x;
			var startY = _background.position.y;
			// spacing parameter is in cm, convert to pixels
			var gridPixelSpacing = (gridSpacing / 100) * _scaleRealToPixel;
			// Set _grid point color to teal
			_grid.beginFill(0x009688);
			var innerHeight;
			var innerWidth;
			let gridInBorder = false;
			if (gridInBorder) {
				innerWidth = _background.innerWidth;
				innerHeight = _background.innerHeight;
				startX = _background.innerX;
				startY = _background.innerY;
			}
			else {
				innerWidth = _background.width;
				innerHeight = _background.height;
				startX = _background.position.x;
				startY = _background.position.y;
			}
			for (var row = 0, lastRow = innerHeight; row < lastRow; row += gridPixelSpacing) {
				for (var i = 0, stop = innerWidth; i < stop; i += gridPixelSpacing) {
					_grid.drawCircle(startX + i, startY + row, 1);
				}
			}
		}
	};

	/**
	 * _snapToGrid function - snaps the xy pixel coordinate to a grid point if _gridEnabled
	 * if not _gridEnabled, just return original coordinates
	 * @param {number} xPixel - x position to snap
	 * @param {number} yPixel - x position to snap
	 * @return {object} - {x, y} snapped points or raw points
	 */
	var _snapToGrid = function _snapToGrid(xPixel, yPixel) {
		if (_gridEnabled) {
			let gridPixelSpacing = (_gridSpacing / 100.0) * _scaleRealToPixel;
			xPixel = Math.round(xPixel / gridPixelSpacing) * gridPixelSpacing;
			yPixel = Math.round(yPixel / gridPixelSpacing) * gridPixelSpacing;
		}
		return {x: xPixel, y: yPixel};
	};

	var _addTestItem = function _addTestItem(x, y, w, h) {
		let texture = PIXI.Texture.fromImage('custom.png');
		let item = new PIXI.Sprite(texture);
		item.x = x - (w / 2);
		item.y = y - (h / 2);
		item.width = w;
		item.height = h;

		_parts.addChild(item);
	};
	
	/**
	 * @function _createLayoutPart - Factory that creates a LayoutPart instance and an associated PIXI Sprite and adds the sprite to the _parts container
	 * Also augments sprite with the layoutPart instance and layoutPart with the sprite instance
	 * @param {object} abstractPart - This should be common across all instances of this part
	 * @param {number} xPixel - x position in pixels
	 * @param {number} yPixel - y position in pixels
	 * @param {number} rotation - clockwise rotation in degrees
	 * @return {LayoutPart} -
	 * @private
	 */
	var _createLayoutPart = function _createLayoutPart(abstractPart, xPixel, yPixel, rotation) {
		var layoutPart = LayoutManager.addItem(abstractPart, xPixel * _scalePixelToReal, yPixel * _scalePixelToReal, rotation);
		var pixiTexture = PIXI.Texture.fromImage(layoutPart.imageUrl);
		var sprite = new PIXI.Sprite(pixiTexture);
		sprite.width = layoutPart.width * _scaleRealToPixel;
		sprite.height = layoutPart.height * _scaleRealToPixel;
		sprite.x = layoutPart.x * _scaleRealToPixel;
		sprite.y = layoutPart.y * _scaleRealToPixel;
		layoutPart.sprite = sprite;
		sprite.layoutPart = layoutPart;
		_parts.addChild(sprite);
		return layoutPart;
	};

	/**
	 * @namespace PixiLayout
	 * LayoutFrame class furnishing the basic framing data/methods
	 */
	var LayoutFrame = function LayoutFrame() {
		var self = this;
		self.layoutFrame = _rectangle(0, 0, 100, 100, 0xFFFFFF, 0xFF0000, 10);
		/**
		 * gets the PIXI layoutFrame
		 * @memberof PixiLayout
		 * @method getLayoutFrame
		 * @return {object} pixi layout frame container
		 */
		LayoutFrame.prototype.getLayoutFrame = function getLayoutFrame() {
			return self.layoutFrame;
		};
		/**
		 * zooms the frame
		 * @memberof PixiLayout
		 * @method zoom
		 * @param {number} scale scale factor to zoom
		 */
		LayoutFrame.prototype.zoom = function zoom(scale) {
			console.log('LayoutFrame.prototype.zoom: ' + scale);
		};
		/**
		 * fits the frame
		 * @memberof PixiLayout
		 * @method fit
		 * @param {number} fitMode type of fit for the frame acceptable values FitType
		 */
		LayoutFrame.prototype.fit = function fit(fitMode) {
			console.log('LayoutFrame.prototype.fit: ' + fitMode);
			if (_pixiRenderer) {
				// set some locals and set defaults
				var pixiRenderWidth = _pixiRenderer.width;
				var pixiRenderHeight = _pixiRenderer.height;
				var dims = CreateLawnData.lawnData.shape.dims;
				var x = 0, y = 0;
				var bestFit = {widthPixels: pixiRenderWidth, lengthPixels: pixiRenderHeight};
				// based on fitMode, adjust values, then modify the fitted frame
				switch (fitMode) {
				case PixiLayout.FitType.FitTypeXY:
					bestFit = Utils.computeLayoutFrame(dims.width, dims.length, pixiRenderWidth, pixiRenderHeight);
					// center layout frame in renderer
					x = (pixiRenderWidth - bestFit.widthPixels) / 2;
					y = (pixiRenderHeight - bestFit.lengthPixels) / 2;
					break;
				case PixiLayout.FitType.FitTypeX:
					bestFit.lengthPixels = (dims.length * pixiRenderWidth) / dims.width;
					// center layout frame in renderer
					y = (pixiRenderHeight - lengthPixels) / 2;
					break;
				case PixiLayout.FitType.FitTypeY:
					bestFit.widthPixels = (dims.width * pixiRenderHeight) / dims.length;
					// center layout frame in renderer
					x = (pixiRenderWidth - widthPixels) / 2;
					break;
				default :
					// error, no effect
					break;
				}
				_scaleRealToPixel = bestFit.lengthPixels / dims.length;
				_scalePixelToReal = 1.0 / _scaleRealToPixel;
				_modifyRectangle(self.layoutFrame, x, y, bestFit.widthPixels, bestFit.lengthPixels, 4);
			}
			else {
				// really an error since there is no renderer but just in case we get invoked too soon noop this
				//_modifyRectangle(self.layoutFrame, 0, 0, (border.width === 200) ? 100 : 200, 300, 4);
			}
		};
		/**
		 * pans the frame
		 * @memberof PixiLayout
		 * @method pan
		 * @param {number} dx amount to shift in x
		 * @param {number} dy amount to shift in y
		 */
		LayoutFrame.prototype.pan = function pan(dx, dy) {
		};
	};

	return {
		pixiRenderer: _pixiRenderer,
		isValid: _isValid,
		createLayout: _createLayout,
		destroyLayout: _destroyLayout,
		resizeLayout: _resizeLayout,
		startAnimation: _startAnimation,
		enableAnimation: _enableAnimation,
		FitType: FitType,
		setGridEnabled: _setGridEnabled,
		enableSelectBox: _enableSelectBox,
		enableMouseSprite: _enableMouseSprite,
		LayoutFrame: LayoutFrame,
		isSame: _isSame,
		createLayoutPart: _createLayoutPart,
		setMouseDnHandler: _setMouseDownHandler,
		setMouseEnterHandler: _setMouseEnterHandler,
		setMouseLeaveHandler: _setMouseLeaveHandler,
		setMouseMvHandler: _setMouseMoveHandler,
		setMouseUpHandler: _setMouseUpHandler,
		isMouseUpDnSame: _isMouseUpDnSame,
		drawSelectBox: _drawSelectBoxPublic,
		moveMouseSprite: _moveMouseSprite,
		finishSelectBox: _finishSelectBoxPublic,
		addTestItem: _addTestItem
	};
})();