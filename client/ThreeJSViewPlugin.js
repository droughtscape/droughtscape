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
		switch (action.constructor.name) {
		case 'ActionInitLawn':
			this.offset = action.offset;
			this.initLawn(action);
			// Force a reset to get size correct
			window.dispatchEvent(new Event('resize'));
			break;
		case 'ActionNewPart':
			this.newPart(action.part);
			break;
		case 'ActionZoom':
			this.zoomCameraOnScene(action.direction, action.delta);
			break;
		case 'ActionRotate':
			this.rotateCameraAroundScene(action.speed, action.direction);
			break;
		case 'ActionPan':
			this.panCameraAcrossScene(action.direction, action.delta);
			break;
		case 'ActionCamera':
			delta = (action.direction === ActionType.CameraUp) ? action.delta : -action.delta;
			this.threeCamera.position.y += delta;
			break;
		case 'ActionAddMesh':
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
			z = this.threeCamera.position.z;

		if (direction === ActionType.RotateLt){
			this.threeCamera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
		} else if (direction === ActionType.RotateRt){
			this.threeCamera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
			this.threeCamera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
		}

		this.threeCamera.lookAt(this.threeScene.position);
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
	callbackLayoutPart (part) {
		console.log('_callbackLayoutPart: part: location[' + part.locus.x + ', ' + part.locus.y + ', ' + part.locus.z +
			']' + ', rotation[' + part.locus.rotation + ']');
		console.log('_callbackLayoutPart: abstractPart.id: ' + part.abstractPart.id.value + ', depth: ' + part.abstractPart.depth);
		this.buildPart(part);
	}
	buildPart (part) {
		console.log('_buildPart: class: ' + part.abstractPart.constructor.name);
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
		mesh.position.y = -20 + (depth / 2);
		mesh.rotation.y = -Math.PI/2; //-90 degrees around the yaxis
		// adjust x
		mesh.position.x = (part.locus.x - this.midX) * 10;
		mesh.position.z = (part.locus.y - this.midZ) * 10;
		this.threeScene.add(mesh);
	}
	initLawn (action) {
		let dims = action.dims;
		this.midX = dims.width / 2;
		this.midZ = dims.length / 2;
		let ground = ThreeJSViewPlugin.buildGround(dims);
		this.threeScene.add(ground);
		// enumerate the 2D layout
		// This is done by dispatching ActionEnumerateParts to the 'layout' store with 'render' as the sender
		// This causes the layout component to enumerate its parts and dispatch NewPart messages to the render store
		// and these then get proxied to this plugin as ActionNewPart events that populate the threejs threeScene
		// Must use setTimeout to decouple as the dispatch cannot be from within a current dispatch
		setTimeout(function () {
			Dispatcher.dispatch('layout', new Message.ActionEnumerateParts(LayoutActionType.EnumerateParts, 'render'));
		}, 0);
	}
	newPart (part) {
		console.log('newPart: part: ' + part);
		this.buildPart(part);
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
		mesh.position.y = -20;
		mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
		mesh.doubleSided = true;
		return mesh;
	}
};

// Set the plugin part of ThreeJSView
if (Meteor.isClient) {
	Meteor.startup(function () {
		ThreeJSViewActionStore.setPlugin(new ThreeJSViewPlugin());
	});
}
