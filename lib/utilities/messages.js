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
// messages that are used by MBus clients
/**
 * @namespace Message - container for typed Messages
 * @type {{Add, BorderColor, Clear, Render, Selection}}
 */
Message = (function () {
	/**
	 * Selection - All carousel selection messages use this
	 * @type {Selection}
	 * @parameter {string} carouselId - id of the carousel originating the message
	 * @parameter {object} htmlItem - div of the selected item
	 */
	var Selection = class Selection {
		constructor (carouselId, htmlItem) {
			this.carouselId = carouselId;
			this.htmlItem = htmlItem;
		}
		getDataPart () {
			return this.htmlItem.getAttribute(Constants.dataPart);
		}
	};
	/**
	 * Render - Used as carousel objects are rendered
	 * @type {Render}
	 * @parameter {string} id - carousel id
	 * @parameter {string} dataType - carousel type
	 */
	var Render = class Render {
		constructor (id, dataType) {
			this.id = id;
			this.dataType = dataType;
		}
	};
	/**
	 * Clear - clears slides from the carousel
	 * @type {Clear}
	 * @parameter {string} carousel - target carousel html id
	 */
	var Clear = class Clear {
		constructor (carousel) {
			this.carousel = carousel;
		}
	};
	/**
	 * Add - adds a slide(s) to the carousel
	 * @type {Add}
	 * @parameter {string} carousel - target carousel html id
	 * @parameter {string} imgWidth - width of the individual slide in px
	 * @parameter {string} imgHeight - height of the individual slide in px
	 * @parameter {[object]} imgArray - array of AbstractPartType items
	 */
	var Add = class Add {
		constructor (carousel, imgWidth, imgHeight, imgArray) {
			this.carousel = carousel;
			this.imgWidth = imgWidth;
			this.imgHeight = imgHeight;
			this.imgArray = imgArray;
		}
	};
	/**
	 * BorderColor
	 * @type {BorderColor}
	 * @parameter {object} carousel - target carousel as jquery element
	 * @parameter {string} borderColor - valid string html color
	 */
	var BorderColor = class BorderColor {
		constructor (carousel, borderColor) {
			this.carousel = carousel;
			this.color = borderColor;
		}
	};
	/**
	 * Action
	 * @type {Action}
	 * @parameter {string} action - type of action to take
	 */
	var Action = class Action {
		constructor(action) {
			this.action = action;
		}
	};
	var ActionInit = class ActionInit extends Action {
		constructor (offset) {
			super(ViewActionType.Init);
			this.offset = offset;
		}
	};
	var ActionEnumerateParts = class ActionEnumerateParts extends Action {
		constructor (action, receiver) {
			super(action);
			this.receiver = receiver;
		}
	};
	var ActionNewPart = class ActionNewPart extends Action {
		constructor (action, part) {
			super(action);
			this.part = part;
		}
	};
	var ActionNotifySelectedPart = class ActionNotifySelectedPart extends Action {
		constructor (selectedPart) {
			super(LayoutActionType.NotifySelectedPart);
			this.selectedPart = selectedPart;
		}
	};
	var ActionNotifyResize = class ActionNotifyResize extends Action {
		constructor (newW, newH) {
			super(ViewActionType.ResizeLayout);
			this.w = newW;
			this.h = newH;
		}
	};
	var ActionNotifyComponentMounted = class ActionNotifyComponentLoaded extends Action {
		constructor (canvas, scene, camera, renderer) {
			super(ViewActionType.ComponentMounted);
			this.canvas = canvas;
			this.threeScene = scene;
			this.threeCamera = camera;
			this.threeRenderer = renderer;
		}
	};
	var ActionNotifyComponentWillUnmount = class ActionNotifyComponentUnloaded extends Action {
		constructor () {
			super(ViewActionType.ComponentWillUnmount);
		}
	};
	
	var SetPixiContext = class SetPixiContext extends Action {
		constructor (pixiRenderer, pixiRootContainer) {
			super(LayoutActionType.SetPixiContext);
			this.pixiRenderer = pixiRenderer;
			this.pixiRootContainer = pixiRootContainer;
		}
	};
	
	var SetThreeContext = class SetThreeContext extends Action {
		constructor (threeScene, threeCamera, threeRenderer) {
			super(RenderActionType.SetThreeContext);
			this.threeScene = threeScene;
			this.threeCamera = threeCamera;
			this.threeRenderer = threeRenderer;
		}
	};
	/**
	 * TypeSelection
	 * @type {TypeSelection}
	 * @parameter {PartType} typeSelection - value of typeSelection
	 */
	var TypeSelection = class TypeSelection {
		constructor (typeSelection) {
			this.typeSelection = typeSelection;
		}
	};
	return {
		Action: Action,
		ActionInit: ActionInit,
		ActionEnumerateParts: ActionEnumerateParts,
		ActionNewPart: ActionNewPart,
		ActionNotifySelectedPart: ActionNotifySelectedPart,
		ActionNotifyResize: ActionNotifyResize,
		ActionNotifyComponentMounted: ActionNotifyComponentMounted,
		ActionNotifyComponentWillUnmount: ActionNotifyComponentWillUnmount,
		SetPixiContext: SetPixiContext,
		SetThreeContext: SetThreeContext,
		Add: Add,
		BorderColor: BorderColor,
		Clear: Clear,
		Render: Render,
		Selection: Selection,
		TypeSelection: TypeSelection
	};
})();

