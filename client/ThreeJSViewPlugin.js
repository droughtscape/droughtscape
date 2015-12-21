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
	zoomCameraOnScene (direction, delta) {
		delta = (direction === ActionType.ZoomIn) ? 0.2 : -0.2;
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
};

// Set the plugin part of ThreeJSView
if (Meteor.isClient) {
	Meteor.startup(function () {
		ThreeJSViewActionStore.setPlugin(new ThreeJSViewPlugin());
	});
}
