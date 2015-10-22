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
ViewState = (function (view, navBar, rightBar, clearOnPush) {
	var _view = view;
	var _navBar = navBar;
	var _rightBar = rightBar;
	// clearOnPush => on any push, clear first
	var _clearOnPush = clearOnPush;
	var _self = this;
	return {
		view: _view,
		navBar: _navBar,
		rightBar: _rightBar,
		clearOnPush: _clearOnPush
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
		_targets[Constants.vsAbout] = new ViewState(Constants.about, Constants.home, Constants.home, false);
		_targets[Constants.vsHome] = new ViewState(Constants.splash, Constants.home, Constants.home, true);
		_targets[Constants.vsSignIn] = new ViewState(Constants.signin, Constants.home, Constants.home, false);
		_targets[Constants.vsCreate] = new ViewState(Constants.create, Constants.home, Constants.none, false);
		_targets[Constants.vsCreateMeasureLawn] = new ViewState(Constants.measure_lawn, Constants.home, Constants.none, false);
		_targets[Constants.vsCreateBuildLawn] = new ViewState(Constants.build_lawn, Constants.create, Constants.none, false);
		_targets[Constants.vsCreateLayoutLawn] = new ViewState(Constants.layout_lawn, Constants.layout, Constants.layout_lawn, true);
		_targets[Constants.vsCreateLayoutSettings] = new ViewState(Constants.layout_settings, Constants.create, Constants.none, false);
		_targets[Constants.vsCreateRenderLawn] = new ViewState(Constants.render_lawn, Constants.create, Constants.render_lawn, true);
		_targets[Constants.vsCreateSelectParts] = new ViewState(Constants.select_parts, Constants.create, Constants.select_parts, false);
		_targets[Constants.vsCreateFinishLawn] = new ViewState(Constants.finish_lawn, Constants.home, Constants.finish_lawn, false);
		_targets[Constants.vsCreateInfoPart] = new ViewState(Constants.info_item, Constants.create, Constants.parts, false);
		_targets[Constants.vsInfoItem] = new ViewState(Constants.info_item, Constants.home, Constants.none, false);
		_targets[Constants.vsInfoPart] = new ViewState(Constants.info_item, Constants.home, Constants.parts, false);
		_targets[Constants.vsNewPart] = new ViewState(Constants.newPart, Constants.home, Constants.parts, false);
		_targets[Constants.vsParts] = new ViewState(Constants.parts, Constants.home, Constants.parts, false);
		_targets[Constants.vsLawns] = new ViewState(Constants.lawns, Constants.home, Constants.lawns, false);
		_targets[Constants.vsPersonalize] = new ViewState(Constants.personalize, Constants.home, Constants.home, false);
		_targets[Constants.vsCommunity] = new ViewState(Constants.community, Constants.home, Constants.home, false);
		_targets[Constants.vsRebates] = new ViewState(Constants.rebates, Constants.home, Constants.home, false);
		_targets[Constants.vsWatercalc] = new ViewState(Constants.watercalc, Constants.home, Constants.none, false);
		_targets[Constants.vsWatersmart] = new ViewState(Constants.watersmart, Constants.home, Constants.none, false);
		_targets[Constants.vsFavorites] = new ViewState(Constants.favorites, Constants.home, Constants.home, false);
		_targets[Constants.vsPartSelectParts] = new ViewState(Constants.select_parts, Constants.home, Constants.new_parts, false);

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
		if (viewState.clearOnPush) {
			_clearState();
		}
		_stack.push(viewState);
		_goToState(viewState);
	};

	/**
	 * @namespace ViewStack
	 * @function _popState - pops viewState off stack, executes a change of view to the popped state
	 * @param {boolean} restore - controls whether we want to "goto" the popped state or just pop off stack
	 */
	var _popState = function _popState (restore) {
		_stack.pop();
		if (restore) {
			_goToState(_peekState());
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
