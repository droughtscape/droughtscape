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
PixiLayoutx = (function () {
	const ArrangeErrorMsg = 'Please select item and try again';
	const DeleteErrorMsg = 'Please select item(s) and try again';
	var _pixiRenderer = null;
	var _pixiContainer = null;
	var _layoutFrame = null;
	var _runAnimation = false;
	var _selected = [];
	var _selectedBox = null;
	var _copyBuffer = [];
	
    var UndoState = {
		Enable: 0,
		Disable: 1
	};
    var UndoType = {
        Undelete: 0,
		Unmove: 1,
		Uncopy: 2,
		Unpaste: 3
    };
    
    class UndoItem {
        constructor (undoType) {
            this.undoType = undoType;
        }
        
        undoMe () {}
    }
    class UndoDeleteItem extends UndoItem {
        constructor (deletedItems) {
            super(UndoType.Undelete);
            // copy this or is a ref good enough?
            this.deletedItems = deletedItems.slice();
        }
        undoMe () {
            for (var i=0, len=this.deletedItems.length; i < len; ++i) {
                _parts.addChild(this.deletedItems[i]);
            }
            _parts.children.sort(depthCompare);
        }
    }
	class UndoMoveItem extends UndoItem {
		/**
		 * 
		 * @param {[]} movedItems - items moved
		 * @param {number} dx - real world units dx
		 * @param {number} dy - real world units dy
		 * @param {number} scaleRealToPixel - cached value
		 */
		constructor (movedItems, dx, dy, scaleRealToPixel) {
			super(UndoType.Unmove);
			this.movedItems = movedItems.slice();
			// cache current scale in case we do a zoom before undo
			this.scaleRealToPixel = scaleRealToPixel;
			this.dx = -dx;
			this.dy = -dy;
		}
		undoMe () {
			for (var i=0, len=this.movedItems.length; i< len; ++i) {
				let part = this.movedItems[i];
				part.layoutPart.moveMe(this.dx, this.dy);
				part.x = part.layoutPart.locus.x * this.scaleRealToPixel;
				part.y = part.layoutPart.locus.y * this.scaleRealToPixel;
			}
		}
	}
	class UndoCopySelection extends UndoItem {
		constructor () {
			super(UndoType.Uncopy);
		}
		undoMe () {
			_copyBuffer = [];
		}
	}
	class UndoPaste extends UndoItem {
		constructor (items) {
			super(UndoType.Unpaste);
			this.pasteItems = items.slice();
		}
		undoMe () {
			// create a clean selected list of the pasteItems and then delete them with _delete's undo disabled
			_clearSelection();
			for (var i=0, len=this.pasteItems.length; i < len; ++i) {
				_selectPart(this.pasteItems[i]);
			}
			_deleteItems(UndoState.Disable);
		}
	}
    class UndoStack {
        constructor () {
            this.maxUndoActions = 100;
            this.undoStack = [];
        }
        
        pushUndelete (items) {
            this.undoStack.push(new UndoDeleteItem(items));
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
        }
        
		pushUnmove (items, dx, dy) {
			this.undoStack.push(new UndoMoveItem(items, dx, dy, _scaleRealToPixel));
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}
		
		pushUncopy () {
			this.undoStack.push(new UndoCopySelection());
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}
		
		pushUnpaste (items) {
			this.undoStack.push(new UndoPaste(items));
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}
        clearUndoStack () {
            this.undoStack = [];
        }
        
        popUndoStack () {
            if (this.undoStack.length > 0) {
                let undoItem = this.undoStack.pop();
                undoItem.undoMe();
            }
            else {
                _blink(0xFF0000, 'Nothing to undo');
            }
        }
    }
    
    var _undoStack = new UndoStack();
    
	/**
	 * Exports the validity (length) of the current selection.  It does NOT export the selection since that type is
	 * private to PixiLayout
	 * @returns {number} - length of the _selected list
	 * @private
	 */
	var _validSelection = function _validSelection () {
		return _selected.length;
	};
	/**
	 * 
	 * @returns {*} - the layoutPart attribute of the first selected item or null
	 * @private
	 */
	var _getSelectedPart = function _getSelectedPart () {
		if (_selected.length > 0) {
			return _selected[0].layoutPart;
		}
		return null;
	};
	/**
	 * Getter for singleton LayoutFrame, creates if not yet created.
	 * @returns {object} - singleton LayoutFrame instance
	 * @private
	 */
	var _getLayoutFrame = function _getLayoutFrame () {
		if (_layoutFrame === null) {
			_layoutFrame = new LayoutFrame();
		}
		return _layoutFrame;
	};

	/**
	 * Getter for singleton PIXI layoutFrame container, creates if not yet created.
	 * @returns {object} - layout frame container
	 * @private
	 */
	var _getPixiContainer = function _getPixiContainer () {
		if (_pixiContainer === null) {
			_pixiContainer = _getLayoutFrame().getLayoutFrame();
		}
		return _pixiContainer;
	};
	/**
	 * Blinks the background
	 * @param {number} color - set background.tint to this and restore on timer expiry
	 * @param {string} msg - error message
	 * @private
	 */
	var _blink = function _blink (color, msg) {
		_blinkPart(_background, color);
		swal({   
			title: 'Oops!',   
			text: msg,   
			timer: 2000,   
			showConfirmButton: true });
	};
	/**
	 * Blinks a part
	 * @param {object} part - pixi item to blink
	 * @param {number} color - to set part.tint to 
	 * @param {number} duration - ms to blink
	 * @param {object} nextFn - chaining function for sequential blinking
	 * @private
	 */
	var _blinkPart = function _blinkPart (part, color, duration, nextFn) {
		var blinkColor = color || 0xFF0000;
		var blinkDuration = duration || 200;
		var originalTint = part.tint;
		part.tint = blinkColor;
		setTimeout(function () {
			part.tint = originalTint;
			if (nextFn) {
				nextFn();
			}
		}, blinkDuration);
	};
	/**
	 * Basic PIXI animation function
	 * @private
	 */
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
	/**
	 * Defines when pixi is correctly setup
	 * @returns {boolean}
	 * @private
	 */
	var _isValid = function _isValid () {
		return _pixiRenderer !== null;
	};
	/**
	 * Setup the basic canvas view of pixi
	 * @param {object} canvas - html canvas
	 * @param {number} w - width of canvas in pixels
	 * @param {number} h - height of canvas in pixels
	 * @returns {*} - browser compatible renderer, prefer WebGL but can be Canvas fallback
	 * @private
	 */
	var _createLayout = function _createLayout (canvas, w, h) {
		_getPixiContainer();
		if (_pixiRenderer === null) {
			_pixiRenderer = PIXI.autoDetectRenderer(w, h, {view:canvas});
		}
		return _pixiRenderer;
	};
	/**
	 * Cleanup on layout exit
	 * @returns {*} - null _pixiRenderer
	 * @private
	 */
	var _destroyLayout = function _destroyLayout () {
		_pixiRenderer = null;
		// disable select box on exit to handle timing issues when this template is 
		// reentered.  We reenable on first mouse down which ensures graphic state is ok
		_enableSelectBox(false);
		return _pixiRenderer;
	};
	/**
	 * Callback to allow adjusting pixi renderer when user changes window size dynamically
	 * @param {number} newWidth - in pixels
	 * @param {number} newHeight - in pixels
	 * @param {number} fitMode - resize method
	 * @private
	 */
	var _resizeLayout = function _resizeLayout (newWidth, newHeight, fitMode) {
		if (_pixiRenderer) {
			_pixiRenderer.resize(newWidth, newHeight);
		}
		_getLayoutFrame().fit(fitMode);
	};
	/**
	 * Starts animation.  Note, this is more than just moving stuff around, it also affects
	 * refresh which is also on the animation function.  Also initiates initial RAF call
	 * @private
	 */
	var _startAnimation = function _startAnimation () {
		_runAnimation = true;
		requestAnimationFrame(_pixiAnimate);
	};
	/**
	 * Controls whether any rendering happens in the animation engine
	 * @param {boolean} enable - self evident
	 * @private
	 */
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

	var _scaleRealToPixel = 1.0;
	var _scalePixelToReal = 1.0;
	var _getScalePixelToReal = function _getScalePixelToReal () {
		return _scalePixelToReal;
	};

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
	 * callback from PIXI.InteractiveManager on mouse entering render area
	 * @param {object} interactionData - PIXI interaction object
	 * @private
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
	 * callback from PIXI.InteractiveManager when mouse leaves area
	 * @param interactionData - PIXI interaction data
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
	 * Manages the _selected array as well as tinting any selected part
	 * @param part
	 * @private
	 */
	var _selectPart = function _selectPart (part) {
		// if already in _selectList, remove it
		var index = _selected.indexOf(part);
		if (index > -1) {
			// already in array, clear tint and remove
			part.tint = 0xFFFFFF;
			part.alpha = 1.0;
			_selected.splice(index, 1);
		}
		else {
			// push onto _selected, set tint
			_selected.push(part);
			_selectedBox = Utils.boxUnionBox(_selectedBox, {x: part.x, y: part.y, w: part.width, h: part.height});
			part.tint = 0xFF0000;
			part.alpha = 0.5;
			Session.set(Constants.layoutSelection, _selected.length);
		}
	};
	/**
	 * resets tinting on any selected part
	 * clears the _selected list
	 * @private
	 */
	var _clearSelection = function _clearSelection () {
		for (var i=0, len=_selected.length; i < len; ++i) {
			_selected[i].tint = 0xFFFFFF;
			_selected[i].alpha = 1.0;
		}
		_selected = [];
		_selectedBox = null;
		Session.set(Constants.layoutSelection, 0);
	};
	/**
	 * 
	 * @param {object} pt - {x, y}
	 * @returns {boolean|*} - true if pt is on the box covering the entire selection
	 * @private
	 */
	var _ptOnSelection = function _ptOnSelection (pt) {
		// Heads up, _selectedBox can be null
		return (_selectedBox === null) ? false : Utils.pointInBox(pt, _selectedBox);
	};
	/**
	 * Encapsulates forward enumeration of the _parts children
	 * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
	 * @returns {boolean} - false if enumeration was stopped, true if finished for all items
	 * @private
	 */
	var _enumeratePartsFwd = function _enumeratePartsFwd (enumFn) {
		var parts = _parts.children;
		for (var len=parts.length, i=0; i < len; ++i) {
			let part = parts[i];
			if (enumFn(part)) {
				return false;
			}
		}
		return true;
	};
	/**
	 * Encapsulates enumeration of the _selected list
	 * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
	 * @returns {boolean} - false if enumeration was stopped, true if finished for all items
	 * @private
	 */
	var _enumerateSelection = function _enumerateSelection (enumFn) {
		for (var i=0, len=_selected.length; i < len; ++i) {
			if (enumFn(_selected[i])) {
				return false;
			}
		}
		return true;
	};
	/**
	 * Encapsulates reverse enumeration of the _parts children
	 * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
	 * @returns {boolean} - false if enumeration was stopped, true if finished for all items
	 * @private
	 */
	var _enumeratePartsRev = function _enumerateParts (enumFn) {
		var parts = _parts.children;
		for (var len=parts.length, i=len-1; i >= 0; i--) {
			let part = parts[i];
			if (enumFn(part)) {
				return false;
			}
		}
		return true;
	};

	/**
	 * Encapsulates reverse enumeration of the _parts children, excluding a callback on excludePart
	 * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
	 * @param {object} excludePart - this part will not be passed to enumFn(part)
	 * @returns {boolean} - false if enumeration was stopped, true if finished for all items
	 * @private
	 */
	var _enumeratePartsExcludePartRev = function _enumeratePartsExcludePartRev (enumFn, excludePart) {
		var parts = _parts.children;
		for (var len=parts.length, i=len-1; i >= 0; i--) {
			var part = parts[i];
			if (part !== excludePart && enumFn(part)) {
				return false;
			}
		}
		return true;
	};
	
	/**
	 * _finishSelectBox function - draws final select box or a point if fromPt === toPt
	 * @param {object} fromPt - x, y location we were at
	 * @param {object} toPt - x, y location we are now at
	 */
	var _finishSelectBox = function _finishSelectBox(fromPt, toPt) {
		if (!_isSame(fromPt, toPt)) {
			_drawSelectBox(fromPt, toPt);
			_clearSelection();
			let selectBox = _selectBox.currentBox;
			_enumeratePartsRev(function (part) {
				if (Utils.boxIntersectBox(_rectFromPart(part), selectBox)) {
					// satisfied
					console.log('_finishSelectBox: ptInBox found at i: ' + i);
					// Highlight via tint, if not selected, set to red, if selected, clear to white
					_selectPart(part);
				}
				return false;
			});
			_selectBox.visible = false;
		}
		else {
			_selectBox.beginFill(0xFF0000, 0.5);
			toPt = _snapToGrid(toPt.x, toPt.y);
			_selectBox.drawCircle(toPt.x, toPt.y, 3);
			// Store a select point, indicate with w, h == 0
			_selectBox.currentBox = {x: toPt.x, y: toPt.y, w: 0, h: 0};
			// Assume sorted by z order, => search from back of list forward to find first selectable item under a point
			_clearSelection();
			_enumeratePartsRev(function (part) {
				if (Utils.pointInBox(toPt, _rectFromPart(part))) {
					// satisfied
					// Highlight via tint, if not selected, set to red, if selected, clear to white
					_selectPart(part);
					return true;
				}
				return false;
			});
		}
	};
	/**
	 * select top item touching point
	 * @param {object} pixelPt - x, y in pixels to look for item
	 * @returns {boolean} - true if we selected one
	 * @private
	 */
	var _selectAtPoint = function _selectAtPoint (pixelPt) {
		pixelPt = _snapToGrid(pixelPt.x, pixelPt.y);
		// Assume sorted by z order, => search from back of list forward to find first selectable item under a point
		_clearSelection();
		// _enumeratePartsRev returns false if a valid selection is made so reverse bool on return
		return !_enumeratePartsRev(function (part) {
			if (Utils.pointInBox(pixelPt, _rectFromPart(part))) {
				// satisfied
				// Highlight via tint, if not selected, set to red, if selected, clear to white
				_selectPart(part);
				return true;
			}
			return false;
		});
	};
	/**
	 * handles mouse up after selection box
	 * @private
	 */
	var _finishMoveSelection = function _finishMoveSelection () {
		if (!_isSame(_mouseDownPt, _mouseUpPt)) {
			let dx = (_mouseUpPt.x - _mouseDownPt.x) * _scalePixelToReal;
			let dy = (_mouseUpPt.y - _mouseDownPt.y) * _scalePixelToReal;
			// clear _selectedBox so we can rebuild the selectedBox with the moved parts
			_selectedBox = null;
			_enumerateSelection(function (part) {
				part.layoutPart.moveMe(dx, dy);
				part.x = part.layoutPart.locus.x * _scaleRealToPixel;
				part.y = part.layoutPart.locus.y * _scaleRealToPixel;
				// Rebuild the selectedBox with the moved parts
				_selectedBox = Utils.boxUnionBox(_selectedBox, {x: part.x, y: part.y, w: part.width, h: part.height});
				return false;
			});
			_undoStack.pushUnmove(_selected, dx, dy);
		}
	};

	/**
	 * _finishSelectBoxPublic function - public for callback from outside.  Uses local mouse locations
	 */
	var _finishSelectBoxPublic = function _finishSelectBoxPublic() {
		_finishSelectBox(_mouseDownPt, _mouseUpPt);
	};
	/**
	 * Enumerates the current selection copies onto _copyBuffer for paste.  Undo is enabled to erase the copy
	 * @private
	 */
	var _copySelection = function _copySelection () {
		_copyBuffer = [];
		_enumerateSelection(function (part) {
			_copyBuffer.push(part.layoutPart.copyMe());
			return false;
		});
		_undoStack.pushUncopy();
	};
	/**
	 * Pastes anything in the _copyBuffer.  Undo is enable to delete any pasted items on undo
	 * @private
	 */
	var _pasteCopy = function _pasteCopy () {
		_clearSelection();
		for (var i=0, len=_copyBuffer.length; i < len; ++i) {
			let layoutPart = _copyBuffer[i];
			var pixiTexture = PIXI.Texture.fromImage(layoutPart.imageUrl);
			var sprite = new PIXI.Sprite(pixiTexture);
			sprite.width = layoutPart.width * _scaleRealToPixel;
			sprite.height = layoutPart.height * _scaleRealToPixel;
			sprite.x = layoutPart.locus.x * _scaleRealToPixel;
			sprite.y = layoutPart.locus.y * _scaleRealToPixel;
			sprite.z = layoutPart.locus.z;
			layoutPart.sprite = sprite;
			sprite.layoutPart = layoutPart;
			_parts.addChild(sprite);
			_selectPart(sprite);
		}
		_undoStack.pushUnpaste(_selected);
	};

	var _mouseSprite = null;
	var _mouseMask = null;
	var _unitW = 50;
	/**
	 * Computes the center point of a part
	 * @param {object} pixelPt - pixel x, y
	 * @returns {{}} - computed center point
	 * @private
	 */
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
		console.log('mouseup: : x' + _mouseUpPt.x + ', y: ' + _mouseUpPt.y);
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
	 * @param {object} layoutPart - This should be common across all instances of this part
	 * @param {number} xPixel - x position in pixels
	 * @param {number} yPixel - y position in pixels
	 * @param {number} rotation - clockwise rotation in degrees
	 * @return {LayoutPart} -
	 * @private
	 */
	var _createLayoutPart = function _createLayoutPart(layoutPart, xPixel, yPixel, rotation) {
		var pixiTexture = PIXI.Texture.fromImage(layoutPart.imageUrl);
		var sprite = new PIXI.Sprite(pixiTexture);
		sprite.width = layoutPart.width * _scaleRealToPixel;
		sprite.height = layoutPart.height * _scaleRealToPixel;
		sprite.x = layoutPart.locus.x * _scaleRealToPixel;
		sprite.y = layoutPart.locus.y * _scaleRealToPixel;
		sprite.z = layoutPart.locus.z;
		layoutPart.sprite = sprite;
		sprite.layoutPart = layoutPart;
		_parts.addChild(sprite);
		_clearSelection();
		_selectPart(sprite);
		return layoutPart;
	};

	/**
	 * Helper for sorting parts when arranging them
	 * @param a
	 * @param b
	 * @returns {number}
	 */
	function depthCompare(a,b) {
		if (a.z < b.z)
			return -1;
		if (a.z > b.z)
			return 1;
		return 0;
	}

	/**
	 * Helper function for frequent activity computing a part's rect
	 * @param {object} part - PIXI.Sprite representation of the part
	 * @returns {{x: (number|*), y: (number|*), w: *, h: *}}
	 * @private
	 */
	var _rectFromPart = function _rectFromPart (part) {
		let ul = _snapToGrid(part.position.x, part.position.y);
		return {x: ul.x, y: ul.y, w: part.width, h: part.height};
	};
	
	// arranging parts in front to back order
	var _enableTestArrangement = false;
	/**
	 * Blink the parts list in order to allow debugging arrangement functions
	 * @private
	 */
	var _testArrangement = function _testArrangement () {
		if (_enableTestArrangement) {
			var current = 0;
			if (current < _parts.children.length) {
				var nextFn = function () {
					if (current < _parts.children.length) {
						_blinkPart(_parts.children[current++], 0x00FF00, 500, nextFn)
					}
				};
				_blinkPart(_parts.children[current++], 0x00FF00, 500, nextFn);
			}
		}
	};
	/**
	 * Tests for valid selection and if found moves it to the front of all items occluding that selection
	 * @private
	 */
	var _moveToFront = function _moveToFront () {
		// Must be a valid single selected item
		if (_selected.length === 1) {
			var targetPart = _selected[0];
			var targetRect = _rectFromPart(targetPart);
			var itemsNotTarget = [];
			_enumeratePartsExcludePartRev(function (part) {
				// examine everything except targetPart 
				if (Utils.boxIntersectBox(_rectFromPart(part), targetRect)) {
					// satisfied, store it
					itemsNotTarget.push(part);
				}
				return false;
			}, targetPart);
			if (itemsNotTarget.length > 0) {
				// Find highest z-order
				var maxZ = -10000;
				for (var i=0, len=itemsNotTarget.length; i < len; ++i) {
					maxZ = (maxZ > itemsNotTarget[i].z) ? maxZ : itemsNotTarget[i].z;
				}
				// store into layout part as well
				targetPart.layoutPart.locus.z = targetPart.z = (maxZ + 1);
				// sort
				_parts.children.sort(depthCompare);
				_testArrangement();
			}
		}
		else {
			_blink(0xFF0000, ArrangeErrorMsg);
		}
	};
	/**
	 * Tests for valid selection and if found moves it to the back of all items occluding that selection
	 * @private
	 */
	var _moveToBack = function _moveToBack () {
		if (_selected.length === 1) {
			let targetPart = _selected[0];
			let targetRect = _rectFromPart(targetPart);
			let itemsNotTarget = [];
			_enumeratePartsExcludePartRev(function (part) {
				// examine everything except targetPart 
				if (Utils.boxIntersectBox(_rectFromPart(part), targetRect)) {
					// satisfied, store it
					itemsNotTarget.push(part);
				}
				return false;
			}, targetPart);
			if (itemsNotTarget.length > 0) {
				// Find highest z-order
				let minZ = 10000;
				for (var i=0, len=itemsNotTarget.length; i < len; ++i) {
					minZ = (minZ < itemsNotTarget[i].z) ? minZ : itemsNotTarget[i].z;
				}
				// store into layout part as well
				targetPart.layoutPart.locus.z = targetPart.z = (minZ - 1);
				// sort
				_parts.children.sort(depthCompare);
				_testArrangement();
			}
		}
		else {
			_blink(0xFF0000, ArrangeErrorMsg);
		}
	};
	/**
	 * Tests for valid selection and if found moves it in front of any item immediately occluding that selection
	 * @private
	 */
	var _moveForward = function _moveForward () {
		if (_selected.length === 1) {
			let targetPart = _selected[0];
			let targetRect = _rectFromPart(targetPart);
			// Since the parts list order of occurrence => z-order, we impose an arbitrary
			// z-order on the items as they are scanned.
			let z_order = 0;
			let itemsNotTarget = [];
			_enumeratePartsFwd(function (part) {
				// save and order everything involved in the targetRect 
				if (part !== targetPart && Utils.boxIntersectBox(_rectFromPart(part), targetRect)) {
					// satisfied, store it
					part.z = z_order;
					part.layoutPart.locus.z = z_order;
					++z_order;
					itemsNotTarget.push(part);
				}
				else if (part === targetPart) {
					part.z = z_order;
					part.layoutPart.locus.z = z_order;
					++z_order;
				}
				return false;
			});
			// The above ordering => the code below can assume valid, non-identical z-order sorted list
			if (itemsNotTarget.length > 0) {
				// find the item we are immediately behind (<) and move in front with z value and re-sort
				// there is a possibility that all items have the same z order.
				let stopZ = targetPart.z;
				for (var i=0, len=itemsNotTarget.length; i < len; ++i) {
					if (itemsNotTarget[i].z > stopZ) {
						targetPart.z = itemsNotTarget[i].z;
						targetPart.layoutPart.locus.z = targetPart.z;
						itemsNotTarget[i].z = stopZ;
						itemsNotTarget[i].layoutPart.locus.z = itemsNotTarget[i].z;
						break;
					}
				}
				// sort
				_parts.children.sort(depthCompare);
				_testArrangement();

			}
		}
		else {
			_blink(0xFF0000, ArrangeErrorMsg);
		}
	};
	/**
	 * Tests for valid selection and if found moves it behind any item occluded by that selection
	 * @private
	 */
	var _moveBackward = function _moveBackward () {
		if (_selected.length === 1) {
			let targetPart = _selected[0];
			let targetRect = _rectFromPart(targetPart);
			// Since the parts list order of occurrence => z-order, we impose an arbitrary
			// z-order on the items as they are scanned.
			let z_order = 0;
			let itemsNotTarget = [];
			_enumeratePartsFwd(function (part) {
				// save and order everything involved in the targetRect 
				if (part !== targetPart && Utils.boxIntersectBox(_rectFromPart(part), targetRect)) {
					// satisfied, store it
					part.z = z_order;
					part.layoutPart.locus.z = z_order;
					++z_order;
					itemsNotTarget.push(part);
				}
				else if (part === targetPart) {
					part.z = z_order;
					part.layoutPart.locus.z = z_order;
					++z_order;
				}
				return false;
			});
			// The above ordering => the code below can assume valid, non-identical z-order sorted list
			if (itemsNotTarget.length > 0) {
				if (itemsNotTarget.length > 1) {
					itemsNotTarget.sort(depthCompare);
				}
				// find the item we are immediately before (<) and move behind with z value and resort
				let stopZ = targetPart.z;
				// iterate end to start of itemsNotTarget array
				for (var len=itemsNotTarget.length, i=len-1; i >= 0; --i) {
					if (itemsNotTarget[i].z < stopZ) {
						targetPart.z = itemsNotTarget[i].z;
						targetPart.layoutPart.locus.z = targetPart.z;
						itemsNotTarget[i].z = stopZ;
						itemsNotTarget[i].layoutPart.locus.z = itemsNotTarget[i].z;
						break;
					}
				}
				// sort
				_parts.children.sort(depthCompare);
				_testArrangement();

			}
		}
		else {
			_blink(0xFF0000, ArrangeErrorMsg);
		}
	};
	/**
	 * Deletes items in _selected.  undoState controls whether we push an undo for this
	 * @param undoState
	 * @private
	 */
	var _deleteItems = function _deleteItems (undoState) {
		let enableUndo = (undoState || UndoState.Enable) === UndoState.Enable;
		if (_selected.length >= 1) {
			_enumerateSelection(function (part) {
				part.tint = 0xFFFFFF;
				part.alpha = 1.0;
				_parts.removeChild(part);
				return false;
			});
			if (enableUndo) {
				_undoStack.pushUndelete(_selected);
			}
			_selected = [];
			Session.set(Constants.layoutSelection, 0)
		}
		else {
			_blink(0xFF0000, DeleteErrorMsg);
		}
	};
	/**
	 * Exposes popUndoStack from the plugin
	 * @private
	 */
    var _undoLastAction = function _undoLastAction () {
        _undoStack.popUndoStack();
    };
	/**
	 * Exposes enumeration of all parts from the plugin
	 * @param callback
	 * @private
	 */
	var _enumerateLayoutParts = function _enumerateLayoutParts (callback) {
		_enumeratePartsFwd(function (part) {
			return callback(part.layoutPart);
		});
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
				case FitType.FitTypeXY:
					bestFit = Utils.computeLayoutFrame(dims.width, dims.length, pixiRenderWidth, pixiRenderHeight);
					// center layout frame in renderer
					x = (pixiRenderWidth - bestFit.widthPixels) / 2;
					y = (pixiRenderHeight - bestFit.lengthPixels) / 2;
					break;
				case FitType.FitTypeX:
					bestFit.lengthPixels = (dims.length * pixiRenderWidth) / dims.width;
					// center layout frame in renderer
					y = (pixiRenderHeight - lengthPixels) / 2;
					break;
				case FitType.FitTypeY:
					bestFit.widthPixels = (dims.width * pixiRenderHeight) / dims.length;
					// center layout frame in renderer
					x = (pixiRenderWidth - widthPixels) / 2;
					break;
				default :
					// error, no effect
					break;
				}
				_updateScale(bestFit.lengthPixels, dims.length);
				_modifyRectangle(self.layoutFrame, x, y, bestFit.widthPixels, bestFit.lengthPixels, 4);
			}
			else {
				// really an error since there is no renderer but just in case we get invoked too soon noop this
				//_modifyRectangle(self.layoutFrame, 0, 0, (border.width === 200) ? 100 : 200, 300, 4);
			}
		};
		var _updateScale = function _updateScale (lengthPixels, lengthMeters) {
			_scaleRealToPixel = lengthPixels / lengthMeters;
			_scalePixelToReal = 1.0 / _scaleRealToPixel;
			// Have to adjust all sprites pixel positions
			_enumeratePartsFwd(function (part) {
				part.x = part.layoutPart.locus.x * _scaleRealToPixel;
				part.y = part.layoutPart.locus.y * _scaleRealToPixel;
				part.width = part.layoutPart.width * _scaleRealToPixel;
				part.height = part.layoutPart.height * _scaleRealToPixel;
			});
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
		getScalePixelToReal: _getScalePixelToReal,
		isValid: _isValid,
		enumerateLayoutParts: _enumerateLayoutParts,
		createLayout: _createLayout,
		destroyLayout: _destroyLayout,
		resizeLayout: _resizeLayout,
		startAnimation: _startAnimation,
		enableAnimation: _enableAnimation,
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
		finishMoveSelection: _finishMoveSelection,
		copySelection: _copySelection,
		pasteCopy: _pasteCopy,
		finishSelectBox: _finishSelectBoxPublic,
		validSelection: _validSelection,
		clearSelection: _clearSelection,
		getSelectedPart: _getSelectedPart,
		ptOnSelection: _ptOnSelection,
		selectAtPoint: _selectAtPoint,
		moveToFront: _moveToFront,
		moveToBack: _moveToBack,
		moveForward: _moveForward,
		moveBackward: _moveBackward,
		deleteItems: _deleteItems,
        undoLastAction: _undoLastAction,
		addTestItem: _addTestItem
	};
})();

Meteor.startup(function () {
	LayoutManager.setPluginRenderer(PixiLayout);
});