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

MouseMode = {
	Select: 0,
	Create: 1,
	Move: 2
};

// Sample actions
AbstractAction = class AbstractAction {
	constructor () {}
};

ActionInitLayout = class ActionInitLayout extends AbstractAction {
	constructor (fitMode, offset, mouseMode, currentAbstractPart) {
		super();
		this.fitMode = fitMode;
		this.offset = offset;
		this.mouseMode = mouseMode;
		this.currentAbstractPart = currentAbstractPart;
	}
};

ActionEnumerateLayout = class ActionEnumerateLayout extends AbstractAction {
	constructor (receiver) {
		super();
		this.receiver = receiver;
	}
};

ActionSetAbstractPart = class ActionSetAbstractPart extends AbstractAction {
	constructor (abstractPart) {
		super();
		this.abstractPart = abstractPart;
	}
};

ActionSetMouseMode = class ActionSetMouseMode extends AbstractAction {
	constructor (mouseMode, abstractPart) {
		super();
		this.mouseMode = mouseMode;
		this.abstractPart = abstractPart;
	}
};

ActionDeleteItems = class ActionDeleteItems extends AbstractAction {
	constructor () {
		super();
	}
};

ActionCopyItems = class ActionCopyItems extends AbstractAction {
	constructor () {
		super();
	}
};

ActionPasteItems = class ActionPasteItems extends AbstractAction {
	constructor () {
		super();
	}
};

ActionUndo = class ActionUndo extends AbstractAction {
	constructor () {
		super();
	}
};

ActionMoveToFront = class ActionMoveToFront extends AbstractAction {
	constructor () {
		super();
	}
};

ActionMoveToBack = class ActionMoveToBack extends AbstractAction {
	constructor () {
		super();
	}
};

ActionMoveForward = class ActionMoveForward extends AbstractAction {
	constructor () {
		super();
	}
};

ActionMoveBackward = class ActionMoveBackward extends AbstractAction {
	constructor () {
		super();
	}
};

ActionAddBackground = class ActionAddBackground extends AbstractAction {
	constructor (color, borderColor) {
		super();
		this.color = color;
		this.borderColor = borderColor;
	}
};

ActionFitLayout = class ActionFitLayout extends AbstractAction {
	constructor (fitMode) {
		super();
		this.fitMode = fitMode;
	}
};

ActionBlink = class ActionBlink extends AbstractAction {
	constructor (color, msg) {
		super();
		this.color = color;
		this.msg = msg;
	}
};

ActionText = class ActionText extends AbstractAction {
	constructor (color, text) {
		super();
		this.color = color;
		this.text = text;
	}
};

/**
 * Singleton layout store
 * @type {{setPlugin, getAll, getState}}
 */
PixiJSViewActionStore = (function () {
	const EVENT_TYPE = 'PixiJSViewActionStore';
	Dispatcher.register(function (action) {
		if (action.type === 'layout') {
			handleLayoutEvent(action);
		}
	});
	var _currentMouseState;
	var _currentAbstractPart = null;
	var _currentSelectedPart = null;
	/**
	 * Handle state of store, emit appropriate actions to the view/plugin
	 * @param {object} action
	 */
	var handleLayoutEvent = function handleLayoutEvent (action) {
		let emit = true;
		console.log('handleLayoutEvent:ENTRY action.action: ' + action.action);
		switch (action.action) {
		case LayoutActionType.Init:
			_state.action = new ActionInitLayout(FitType.FitTypeXY, 
				action.offset, 
				(_currentAbstractPart) ? MouseMode.Create : MouseMode.Select, 
				_currentAbstractPart);
			_currentMouseMode = _state.action.mouseMode;
			console.log('handleLayoutEvent:INFO action: ' + _state.action.constructor.name);
			break;
		case LayoutActionType.EnumerateParts:
			_state.action = new ActionEnumerateLayout(action.receiver);
			break;
		case LayoutActionType.SetAbstractPart:
			// Duplicate events can occur, filter them here
			if ((_currentAbstractPart === null) ||
				(action.part === null) || 
				(_currentAbstractPart.itemId !== action.part.itemId)) {
				_currentAbstractPart = action.part;
				//_state.action = new ActionSetAbstractPart(action.part);
			}
			emit = false;
			break;
		case LayoutActionType.NotifySelectedPart:
			_currentSelectedPart = action.selectedPart;
			emit = false;
			break;
		case NavBarTagActionType.Fit:
			_state.action = new ActionFitLayout(FitType.FitTypeXY);
			break;
		case NavBarTagActionType.FitWidth:
			_state.action = new ActionFitLayout(FitType.FitTypeX);
			break;
		case NavBarTagActionType.FitHeight:
			_state.action = new ActionFitLayout(FitType.FitTypeY);
			break;
		case NavBarTagActionType.FitToBox:
			break;
		case NavBarTagActionType.Zoom400:
			break;
		case NavBarTagActionType.Zoom300:
			break;
		case NavBarTagActionType.Zoom200:
			break;
		case NavBarTagActionType.Zoom100:
			break;
		case NavBarTagActionType.Delete:
			_state.action = new ActionDeleteItems();
			break;
		case NavBarTagActionType.Copy:
			_state.action = new ActionCopyItems();
			break;
		case NavBarTagActionType.Paste:
			_state.action = new ActionPasteItems();
			break;
		case NavBarTagActionType.Undo:
			_state.action = new ActionUndo();
			break;
		case NavBarTagActionType.MoveToBack:
			_state.action = new ActionMoveToBack();
			break;
		case NavBarTagActionType.MoveToFront:
			_state.action = new ActionMoveToFront();
			break;
		case NavBarTagActionType.MoveBackward:
			_state.action = new ActionMoveBackward();
			break;
		case NavBarTagActionType.MoveForward:
			_state.action = new ActionMoveForward();
			break;
		case NavBarTagActionType.Rotate90:
			break;
		case NavBarTagActionType.FlipVertical:
			break;
		case NavBarTagActionType.FlipHorizontal:
			break;
		case NavBarTagActionType.SelectMode:
			_state.action = new ActionSetMouseMode(MouseMode.Select, null);
			_currentAbstractPart = null;
			break;
		}
		if (emit) {
			EventEx.emit(EVENT_TYPE, {data: null});
		}

	};
	
	var _state = {};

	/**
	 * callback to get the plugin which supports app specific rendering
	 * @param {object} plugin - User defined per specific component usage.
	 * @private
	 */
	var _setPlugin = function _setPlugin (plugin) {
		_state.plugin = plugin;
	};
	/**
	 * API to retrieve the state
	 * @returns {{}}
	 * @private
	 */
	var _getAll = function _getAll () {
		return _state;
	};
	/**
	 * API to allow retrieving the _currentSelectedPart which is set via LayoutActionType.NotifySelectedPart
	 * @returns {*}
	 * @private
	 */
	var _getCurrentSelectedPart = function () {
		return _currentSelectedPart;
	};
	
	return {
		/**
		 * name is a string constant that must match the store variable name
		 */
		name: 'PixiJSViewActionStore',
		setPlugin: _setPlugin,
		getAll: _getAll,
		getSelectedPart: _getCurrentSelectedPart
	}
})();