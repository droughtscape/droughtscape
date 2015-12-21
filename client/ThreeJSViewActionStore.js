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
// Sample store
ActionType = {
	ZoomIn: 0,
	ZoomOut: 1,
	RotateRt: 2,
	RotateLt: 3,
	PanRt: 4,
	PanLt: 5,
	CameraUp: 6,
	CameraDn: 7,
	AddMesh: 8
};

// Sample actions
AbstractAction = class AbstractAction {
	constructor () {}
};

ActionInitLawn = class ActionInitLawn extends AbstractAction {
	constructor () {
		super();
	}
};

ActionZoom = class ActionZoom extends AbstractAction {
	constructor (direction, delta) {
		super();
		this.direction = direction;
		this.delta = delta;
	}
};

ActionRotate = class ActionRotate extends AbstractAction {
	constructor (direction, speed) {
		super();
		this.direction = direction;
		this.speed = speed;
	}
};

ActionPan = class ActionPan extends AbstractAction {
	constructor (direction, delta) {
		super();
		this.direction = direction;
		this.delta = delta;
	}
};

ActionCamera = class ActionCamera extends AbstractAction {
	constructor (direction, delta) {
		super();
		this.direction = direction;
		this.delta = delta;
	}
};

ActionSetCamera = class ActionSetCamera extends AbstractAction {
	constructor (camera) {
		super();
		this.camera = camera;
	}
};

ActionAddMesh = class ActionAddMesh extends AbstractAction {
	constructor (mesh) {
		super();
		this.mesh = mesh;
	}
};



ThreeJSViewActionStore = (function () {
	const EVENT_TYPE = 'ThreeJSViewActionStore';
	Dispatcher.register(function (action) {
		switch (action.type) {
		case 'render':
			handleRenderEvent(action.action);
			break;
		case 'TEST_TRIGGER':
			console.log('TEST_TRIGGER');
			//MBus.publish('_change_', null);
			EventEx.emit('_change_', {data: null});
			break;
		case 'TEST_INIT':
			// Build sample ground
			let dims = {width: 10, height: 4};
			var ground = _buildGround(dims);
			_state.action = new ActionAddMesh(ground);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ZOOM_IN':
			_state.action = new ActionZoom(ActionType.ZoomIn, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ZOOM_OUT':
			_state.action = new ActionZoom(ActionType.ZoomOut, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ROT_RT':
			_state.action = new ActionRotate(ActionType.RotateRt, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'ROT_LT':
			_state.action = new ActionRotate(ActionType.RotateLt, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'PAN_RT':
			_state.action = new ActionPan(ActionType.PanRt, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'PAN_LT':
			_state.action = new ActionPan(ActionType.PanLt, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'SET_ORTHO_CAMERA':
			_state.action = new ActionSetCamera(_createOrthographicCamera(800, 400, -100, 100));
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'SET_PERSPECTIVE_CAMERA':
			_state.action = new ActionSetCamera(_createPerspectiveCamera(75, 400/300, 0.1, 1000));
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'CAMERA_UP':
			_state.action = new ActionCamera(ActionType.CameraUp, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'CAMERA_DN':
			_state.action = new ActionCamera(ActionType.CameraDn, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case 'TEST_MESH':
			_state.action = new ActionAddMesh(_buildMesh('custom.png', 0.5, 0.5, 0.5, 'sphere'));
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		}
	});
	
	var handleRenderEvent = function handleRenderEvent (action) {
		console.log('handleRenderEvent: action: ' + action);
		switch (action) {
		case RenderActionType.Init:
			_state.action = new ActionInitLawn();
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.ZoomIn:
			break;
		case RightBarTagActionType.ZoomOut:
			break;
		case RightBarTagActionType.PanCameraLeft:
			break;
		case RightBarTagActionType.PanCameraRight:
			break;
		case RightBarTagActionType.MoveCameraDn:
			break;
		case RightBarTagActionType.MoveCameraUp:
			break;
		case RightBarTagActionType.RotateCameraLt:
			break;
		case RightBarTagActionType.RotateCameraRt:
			break;
		}
	};
	
	var _state = {
		camera: CameraType.perspective
	};
	
	var _createPerspectiveCamera = function _createPerspectiveCamera (viewAngle, aspect, near, far) {
		return new THREE.PerspectiveCamera(viewAngle, aspect, near, far);
	};
	
	var _createOrthographicCamera = function _createOrthographicCamera (width, height, near, far) {
		return new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, near, far);
	};
	/**
	 * callback to get the plugin which supports app specific rendering
	 * @param {object} plugin - User defined per specific component usage.
	 * @private
	 */
	var _setPlugin = function _setPlugin (plugin) {
		_state.plugin = plugin;
	};
	/**
	 * Sample to build simple mesh
	 * @param url
	 * @param width
	 * @param height
	 * @param depth
	 * @param shape
	 * @returns {THREE.Mesh}
	 * @private
	 */
	var _buildMesh = function _buildMesh (url, width, height, depth, shape) {
		let bitmap = new Image();
		bitmap.src = url;
		bitmap.onerror = function () {
			console.error('Error loading: ' + bitmap.src);
		};
		width = width * 10;
		height = height * 10;
		depth = depth * 10;
		let geometry;
		let texture = THREE.ImageUtils.loadTexture(bitmap.src);
		let material = new THREE.MeshPhongMaterial({ map: texture });
		switch (shape) {
		case 'sphere':
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
		mesh.position.x = 0;
		mesh.position.z = 0;
		return mesh;
	};
	/**
	 * Builds a reference ground plane
	 * @param dims
	 * @returns {THREE.Mesh}
	 * @private
	 */
	var _buildGround = function _buildGround (dims) {
		var w = dims.width * 10;
		var h = dims.height * 10;
		var geometry = new THREE.PlaneGeometry(w, h);
		//var material = new THREE.MeshPhongMaterial({ ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 });
		var material = new THREE.MeshBasicMaterial( { color: 0xd2b48c } );
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.y = -20;
		mesh.rotation.x = -Math.PI/2; //-90 degrees around the xaxis
		mesh.doubleSided = true;
		return mesh;
	};
	
	var _getAll = function _getAll () {
		return _state;
	};
	
	return {
		name: 'ThreeJSViewActionStore',
		setPlugin: _setPlugin,
		getAll: _getAll
	}
})();