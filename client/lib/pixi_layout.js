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

	var _rectanglex = function ( x, y, width, height, backgroundColor, borderColor, borderWidth ) {
		console.log('PixiLayout._rectangle(' + x + ', ' + y + ', ' + width + ', ' + height +
			', ' + backgroundColor + ', ' + borderColor + ', ' + borderWidth);
		var box = new PIXI.Graphics();
		box.lineStyle(borderWidth, borderColor, 1.0);
		box.moveTo(0,0);
		box.lineTo(200,0);
		box.lineTo(200,100);
		box.lineTo(0,100);
		box.lineTo(0,0);
		return box;
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
				var dims = CreateLawnData.lawnData.shape.dims;
				switch (fitMode) {
				case PixiLayout.FitType.FitTypeXY:
					var bestFit = Utils.computeLayoutFrame(dims.width, dims.length, _pixiRenderer.width, _pixiRenderer.height);
					_modifyRectangle(self.layoutFrame, 0, 0, bestFit.widthPixels, bestFit.lengthPixels, 4);
					break;
				case PixiLayout.FitType.FitTypeX:
					var lengthPixels = (dims.length * _pixiRenderer.width) / dims.width;
					_modifyRectangle(self.layoutFrame, 0, 0, _pixiRenderer.width, lengthPixels, 4);
					break;
				case PixiLayout.FitType.FitTypeY:
					var widthPixels = (dims.width * _pixiRenderer.height) / dims.length;
					_modifyRectangle(self.layoutFrame, 0, 0, widthPixels, _pixiRenderer.height, 4);
					break;
				default :
					// error, no effect
					break;
				}
			}
			else {
				_modifyRectangle(self.layoutFrame, 0, 0, (border.width === 200) ? 100 : 200, 300, 4);
				//border.width = (border.width === 200) ? 100 : 200;
				//self.layoutFrame.graphicsData[0].shape.points[2] = 400;
			}
			//var box = _rectangle(0,0,100,100,0xFFFFFF, 0x000000, 10);
		};
		/**
		 * pans the frame
		 * @memberof PixiLayout
		 * @method pan
		 * @param {number} dx amount to shift in x
		 * @param {number} dy amount to shift in y
		 */
		LayoutFrame.prototype.pan = function pan (dx, dy) {};
	};
	
	return {
		FitType: FitType,
		setRenderer: _setRenderer,
		LayoutFrame: LayoutFrame
	};
})();