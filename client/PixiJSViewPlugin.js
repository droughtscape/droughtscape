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
// Use PixiLayout closure to hide stuff and to allow module wide variables
PixiLayout = (function () {
	const ArrangeErrorMsg = 'Please select item and try again';
	const DeleteErrorMsg = 'Please select item(s) and try again';
	// classes grouping functionality
	var _plugin = null;
	var _layoutFrame = null;
	var _mouseMgr = null;
	var _selectionMgr = null;
    var _partsMgr;
	
	// module wide values
	var _currentAbstractPart = null;
	var _unitW = 50;
	var _scaleRealToPixel;
	var _scalePixelToReal;
	/**
	 * Dispatch within setTimeout to avoid any dispatch within a dispatch issues
	 * @param {string} target - label of the dispatch destination
	 * @param {*} message - event data
	 * @private
	 */
	var _safeDispatch = function _safeDispatch (target, message) {
		setTimeout(function () {
			Dispatcher.dispatch(target, message);
		});
	};
	/**
	 * Helper to scale a pixel point (x, y) to real
	 * @param {object} pixelPt
	 * @returns {{x: number, y: number}}
	 * @private
	 */
	var _scalePixelPtToRealPt = function _scalePixelPtToRealPt (pixelPt) {
		return {x: pixelPt.x * _scalePixelToReal, y: pixelPt.y * _scalePixelToReal};
	};
	/**
	 * Helper to scale a real point (x, y) to pixel
	 * @param realPt
	 * @returns {{x: number, y: number}}
	 * @private
	 */
	var _scaleRealPtToPixelPt = function _scaleRealPtToPixelPt (realPt) {
		return {x: realPt.x * _scaleRealToPixel, y: realPt.y * _scaleRealToPixel};
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
	 * Helper function for frequent activity computing a part's rect
	 * @param {object} part - PIXI.Sprite representation of the part
	 * @returns {{x: (number|*), y: (number|*), w: *, h: *}}
	 * @private
	 */
	var _rectFromPart = function _rectFromPart (part) {
		let ul = _layoutFrame.snapToGrid(part.position);
		//console.log('_rectFromPart: ' + ul.x + ', ' + ul.y + ' : ' + part.width + ', ' + part.height);
		return {x: ul.x, y: ul.y, w: part.width, h: part.height};
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

		copyMe () {
			let copy = new LayoutPart(this.abstractPart,
				this.locus.x,
				this.locus.y,
				this.locus.z,
				this.locus.rotation);
			copy.locus.x = this.locus.x;
			copy.locus.y = this.locus.y;
			return copy;
		}

		moveMe (dx, dy) {
			this.locus.x += dx;
			this.locus.y += dy;
		}
	};
	
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
				_partsMgr.parts.addChild(this.deletedItems[i]);
			}
			_partsMgr.parts.children.sort(depthCompare);
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

		/**
		 * Undo any move motion
		 */
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

		/**
		 * Since copy does not affect the visual field and just copies parts to a buffer, just clear the buffer
		 */
		undoMe () {
			_partsMgr.copyBuffer = [];
		}
	}
	class UndoPaste extends UndoItem {
		constructor (items) {
			super(UndoType.Unpaste);
			this.pasteItems = items.slice();
		}

		/**
		 * Create a selection of the pasted items and delete them
		 */
		undoMe () {
			// create a clean selected list of the pasteItems and then delete them with _delete's undo disabled
			_selectionMgr.clearSelection();
			for (var i=0, len=this.pasteItems.length; i < len; ++i) {
				_selectionMgr.selectPart(this.pasteItems[i]);
			}
			_partsMgr.deleteItems(UndoState.Disable);
		}
	}
	class UndoStack {
		constructor () {
			this.maxUndoActions = 100;
			this.undoStack = [];
		}

		/**
		 * Push a list of items to undelete onto the undoStack
		 * @param {object} items
		 */
		pushUndelete (items) {
			this.undoStack.push(new UndoDeleteItem(items));
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}

		/**
		 * Push a list of items to unmove as well as the dx, dy to revert
		 * @param {object} items
		 * @param {number} dx
		 * @param {number} dy
		 */
		pushUnmove (items, dx, dy) {
			this.undoStack.push(new UndoMoveItem(items, dx, dy, _scaleRealToPixel));
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}

		/**
		 * push UndoCopySelection action
		 */
		pushUncopy () {
			this.undoStack.push(new UndoCopySelection());
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}

		/**
		 * Push items to unpaste
		 * @param {object} items
		 */
		pushUnpaste (items) {
			this.undoStack.push(new UndoPaste(items));
			if (this.undoStack.length > this.maxUndoActions) {
				// trim array, discarding oldest event this.undoStack[0]
				this.undoStack.slice(1);
			}
		}

		/**
		 * clear the undoStack
		 */
		clearUndoStack () {
			this.undoStack = [];
		}

		/**
		 * pop the undoStack and "undo" the item
		 */
		popUndoStack () {
			if (this.undoStack.length > 0) {
				let undoItem = this.undoStack.pop();
				undoItem.undoMe();
			}
			else {
				LayoutFrame.blink(0xFF0000, 'Nothing to undo');
			}
		}
	}
	var _undoStack = new UndoStack();

	MouseMgr = class MouseMgr {
		constructor () {
			this.mouseMode = MouseMode.Select;
			this.currentMoveState = false;
			this.mouseSprite = null;
		}

		/**
		 * Sets the appropriate handlers based on mouseMode
		 * @param {MouseMode} mouseMode
		 */
		setMouseMode (mouseMode) {
			this.mouseMode = mouseMode;
			let targetEnterHandler = null,
				targetLeaveHandler = null,
				targetDnHandler = null,
				targetUpHandler = null,
				targetMvHandler = null;
			// fat arrow (=>) function syntax to ensure bind correct this
			switch (mouseMode) {
			default:
			case MouseMode.Select:
				targetDnHandler = (pixelPt) => this.mouseDnSelectHandler(pixelPt);
				targetUpHandler = (pixelPt) => this.mouseUpSelectHandler(pixelPt);
				targetMvHandler = (pixelPt) => this.mouseMvSelectHandler(pixelPt);
				break;
			case MouseMode.Create:
				targetEnterHandler = (pixelPt) => this.mouseEnterCreateHandler(pixelPt);
				targetLeaveHandler = () => this.mouseLeaveCreateHandler();
				targetUpHandler = (pixelPt) => this.mouseUpCreateHandler(pixelPt);
				break;
			case MouseMode.Move:
				targetMvHandler = (pixelPt) => this.mouseMvMoveHandler(pixelPt);
				targetUpHandler = (pixelPt) => this.mouseUpMoveHandler(pixelPt);
				break;
			}
			this.mouseDnHandler = targetDnHandler;
			this.mouseUpHandler = targetUpHandler;
			this.mouseMvHandler = null;
			this.mouseEnterHandler = targetEnterHandler;
			this.mouseLeaveHandler = targetLeaveHandler;
			
		}
		/**
		 * computeRelativeMouseLocation function - returns point location relative to background by
		 *   computing offset point from background to _pixiRenderer
		 * @param {object} absPt - object, point {x, y} - location relative to _pixiRenderer
		 * @return {object} - point relative to background, valid if within the background
		 */
		computeRelativeMouseLocation(absPt) {
			let point = {x: absPt.x - _plugin.pixiRenderer.bgndOffX, y: absPt.y - _plugin.pixiRenderer.bgndOffY, valid: true};
			point.valid = (point.x <= _layoutFrame.background.width) && (point.y <= _layoutFrame.background.height) &&
				(point.x >= 0) && (point.y >= 0);
			return point;
		}
		/**
		 * mouseDown function - callback from PIXI.InteractiveManager on mouse button down
		 * @param {object} interactionData - object, contains current point relative to render surface
		 */
		mouseDown(interactionData) {
			let mouseDnPt = this.computeRelativeMouseLocation(interactionData.data.global);
			this.mouseDnPt = _layoutFrame.snapToGrid(mouseDnPt);
			//console.log('_mouseDown: ' + currentMouseLoc.x + ', ' + currentMouseLoc.y);
			if (this.mouseDnHandler) {
				this.mouseDnHandler(this.mouseDnPt);
			}
		}
		/**
		 * mouseUp function - callback from PIXI.InteractiveManager on mouse button up
		 * @param {object} interactionData - object, contains current point relative to render surface
		 */
		mouseUp(interactionData) {
			let mouseUpPt = this.computeRelativeMouseLocation(interactionData.data.global);
			this.mouseUpPt = _layoutFrame.snapToGrid(mouseUpPt);
			//console.log('console: ' + mouseUpPt);
			if (this.mouseUpHandler) {
				this.mouseUpHandler(this.mouseUpPt);
			}
			console.log('mouseup: : x' + mouseUpPt.x + ', y: ' + mouseUpPt.y);
		}
		/**
		 * mouseMove function - callback from PIXI.InteractiveManager on mouse motion
		 * @param {object} interactionData - object, contains current point relative to render surface
		 */
		mouseMove(interactionData) {
			// Rule out Infinity which seems to be a PIXI bug if mouse move is active
			// and then we move out to a different window and then back into this one.
			// Even though we reset the mouse handlers, there seems to be some state bug.
			if (interactionData.data.global.x !== Infinity) {
				let {x, y, valid} = this.computeRelativeMouseLocation(interactionData.data.global);
				this.mouseMvPt = _layoutFrame.snapToGrid({x: x, y: y});
				//console.log('mouseMove: ' + this.mouseMvPt.x + ', ' + this.mouseMvPt.y + 
				//	' : ' + this.mouseMvPt.x * _scalePixelToReal + ', ' + this.mouseMvPt.y * _scalePixelToReal + ' : valid: ' + valid);

				// Try to detect mouseover, mouseout
				if (this.currentMoveState) {
					// The last state was inside
					if (!valid) {
						//console.log('_mouseMove: LEAVE');
						// We just moved out, fire handler, set _currentMoveState to out
						if (this.mouseLeaveHandler) {
							this.mouseLeaveHandler();
						}
						this.currentMoveState = valid;
					}
				}
				else {
					// The last state was outside
					if (valid) {
						//console.log('_mouseMove: ENTER');
						// We just moved in, fire handler, set _currentMoveState to in
						if (this.mouseEnterHandler) {
							this.mouseEnterHandler(this.mouseMvPt);
						}
						this.currentMoveState = valid;
					}
				}

				if (this.mouseMvHandler) {
					this.mouseMvHandler(this.mouseDnPt, this.mouseMvPt);
				}
			}
		}
		// Mouse handlers
		/**
		 * Handle all mouse button down events
		 * @param {object} pixelPt
		 */
		mouseDnSelectHandler (pixelPt) {
			if (_selectionMgr.validSelection() > 0) {
				if (_selectionMgr.ptOnSelection(pixelPt)) {
					console.log('ptOnSelection is TRUE');
					this.mouseMvHandler = (pixelPt) => this.mouseMvMoveHandler(pixelPt);
					this.mouseUpHandler = (pixelPt) => this.mouseUpMoveHandler(pixelPt);
					_selectionMgr.enableSelectBox(false);
				}
				else {
					if (_selectionMgr.selectAtPoint(pixelPt)) {
						// We have something selected
						this.mouseMvHandler = (pixelPt) => this.mouseMvMoveHandler(pixelPt);
						this.mouseUpHandler = (pixelPt) => this.mouseUpMoveHandler(pixelPt);
						_selectionMgr.enableSelectBox(false);
					}
					else {
						// Nothing under the selection
						this.mouseMvHandler = (pixelPt) => this.mouseMvSelectHandler(pixelPt);
						this.mouseUpHandler = (pixelPt) => this.mouseUpSelectHandler(pixelPt);
						_selectionMgr.enableSelectBox(true);
					}
				}
			}
			else {
				if (_selectionMgr.selectAtPoint(pixelPt)) {
					// We have something selected
					this.mouseMvHandler = (pixelPt) => this.mouseMvMoveHandler(pixelPt);
					this.mouseUpHandler = (pixelPt) => this.mouseUpMoveHandler(pixelPt);
					_selectionMgr.enableSelectBox(false);
				}
				else {
					// Nothing under the selection
					this.mouseMvHandler = (pixelPt) => this.mouseMvSelectHandler(pixelPt);
					this.mouseUpHandler = (pixelPt) => this.mouseUpSelectHandler(pixelPt);
					_selectionMgr.enableSelectBox(true);
				}
			}
		}

		/**
		 * Handles mouse move selection events
		 * @param {object} pixelPt
		 */
		mouseMvSelectHandler (pixelPt) {
			_selectionMgr.setSelectBox(this.mouseDnPt, this.mouseMvPt);
			_selectionMgr.drawSelectBox();
		}

		/**
		 * Handles mouse up selection events
		 * @param {object} pixelPt
		 */
		mouseUpSelectHandler (pixelPt) {
			this.mouseMvHandler = null;
			_selectionMgr.finishSelectBox(this.mouseDnPt, this.mouseUpPt);
		}

		/**
		 * Empty handler for move mouse move events.  May be used later if we drag an image of the selection
		 * @param {object} pixelPt
		 */
		mouseMvMoveHandler (pixelPt) {}

		/**
		 * Handles mouse move create events.  Primarily drags the mouse sprite
		 * @param {*} noop
		 * @param {object} pixelPt
		 */
		mouseMvCreateHandler (noop, pixelPt) {
			this.moveMouseSprite(pixelPt);
		}

		/**
		 * Handle mouse entry create event.
		 * On entry to the mouse tracked surface, create the sprite image of the item we will create
		 * @param {object} pixelPt
		 */
		mouseEnterCreateHandler (pixelPt) {
			this.mouseMvHandler = (noop, pixelPt) => this.mouseMvCreateHandler(noop, pixelPt);
			this.enableMouseSprite(true, pixelPt, _currentAbstractPart);
		}

		/**
		 * Handle mouse exit create event
		 * Clear state on exit 
		 */
		mouseLeaveCreateHandler () {
			this.mouseMvHandler = null;
			this.enableMouseSprite(false);
		}

		/**
		 * Handle mouse up create event.  Creates a layout part at pixelPt
		 * @param {object} pixelPt - pixel location to create the layout part
		 */
		mouseUpCreateHandler (pixelPt) {
			if (this.isMouseUpDnSame() && _currentAbstractPart) {
				var scalePixelToReal = _scalePixelToReal;
				_partsMgr.createLayoutPart(new LayoutPart(_currentAbstractPart, pixelPt.x * scalePixelToReal, pixelPt.y * scalePixelToReal),
					pixelPt.x, pixelPt.y);
			}
		}

		/**
		 * Handle mouse up move event.  Moves the selected set of parts to pixelPt
		 * @param {object} pixelPt - pixel location to finish the move at
		 */
		mouseUpMoveHandler (pixelPt) {
			this.mouseMvHandler = null;
			_selectionMgr.finishMoveSelection(this.mouseDnPt, this.mouseUpPt);
		}
		// Mouse utils
		/**
		 * Determine if mouse dn/up is on the same location
		 * @returns {boolean}
		 */
		isMouseUpDnSame () {
			return _isSame(this.mouseDnPt, this.mouseUpPt);
		}
		/**
		 * enableMouseSprite function - enable/disable the graphic cursor sprite.  Used to avoid any
		 * timing issues when switching between windows
		 * @param {boolean} enable - true to turn on, false to turn off..
		 * @param {object} pixelPt - mandatory if enable is true
		 * @param {object} abstractPart - the part we have selected to create, currently of type TestAbstractPart
		 */
		enableMouseSprite (enable, pixelPt, abstractPart) {
			let selectBox = _layoutFrame.selectBox;
			selectBox.visible = enable;
			// _unitW is currently 50, height of mouse sprite is relative to the ratio of w:h in the abstractPart.  
			if (enable) {
				if (!this.mouseSprite) {
					var url = abstractPart.url;
					this.mouseSprite = PIXI.Sprite.fromImage(url);
					this.mouseSprite.width = _unitW;
					this.mouseSprite.height = (_unitW * abstractPart.height) / abstractPart.width;
					// Center the sprite
					this.mouseSprite.position = this.computeCenterPt(pixelPt);
					// For rectangular masking, just adjust the height and compute center point
					// For ellipse, center point is computed identically but we have to make a mask
					if (abstractPart.footprint === LayoutFootprintType.ellipse) {
						// have to mask
						this.mouseMask = new PIXI.Graphics();
						this.mouseMask.beginFill();
						this.mouseMask.drawEllipse(this.mouseSprite.width / 2, this.mouseSprite.height.y / 2, this.mouseSprite.width, this.mouseSprite.height);
						this.mouseMask.endFill();
						this.mouseMask.position.x = this.mouseSprite.position.x;
						this.mouseMask.position.y = this.mouseSprite.position.y;

						selectBox.addChild(this.mouseMask);
						this.mouseSprite.mask = this.mouseMask;
					}
					else {
						this.mouseMask = null;
						this.mouseSprite.mask = null;
					}
					selectBox.addChild(this.mouseSprite);
				}
			}
			else {
				if (this.mouseSprite) {
					// Remove from the 
					selectBox.removeChild(this.mouseSprite);
					this.mouseSprite = null;
				}
			}
		}
		/**
		 * moveMouseSprite function - Set xy loc of sprite to pixelPt
		 * @param {object} pixelPt - location to place sprite if active
		 */
		moveMouseSprite (pixelPt) {
			if (_layoutFrame.selectBox.visible && this.mouseSprite) {
				// Center the sprite
				this.mouseSprite.position = this.computeCenterPt(pixelPt);
				if (this.mouseMask) {
					this.mouseMask.position.x = this.mouseSprite.position.x;
					this.mouseMask.position.y = this.mouseSprite.position.y;
				}
			}
		}

		/**
		 * compute the center point of the mouse sprite
		 * @param {object} pixelPt - mouse pointer upper left
		 * @returns {object}
		 */
		computeCenterPt (pixelPt) {
			let centerPt = {};
			centerPt.x = pixelPt.x - (_unitW / 2);
			centerPt.y = pixelPt.y - (this.mouseSprite.height / 2);
			return centerPt;
		}
	};
	/**
	 * Manage selections
	 */
	SelectionMgr = class SelectionMgr {
		constructor () {
			this.selectedBox = null;
			this.selected = [];
		}

		/**
		 * Return length of this.selected.  Allows it to be used as a boolean test as well as looking at the length
		 * @returns {*}
		 */
		validSelection () {
			return this.selected.length;
		}
		/**
		 * resets tinting on any selected part
		 * clears the selected list
		 */
		clearSelection () {
			let selected = this.selected;
			for (var i=0, len=selected.length; i < len; ++i) {
				selected[i].tint = 0xFFFFFF;
				selected[i].alpha = 1.0;
			}
			this.selected = [];
			this.selectedBox = null;
			Session.set(Constants.layoutSelection, 0);
			// decouple to avoid dispatch in dispatch
			_safeDispatch('layout', new Message.ActionNotifySelectedPart(null));
		}

		/**
		 *
		 * @param {object} pt - {x, y}
		 * @returns {boolean|*} - true if pt is on the box covering the entire selection
		 */
		ptOnSelection (pt) {
			// Heads up, this.selectedBox can be null
			return (this.selectedBox === null) ? false : Utils.pointInBox(pt, this.selectedBox);
		}
        /**
         * Manages the selected array as well as tinting any selected part
         * @param {object} part
         */
        selectPart (part) {
            // if already in _selectList, remove it
			let selected = this.selected;
            var index = selected.indexOf(part);
            if (index > -1) {
                // already in array, clear tint and remove
                part.tint = 0xFFFFFF;
                part.alpha = 1.0;
				selected.splice(index, 1);
            }
            else {
                // push onto selected, set tint
				this.selected.push(part);
                this.selectedBox = Utils.boxUnionBox(this.selectedBox, {x: part.x, y: part.y, w: part.width, h: part.height});
                part.tint = 0xFF0000;
                part.alpha = 0.5;
                Session.set(Constants.layoutSelection, selected.length);
            }
			_safeDispatch('layout', new Message.ActionNotifySelectedPart((selected.length === 1)? selected[0].layoutPart : null));
		}
		/**
		 * select top item touching point
		 * @param {object} pixelPt - x, y in pixels to look for item
		 * @returns {boolean} - true if we selected one
		 */
		selectAtPoint (pixelPt) {
			pixelPt = _layoutFrame.snapToGrid(pixelPt);
			// Assume sorted by z order, => search from back of list forward to find first selectable item under a point
			this.clearSelection();
			// enumeratePartsRev returns false if a valid selection is made so reverse bool on return
			//let fn = (part) => this.selectPart(part);
			return !_partsMgr.enumeratePartsRev((part) => {
				if (Utils.pointInBox(pixelPt, _rectFromPart(part))) {
					// satisfied
					// Highlight via tint, if not selected, set to red, if selected, clear to white
					this.selectPart(part);
					return true;
				}
				return false;
			});
		}
		/**
		 * enableSelectBox function - enable/disable the graphic _selectBox.  Used to avoid any
		 * timing issues when switching between windows
		 * @param {boolean} enable - true to turn on, false to turn off..
		 */
		enableSelectBox (enable) {
			let selectBox = _layoutFrame.selectBox;
			selectBox.visible = enable;
			selectBox.clear();
			//_selectBox.startSelect = mouseDnPt;
			//console.log('_mouseDown: x: ' + selectBox.startSelect.x + ', y: ' + selectBox.startSelect.y + 
			//	', background.x: ' + background.innerX + ', background.y: ' + background.innerY);
			selectBox.currentBox = null;
		}

		/**
		 * Sets the select start and end point into the selectBox
		 * Also stores real world coordinates so we can rescale the pixel ones as our scale changes
		 * @param startPixelPt
		 * @param endPixelPt
		 */
		setSelectBox (startPixelPt, endPixelPt) {
			let selectBox = _layoutFrame.selectBox;
			selectBox.startPixelPt = startPixelPt;
			selectBox.endPixelPt = endPixelPt;
			selectBox.startRealPt = _scalePixelPtToRealPt(startPixelPt);
			selectBox.endRealPt = _scalePixelPtToRealPt(endPixelPt);
		}
		/**
		 * drawSelectBox function - if in select mode, clear and redraw selection box if toPt != fromPt
		 * Gets the stored points from selectBox.startPixelPt, selectBox.endPixelPt
		 *   => setSelectBox must be called 
		 * @param {object} fromPt - x, y location we were at
		 * @param {object} toPt - x, y location we are now at
		 */
		drawSelectBox() {
			let selectBox = _layoutFrame.selectBox;
			let fromPt = selectBox.startPixelPt,
				toPt = selectBox.endPixelPt;
			if (selectBox.visible) {
				selectBox.clear();
				if (!_isSame(fromPt, toPt)) {
					// Clear last box
					// Draw outline of final box
					selectBox.currentBox = _computeRect(fromPt, toPt);
					selectBox.beginFill(0xFF0000, 0.5);
					selectBox.drawRect(selectBox.currentBox.x, selectBox.currentBox.y, selectBox.currentBox.w, selectBox.currentBox.h);
					selectBox.endFill();
				}
				else {
					selectBox.beginFill(0xFF0000, 0.5);
					toPt = _layoutFrame.snapToGrid(toPt);
					selectBox.drawCircle(toPt.x, toPt.y, 3);
					selectBox.endFill();
				}
			}
		}
		/**
		 * finishSelectBox function - draws final select box or a point if fromPt === toPt
		 * @param {object} fromPt - x, y location we were at
		 * @param {object} toPt - x, y location we are now at
		 */
		finishSelectBox (fromPt, toPt) {
			let selectBox = _layoutFrame.selectBox;
			this.setSelectBox(fromPt, toPt);
			if (!_isSame(fromPt, toPt)) {
				this.drawSelectBox();
				this.clearSelection();
				let currentBox = selectBox.currentBox;
				let fn = (part) => this.selectPart(part);
				_partsMgr.enumeratePartsRev(function (part) {
					if (Utils.boxIntersectBox(_rectFromPart(part), currentBox)) {
						// satisfied
						//console.log('_finishSelectBox: ptInBox found at i: ' + i);
						// Highlight via tint, if not selected, set to red, if selected, clear to white
						fn(part);
					}
					return false;
				});
				selectBox.visible = false;
			}
			else {
				selectBox.beginFill(0xFF0000, 0.5);
				toPt = _layoutFrame.snapToGrid(toPt);
				selectBox.drawCircle(toPt.x, toPt.y, 3);
				selectBox.endFill();
				// Store a select point, indicate with w, h == 0
				selectBox.currentBox = {x: toPt.x, y: toPt.y, w: 0, h: 0};
				// Assume sorted by z order, => search from back of list forward to find first selectable item under a point
				this.clearSelection();
				_partsMgr.enumeratePartsRev(function (part) {
					if (Utils.pointInBox(toPt, _rectFromPart(part))) {
						// satisfied
						console.log('finishSelectBox: toPt: ' + toPt.x + ', ' + toPt.y );
						// Highlight via tint, if not selected, set to red, if selected, clear to white
						this.selectPart(part);
						return true;
					}
					return false;
				});
				_layoutFrame.centerPoint(toPt);
			}
		}
		/**
		 * handles mouse up after selection box
		 * @param {object} mouseDnPt
		 * @param {object} mouseUpPt
		 */
		finishMoveSelection (mouseDnPt, mouseUpPt) {
			if (!_isSame(mouseDnPt, mouseUpPt)) {
				let dx = (mouseUpPt.x - mouseDnPt.x) * _scalePixelToReal;
				let dy = (mouseUpPt.y - mouseDnPt.y) * _scalePixelToReal;
				// clear this.selectedBox so we can rebuild the selectedBox with the moved parts
				this.selectedBox = null;
				this.enumerateSelection(function (part) {
					part.layoutPart.moveMe(dx, dy);
					part.x = part.layoutPart.locus.x * _scaleRealToPixel;
					part.y = part.layoutPart.locus.y * _scaleRealToPixel;
					// Rebuild the selectedBox with the moved parts
					this.selectedBox = Utils.boxUnionBox(this.selectedBox, {x: part.x, y: part.y, w: part.width, h: part.height});
					return false;
				});
				_undoStack.pushUnmove(this.selected, dx, dy);
			}
		}
        /**
         * Encapsulates enumeration of the selected list
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         */
        enumerateSelection (enumFn) {
			let selected = this.selected;
            for (var i=0, len=selected.length; i < len; ++i) {
                if (enumFn(selected[i])) {
                    return false;
                }
            }
            return true;
        }
	};
	/**
	 * Manages parts actions
	 */
    PartsMgr = class PartsMgr {
        constructor () {
            this.parts = new PIXI.Container();
			this.copyBuffer = [];
        }
        /**
         * Encapsulates forward enumeration of the this.parts children
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         */
        enumeratePartsFwd (enumFn) {
            var parts = this.parts.children;
            for (var len=parts.length, i=0; i < len; ++i) {
                let part = parts[i];
                if (enumFn(part)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Encapsulates reverse enumeration of the this.parts children
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         */
        enumeratePartsRev (enumFn) {
            var parts = this.parts.children;
            for (var len=parts.length, i=len-1; i >= 0; i--) {
                let part = parts[i];
                if (enumFn(part)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Encapsulates reverse enumeration of the this.parts children, excluding a callback on excludePart
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @param {object} excludePart - this part will not be passed to enumFn(part)
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         */
        enumeratePartsExcludePartRev (enumFn, excludePart) {
            var parts = this.parts.children;
            for (var len=parts.length, i=len-1; i >= 0; i--) {
                var part = parts[i];
                if (part !== excludePart && enumFn(part)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Exposes enumeration of all parts from the plugin
         * @param callback
         */
        enumerateLayoutParts (callback) {
            this.enumeratePartsFwd(function (part) {
                return callback(part.layoutPart);
            });
        }
		/**
		 * @function createLayoutPart - Factory that creates a LayoutPart instance and an associated PIXI Sprite and adds the sprite to the parts container
		 * Also augments sprite with the layoutPart instance and layoutPart with the sprite instance
		 * @param {object} layoutPart - This should be common across all instances of this part
		 * @param {number} xPixel - x position in pixels
		 * @param {number} yPixel - y position in pixels
		 * @param {number} rotation - clockwise rotation in degrees
		 * @returns {LayoutPart} - The layoutPart with the created PIXI.Sprite embedded
		 */
		createLayoutPart(layoutPart, xPixel, yPixel, rotation) {
			var pixiTexture = PIXI.Texture.fromImage(layoutPart.imageUrl);
			var sprite = new PIXI.Sprite(pixiTexture);
			sprite.width = layoutPart.width * _scaleRealToPixel;
			sprite.height = layoutPart.height * _scaleRealToPixel;
			sprite.x = layoutPart.locus.x * _scaleRealToPixel;
			sprite.y = layoutPart.locus.y * _scaleRealToPixel;
			sprite.z = layoutPart.locus.z;
			layoutPart.sprite = sprite;
			sprite.layoutPart = layoutPart;
			this.parts.addChild(sprite);
			_selectionMgr.clearSelection();
			_selectionMgr.selectPart(sprite);
			return layoutPart;
		}
		/**
		 * Tests for valid selection and if found moves it to the front of all items occluding that selection
		 */
		moveToFront () {
			// Must be a valid single selected item
			if (_selectionMgr.validSelection() === 1) {
				var targetPart = _selectionMgr.selected[0];
				var targetRect = _rectFromPart(targetPart);
				var itemsNotTarget = [];
				this.enumeratePartsExcludePartRev(function (part) {
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
					this.parts.children.sort(depthCompare);
					//_testArrangement();
				}
			}
			else {
				LayoutFrame.blink(0xFF0000, ArrangeErrorMsg);
			}
		}
		/**
		 * Tests for valid selection and if found moves it to the back of all items occluding that selection
		 */
		moveToBack () {
			if (_selectionMgr.validSelection() === 1) {
				let targetPart = _selectionMgr.selected[0];
				let targetRect = _rectFromPart(targetPart);
				let itemsNotTarget = [];
				this.enumeratePartsExcludePartRev(function (part) {
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
					this.parts.children.sort(depthCompare);
					//_testArrangement();
				}
			}
			else {
				LayoutFrame.blink(0xFF0000, ArrangeErrorMsg);
			}
		};
		/**
		 * Tests for valid selection and if found moves it in front of any item immediately occluding that selection
		 */
		moveForward () {
			if (_selectionMgr.validSelection() === 1) {
				let targetPart = _selectionMgr.selected[0];
				let targetRect = _rectFromPart(targetPart);
				// Since the parts list order of occurrence => z-order, we impose an arbitrary
				// z-order on the items as they are scanned.
				let z_order = 0;
				let itemsNotTarget = [];
				this.enumeratePartsFwd(function (part) {
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
					this.parts.children.sort(depthCompare);
					//_testArrangement();

				}
			}
			else {
				LayoutFrame.blink(0xFF0000, ArrangeErrorMsg);
			}
		}
		/**
		 * Tests for valid selection and if found moves it behind any item occluded by that selection
		 */
		moveBackward () {
			if (_selectionMgr.validSelection() === 1) {
				let targetPart = _selectionMgr.selected[0];
				let targetRect = _rectFromPart(targetPart);
				// Since the parts list order of occurrence => z-order, we impose an arbitrary
				// z-order on the items as they are scanned.
				let z_order = 0;
				let itemsNotTarget = [];
				this.enumeratePartsFwd(function (part) {
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
					this.parts.children.sort(depthCompare);
					//_testArrangement();

				}
			}
			else {
				LayoutFrame.blink(0xFF0000, ArrangeErrorMsg);
			}
		}
		/**
		 * Deletes items in _selectionMgr.selected.  undoState controls whether we push an undo for this
		 * @param undoState
		 */
		deleteItems (undoState) {
			let enableUndo = (undoState || UndoState.Enable) === UndoState.Enable;
			if (_selectionMgr.validSelection()) {
				_selectionMgr.enumerateSelection((part) => {
					part.tint = 0xFFFFFF;
					part.alpha = 1.0;
					this.parts.removeChild(part);
					return false;
				});
				if (enableUndo) {
					_undoStack.pushUndelete(_selectionMgr.selected);
				}
				_selectionMgr.selected = [];
				Session.set(Constants.layoutSelection, 0)
			}
			else {
				LayoutFrame.blink(0xFF0000, DeleteErrorMsg);
			}
		}
		/**
		 * Enumerates the current selection copies onto copyBuffer for paste.  Undo is enabled to erase the copy
		 */
		copySelection () {
			this.copyBuffer = [];
			//_selectionMgr.enumerateSelection(function (part) {
			//	this.copyBuffer.push(part.layoutPart.copyMe());
			//	return false;
			_selectionMgr.enumerateSelection((part) => {
				this.copyBuffer.push(part.layoutPart.copyMe());
				return false;
			});
			_undoStack.pushUncopy();
		}
		/**
		 * Pastes anything in the copyBuffer.  Undo is enable to delete any pasted items on undo
		 * @private
		 */
		pasteCopy () {
			_selectionMgr.clearSelection();
			for (var i=0, len=this.copyBuffer.length; i < len; ++i) {
				let layoutPart = this.copyBuffer[i];
				var pixiTexture = PIXI.Texture.fromImage(layoutPart.imageUrl);
				var sprite = new PIXI.Sprite(pixiTexture);
				sprite.width = layoutPart.width * _scaleRealToPixel;
				sprite.height = layoutPart.height * _scaleRealToPixel;
				sprite.x = layoutPart.locus.x * _scaleRealToPixel;
				sprite.y = layoutPart.locus.y * _scaleRealToPixel;
				sprite.z = layoutPart.locus.z;
				layoutPart.sprite = sprite;
				sprite.layoutPart = layoutPart;
				this.parts.addChild(sprite);
				_selectionMgr.selectPart(sprite);
			}
			_undoStack.pushUnpaste(_selectionMgr.selected);
		}
	};

	/**
	 * Manages layout frame actions like fit
	 */
	LayoutFrame = class LayoutFrame {
		constructor () {
			// default scaling
			_scaleRealToPixel = _scalePixelToReal = 1.0;
			_selectionMgr = new SelectionMgr();
			_mouseMgr = new MouseMgr();
            _partsMgr = new PartsMgr();
			this.createLayoutFrame();
		}
		/**
		 * Creates initial layout frame
		 * @param {number} x - x pixel position of frame - Allows centering
		 * @param {number} y - y pixel position of frame - Allows centering
		 * @return {object} this.box => frame PIXI.Container
		 */
		createLayoutFrame (x, y) {
			console.log('createLayoutFrame');
			this.borderWidth = 4;
			this.centerPt = {x: _plugin.pixiRenderer.width / 2, y: _plugin.pixiRenderer.height};
			this.box = new PIXI.Container();
			this.box.interactive = true;
			this.box.mousedown = (interactionData) => _mouseMgr.mouseDown(interactionData);
			this.box.mouseup = (interactionData) => _mouseMgr.mouseUp(interactionData);
			this.box.mousemove = (interactionData) => _mouseMgr.mouseMove(interactionData);
			this.background = new PIXI.Graphics();
			this.gridEnabled = false;
			this.gridSpacing = 0;
			this.box.addChild(this.background);
			this.grid = new PIXI.Graphics();
			this.box.addChild(this.grid);
			this.box.position.x = x;
			this.box.position.y = y;
			this.houseText = new PIXI.Text('house');
			this.box.addChild(this.houseText);
			this.curbText = new PIXI.Text('curb');
			this.box.addChild(this.curbText);
			this.box.addChild(_partsMgr.parts);
			this.selectBox = new PIXI.Graphics();
			this.selectBox.visible = false;
			this.box.addChild(this.selectBox);
			return this.box;
		}
		/**
		 * modifyLayoutFrame function - Does the heavy lifting for fit, scale to modify the frame
		 * Also draws any gridding
		 * @param {number} x - x pixel position of frame - Allows centering
		 * @param {number} y - y pixel position of frame - Allows centering
		 * @param {number} width - pixel width of frame
		 * @param {number} height - pixel height of frame
		 */
		modifyLayoutFrame (x, y, width, height) {
			console.log('modifyLayoutFrame: ' + x + ', ' + y + ' : ' + width + ', ' + height);
			let box = this.box,
				houseText = this.houseText,
				curbText = this.curbText,
				borderWidth = this.borderWidth;
			this.background.clear();
			// Now store positional info into background, even though we still have to explicitly draw
			this.background.innerWidth = width - (2 * borderWidth);
			this.background.innerHeight = height - (2 * borderWidth);
			this.background.innerX = borderWidth;
			this.background.innerY = borderWidth;
			this.background.width = width;
			this.background.height = height;
			this.background.position.x = 0;
			this.background.position.y = 0;
			this.background.beginFill(0xFF0000);
			this.background.drawRect(0, 0, width, height);
			this.background.beginFill(0xFFFFFF);
			this.background.drawRect(borderWidth, borderWidth, this.background.innerWidth, this.background.innerHeight);
			box.position.x = x;
			box.position.y = y;
			// Safest to use the real session variables to determine _grid
			this.gridEnabled = Session.get(Constants.gridEnabled);
			this.gridSpacing = Session.get(Constants.gridSpacing);
			this.drawGrid(this.gridEnabled, this.gridSpacing);
			// center text horizontally, stick to top and bottom, house and curb respectively
			let midX = width / 2;
			houseText.x = midX - (houseText.width / 2);
			houseText.y = borderWidth;
			curbText.x = midX - (curbText.width / 2);
			curbText.y = this.background.height - curbText.height;
			_plugin.pixiRenderer.bgndOffX = x;
			_plugin.pixiRenderer.bgndOffY = y;
			_selectionMgr.drawSelectBox();
		}
		centerPoint (pt) {
			// compute delta from pt to center point
			let deltaX = this.centerPt.x - pt.x,
				deltaY = this.centerPt.y - pt.y;
			this.modifyLayoutFrame(this.box.x + deltaX, this.box.y + deltaY, _plugin.pixiRenderer.width, _plugin.pixiRenderer.height);
		}
		/**
		 * drawGrid function - draws a grid with xy spacing in the frame.  spacing is in cm
		 * @param {boolean} gridEnabled - draw or clear grid
		 * @param {number} gridSpacing - grid spacing in cm
		 */
		drawGrid (gridEnabled, gridSpacing) {
			console.log('LayoutFrame.drawGrid: ENTRY, gridEnabled: ' + gridEnabled + ', gridSpacing: ' + gridSpacing);
			// Clear the _grid before we draw it so we don't accumulate graphics
			// Always clear since it handles the !gridEnabled case too.
			let grid = this.grid;
			grid.clear();
			if (gridEnabled) {
				// pixel positions
				var startX = this.background.position.x;
				var startY = this.background.position.y;
				// spacing parameter is in cm, convert to pixels
				var gridPixelSpacing = (gridSpacing / 100) * _scaleRealToPixel;
				// Set _grid point color to teal
				grid.beginFill(0x009688);
				var innerHeight;
				var innerWidth;
				let gridInBorder = false;
				if (gridInBorder) {
					innerWidth = this.background.innerWidth;
					innerHeight = this.background.innerHeight;
					startX = this.background.innerX;
					startY = this.background.innerY;
				}
				else {
					innerWidth = this.background.width;
					innerHeight = this.background.height;
					startX = this.background.position.x;
					startY = this.background.position.y;
				}
				for (var row = 0, lastRow = innerHeight; row < lastRow; row += gridPixelSpacing) {
					for (var i = 0, stop = innerWidth; i < stop; i += gridPixelSpacing) {
						grid.drawCircle(startX + i, startY + row, 1);
					}
				}
			}
		}
		/**
		 * snapToGrid function - snaps the xy pixel coordinate to a grid point if this.gridEnabled
		 * if not this.gridEnabled, just return original coordinates
		 * @param {object} raw - object with x, y
		 * @return {object} - {x, y} snapped points or raw points
		 */
		snapToGrid (raw) {
			let snapped = {x:raw.x, y:raw.y};
			if (this.gridEnabled) {
				let gridPixelSpacing = (this.gridSpacing / 100.0) * _scaleRealToPixel;
				snapped.x = Math.round(raw.x / gridPixelSpacing) * gridPixelSpacing;
				snapped.y = Math.round(raw.y / gridPixelSpacing) * gridPixelSpacing;
			}
			return {x: snapped.x, y: snapped.y};
		}

		/**
		 * Update scale factors and part locations
		 * @param {number} lengthPixels
		 * @param {number} lengthMeters
		 */
		updateScale (lengthPixels, lengthMeters) {
			_scaleRealToPixel = lengthPixels / lengthMeters;
			_scalePixelToReal = 1.0 / _scaleRealToPixel;
			let scaleRealToPixel = _scaleRealToPixel, scalePixelToReal = _scalePixelToReal;
			// Have to adjust all sprites pixel positions
			_partsMgr.enumeratePartsFwd(function (part) {
				part.x = part.layoutPart.locus.x * scaleRealToPixel;
				part.y = part.layoutPart.locus.y * scaleRealToPixel;
				part.width = part.layoutPart.width * scaleRealToPixel;
				part.height = part.layoutPart.height * scaleRealToPixel;
			});
			// Select box if visible
			if (this.selectBox.visible) {
				this.selectBox.startPixelPt = _scaleRealPtToPixelPt(this.selectBox.startRealPt);
				this.selectBox.endPixelPt = _scaleRealPtToPixelPt(this.selectBox.endRealPt);
			}
		}
		/**
		 * Fits the layout into the current pixiRenderer dimensions
		 * @param {FitType} fitMode - Type of fit
		 */
		fit (fitMode) {
			console.log('LayoutFrame.prototype.fit: ' + fitMode);
			if (_plugin.pixiRenderer) {
				// set some locals and set defaults
				var pixiRenderWidth = _plugin.pixiRenderer.width;
				var pixiRenderHeight = _plugin.pixiRenderer.height;
				var dims = CreateLawnData.lawnData.shape.dims;
				var x = 0, y = 0;
				this.bestFit = {widthPixels: pixiRenderWidth, lengthPixels: pixiRenderHeight};
				// based on fitMode, adjust values, then modify the fitted frame
				switch (fitMode) {
				case FitType.FitTypeXY:
					this.bestFit = Utils.computeLayoutFrame(dims.width, dims.length, pixiRenderWidth, pixiRenderHeight);
					// center layout frame in renderer
					x = (pixiRenderWidth - this.bestFit.widthPixels) / 2;
					y = (pixiRenderHeight - this.bestFit.lengthPixels) / 2;
					break;
				case FitType.FitTypeX:
					this.bestFit.lengthPixels = (dims.length * pixiRenderWidth) / dims.width;
					// center layout frame in renderer
					y = (pixiRenderHeight - this.bestFit.lengthPixels) / 2;
					break;
				case FitType.FitTypeY:
					this.bestFit.widthPixels = (dims.width * pixiRenderHeight) / dims.length;
					// center layout frame in renderer
					x = (pixiRenderWidth - this.bestFit.widthPixels) / 2;
					break;
				default :
					// error, no effect
					break;
				}
				this.updateScale(this.bestFit.lengthPixels, dims.length);
				this.modifyLayoutFrame(x, y, this.bestFit.widthPixels, this.bestFit.lengthPixels);
				if (fitMode !== FitType.FitTypeY) {
					// Bogus, repeat the modifyLayoutFrame, why????
					this.modifyLayoutFrame(x, y, this.bestFit.widthPixels, this.bestFit.lengthPixels);
				}
			}
			else {
				// really an error since there is no renderer but just in case we get invoked too soon noop this
				//_modifyRectangle(self.layoutFrame, 0, 0, (border.width === 200) ? 100 : 200, 300);
			}
		}
		/**
		 * Blinks the background
		 * @param {number} color - set background.tint to this and restore on timer expiry
		 * @param {string} msg - error message
		 */
		static blink (color, msg) {
			_blinkPart(_layoutFrame.background, color);
			swal({
				title: 'Oops!',
				text: msg,
				timer: 2000,
				showConfirmButton: true });
		};

	};
	/**
	 * Handles macro plugin activity like inbound action events
	 */
	PixiJSViewPlugin = class PixiJSViewPlugin {
		constructor () {
			this.pixiRenderer = null;
			_layoutFrame = null;
			_plugin = this;
			this.offset = 0;
		}

		/**
		 * Store pixi context into plugin
		 * This should be called once the pixijs engine is initialized
		 * @param {object} pixiRenderer
		 * @param {object} pixiRootContainer
		 */
		setContext (pixiRenderer, pixiRootContainer) {
			this.pixiRenderer = pixiRenderer;
			this.pixiRootContainer = pixiRootContainer;
			if (_layoutFrame === null) {
				_layoutFrame = new LayoutFrame();
			}
		}
		/**
		 * Called from PixiJSViewStore.handleLayoutEvent
		 * @param {object} action - See ActionClass and extensions in the store
		 */
		handleAction (action) {
			switch (action.constructor) {
			case ActionInitLayout:
				this.offset = action.offset;
				this.pixiRootContainer.addChild(_layoutFrame.createLayoutFrame(0, 0));
				this.fitMode = action.fitMode;
				_layoutFrame.fit(action.fitMode);
				_mouseMgr.setMouseMode(action.mouseMode);
				_currentAbstractPart = action.currentAbstractPart;
				// Force a reset to get size correct
				window.dispatchEvent(new Event('resize'));
				break;
			case ActionEnumerateLayout:
				console.log('handleAction[ActionEnumerateLayout] => ' + action.receiver);
				setTimeout(function () {
					_partsMgr.enumerateLayoutParts(function (part) {
						_safeDispatch(action.receiver, new Message.ActionNewPart(RenderActionType.NewPart, part));
						return false;
					});
				}, 0);
				break;
			case ActionSetAbstractPart:
				console.log('handleAction[ActionSetAbstractPart]');
				_currentAbstractPart = action.abstractPart;
				break;
			case ActionResizeLayout:
				if (this.lastResizeW !== action.w || this.lastResizeH !== action.h) {
					this.lastResizeW = action.w;
					this.lastResizeH = action.h;
					this.resizeLayout(action.w, action.h);
				}
				break;
			case ActionSetMouseMode:
				_mouseMgr.setMouseMode(action.mouseMode);
				_currentAbstractPart = action.abstractPart;
				break;
			case ActionMoveToFront:
				_partsMgr.moveToFront();
				break;
			case ActionMoveToBack:
				_partsMgr.moveToBack();
				break;
			case ActionMoveForward:
				_partsMgr.moveForward();
				break;
			case ActionMoveBackward:
				_partsMgr.moveBackward();
				break;
			case ActionDeleteItems:
				_partsMgr.deleteItems();
				break;
			case ActionCopyItems:
				_partsMgr.copySelection();
				break;
			case ActionPasteItems:
				_partsMgr.pasteCopy();
				break;
			case ActionUndo:
				_undoStack.popUndoStack();
				break;
			case ActionFitLayout:
				this.fitMode = action.fitMode;
				_layoutFrame.fit(this.fitMode);
				break;
			}
		}
		/**
		 * Called from PixiJSView when it proxies action to here before the component is mounted -> no setState() can be done
		 * This is strictly for actions that bypass the view 
		 * @param {object} action - See ActionClass and extensions in the store
		 */
		handleActionUnmounted (action) {
			switch (action.constructor) {
			case ActionEnumerateLayout:
				console.log('handleAction[ActionEnumerateLayout] => ' + action.receiver);
				setTimeout(function () {
					_partsMgr.enumerateLayoutParts(function (part) {
						_safeDispatch(action.receiver, new Message.ActionNewPart(RenderActionType.NewPart, part));
						return false;
					});
				}, 0);
				break;
			case ActionSetAbstractPart:
				console.log('handleAction[ActionSetAbstractPart]');
				_currentAbstractPart = action.abstractPart;
				break;
			}
		}

		/**
		 * Adjust the pixiRenderer by height less offset (h - this.offset) => implicitly modifies the canvas
		 * @param {number} w
		 * @param {number} h
		 */
		resizeLayout (w, h) {
			console.log('resizeLayout(' + w + ', ' + h +')');
			this.pixiRenderer.resize(w, (h - this.offset));
			_layoutFrame.fit(this.fitMode);
		}
	};

// plug us into the store, couple a particular store and associated plugin
	if (Meteor.isClient) {
		Meteor.startup(function () {
			console.log('PixiJSViewActionStore.setPlugin');
			PixiJSViewActionStore.setPlugin(new PixiJSViewPlugin());
		});
	}
})();
