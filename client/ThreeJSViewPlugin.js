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

ThreeJSViewPlugin = class ThreeJSViewPlugin {
	constructor () {
		this.threeScene = null;
		this.threeCamera = null;
		this.threeRenderer = null;
	}

	/**
	 * This should be called once the threejs engine is initialized
	 * @param {object} canvas - dom element that threejs is rendering onto
	 * @param {object} threeScene
	 * @param {object} threeCamera
	 * @param {object} threeRenderer
	 */
	setContext (canvas, threeScene, threeCamera, threeRenderer) {
		console.log('ThreeJSViewPlugin:setContext');
		this.canvas = canvas;
		this.threeScene = threeScene;
		this.threeCamera = threeCamera;
		this.threeRenderer = threeRenderer;
	}

	/**
	 * Should be called when the component is unloading
	 */
	clearContext () {
		console.log('ThreeJSViewPlugin:clearContext');
		// Clear context
		this.canvas = null;
		this.threeScene = null;
		this.threeCamera = null;
		this.threeRenderer = null;
	}
	/**
	 * Called directly from the store when it proxies action to here
	 * @param {object} action - See ActionClass and extensions in the store
	 */
	handleAction (action) {
		var delta;
		switch (action.constructor) {
		case ActionInitLawn:
			this.offset = action.offset;
			this.initLawn(action);
			// Store initial state
			this.initialState = {threeCamera: {position: {}}, threeScene: {position: {}}};
			this.initialState.threeCamera.zoom = this.threeCamera.zoom;
			this.initialState.threeCamera.position.x = this.threeCamera.position.x;
			this.initialState.threeCamera.position.y = this.threeCamera.position.y;
			this.initialState.threeCamera.position.z = this.threeCamera.position.z;
			this.initialState.threeScene.position.x = this.threeScene.position.x;
			this.initialState.threeScene.position.y = this.threeScene.position.y;
			this.initialState.threeScene.position.z = this.threeScene.position.z;
			
			// Force a reset to get size correct
			window.dispatchEvent(new Event('resize'));
			break;
		case ActionNewPart:
			this.renderPart(action.part);
			break;
		case ActionZoom:
			this.zoomCameraOnScene(action.direction, action.delta);
			break;
		case ActionRotate:
			this.rotateCameraAroundScene(action.speed, action.direction);
			break;
		case ActionPan:
			this.panCameraAcrossScene(action.direction, action.delta);
			break;
		case ActionCamera:
			console.log('ActionCamera: xyz: ' + this.threeCamera.position.x + ', ' + this.threeCamera.position.y + ', ' + this.threeCamera.position.z);
			delta = (action.direction === ActionType.CameraUp) ? action.delta : -action.delta;
			this.threeCamera.position.y += delta;
			this.threeCamera.position.z -= delta;
			//let yOld = this.threeCamera.position.y;
			//let zOld = this.threeCamera.position.z;
			//this.threeCamera.position.y = zOld;
			//this.threeCamera.position.z = yOld;
			break;
		case ActionAddMesh:
			this.threeScene.add(action.mesh);
			break;
		case ActionResetView:
			this.resetView();
			break;
		case ActionResizeLayout:
			if (this.lastResizeW !== action.w || this.lastResizeH !== action.h) {
				this.lastResizeW = action.w;
				this.lastResizeH = action.h;
				this.resizeLayout(action.w, action.h);
			}
			break;
		}
	}
	/**
	 * Called from ThreeJSView when it proxies action to here before the component is mounted -> no setState() can be done
	 * This is strictly for actions that bypass the view
	 * @param {object} action - See ActionClass and extensions in the store
	 */
	handleActionUnmounted (action) {
		console.log('handleActionUnmounted: ' + action.constructor.name);
	}

	/**
	 * Reset the view to the initial state
	 */
	resetView () {
		this.threeCamera.zoom = this.initialState.threeCamera.zoom;
		this.threeCamera.position.x = this.initialState.threeCamera.position.x;
		this.threeCamera.position.y = this.initialState.threeCamera.position.y;
		this.threeCamera.position.z = this.initialState.threeCamera.position.z;
		this.threeScene.position.x = this.initialState.threeScene.position.x;
		this.threeScene.position.y = this.initialState.threeScene.position.y;
		this.threeScene.position.z = this.initialState.threeScene.position.z;
		this.threeCamera.updateProjectionMatrix();
	}
	/**
	 * Zooming functionality
	 * @param {number} direction - scale in or out
	 * @param {number} delta - magnitude of the zoom
	 */
	zoomCameraOnScene (direction, delta) {
		if (direction === ActionType.ZoomOut) {
			delta = -delta;
		}
		this.threeCamera.zoom += delta;
		this.threeCamera.updateProjectionMatrix();
		this.threeCamera.lookAt(this.threeScene.position);
	}
	/**
	 * Example of camera rotation around center point of scene
	 * @param rotSpeed
	 * @param direction
	 */
	rotateCameraAroundScene (rotSpeed, direction) {
		var x = this.threeCamera.position.x,
			y = this.threeCamera.position.y,
			z = this.threeCamera.position.z;

		switch (direction) {
		case ActionType.RotateLt:
			this.threeCamera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
			break;
		case ActionType.RotateRt:
			this.threeCamera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
			break;
		case ActionType.RotateDn:
			this.threeCamera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) - y * Math.sin(rotSpeed);
			break;
		case ActionType.RotateUp:
			this.threeCamera.position.y = y * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) + y * Math.sin(rotSpeed);
			break;
		}
		console.log('rotateCameraAroundStore: ' + this.threeCamera.position.x + ', ' + this.threeCamera.position.y + ', ' + this.threeCamera.position.z);
		// draw vector
		//this.drawVector(this.threeCamera.position.x,this.threeCamera.position.y,this.threeCamera.position.z);
		
		//if (direction === ActionType.RotateLt){
		//	this.threeCamera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
		//	this.threeCamera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
		//} else if (direction === ActionType.RotateRt){
		//	this.threeCamera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
		//	this.threeCamera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
		//}

		this.threeCamera.lookAt(this.threeScene.position);
	}

	/**
	 * Debug 
	 * @param x
	 * @param y
	 * @param z
	 */
	drawVector (x, y, z) {
		if (this.cameraVector) {
			let selectedObject = this.threeScene.getObjectByName('cameraVector');
			this.threeScene.remove(selectedObject);
		}

		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(x, y, z));
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		var cameraVector = new THREE.Line(geometry, material);
		cameraVector.name = 'cameraVector';
		this.threeScene.add(cameraVector);
	}

	/**
	 * Example of panning horizontally across scene
	 * @param direction
	 * @param delta
	 */
	panCameraAcrossScene (direction, delta) {
		if (direction === ActionType.PanLt) {
			this.threeScene.position.x -= delta;
		}
		else if (direction === ActionType.PanRt) {
			this.threeScene.position.x += delta;
		}
		this.threeCamera.lookAt(this.threeScene.position);
	}

	/**
	 * Sample code from http://ourklass.my1.ru/engines/three/beginner/2-mouse.js.html
	 * Reference only, not used
	 * @param x
	 * @param y
	 * @param depth
	 * @param position
	 */
	screenToWorld (x, y, depth, position) {
		let camera = {};
		camera.mouse = {};
		camera.plane = {position: {x: x, y: y, z: -depth}};
		
		camera.plane.position.z = -depth;
		camera.mouse.x = (x / renderer.domElement.width) * 2 - 1;
		camera.mouse.y = -(y / renderer.domElement.height) * 2 + 1;
		thiscamera.raycaster.setFromCamera(camera.mouse, this);
		var object = this.raycaster.intersectObject(this.plane)[0];
		position.copy(object !== undefined ? object.point : position);
	}

	/**
	 * Exploratory code to map mouse to world coordinates.  Not used
	 * @param x
	 * @param y
	 * @param w
	 * @param h
	 * @returns {*}
	 */
	mouseToWorld (x, y, w, h) {
		var vector = new THREE.Vector3();
		vector.set((x / this.canvas.width) * 2 - 1,
		- (y / (this.canvas.height)) * 2 + 1,
		0.5);
		vector.unproject (this.threeCamera);
		var dir = vector.sub(this.threeCamera.position).normalize();
		var distance = -this.threeCamera.position.z / dir.z;
		return this.threeCamera.position.clone().add(dir.multiplyScalar(distance));
	}

	/**
	 * Renders a three.js display only version of LayoutPart (part)
	 * @param {LayoutPart} part - The LayoutPart to render
	 */
	renderPart (part) {
		console.log('renderPart: class: ' + part.abstractPart.constructor.name);
		let abstractPart = part.abstractPart;
		let bitmap = new Image();
		bitmap.src = abstractPart.url;
		bitmap.onerror = function () {
			console.error('Error loading: ' + bitmap.src);
		};
		let width = abstractPart.width * 10;
		let height = abstractPart.height * 10;
		let depth = abstractPart.depth * 10;
		let geometry;
		let texture = THREE.ImageUtils.loadTexture(bitmap.src);
		let material = new THREE.MeshPhongMaterial({ map: texture });
		switch (abstractPart.renderShape) {
		case RenderShapeType.sphere:
			geometry = new THREE.SphereGeometry(depth / 2, 64, 64);
			break;
		default:
			geometry = new THREE.BoxGeometry(width, height, depth);
			break;
		}
		let mesh = new THREE.Mesh(geometry, material);
		// part.locus is UL in real units
		mesh.position.x = (part.locus.x + (part.width / 2)) * 10;
		mesh.position.y = -((part.locus.y + (part.height / 2)) * 10);
		mesh.position.z = ((part.height + part.abstractPart.heightOffset) / 2 * 10);
		mesh.rotation.y = -(Math.PI / 2); //-90 degrees around the yaxis
		// This might not be necessary.  Currently, it will cause parts to "face the camera"
		mesh.rotation.x = (Math.PI / 2); //+90 degrees around the xaxis
		this.lawn.add(mesh);
		//mesh.position.y = -20 + (depth / 2);
		//mesh.rotation.y = -Math.PI/2; //-90 degrees around the yaxis
		//// adjust x
		//mesh.position.x = (part.locus.x - this.midX) * 10;
		//mesh.position.z = (part.locus.y - this.midZ) * 10;
		//this.threeScene.add(mesh);
	}

	/**
	 * Setup the render surface
	 * @param {object} action
	 */
	initLawn (action) {
		let dims = action.dims;
		this.midX = dims.width / 2;
		this.midZ = dims.length / 2;
		this.layoutOutline = ThreeJSViewPlugin.buildLayoutOutline(dims);
		this.layout = ThreeJSViewPlugin.buildLayout(dims);
		this.grid = this.buildGrid(dims);
		this.ground = ThreeJSViewPlugin.buildGround(dims);
		
		this.lawn = new THREE.Group();
		this.w = dims.width * 10;
		this.h = dims.length * 10;
		//this.lawn.add(this.layoutOutline);
		this.lawn.add(this.layout);
		this.lawn.add(this.grid);
		this.lawn.add(this.ground);
		this.threeScene.add(this.lawn);
		this.lawn.position.x = -this.w/2;
		this.lawn.position.y = this.h/2;
		// enumerate the 2D layout
		// This is done by dispatching ActionEnumerateParts to the 'layout' store with 'render' as the sender
		// This causes the layout component to enumerate its parts and dispatch NewPart messages to the render store
		// and these then get proxied to this plugin as ActionNewPart events that populate the threejs threeScene
		// Must use setTimeout to decouple as the dispatch cannot be from within a current dispatch
		setTimeout(function () {
			Dispatcher.dispatch('layout', new Message.ActionEnumerateParts(LayoutActionType.EnumerateParts, 'render'));
		}, 0);
		
		this.lawn.position.y = -20;
		this.lawn.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
	}

	/**
	 * NOOP
	 * @param {number} w
	 * @param {number} h
	 */
	resizeLayout (w, h) {
		// For ThreeJSView, nothing to do
	}
	/**
	 * Builds a reference ground plane
	 * @param dims
	 * @returns {THREE.Mesh}
	 * @private
	 */
	static buildGround (dims) {
		var w = dims.width * 10;
		var h = dims.length * 10;
		var geometry = new THREE.PlaneGeometry(w, h);
		//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
		var material = new THREE.MeshBasicMaterial( { color: 0xd2b48c } );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = w/2;
		mesh.position.y = -h/2;
		mesh.doubleSided = true;
		return mesh;
	}
	/**
	 * Builds a reference layout plane
	 * @param dims
	 * @returns {THREE.Mesh}
	 * @private
	 */
	static buildLayout (dims) {
		var w = dims.width * 10;
		var h = dims.length * 10;
		var geometry = new THREE.PlaneGeometry(w, h);
		//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
		var material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = w/2;
		mesh.position.y = -h/2;
		mesh.doubleSided = true;
		return mesh;
	}
	/**
	 * Builds a reference layout plane outline
	 * @param dims
	 * @returns {THREE.Mesh}
	 * @private
	 */
	static buildLayoutOutline (dims) {
		var w = (dims.width) * 10 + 2;
		var h = (dims.length) * 10 + 2;
		var geometry = new THREE.PlaneGeometry(w, h);
		//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
		var material = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = w/2;
		mesh.position.y = -h/2;
		//mesh.scale.multiplyScalar(1.05);
		return mesh;
	}

	/**
	 * Creates a grid that matches the layout grid for user reference
	 * @param {object} dims - width, length
	 * @returns {THREE.ParticleSystem}
	 */
	buildGrid (dims) {
		// create the particle variables
		var particles = new THREE.Geometry(),
			pMaterial = new THREE.PointCloudMaterial({
				color: 0xFF0000,
				size: .4
			}),
			midX = (dims.width * 10) / 2,
			midY = (dims.length * 10) / 2,
			startRowX = this.layout.position.x - midX,
			startRowY = this.layout.position.y + midY,
			stopRowX = startRowX + (dims.width * 10),
			gridSpacing = Session.get(Constants.gridSpacing) / 10;

		// now create the individual particles
		for (var pY = startRowY, stopRowY = startRowY - (dims.length * 10); pY >= stopRowY; pY -= gridSpacing) {
			for (var pX = startRowX; pX <= stopRowX; pX += gridSpacing) {
				particles.vertices.push(new THREE.Vector3(pX, pY, 0));
			}
		}

		// create the particle system
		return new THREE.ParticleSystem(
			particles,
			pMaterial);
	}
};

// Set the plugin part of ThreeJSView
if (Meteor.isClient) {
	Meteor.startup(function () {
		ThreeJSViewActionStore.setPlugin(new ThreeJSViewPlugin());
	});
}
