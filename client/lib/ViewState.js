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
/**
 * ViewState - Type defining object
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
 * Public namespace ViewStack.  Creates s singleton to control view selection and movement
 * @namespace ViewStack
 */
ViewStack = (function () {
	// Note, although it seems a little odd to place the class inside the module, when I inspect in chrome,
	// putting the class outside the ViewStack and then instantiating the singleton, results in an extra closure.
	// When it is inside as here, there is only the single expected closure.
	/**
	 * Intenal class implementing the ViewStack
	 * @type {ViewStackInternal}
	 */
	var ViewStackInternal = class ViewStackInternal {
		constructor () {
			this.targets = {};
			this.stack = [];
		}
		initTargets () {
			// Have to init in a function to avoid load order issues
			this.targets[ViewTargetType.about] 					= new ViewState(RenderViewType.about, NavBarType.home, RightBarType.home, false);
			this.targets[ViewTargetType.home] 					= new ViewState(RenderViewType.splash, NavBarType.home, RightBarType.home, true);
			this.targets[ViewTargetType.signIn] 				= new ViewState(RenderViewType.signin, NavBarType.home, RightBarType.home, false);
			this.targets[ViewTargetType.create] 				= new ViewState(RenderViewType.create, NavBarType.home, RightBarType.none, false);
			this.targets[ViewTargetType.createShapeLawn] 		= new ViewState(RenderViewType.shape_lawn, NavBarType.home, RightBarType.none, false);
			this.targets[ViewTargetType.createMeasureLawn] 		= new ViewState(RenderViewType.measure_lawn, NavBarType.home, RightBarType.none, false);
			this.targets[ViewTargetType.createBuildLawn] 		= new ViewState(RenderViewType.build_lawn, NavBarType.create, RightBarType.none, false);
			this.targets[ViewTargetType.createLayoutLawn] 		= new ViewState(RenderViewType.layout_lawn, NavBarType.layout, RightBarType.layout_lawn, true);
			this.targets[ViewTargetType.createLayoutSettings] 	= new ViewState(RenderViewType.layout_settings, NavBarType.create, RightBarType.none, false);
			this.targets[ViewTargetType.createRenderLawn] 		= new ViewState(RenderViewType.render_lawn, NavBarType.render, RightBarType.render_lawn, true);
			this.targets[ViewTargetType.createSelectParts] 		= new ViewState(RenderViewType.select_parts, NavBarType.create, RightBarType.select_parts, false);
			this.targets[ViewTargetType.createFinishLawn] 		= new ViewState(RenderViewType.finish_lawn, NavBarType.home, RightBarType.finish_lawn, false);
			this.targets[ViewTargetType.createInfoPart] 		= new ViewState(RenderViewType.info_part, NavBarType.create, RightBarType.create_info_item, false);
			this.targets[ViewTargetType.infoLawn] 				= new ViewState(RenderViewType.info_lawn, NavBarType.home, RightBarType.none, false);
			this.targets[ViewTargetType.infoPart] 				= new ViewState(RenderViewType.info_part, NavBarType.home, RightBarType.part_info_item, false);
			this.targets[ViewTargetType.newPart] 				= new ViewState(RenderViewType.new_part, NavBarType.home, RightBarType.parts, false);
			this.targets[ViewTargetType.parts] 					= new ViewState(RenderViewType.parts, NavBarType.home, RightBarType.parts, false);
			this.targets[ViewTargetType.lawns] 					= new ViewState(RenderViewType.lawns, NavBarType.home, RightBarType.lawns, false);
			this.targets[ViewTargetType.personalize] 			= new ViewState(RenderViewType.personalize, NavBarType.home, RightBarType.home, false);
			this.targets[ViewTargetType.community] 				= new ViewState(RenderViewType.community, NavBarType.home, RightBarType.home, false);
			this.targets[ViewTargetType.rebates] 				= new ViewState(RenderViewType.rebates, NavBarType.home, RightBarType.home, false);
			this.targets[ViewTargetType.waterCalc] 				= new ViewState(RenderViewType.watercalc, NavBarType.home, RightBarType.none, false);
			this.targets[ViewTargetType.waterSmart] 			= new ViewState(RenderViewType.watersmart, NavBarType.home, RightBarType.none, false);
			this.targets[ViewTargetType.favorites] 				= new ViewState(RenderViewType.favorites, NavBarType.home, RightBarType.home, false);
			this.targets[ViewTargetType.partSelectParts] 		= new ViewState(RenderViewType.select_parts, NavBarType.home, RightBarType.new_parts, false);
		}
		pushTarget (target) {
			if (this.targets.hasOwnProperty(target)) {
				this.pushState(this.targets[target]);
			}
		}
		/**
		 * @namespace ViewStack
		 * @function pushState - pushes viewState on stack, executes a change of view to the pushed state
		 * @param {object} viewState - the target viewState to push and move to
		 */
		pushState (viewState) {
			if (viewState.clearOnPush) {
				this.clearState();
			}
			this.stack.push(viewState);
			this.goToState(viewState);
		}

		/**
		 * @namespace ViewStack
		 * @function popState - pops viewState off stack, executes a change of view to the popped state
		 * @param {boolean} restore - controls whether we want to "goto" the popped state or just pop off stack
		 */
		popState (restore) {
			this.stack.pop();
			if (restore) {
				this.goToState(peekState());
			}
		}

		peekState () {
			return this.stack[this.stack.length-1];
		}

		/**
		 * @namespace ViewStack
		 * @function goToState - executes a change of view to the pushed state
		 * @param {object} viewState - the target viewState to change to
		 */
		goToState (viewState) {
			Session.set(Constants.navBarConfig, viewState.navBar);
			Session.set(Constants.rightBarConfig, viewState.rightBar);
			Session.set(Constants.renderView, viewState.view);
		}

		/**
		 * @namespace ViewStack
		 * @function clearState - clears the stack of all states
		 */
		clearState () {
			this.stack = [];
		}

		/**
		 * @namespace ViewStack
		 * @function length - exposes stack.length
		 */
		length () {
			return this.stack.length;
		};
	};

	let SINGLETON = new ViewStackInternal();
	return SINGLETON;
})();


