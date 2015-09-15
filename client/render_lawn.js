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
// For a rendered view, we will use a true 3D engine so that we can move the
// camera around so the user can see what the droughtscape will look like.
// We will use a perspective camera.
var threeScene = null;
var threeRenderer = null;
var threeCamera = null;
var runAnimation = false;
var WIDTH = 400, HEIGHT = 300;
var VIEW_ANGLE = 75, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 1000;
var cube;
var threeAnimate = function threeAnimate () {
	if (runAnimation) {
		requestAnimationFrame(threeAnimate);
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
		threeRenderer.render(threeScene, threeCamera)
	}
};

Template.render_lawn.onCreated(function () {
	NavConfig.pushRightBar('rightBar', 'render_lawn');
	runAnimation = true;
});

Template.render_lawn.onDestroyed(function () {
	NavConfig.popRightBar();
	threeCamera = null;
	threeRenderer = null;
	threeScene = null;
	runAnimation = false
});

var render = function render () {
	requestAnimationFrame( render );
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	threeRenderer.render( threeScene, threeCamera );
};

var testMode = true;
Template.render_lawn.onRendered(function () {
	var geometry, material;
	if (testMode) {
		if (threeScene === null) {
			threeScene = new THREE.Scene();
		}
		if (threeCamera === null) {
			threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		}
		if (threeRenderer === null) {
			threeRenderer = new THREE.WebGLRenderer({canvas: document.getElementById('render-canvas')});
		}
		//renderer.setSize(window.innerWidth, window.innerHeight);
		//document.body.appendChild(renderer.domElement);

		geometry = new THREE.BoxGeometry( 10, 1, 1 );
		material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		cube = new THREE.Mesh( geometry, material );
		threeScene.add( cube );

		threeCamera.position.z = 5;

		threeAnimate();
	}
	else {
		if (threeRenderer === null) {
			threeRenderer = new THREE.WebGLRenderer({canvas: document.getElementById('render-canvas')});
			threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		}
		if (threeScene === null) {
			threeScene = new THREE.Scene();
			//threeScene.add(threeCamera);
			//threeRenderer.setSize(WIDTH, HEIGHT);
			//var render = document.getElementById('render-canvas');
			//render.appendChild(threeRenderer.domElement);
			//document.body.appendChild(threeRenderer.domElement);
			geometry = new THREE.BoxGeometry( 1, 1, 1 );
			material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			cube = new THREE.Mesh( geometry, material );
			threeScene.add( cube );
			threeCamera.position.z = 5;
			threeAnimate();
		}
	}
	console.log('render_lawn.onCreated, threeScene: ' + threeScene + ', threeRenderer: ' + threeRenderer);
});