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

/**
 * Stores the viewState needed to set the view
 * @class ViewState
 */
ViewState = (function (view, navBar, rightBar) {
	var _view = view;
	var _navBar = navBar;
	var _rightBar = rightBar;
	var _self = this;
	return {
		view: _view,
		navBar: _navBar,
		rightBar: _rightBar
	}
});

/**
 * Implements a stack of ViewState and also changes to particular ViewStates
 * @class ViewStack
 */
ViewStack = (function () {
	// Predefined targets
	var _targets = {};
	
	var _initTargets = function _initTargets () {
		// Have to init in a function to avoid load order issues
		_targets['home'] = new ViewState(Constants.splash, Constants.home, Constants.home);
	};
	
	var _stack = [];
	var _pushTarget = function _pushTarget (target) {
		if (_targets.hasOwnProperty(target)) {
			_pushState(_targets[target]);
		}
	};
	
	/**
	 * @namespace ViewStack
	 * @function _pushState - pushes viewState on stack, executes a change of view to the pushed state
	 * @param {object} viewState - the target viewState to push and move to
	 */
	var _pushState = function _pushState (viewState) {
		_stack.push(viewState);
		_goToState(viewState);
	};

	/**
	 * @namespace ViewStack
	 * @function _popState - pops viewState off stack, executes a change of view to the popped state
	 * @param {boolean} restore - controls whether we want to "goto" the popped state or just pop off stack
	 */
	var _popState = function _popState (restore) {
		let state = _stack.pop();
		if (restore) {
			_goToState(state);
		}
	};
	
	var _peekState = function _peekState () {
		return _stack[_stack.length-1];
	};

	/**
	 * @namespace ViewStack
	 * @function _goToState - executes a change of view to the pushed state
	 * @param {object} viewState - the target viewState to change to
	 */
	var _goToState = function _goToState (viewState) {
		// TODO implement
		Session.set(Constants.navBarConfig, viewState.navBar);
		Session.set(Constants.rightBarConfig, viewState.rightBar);
		Session.set(Constants.renderView, viewState.view);
	};

	/**
	 * @namespace ViewStack
	 * @function _clearState - clears the _stack of all states
	 */
	var _clearState = function _clearState () {
		_stack = [];
	};

	/**
	 * @namespace ViewStack
	 * @function _length - exposes _stack.length
	 */
	var _length = function _length () {
		return _stack.length;
	};
	
	return {
		initTargets: _initTargets,
		pushTarget: _pushTarget,
		pushState: _pushState,
		popState: _popState,
		peekState: _peekState,
		clearState: _clearState,
		length: _length
	};
})();

//var test1 = new ViewState('red', 'green', 'blue');
//var test2 = new ViewState('cyan', 'magenta', 'yellow');
//console.log('ViewState:test1: ' + test1.view + ', test2: ' + test2.view);

/*class ViewState {
	constructor (view, navBar, rightBar) {
		this.view = view;
		this.navBar = navBar;
		this.rightBar = rightBar;
	}
}*/

/*
class ViewStack {
	constructor () {
		this.stack = [];
	}
	
	pushState (viewState) {
		this.stack.push(viewState);
		goToState(viewState);
	}
	
	popState () {
		goToState( this.stack.pop());
	}
	
	goToState (viewState) {
		// TODO, implement
	}
	
	clearStack () {
		this.stack = [];
	}
	
	length () {
		return this.stack.length;
	}
}*/
