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
	constructor (dims) {
		super();
        this.dims = dims;
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
		if (action.type === 'render') {
			handleRenderEvent(action.action);
		}
	});
	
	var handleRenderEvent = function handleRenderEvent (action) {
		console.log('handleRenderEvent: action: ' + action);
		switch (action) {
		case RenderActionType.Init:
			_state.action = new ActionInitLawn(CreateLawnData.lawnData.shape.dims);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.ZoomIn:
			_state.action = new ActionZoom(ActionType.ZoomIn, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.ZoomOut:
			_state.action = new ActionZoom(ActionType.ZoomOut, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.PanCameraLeft:
			_state.action = new ActionPan(ActionType.PanLt, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.PanCameraRight:
			_state.action = new ActionPan(ActionType.PanRt, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.MoveCameraDn:
			_state.action = new ActionCamera(ActionType.CameraDn, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.MoveCameraUp:
			_state.action = new ActionCamera(ActionType.CameraUp, 10);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.RotateCameraLt:
			_state.action = new ActionRotate(ActionType.RotateLt, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		case RightBarTagActionType.RotateCameraRt:
			_state.action = new ActionRotate(ActionType.RotateRt, 0.2);
			EventEx.emit(EVENT_TYPE, {data: null});
			break;
		}
	};
	
	var _state = {
		camera: CameraType.perspective
	};
	
	/**
	 * callback to get the plugin which supports app specific rendering
	 * @param {object} plugin - User defined per specific component usage.
	 * @private
	 */
	var _setPlugin = function _setPlugin (plugin) {
		_state.plugin = plugin;
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