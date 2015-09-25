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
		FitTypeXY:	0,
		FitTypeX:	1,
		FitTypeY:	2
	};
	var _pixiRenderer = null;
	var _setRenderer = function _setRenderer(pixiRenderer) {
		_pixiRenderer = pixiRenderer;
	};
	var _colorTextures = {};
	var _getTexture = function _getTexture(color) {
		if(_colorTextures[color] === undefined) {
			var canvas = document.createElement('canvas');
			canvas.width = 1;
			canvas.height = 1;
			ctx = canvas.getContext('2d');
			ctx.fillStyle = '#' + color.toString(16);
			ctx.beginPath();
			ctx.rect(0,0,1,1);
			ctx.fill();
			ctx.closePath();
			_colorTextures[color] = PIXI.Texture.fromCanvas(canvas);
		}
		return _colorTextures[color];
	};
	var border;
	var background;
	var grid;

	var _rectangle = function _rectangle( x, y, width, height, backgroundColor, borderColor, borderWidth ) {
		console.log('PixiLayout._rectangle(' + x + ', ' + y + ', ' + width + ', ' + height +
			', ' + backgroundColor + ', ' + borderColor + ', ' + borderWidth);
		var box = new PIXI.Container();
		border = new PIXI.Sprite(_getTexture(borderColor));
		border.width = width;
		border.height = height;
		box.addChild(border);
		background = new PIXI.Sprite(_getTexture(backgroundColor));
		background.width = width - 2 * borderWidth;
		background.height = height - 2 * borderWidth;
		background.position.x = borderWidth;
		background.position.y = borderWidth;
		box.addChild(background);
		// gridding?
		grid = new PIXI.Graphics();
		box.addChild(grid);
		box.position.x = x;
		box.position.y = y;
		return box;
	};

	var _modifyRectangle = function _modifyRectangle(rectangle, x, y, width, height, borderWidth) {
		border.width = width;
		border.height = height;
		background.width = width - 2 * borderWidth;
		background.height = height - 2 * borderWidth;
		background.position.x = borderWidth;
		background.position.y = borderWidth;
		rectangle.position.x = x;
		rectangle.position.y = y;
	};

	/**
	 * @namespace PixiLayout
	 * LayoutFrame class furnishing the basic framing data/methods
	 */
	var LayoutFrame = function LayoutFrame () {
		var self = this;
		self.layoutFrame = _rectangle(0, 0, 100, 100, 0xFFFFFF, 0xFF0000, 10);
		/**
		 * gets the PIXI layoutFrame
		 * @memberof PixiLayout
		 * @method getLayoutFrame
		 * @return {object} pixi layout frame container
		 */
		LayoutFrame.prototype.getLayoutFrame = function getLayoutFrame () {
			return self.layoutFrame;
		};
		/**
		 * zooms the frame
		 * @memberof PixiLayout
		 * @method zoom
		 * @param {number} scale scale factor to zoom
		 */
		LayoutFrame.prototype.zoom = function zoom (scale) { console.log('LayoutFrame.prototype.zoom: ' + scale);};
		/**
		 * fits the frame
		 * @memberof PixiLayout
		 * @method fit
		 * @param {number} fitMode type of fit for the frame acceptable values FitType
		 */
		LayoutFrame.prototype.fit = function fit (fitMode) {
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
					x = (pixiRenderWidth - bestFit.widthPixels)/2;
					y = (pixiRenderHeight - bestFit.lengthPixels)/2;
					break;
				case PixiLayout.FitType.FitTypeX:
					bestFit.lengthPixels = (dims.length * pixiRenderWidth) / dims.width;
					// center layout frame in renderer
					y = (pixiRenderHeight - lengthPixels)/2;
					break;
				case PixiLayout.FitType.FitTypeY:
					bestFit.widthPixels = (dims.width * pixiRenderHeight) / dims.length;
					// center layout frame in renderer
					x = (pixiRenderWidth - widthPixels)/2;
					break;
				default :
					// error, no effect
					break;
				}
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
		LayoutFrame.prototype.pan = function pan (dx, dy) {};
		/**
		 * draws a grid with xy spacing in the frame.  spacing is in cm
		 * @memberof PixiLayout
		 * @method drawGrid
		 * @param {boolean} gridEnabled - draw or clear grid
		 * @param {number} spacing - grid spacing in cm
		 */
		LayoutFrame.prototype.drawGrid = function drawGrid (gridEnabled, spacing) {
			// pixel positions
			var startX = background.position.x;
			var startY = background.position.y;
			if (gridEnabled) {
				var gridPixelSpacing = 10;
				// real world coords
				var gridStartX = 0, gridStartY = 0;
				grid.beginFill(0x00FF00);
				for (var i= 0, stop = 100; i < stop; i += gridPixelSpacing) {
					grid.drawCircle(startX + i, startY, 1);
				}
			}
			else {
				// clear the grid
				grid.beginFill(0xFF0000);
				for (i= 0, stop = 100; i < stop; i += gridPixelSpacing) {
					grid.drawCircle(startX + i, startY, 1);
				}
			}
		}
	};
	
	return {
		FitType: FitType,
		setRenderer: _setRenderer,
		LayoutFrame: LayoutFrame
	};
})();