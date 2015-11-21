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
		//cube.rotation.x += 0.1;
		//cube.rotation.y += 0.1;
		threeRenderer.render(threeScene, threeCamera)
	}
};

/**
 * _renderRender function to redraw the render
 * typically called from Meteor.defer so that window dimensions
 * are already finalized and usable for scaling
 */
var _renderRender = function _renderRender () {
	var renderContainer = document.getElementById('render-div-container');
	var width;
	var height;
	if (renderContainer) {
		width = renderContainer.clientWidth;
		height = renderContainer.clientHeight;
	}
	else {
		width = 800;
		height = 600;
	}
	var renderCanvas = document.getElementById('render-canvas');
	renderCanvas.height = height;
	renderCanvas.width = width;
};

/**
 * _handleResizeEvent function to handle the resize event.
 * Dynamically resize rightBar height when window resizes.
 * Just use the Meteor.defer() so that the DOM is fully
 * rendered before we call _renderRightBar()
 */
var _handleResizeEvent = Utils.createDeferredFunction(_renderRender);

var unsubscribe = null;

var _handleRenderMessages = function _handleRenderMessages (message) {
	if (MBus.validateMessage(message)) {
		switch (message.value.action) {
		default :
			console.log('_handleRenderMessages: action: ' + message.value.action);
			break;
		}
	}
	else {
		console.log('_handleRenderMessages:ERROR, invalid message: ' + message);
	}
};

Template.render_lawn.onCreated(function () {
	runAnimation = true;
	window.addEventListener('resize', _handleResizeEvent);
	// NavBar events
	unsubscribe = MBus.subscribe(Constants.mbus_render, _handleRenderMessages);
});

Template.render_lawn.onDestroyed(function () {
	threeCamera = null;
	threeRenderer = null;
	threeScene = null;
	runAnimation = false;
	window.removeEventListener('resize', _handleResizeEvent);
	unsubscribe.remove();
});

/**
 * render function to furnish animation energy using requestAnimationFrame()
 * Currently this just animates a test case.
 */
var render = function render () {
	requestAnimationFrame( render );
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;
	threeRenderer.render( threeScene, threeCamera );
};

var testMode = true;

/**
 * getRenderer function to return proper WebGL or Canvas renderer, setting the passed in canvas into the renderer
 * @param {object} canvas html canvas to use
 * @returns {object} Appropriate threejs renderer
 */
var getRenderer = function getRenderer (canvas) {
	return Detector.webgl? new THREE.WebGLRenderer({canvas: canvas}): new THREE.CanvasRenderer({canvas: canvas});
};

var _callbackLayoutPart = function _callbackLayoutPart (part) {
	console.log('_callbackLayoutPart: part: location[' + part.locus.x + ', ' + part.locus.y + ', ' + part.locus.z + 
		']' + ', rotation[' + part.locus.rotation + ']');
	console.log('_callbackLayoutPart: abstractPart.id: ' + part.abstractPart.id.value + ', depth: ' + part.abstractPart.depth);
};

var _buildSky = function _buildSky () {
	// ref: http://joshondesign.com/p/books/canvasdeepdive/chapter11.html
	var urls = [
		'sky.png',
		'sky.png',
		'sky.png',
		'sky.png',
		'sky.png',
		'sky.png'
	];
	var size = 10000;
	var geometry = new THREE.BoxGeometry(size, size, size);
	//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
	var material = new THREE.MeshBasicMaterial( { color: 0x87ceeb } );
	var mesh = new THREE.Mesh(geometry, material);
	mesh.flipSided = true;
	return mesh;
	
	//var textureCube = THREE.ImageUtils.loadTextureCube(urls);
	////setup the cube shader 
	//var shader = THREE.ShaderUtils.lib["cube"];
	//var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
	//uniforms['tCube'].texture = textureCube;
	//var material = new THREE.ShaderMaterial({
	//	fragmentShader : shader.fragmentShader,
	//	vertexShader   : shader.vertexShader,
	//	uniforms       : uniforms
	//});
	//return material;
};

var _buildGround = function _buildGround () {
	var w = 100;
	var h = 40;
	var geometry = new THREE.PlaneGeometry(w, h);
	//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
	var material = new THREE.MeshBasicMaterial( { color: 0xd2b48c } );
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.y = -20;
	mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
	mesh.doubleSided = true;
	return mesh;
};

Template.render_lawn.onRendered(function () {
	// Start dropdowns
	$(".dropdown-button").dropdown();

	var geometry, material;
	var infoContainer = document.getElementById('info-container');
	// compute offset occupied by the infoContainer
	var offset = infoContainer.offsetTop + infoContainer.clientHeight;
	var renderCanvas = document.getElementById('render-canvas');
	var renderContainer = document.getElementById('render-div-container');
	var width = (renderContainer) ? renderContainer.clientWidth : 800;
	var height = (renderContainer) ? renderContainer.clientHeight : 600;
	// adjust canvas height by offset to account for infoContainer 
	height -= offset;
	renderCanvas.height = height;
	renderCanvas.width = width;
	
	if (threeScene === null) {
		threeScene = new THREE.Scene();
	}
	if (threeCamera === null) {
		threeCamera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	}
	if (threeRenderer === null) {
		threeRenderer = getRenderer(renderCanvas);
	}
	//renderer.setSize(window.innerWidth, window.innerHeight);
	//document.body.appendChild(renderer.domElement);
	
	// Now see if we can get the real stuff
	LayoutManager.enumerateLayout(_callbackLayoutPart);
	var skyMesh = _buildSky();
	skyMesh.position.z = -50;
	threeScene.add(skyMesh);
	
	var ground = _buildGround();
	threeScene.add(ground);
	
	//geometry = new THREE.BoxGeometry( 10, 1, 1 );
	//material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	//cube = new THREE.Mesh( geometry, material );
	//threeScene.add( cube );
	
	//add sunlight 
	var light = new THREE.SpotLight();
	light.position.set(0,500,0);
	//threeScene.add(light);

	threeCamera.position.z = 100;

	threeAnimate();
	console.log('render_lawn.onCreated, threeScene: ' + threeScene + ', threeRenderer: ' + threeRenderer);
});