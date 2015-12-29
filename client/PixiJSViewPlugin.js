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
	var _layoutFrame = null;
	var _pixiRenderer = null;
	var _background = null;
	var _parts;
	var _selected = [];
	var _selectedBox = null;
	var _copyBuffer = [];
	var _selectBox;
	var _mouseMgr = null;
	var _selectionMgr = null;
    var _partsMgr;
	var _currentAbstractPart = null;
	var _unitW = 50;

	var _mouseDownPt;
	var _mouseUpPt;
	var _mouseMovePt;
	var _gridEnabled;
	var _gridSpacing;
	var _scaleRealToPixel;
	var _scalePixelToReal;

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
	 * @param {object} mouseDnPt - object, point {x, y}
	 * @param {object} mouseUpPt - object, point {x, y}
	 * @return {boolean} - true if same
	 */
	var _isMouseUpDnSame = function _isMouseUpDnSame(mouseDnPt, mouseUpPt) {
		return _isSame(mouseDnPt, mouseUpPt);
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
		let ul = _snapToGrid(part.position.x, part.position.y);
		return {x: ul.x, y: ul.y, w: part.width, h: part.height};
	};


	MouseMgr = class MouseMgr {
		constructor () {
			this.mouseMode = MouseMode.Select;
			this.currentMoveState = false;
			this.mouseSprite = null;
		}
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
			case LayoutManager.MOUSE_MODE.Select:
				targetDnHandler = (pixelPt) => this.mouseDnSelectHandler(pixelPt);
				targetUpHandler = (pixelPt) => this.mouseUpSelectHandler(pixelPt);
				targetMvHandler = (pixelPt) => this.mouseMvSelectHandler(pixelPt);
				break;
			case LayoutManager.MOUSE_MODE.Create:
				targetEnterHandler = (pixelPt) => this.mouseEnterCreateHandler(pixelPt);
				targetLeaveHandler = () => this.mouseLeaveCreateHandler();
				targetUpHandler = (pixelPt) => this.mouseUpCreateHandler(pixelPt);
				break;
			case LayoutManager.MOUSE_MODE.Move:
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
		 * @return {object} - point relative to background, valid if within the _background
		 */
		computeRelativeMouseLocation(absPt) {
			let point = {x: absPt.x - _pixiRenderer.bgndOffX, y: absPt.y - _pixiRenderer.bgndOffY, valid: true};
			point.valid = (point.x <= _background.width) && (point.y <= _background.height) &&
				(point.x >= 0) && (point.y >= 0);
			return point;
		}
		/**
		 * mouseDown function - callback from PIXI.InteractiveManager on mouse button down
		 * @param {object} interactionData - object, contains current point relative to render surface
		 */
		mouseDown(interactionData) {
			let mouseDnPt = this.computeRelativeMouseLocation(interactionData.data.global);
			this.mouseDnPt = _snapToGrid(mouseDnPt.x, mouseDnPt.y);
			//console.log('_mouseDown: ' + currentMouseLoc.x + ', ' + currentMouseLoc.y);
			if (this.mouseDnHandler) {
				this.mouseDnHandler(mouseDnPt);
			}
		}
		/**
		 * mouseUp function - callback from PIXI.InteractiveManager on mouse button up
		 * @param {object} interactionData - object, contains current point relative to render surface
		 */
		mouseUp(interactionData) {
			let mouseUpPt = this.computeRelativeMouseLocation(interactionData.data.global);
			this.mouseUpPt = _snapToGrid(mouseUpPt.x, mouseUpPt.y);
			//console.log('console: ' + _mouseUpPt);
			if (this.mouseUpHandler) {
				this.mouseUpHandler(mouseUpPt);
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
				this.mouseMvPt = _snapToGrid(x, y);
				//console.log('mouseMove: ' + this.mouseMvPt.x + ', ' + this.mouseMvPt.x + ' : valid: ' + valid);

				// Try to detect mouseover, mouseout
				if (this.currentMoveState) {
					// The last state was inside
					if (!valid) {
						console.log('_mouseMove: LEAVE');
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
						console.log('_mouseMove: ENTER');
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
		mouseMvSelectHandler (pixelPt) {
			_selectionMgr.drawSelectBox(this.mouseDnPt, this.mouseMvPt);
		}
		mouseUpSelectHandler (pixelPt) {
			this.mouseMvHandler = null;
			_selectionMgr.finishSelectBox(this.mouseDnPt, this.mouseUpPt);
		}
		mouseMvMoveHandler (pixelPt) {}
		mouseMvCreateHandler (noop, pixelPt) {
			this.moveMouseSprite(pixelPt);
		}
		mouseEnterCreateHandler (pixelPt) {
			this.mouseMvHandler = (noop, pixelPt) => this.mouseMvCreateHandler(noop, pixelPt);
			this.enableMouseSprite(true, pixelPt, _currentAbstractPart);
		}
		mouseLeaveCreateHandler () {
			this.mouseMvHandler = null;
			this.enableMouseSprite(false);
		}
		mouseUpCreateHandler (pixelPt) {
			if (_isMouseUpDnSame(this.mouseDnPt, this.mouseUpPt) && _currentAbstractPart) {
				var scalePixelToReal = _scalePixelToReal;
				PartsMgr.createLayoutPart(new LayoutPart(_currentAbstractPart, pixelPt.x * scalePixelToReal, pixelPt.y * scalePixelToReal),
					pixelPt.x, pixelPt.y);
			}
		}
		mouseUpMoveHandler (pixelPt) {
			this.mouseMvHandler = null;
			this.finishMoveSelection();
		}
		// Mouse utils
		/**
		 * enableMouseSprite function - enable/disable the graphic cursor sprite.  Used to avoid any
		 * timing issues when switching between windows
		 * @param {boolean} enable - true to turn on, false to turn off..
		 * @param {object} pixelPt - mandatory if enable is true
		 * @param {object} abstractPart - the part we have selected to create, currently of type TestAbstractPart
		 */
		enableMouseSprite (enable, pixelPt, abstractPart) {
			_selectBox.visible = enable;
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

						_selectBox.addChild(this.mouseMask);
						this.mouseSprite.mask = this.mouseMask;
					}
					else {
						this.mouseMask = null;
						this.mouseSprite.mask = null;
					}
					_selectBox.addChild(this.mouseSprite);
				}
			}
			else {
				if (this.mouseSprite) {
					// Remove from the 
					_selectBox.removeChild(this.mouseSprite);
					this.mouseSprite = null;
				}
			}
		}
		/**
		 * moveMouseSprite function - Set xy loc of sprite to pixelPt
		 * @param {object} pixelPt - location to place sprite if active
		 */
		moveMouseSprite (pixelPt) {
			if (_selectBox.visible && this.mouseSprite) {
				// Center the sprite
				this.mouseSprite.position = this.computeCenterPt(pixelPt);
				if (this.mouseMask) {
					this.mouseMask.position.x = this.mouseSprite.position.x;
					this.mouseMask.position.y = this.mouseSprite.position.y;
				}
			}
		}
		computeCenterPt (pixelPt) {
			let centerPt = {};
			centerPt.x = pixelPt.x - (_unitW / 2);
			centerPt.y = pixelPt.y - (this.mouseSprite.height / 2);
			return centerPt;
		}
	};
	
	SelectionMgr = class SelectionMgr {
		constructor () {
			this.selectedBox = null;
		}
		validSelection () {
			return _selected.length;
		}
		/**
		 * resets tinting on any selected part
		 * clears the _selected list
		 * @private
		 */
		clearSelection () {
			for (var i=0, len=_selected.length; i < len; ++i) {
				_selected[i].tint = 0xFFFFFF;
				_selected[i].alpha = 1.0;
			}
			_selected = [];
			_selectedBox = null;
			Session.set(Constants.layoutSelection, 0);
		}

		/**
		 *
		 * @param {object} pt - {x, y}
		 * @returns {boolean|*} - true if pt is on the box covering the entire selection
		 * @private
		 */
		ptOnSelection (pt) {
			// Heads up, _selectedBox can be null
			return (this.selectedBox === null) ? false : Utils.pointInBox(pt, this.selectedBox);
		}
        /**
         * Manages the selected array as well as tinting any selected part
         * @param part
         * @private
         */
        static selectPart (part) {
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
        }
		/**
		 * select top item touching point
		 * @param {object} pixelPt - x, y in pixels to look for item
		 * @returns {boolean} - true if we selected one
		 * @private
		 */
		selectAtPoint (pixelPt) {
			pixelPt = _snapToGrid(pixelPt.x, pixelPt.y);
			// Assume sorted by z order, => search from back of list forward to find first selectable item under a point
			this.clearSelection();
			// enumeratePartsRev returns false if a valid selection is made so reverse bool on return
			return !PartsMgr.enumeratePartsRev(function (part) {
				if (Utils.pointInBox(pixelPt, _rectFromPart(part))) {
					// satisfied
					// Highlight via tint, if not selected, set to red, if selected, clear to white
					SelectionMgr.selectPart(part);
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
			_selectBox.visible = enable;
			_selectBox.clear();
			_selectBox.startSelect = _mouseDownPt;
			//console.log('_mouseDown: x: ' + _selectBox.startSelect.x + ', y: ' + _selectBox.startSelect.y + 
			//	', background.x: ' + background.innerX + ', background.y: ' + background.innerY);
			_selectBox.currentBox = null;
		}
		/**
		 * drawSelectBox function - if in select mode, clear and redraw selection box if toPt != fromPt
		 * @param {object} fromPt - x, y location we were at
		 * @param {object} toPt - x, y location we are now at
		 */
		drawSelectBox(fromPt, toPt) {
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
		}
		/**
		 * finishSelectBox function - draws final select box or a point if fromPt === toPt
		 * @param {object} fromPt - x, y location we were at
		 * @param {object} toPt - x, y location we are now at
		 */
		finishSelectBox (fromPt, toPt) {
			if (!_isSame(fromPt, toPt)) {
				this.drawSelectBox(fromPt, toPt);
				this.clearSelection();
				let selectBox = _selectBox.currentBox;
				PartsMgr.enumeratePartsRev(function (part) {
					if (Utils.boxIntersectBox(_rectFromPart(part), selectBox)) {
						// satisfied
						console.log('_finishSelectBox: ptInBox found at i: ' + i);
						// Highlight via tint, if not selected, set to red, if selected, clear to white
						SelectionMgr.selectPart(part);
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
				this.clearSelection();
				PartsMgr.enumeratePartsRev(function (part) {
					if (Utils.pointInBox(toPt, _rectFromPart(part))) {
						// satisfied
						// Highlight via tint, if not selected, set to red, if selected, clear to white
						SelectionMgr.selectPart(part);
						return true;
					}
					return false;
				});
			}
		}
		/**
		 * handles mouse up after selection box
		 * @private
		 */
		finishMoveSelection () {
			if (!_isSame(_mouseDownPt, _mouseUpPt)) {
				let dx = (_mouseUpPt.x - _mouseDownPt.x) * _scalePixelToReal;
				let dy = (_mouseUpPt.y - _mouseDownPt.y) * _scalePixelToReal;
				// clear _selectedBox so we can rebuild the selectedBox with the moved parts
				_selectedBox = null;
				SelectionMgr.enumerateSelection(function (part) {
					part.layoutPart.moveMe(dx, dy);
					part.x = part.layoutPart.locus.x * _scaleRealToPixel;
					part.y = part.layoutPart.locus.y * _scaleRealToPixel;
					// Rebuild the selectedBox with the moved parts
					_selectedBox = Utils.boxUnionBox(_selectedBox, {x: part.x, y: part.y, w: part.width, h: part.height});
					return false;
				});
				_undoStack.pushUnmove(_selected, dx, dy);
			}
		}
        /**
         * Encapsulates enumeration of the _selected list
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         * @private
         */
        static enumerateSelection (enumFn) {
            for (var i=0, len=_selected.length; i < len; ++i) {
                if (enumFn(_selected[i])) {
                    return false;
                }
            }
            return true;
        }
	};
    
    PartsMgr = class PartsMgr {
        constructor () {
            this.parts = _parts = new PIXI.Container();
        }
        /**
         * Encapsulates forward enumeration of the _parts children
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         * @private
         */
        static enumeratePartsFwd (enumFn) {
            var parts = _parts.children;
            for (var len=parts.length, i=0; i < len; ++i) {
                let part = parts[i];
                if (enumFn(part)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Encapsulates reverse enumeration of the _parts children
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         * @private
         */
        static enumeratePartsRev (enumFn) {
            var parts = _parts.children;
            for (var len=parts.length, i=len-1; i >= 0; i--) {
                let part = parts[i];
                if (enumFn(part)) {
                    return false;
                }
            }
            return true;
        }
        /**
         * Encapsulates reverse enumeration of the _parts children, excluding a callback on excludePart
         * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
         * @param {object} excludePart - this part will not be passed to enumFn(part)
         * @returns {boolean} - false if enumeration was stopped, true if finished for all items
         * @private
         */
        static enumeratePartsExcludePartRev (enumFn, excludePart) {
            var parts = _parts.children;
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
         * @private
         */
        static enumerateLayoutParts (callback) {
            PartsMgr.enumeratePartsFwd(function (part) {
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
		 * @return {LayoutPart} -
		 * @private
		 */
		static createLayoutPart(layoutPart, xPixel, yPixel, rotation) {
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
			_selectionMgr.clearSelection();
			SelectionMgr.selectPart(sprite);
			return layoutPart;
		}
    };

	LayoutFrame = class LayoutFrame {
		constructor () {
			// default scaling
			_scaleRealToPixel = _scalePixelToReal = 1.0;
			_selectionMgr = new SelectionMgr();
			_mouseMgr = new MouseMgr();
            _partsMgr = new PartsMgr();
			_layoutFrame = this.createLayoutFrame();
		}
		createLayoutFrame (x, y) {
			console.log('createLayoutFrame');
			this.box = new PIXI.Container();
			this.box.interactive = true;
			this.box.mousedown = (interactionData) => _mouseMgr.mouseDown(interactionData);
			this.box.mouseup = (interactionData) => _mouseMgr.mouseUp(interactionData);
			this.box.mousemove = (interactionData) => _mouseMgr.mouseMove(interactionData);
			_background = new PIXI.Graphics();
			_gridEnabled = false;
			_gridSpacing = 0;
			this.box.addChild(_background);
			this.grid = new PIXI.Graphics();
			this.box.addChild(this.grid);
			this.box.position.x = x;
			this.box.position.y = y;
			this.houseText = new PIXI.Text('house');
			this.box.addChild(this.houseText);
			this.curbText = new PIXI.Text('curb');
			this.box.addChild(this.curbText);
			this.box.addChild(_partsMgr.parts);
			_selectBox = new PIXI.Graphics();
			_selectBox.visible = false;
			this.box.addChild(_selectBox);
			return this.box;
		}
		modifyLayoutFrame (x, y,width, height, borderWidth) {
			let box = this.box,
				houseText = this.houseText,
				curbText = this.curbText;
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
			this.box.position.x = x;
			this.box.position.y = y;
			// Safest to use the real session variables to determine _grid
			_gridEnabled = Session.get(Constants.gridEnabled);
			_gridSpacing = Session.get(Constants.gridSpacing);
			this.drawGrid(_gridEnabled, _gridSpacing);
			// center text horizontally, stick to top and bottom, house and curb respectively
			let midX = width / 2;
			houseText.x = midX - (houseText.width / 2);
			houseText.y = borderWidth;
			curbText.x = midX - (curbText.width / 2);
			curbText.y = _background.height - curbText.height;
			_pixiRenderer.bgndOffX = x;
			_pixiRenderer.bgndOffY = y;
		}
		drawGrid (gridEnabled, gridSpacing) {
			console.log('LayoutFrame.drawGrid: ENTRY, gridEnabled: ' + gridEnabled + ', gridSpacing: ' + gridSpacing);
			// Clear the _grid before we draw it so we don't accumulate graphics
			// Always clear since it handles the !gridEnabled case too.
			let grid = this.grid;
			grid.clear();
			if (gridEnabled) {
				console.log('_drawGrid, drawing _grid');
				// pixel positions
				var startX = _background.position.x;
				var startY = _background.position.y;
				// spacing parameter is in cm, convert to pixels
				var gridPixelSpacing = (gridSpacing / 100) * _scaleRealToPixel;
				// Set _grid point color to teal
				grid.beginFill(0x009688);
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
						grid.drawCircle(startX + i, startY + row, 1);
					}
				}
			}
		}
		/**
		 * snapToGrid function - snaps the xy pixel coordinate to a grid point if _gridEnabled
		 * if not _gridEnabled, just return original coordinates
		 * @param {number} xPixel - x position to snap
		 * @param {number} yPixel - x position to snap
		 * @return {object} - {x, y} snapped points or raw points
		 */
		snapToGrid (xPixel, yPixel) {
			if (_gridEnabled) {
				let gridPixelSpacing = (_gridSpacing / 100.0) * _scaleRealToPixel;
				xPixel = Math.round(xPixel / gridPixelSpacing) * gridPixelSpacing;
				yPixel = Math.round(yPixel / gridPixelSpacing) * gridPixelSpacing;
			}
			return {x: xPixel, y: yPixel};
		}

		updateScale (lengthPixels, lengthMeters) {
			_scaleRealToPixel = lengthPixels / lengthMeters;
			_scalePixelToReal = 1.0 / _scaleRealToPixel;
			let scaleRealToPixel = _scaleRealToPixel, scalePixelToReal = _scalePixelToReal;
			// Have to adjust all sprites pixel positions
			PartsMgr.enumeratePartsFwd(function (part) {
				part.x = part.layoutPart.locus.x * scaleRealToPixel;
				part.y = part.layoutPart.locus.y * scaleRealToPixel;
				part.width = part.layoutPart.width * scaleRealToPixel;
				part.height = part.layoutPart.height * scaleRealToPixel;
			});
		}
		fit (fitMode) {
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
				this.updateScale(bestFit.lengthPixels, dims.length);
				this.modifyLayoutFrame(x, y, bestFit.widthPixels, bestFit.lengthPixels, 4);
			}
			else {
				// really an error since there is no renderer but just in case we get invoked too soon noop this
				//_modifyRectangle(self.layoutFrame, 0, 0, (border.width === 200) ? 100 : 200, 300, 4);
			}
		}
	};

	PixiJSViewPlugin = class PixiJSViewPlugin {
		constructor () {
			_pixiRenderer = null;
			_layoutFrame = null;
		}

		/**
		 * Store pixi context into plugin
		 * This should be called once the pixijs engine is initialized
		 * @param {object} pixiRenderer
		 * @param {object} pixiRootContainer
		 */
		setContext (pixiRenderer, pixiRootContainer) {
			_pixiRenderer = pixiRenderer;
			this.pixiRootContainer = pixiRootContainer;
			if (_layoutFrame === null) {
				_layoutFrame = new LayoutFrame();
			}
		}
		/**
		 * Called from shouldComponentUpdate when it proxies action to here
		 * @param {object} action - See ActionClass and extensions in the store
		 */
		handleAction (action) {
			switch (action.constructor.name) {
			case 'ActionInitLayout':
				//this.addBackground(0xFEFEFE, 0xFF0000);
				this.pixiRootContainer.addChild(_layoutFrame.createLayoutFrame(0, 0));
				_layoutFrame.fit(action.fitMode);
				_mouseMgr.setMouseMode(action.mouseMode);
				_currentAbstractPart = action.currentAbstractPart;
				break;
			case 'ActionEnumerateLayout':
				console.log('handleAction[ActionEnumerateLayout] => ' + action.receiver);
				setTimeout(function () {
					PartsMgr.enumerateLayoutParts(function (part) {
						Dispatcher.dispatch(action.receiver, new Message.ActionNewPart(RenderActionType.NewPart, part));
						return false;
					});
				}, 0);
				break;
			case 'ActionSetAbstractPart':
				console.log('handleAction[ActionSetAbstractPart]');
				_currentAbstractPart = action.abstractPart;
				break;
			case 'ActionSetMouseMode':
				_mouseMgr.setMouseMode(action.mouseMode);
				_currentAbstractPart = action.abstractPart;
				break;
			case 'ActionAddBackground':
				this.addBackground(action.color, action.borderColor);
				break;
			case 'ActionBlink':
				this.blink(action.color, action.msg);
				break;
			case 'ActionText':
				this.addTextToBackground(action.color, action.text);
				break;
			}
		}

		/**
		 * Example of adding rectangle background as graphics
		 * @param {number} color
		 * @param {number} borderColor
		 */
		addBackground (color, borderColor) {
			let background = new PIXI.Graphics();
			background.beginFill(color);
			background.lineStyle(5, borderColor);
			background.drawRect(0, 0, _pixiRenderer.width, _pixiRenderer.height);
			background.endFill();
			this.pixiRootContainer.addChild(background);
			_background = background;
		}

		/**
		 * Blink "background"
		 * @param {number} color
		 * @param {string} msg
		 */
		blink (color, msg) {
			this.blinkItem(_background, color);
		}

		/**
		 * Blink specific item
		 * This is a "tint" operation so color is blended and may not be what you expect, to really recolor, we have to redraw.
		 * @param {object} item
		 * @param {number} color
		 * @param {number}duration
		 * @param {function} nextFn
		 */
		blinkItem (item, color, duration, nextFn) {
			var blinkColor = color || 0xFF0000;
			var blinkDuration = duration || 200;
			var originalTint = item.tint;
			item.tint = blinkColor;
			setTimeout(function () {
				item.tint = originalTint;
				if (nextFn) {
					nextFn();
				}
			}, blinkDuration);
		}

		/**
		 * Add text with color to background
		 * @param {number} color
		 * @param {string} text
		 */
		addTextToBackground (color, text) {
			let style = {
				fill: color
			};
			let testItem = new PIXI.Text(text, style);
			testItem.x = 0;
			testItem.y = 0;
			_background.addChild(testItem);

		}
		resizeLayout (w, h) {
			console.log('resizeLayout(' + w + ', ' + h +')');
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
