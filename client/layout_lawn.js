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
var pixiContainer = null;
var pixiRenderer = null;
var runAnimation = false;
var pixiAnimate = function pixiAnimate () {
	if (runAnimation) {
		requestAnimationFrame(pixiAnimate);
		watersave.rotation += 0.1
		pixiRenderer.render(pixiContainer);
	}
	else {
		console.log('pixiAnimate: stopping animation');
	}
};

// Test stuff
var texture = PIXI.Texture.fromImage('watersave.jpg');
var watersave = new PIXI.Sprite(texture);
watersave.anchor.x = 0.5;
watersave.anchor.y = 0.5;
watersave.position.x = 200;
watersave.position.y = 200;

Template.layout_lawn.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'layout_lawn');
	runAnimation = true;
});

Template.layout_lawn.onDestroyed(function () {
	NavConfig.popRightBar();
	// Have to stop animation and renderer
	runAnimation = false;
	pixiRenderer = null;
});

Template.layout_lawn.onRendered(function () {
	// The pixiContainer state is kept between entries here but
	// must be managed at a meta level above the create context so that we
	// can distinguish between:
	// 1. entering a new lawn create/open sequence
	// 2. bouncing between layout/render of the current lawn sequence
	if (pixiContainer === null) {
		pixiContainer = new PIXI.Container();
		pixiContainer.addChild(watersave);
	}
	// See onDestroyed() which is stopping animation and clearing pixiRenderer
	// => every time we enter onRendered(), pixiRenderer should be null
	if (pixiRenderer === null) {
		var layout = document.getElementById('layout-canvas');
		pixiRenderer = PIXI.autoDetectRenderer(512,
			384,
			{view:layout}
		);
		//document.body.appendChild(pixiRenderer.view);
		requestAnimationFrame(pixiAnimate);
	}
	console.log('layout_lawn.onRendered, pixiRenderer: ' + pixiRenderer);
});
