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
	constructor(abstractPart, x, y, z, rotation) {
		this.abstractPart = abstractPart;
		this.locus = new AbstractLayoutLocus(x, y, z, rotation);
		this.width = abstractPart.width;
		this.height = abstractPart.height;
		this.imageUrl = abstractPart.url;
		this.locus.x = this.locus.x - (this.width / 2);
		this.locus.y = this.locus.y - (this.height / 2);
	}

	copyMe(x, y, rotation) {
		let copy = new AbstractPart(_abstractPart, x, y, rotation);
		return copy;
	}
};


// Use module to create public singleton created at load time and also to add global enumeration and getDefaultFitMode
// Also gives us namespace
/**
 * Encapsulates the singleton proxy between layout and layout(s) => persistent data
 * Manages things that are related to laying out a lawn, assumes the lawn is already configured
 * For layout, we use pixijs since we want a true 2D view to simplify the layout.
 * We will use a top view, looking down on the lawn area from above to simplify
 * the actual layout activity.
 * @namespace LayoutManager
 */
LayoutManager = (function () {
	/**
	 * internal class implementing most of LayoutManager functionality
	 * @type {LayoutManagerInternal}
	 */
	var LayoutManagerInternal = class LayoutManagerInternal {
		constructor() {
			this.pluginRenderer = null;
			this.activeLayoutPart = null;
			this.currentAbstractPart = null;
			this.currentLayout = [];
			this.actionStack = [];
			this.currentLawnItemId = null;
			this.currentLayoutPart = null;
		}

		setPluginRenderer(renderer) {
			this.pluginRenderer = renderer;
		}

		setActiveLayoutPart(part) {
			this.activeLayoutPart = part;
			return this.activeLayoutPart;
		}

		// Forwarding methods for plugInRenderer
		isValid() {
			return this.pluginRenderer && this.pluginRenderer.isValid();
		}

		createLayout(canvas, w, h) {
			return this.pluginRenderer.createLayout(canvas, w, h);
		}

		destroyLayout() {
			return this.pluginRenderer.destroyLayout();
		}

		resizeLayout(newWidth, newHeight, fitMode) {
			this.pluginRenderer.resizeLayout(newWidth, newHeight, fitMode);
		}

		startAnimation() {
			this.pluginRenderer.startAnimation();
		}

		enableAnimation(enable) {
			this.pluginRenderer.enableAnimation(enable);
		}

		// Mouse handlers
		mouseDnSelectHandler(pixelPt) {
			this.pluginRenderer.setMouseMvHandler(pixelPt => LayoutManager.mouseMvSelectHandler(pixelPt));
			this.pluginRenderer.enableSelectBox(true);
		}

		mouseMvSelectHandler(pixelPt) {
			this.pluginRenderer.drawSelectBox();
		}

		mouseUpSelectHandler(pixelPt) {
			this.pluginRenderer.setMouseMvHandler(null);
			this.pluginRenderer.finishSelectBox();
		}

		mouseMvCreateHandler(noop, pixelPt) {
			this.pluginRenderer.moveMouseSprite(pixelPt);
		}

		mouseEnterCreateHandler(pixelPt) {
			this.pluginRenderer.setMouseMvHandler((noop, pixelPt) => LayoutManager.mouseMvCreateHandler(noop, pixelPt));
			this.pluginRenderer.enableMouseSprite(true, pixelPt, this.activeLayoutPart);
		}

		mouseLeaveCreateHandler() {
			this.pluginRenderer.setMouseMvHandler(null);
			this.pluginRenderer.enableMouseSprite(false);
		}

		mouseUpCreateHandler(pixelPt) {
			if (this.pluginRenderer.isMouseUpDnSame() && this.activeLayoutPart) {
				var scalePixelToReal = this.pluginRenderer.getScalePixelToReal();
				this.pluginRenderer.createLayoutPart(LayoutManager.addItem(this.activeLayoutPart, pixelPt.x * scalePixelToReal, pixelPt.y * scalePixelToReal),
					pixelPt.x, pixelPt.y);
			}
		}

		setMouseMode(mouseMode) {
			var targetEnterHandler = null;
			var targetLeaveHandler = null;
			var targetDnHandler = null;
			var targetUpHandler = null;
			var targetMvHandler = null;
			switch (mouseMode) {
			default:
			case LayoutManager.MOUSE_MODE.Select:
				// Go all in, switch to ES6 fat arrow functions for lexical this binding and we don't have to use .bind()
				targetDnHandler = pixelPt => LayoutManager.mouseDnSelectHandler(pixelPt);
				targetUpHandler = pixelPt => LayoutManager.mouseUpSelectHandler(pixelPt);
				targetMvHandler = pixelPt => LayoutManager.mouseMvSelectHandler(pixelPt);
				break;
			case LayoutManager.MOUSE_MODE.Create:
				targetEnterHandler = pixelPt => LayoutManager.mouseEnterCreateHandler(pixelPt);
				targetLeaveHandler = () => LayoutManager.mouseLeaveCreateHandler();
				targetUpHandler = pixelPt => LayoutManager.mouseUpCreateHandler(pixelPt);
				break;
			}
			this.pluginRenderer.setMouseDnHandler(targetDnHandler);
			this.pluginRenderer.setMouseMvHandler(targetMvHandler);
			this.pluginRenderer.setMouseUpHandler(targetUpHandler);
			this.pluginRenderer.setMouseEnterHandler(targetEnterHandler);
			this.pluginRenderer.setMouseLeaveHandler(targetLeaveHandler);
		}

		loadLayout(lawnItemId) {
			this.currentLawnItemId = lawnItemId;
			return false;
		}

		static saveLayout() {
			return false;
		}

		saveAsLayout(lawnItemId) {

		}

		clearCurrentLayout() {
			this.currentLayout = [];
			this.actionStack = [];
		}

		addItem(abstractPart, x, y, rotation) {
			var layoutPart = new LayoutPart(abstractPart, x, y, rotation);
			this.currentLayout.push(layoutPart);
			this.currentLayoutPart = layoutPart;
			return layoutPart;
		}

		delItem(item) {
			let foundIndex = -1;
			for (var i = 0, len = this.currentLayout.length; i < len; ++i) {
				if (this.currentLayout[i] === item) {
					foundIndex = i;
					break;
				}
			}
			if (foundIndex >= 0) {
				let removedPart = this.currentLayout.splice(foundIndex, 1);
				if (removedPart && removedPart.length === 1) {
					// part is removed
				}
			}
			return null;
		}

		selectItem(item) {
			this.currentLayoutPart = item;
			return item;
		}

		static copyItem(item) {
			let copy = item.copyMe();
			return copy;
		}

		moveItem(item, x, y, rotation) {
			item._x = x || item._x;
			item._y = y || item._y;
			item._rotation = rotation || item._rotation;
			this.currentLayoutPart = item;
			return item;
		}

		// proxy to plugin
		validSelection() {
			return this.pluginRenderer.validSelection();
		}

		moveForward() {
			this.pluginRenderer.moveForward();
		}

		moveToFront() {
			this.pluginRenderer.moveToFront();
		}

		moveBackward() {
			this.pluginRenderer.moveBackward();
		}

		moveToBack() {
			this.pluginRenderer.moveToBack();
		}

		undoLastAction() {

		}

		setCurrentAbstractPart(abstractPart) {
			this.currentAbstractPart = abstractPart;
		}

		getCurrentAbstractPart() {
			return this.currentAbstractPart;
		}

		enumerateLayout(callback) {
			this.pluginRenderer.enumerateLayoutParts(callback);
		}
	};

	let SINGLETON = new LayoutManagerInternal();
	const MOUSE_MODE = {Select: 0, Create: 1};
	// Hook into the prototype chain here just in case we decide to not be singleton.
	LayoutManagerInternal.prototype.MOUSE_MODE = MOUSE_MODE;
	LayoutManagerInternal.prototype.getDefaultFitMode = function () {
		return FitType.FitTypeXY;
	};
	return SINGLETON;
})();


