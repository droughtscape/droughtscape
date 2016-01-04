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
var testFlat = true;

ThreeJSViewPlugin = class ThreeJSViewPlugin {
	constructor () {
		this.threeScene = null;
		this.threeCamera = null;
		this.threeRenderer = null;
	}

	/**
	 * This should be called once the threejs engine is initialized
	 * @param threeScene
	 * @param threeCamera
	 * @param threeRenderer
	 */
	setContext (threeScene, threeCamera, threeRenderer) {
		this.threeScene = threeScene;
		this.threeCamera = threeCamera;
		this.threeRenderer = threeRenderer;
	}

	/**
	 * Called from shouldComponentUpdate when it proxies action to here
	 * @param {object} action - See ActionClass and extensions in the store
	 */
	handleAction (action) {
		var delta;
		switch (action.constructor) {
		case ActionInitLawn:
			this.offset = action.offset;
			this.initLawn(action);
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
		//geometry.vertices.push(new THREE.Vector3(10, 0, 0));
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
			if (testFlat) {
				// Set to layout mode
				this.ground.visible = false;
				this.lawn.position.y = 20;
				this.lawn.rotation.x = 0;
			}
			else {
				this.threeScene.position.x -= delta;
			}
		}
		else if (direction === ActionType.PanRt) {
			if (testFlat) {
				this.ground.visible = true;
				this.lawn.position.y = -20;
				this.lawn.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
			}
			else {
				this.threeScene.position.x += delta;
			}
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
		if (testFlat) {
			mesh.position.x = part.locus.x * 10;
			mesh.position.y = -(part.locus.y * 10);
			mesh.rotation.y = Math.PI; //-90 degrees around the yaxis
			this.lawn.add(mesh);
		}
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
		this.grid = ThreeJSViewPlugin.buildGrid(dims);
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
		if (testFlat) {
			mesh.position.x = w/2;
			mesh.position.y = -h/2;
		}
		//mesh.position.y = -20;
		//mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
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
		if (testFlat) {
			mesh.position.x = w/2;
			mesh.position.y = -h/2;
		}
		//mesh.position.y = -20;
		//mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
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
		if (testFlat) {
			mesh.position.x = w/2;
			mesh.position.y = -h/2;
		}
		//mesh.scale.multiplyScalar(1.05);
		return mesh;
	}
	static buildGrid (dims) {
		// create the particle variables
		var particleCount = 1800,
			particles = new THREE.Geometry(),
			pMaterial = new THREE.PointCloudMaterial({
				color: 0xFF0000,
				size: 1
			});

		// now create the individual particles
		for (var p = 0; p < particleCount; p++) {

			// create a particle with random
			// position values, -250 -> 250
			var pX = Math.random() * 500 - 250,
				pY = Math.random() * 500 - 250,
				pZ = 1;

			// add it to the geometry
			particles.vertices.push(new THREE.Vector3(pX, pY, pZ));
		}

		// create the particle system
		var particleSystem = new THREE.ParticleSystem(
			particles,
			pMaterial);

		// add it to the scene
		return particleSystem;
	}
};

// Set the plugin part of ThreeJSView
if (Meteor.isClient) {
	Meteor.startup(function () {
		ThreeJSViewActionStore.setPlugin(new ThreeJSViewPlugin());
	});
}
