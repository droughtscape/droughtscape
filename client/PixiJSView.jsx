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

PixiJSView = React.createClass({
    proptypes: {
		// optional
		testMode: React.PropTypes.bool,
        canvasWidth: React.PropTypes.number.isRequired,
        canvasHeight: React.PropTypes.number.isRequired
    },
	getDefaultProps: function () {
		return {canvasWidth: 900, canvasHeight: 700, testMode: false, WIDTH: 400, HEIGHT: 300};
	},
	getInitialState: function getInitialState () {
		return this.getStateFromStore();
	},
	getStateFromStore: function () {
		return this.getBoundStateFromStore();
	},
	getBoundStateFromStore: function () {
		if (this.boundGetAll) {
			return this.boundGetAll();
		}
		else {
			if (this.props.store && this.props.store.hasOwnProperty('getAll')) {
				this.boundGetAll = this.props.store.getAll;
				return this.boundGetAll();
			}
			else {
				return {};
			}
		}
	},
	setupStore: function () {
		if (this.props.store) {
			if (this.props.store.hasOwnProperty('name')) {
				let storeName = this.props.store.name;
				let listener = function () {
					console.log('Event: ' + storeName);
					// Guard setState with isMounted()
					// If we are mounted, setState() so any jsx view related stuff can be handled if needed
					if (this.isMounted()) {
						console.log('Event: ' + storeName + ', mounted');
						// Pass the state to the real component whenever the store updates the state
						this.setState(this.getStateFromStore());
					}
					else {
						// If not mounted, send state to the plugin and let it deal with it.  Caveat Emptor.
						this.plugin.handleActionUnmounted(this.getStateFromStore().action);
					}
				}.bind(this);
				EventEx.on(storeName, listener);
			}
		}
	},
	getPluginFromState: function () {
		if (this.plugin) {
			return plugin;
		}
		else {
			if (this.state && this.state.hasOwnProperty('plugin')) {
				this.plugin = this.state.plugin;
				return this.plugin;

			}
			else {
				return null;
			}
		}
	},
	/**
	 * For pixijs components which render themselves, this is a one time action
	 * @returns {XML}
	 */
	render: function () {
		console.log('PixiJSView:render');
		return (<div className="PixiJSView" ref='pixiJSView' align="center"
					 style={{position: 'absolute', left: 0, width: 100 + '%', height: 100 + '%'}}>
			<canvas className='PixiJSCanvas' ref='pixiJSCanvas'
					style={{display: 'table-row', backgroundColor: '#222222'}}></canvas>
		</div>);
	},
	/**
	 * Set up the pixijs basic render context, controls
	 */
	componentDidMount: function () {
		// Use a ref to get the underlying DOM element once we are mounted
		let renderCanvas = this.refs.pixiJSCanvas;
		console.log('componentDidMount, canvas: ' + renderCanvas);
        this.configureCanvas(renderCanvas);
		// get the plugin renderer
		this.plugin = this.getPluginFromState();
		this.setupStore();

		// Do some basic pixijs setup
		if (!this.pixiRenderer) {
			this.pixiRenderer = PIXI.autoDetectRenderer(renderCanvas.width, renderCanvas.height, {view: renderCanvas});
		}
		if (!this.pixiRootContainer) {
			this.pixiRootContainer = new PIXI.Container();
		}
		// Give the plugin renderer pixi context we setup here
		if (this.plugin) {
			this.plugin.setContext(this.pixiRenderer, this.pixiRootContainer);
		}
		
		// Enable animation
		this.runAnimation = true;
		this.pixiAnimate();
		this.pixiRender();
		window.addEventListener('resize', this.handleResize)
	},
	/**
	 * Clear out pixijs context on unmount
	 */
	componentWillUnmount: function componentWillUnmount () {
		this.runAnimation = false;
		this.pixiRootContainer = null;
		this.pixiRenderer = null;
		window.removeEventListener('resize', this.handleResize);
	},
	/**
	 * This is where we proxy action to plugin and also prevent vdom activity
	 * @param nextProps
	 * @param nextState
	 * @returns {boolean}
	 */
	shouldComponentUpdate: function shouldComponentUpdate (nextProps, nextState) {
		console.log('PixiJSView: shouldComponentUpdate: ENTRY');
		let action = nextState.action;
		if (this.plugin) {
			this.plugin.handleAction(action);
		}
		return !this.isMounted();
	},
	/**
	 * Compute canvas height and width
	 * @param canvas - dom item, mutate height and width on it
	 */
    configureCanvas: function configureCanvas (canvas) {
        var renderContainer = this.refs.pixiJSView;
        var width;
        var height;
        // set area either from container or props if no container
        if (!this.props.testMode && renderContainer) {
            width = renderContainer.clientWidth;
            height = renderContainer.clientHeight;
        }
        else {
            width = this.props.canvasWidth;
            height = this.props.canvasHeight;
        }
        canvas.height = height;
        canvas.width = width;
    },
	handleResize: function handleResize (e) {
		console.log('handleResize: ' + e);
		let renderCanvas = this.refs.pixiJSCanvas;
		this.configureCanvas(renderCanvas);
		this.pixiRenderer.resize(renderCanvas.width, renderCanvas.height);
		if (this.resizeLayout) {
			this.resizeLayout(renderCanvas.width, renderCanvas.height);
		}
		if (this.plugin) {
			if (this.plugin.resizeLayout) {
				this.resizeLayout = function (w, h) {
					this.plugin.resizeLayout(w, h);
				};
				this.resizeLayout(renderCanvas.width, renderCanvas.height);
			}
		}
	},
	/**
	 * wrapper around the pixijs render call
	 */
	pixiRender: function pixiRender () {
		this.pixiRenderer.render(this.pixiRootContainer);
	},
	/**
	 * pixijs render with RAF
	 */
	pixiAnimate: function pixiAnimate () {
		if (this.runAnimation) {
			requestAnimationFrame(this.pixiAnimate);
			this.pixiRender();
		}
	}
});

