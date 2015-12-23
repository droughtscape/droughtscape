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
LayoutFrame = class LayoutFrame {
	constructor (pixiRenderer) {
		this.pixiRenderer = pixiRenderer;
		this.layoutFrame = this.createLayoutFrame();
		// default scaling
		this.scaleRealToPixel = this.scalePixelToReal = 1.0;
	}
	createLayoutFrame (x, y) {
		console.log('createLayoutFrame');
		this.box = new PIXI.Container();
		this.box.interactive = true;
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
		this.parts = new PIXI.Container();
		this.box.addChild(this.parts);
		this.selectBox = new PIXI.Graphics();
		this.selectBox.visible = false;
		this.box.addChild(this.selectBox);
		return this.box;
	}
	modifyLayoutFrame (x, y,width, height, borderWidth) {
		let box = this.box, 
			background = this.background,
			houseText = this.houseText,
			curbText = this.curbText
			pixiRenderer = this.pixiRenderer;
		background.clear();
		// Now store positional info into background, even though we still have to explicitly draw
		background.innerWidth = width - (2 * borderWidth);
		background.innerHeight = height - (2 * borderWidth);
		background.innerX = borderWidth;
		background.innerY = borderWidth;
		background.width = width;
		background.height = height;
		background.position.x = 0;
		background.position.y = 0;
		background.beginFill(0xFF0000);
		background.drawRect(0, 0, width, height);
		background.beginFill(0xFFFFFF);
		background.drawRect(borderWidth, borderWidth, background.innerWidth, background.innerHeight);
		rectangle.position.x = x;
		rectangle.position.y = y;
		// Safest to use the real session variables to determine _grid
		this.gridEnabled = Session.get(Constants.gridEnabled);
		this.gridSpacing = Session.get(Constants.gridSpacing);
		this.drawGrid(this.gridEnabled, this.gridSpacing);
		// center text horizontally, stick to top and bottom, house and curb respectively
		let midX = width / 2;
		houseText.x = midX - (houseText.width / 2);
		houseText.y = borderWidth;
		curbText.x = midX - (curbText.width / 2);
		curbText.y = background.height - curbText.height;
		pixiRenderer.bgndOffX = x;
		pixiRenderer.bgndOffY = y;
	}
	drawGrid (gridEnabled, gridSpacing) {
		console.log('_drawGrid: ENTRY');
		// Clear the _grid before we draw it so we don't accumulate graphics
		// Always clear since it handles the !gridEnabled case too.
		let grid = this.grid,
			background = this.background;
		grid.clear();
		if (gridEnabled) {
			console.log('_drawGrid, drawing _grid');
			// pixel positions
			var startX = background.position.x;
			var startY = background.position.y;
			// spacing parameter is in cm, convert to pixels
			var gridPixelSpacing = (gridSpacing / 100) * this.scaleRealToPixel;
			// Set _grid point color to teal
			grid.beginFill(0x009688);
			var innerHeight;
			var innerWidth;
			let gridInBorder = false;
			if (gridInBorder) {
				innerWidth = background.innerWidth;
				innerHeight = background.innerHeight;
				startX = background.innerX;
				startY = background.innerY;
			}
			else {
				innerWidth = background.width;
				innerHeight = background.height;
				startX = background.position.x;
				startY = background.position.y;
			}
			for (var row = 0, lastRow = innerHeight; row < lastRow; row += gridPixelSpacing) {
				for (var i = 0, stop = innerWidth; i < stop; i += gridPixelSpacing) {
					grid.drawCircle(startX + i, startY + row, 1);
				}
			}
		}
	}
	updateScale (lengthPixels, lengthMeters) {
		this.scaleRealToPixel = lengthPixels / lengthMeters;
		this.scalePixelToReal = 1.0 / this.scaleRealToPixel;
		let scaleRealToPixel = this.scaleRealToPixel, scalePixelToReal = this.scalePixelToReal;
		// Have to adjust all sprites pixel positions
		this.enumeratePartsFwd(function (part) {
			part.x = part.layoutPart.locus.x * scaleRealToPixel;
			part.y = part.layoutPart.locus.y * scaleRealToPixel;
			part.width = part.layoutPart.width * scaleRealToPixel;
			part.height = part.layoutPart.height * scaleRealToPixel;
		});
	}
	/**
	 * Encapsulates forward enumeration of the _parts children
	 * @param {object} enumFn - callback on each enumerated part.  Return true to stop enumeration, false to continue
	 * @returns {boolean} - false if enumeration was stopped, true if finished for all items
	 * @private
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
};

PixiJSViewPlugin = class PixiJSViewPlugin {
	constructor () {
		this.pixiRenderer = null;
		this.layoutFrame = null;
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
		if (this.layoutFrame === null) {
			this.layoutFrame = new LayoutFrame(this.pixiRenderer);
		}
	}
	/**
	 * Called from shouldComponentUpdate when it proxies action to here
	 * @param {object} action - See ActionClass and extensions in the store
	 */
	handleAction (action) {
		switch (action.constructor.name) {
		case 'ActionInitLayout':
			this.addBackground(0xFEFEFE, 0xFF0000);
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
		background.drawRect(0, 0, this.pixiRenderer.width, this.pixiRenderer.height);
		background.endFill();
		this.pixiRootContainer.addChild(background);
		this.background = background;
	}

	/**
	 * Blink "background"
	 * @param {number} color
	 * @param {string} msg
	 */
	blink (color, msg) {
		this.blinkItem(this.background, color);
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
		this.background.addChild(testItem);

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
