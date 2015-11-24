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
 * ViewState - Type defining class - Here it is felt a class is apropos because there will be instances of ViewState
 * @type {ViewState}
 * @parameter view - the current view 
 * @parameter navBar - name of the navBar contents associated with this view
 * @parameter rightBar - name of the rightBar contents associated with this view
 * @parameter clearOnPush - on any push, clear the ViewState stack
 */
ViewState = class ViewState  {
	constructor (view, navBar, rightBar, clearOnPush) {
		this.view = view;
		this.navBar = navBar;
		this.rightBar = rightBar;
		this.clearOnPush = clearOnPush;
	}
};

/**
 * Implements a stack of ViewState and also changes to particular ViewStates
 * Waffled between revealing module pattern and singleton class.  Settle on revealing module as it better
 * maps a singleton => there is ONE and only ONE ViewStack
 * @module ViewStack
 */
ViewStack = (function () {
	// Predefined targets
	var _targets = {};
	
	var _initTargets = function _initTargets () {
		// Have to init in a function to avoid load order issues
		_targets[ViewTargetType.about] 					= new ViewState(RenderViewType.about, NavBarType.home, RightBarType.home, false);
		_targets[ViewTargetType.home] 					= new ViewState(RenderViewType.splash, NavBarType.home, RightBarType.home, true);
		_targets[ViewTargetType.signIn] 				= new ViewState(RenderViewType.signin, NavBarType.home, RightBarType.home, false);
		_targets[ViewTargetType.create] 				= new ViewState(RenderViewType.create, NavBarType.home, RightBarType.none, false);
		_targets[ViewTargetType.createShapeLawn] 		= new ViewState(RenderViewType.shape_lawn, NavBarType.home, RightBarType.none, false);
		_targets[ViewTargetType.createMeasureLawn] 		= new ViewState(RenderViewType.measure_lawn, NavBarType.home, RightBarType.none, false);
		_targets[ViewTargetType.createBuildLawn] 		= new ViewState(RenderViewType.build_lawn, NavBarType.create, RightBarType.none, false);
		_targets[ViewTargetType.createLayoutLawn] 		= new ViewState(RenderViewType.layout_lawn, NavBarType.layout, RightBarType.layout_lawn, true);
		_targets[ViewTargetType.createLayoutSettings] 	= new ViewState(RenderViewType.layout_settings, NavBarType.create, RightBarType.none, false);
		_targets[ViewTargetType.createRenderLawn] 		= new ViewState(RenderViewType.render_lawn, NavBarType.render, RightBarType.render_lawn, true);
		_targets[ViewTargetType.createSelectParts] 		= new ViewState(RenderViewType.select_parts, NavBarType.create, RightBarType.select_parts, false);
		_targets[ViewTargetType.createFinishLawn] 		= new ViewState(RenderViewType.finish_lawn, NavBarType.home, RightBarType.finish_lawn, false);
		_targets[ViewTargetType.createInfoPart] 		= new ViewState(RenderViewType.info_part, NavBarType.create, RightBarType.create_info_item, false);
		_targets[ViewTargetType.infoLawn] 				= new ViewState(RenderViewType.info_lawn, NavBarType.home, RightBarType.none, false);
		_targets[ViewTargetType.infoPart] 				= new ViewState(RenderViewType.info_part, NavBarType.home, RightBarType.part_info_item, false);
		_targets[ViewTargetType.newPart] 				= new ViewState(RenderViewType.new_part, NavBarType.home, RightBarType.parts, false);
		_targets[ViewTargetType.parts] 					= new ViewState(RenderViewType.parts, NavBarType.home, RightBarType.parts, false);
		_targets[ViewTargetType.lawns] 					= new ViewState(RenderViewType.lawns, NavBarType.home, RightBarType.lawns, false);
		_targets[ViewTargetType.personalize] 			= new ViewState(RenderViewType.personalize, NavBarType.home, RightBarType.home, false);
		_targets[ViewTargetType.community] 				= new ViewState(RenderViewType.community, NavBarType.home, RightBarType.home, false);
		_targets[ViewTargetType.rebates] 				= new ViewState(RenderViewType.rebates, NavBarType.home, RightBarType.home, false);
		_targets[ViewTargetType.waterCalc] 				= new ViewState(RenderViewType.watercalc, NavBarType.home, RightBarType.none, false);
		_targets[ViewTargetType.waterSmart] 			= new ViewState(RenderViewType.watersmart, NavBarType.home, RightBarType.none, false);
		_targets[ViewTargetType.favorites] 				= new ViewState(RenderViewType.favorites, NavBarType.home, RightBarType.home, false);
		_targets[ViewTargetType.partSelectParts] 		= new ViewState(RenderViewType.select_parts, NavBarType.home, RightBarType.new_parts, false);

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

