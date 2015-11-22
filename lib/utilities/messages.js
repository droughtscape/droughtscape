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
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {string} carouselId - id of the carousel originating the message
	 * @parameter {object} htmlItem - div of the selected item
	 */
	var Selection = class {
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
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {string} id - carousel id
	 * @parameter {string} dataType - carousel type
	 */
	var Render = class {
		constructor (id, dataType) {
			this.id = id;
			this.dataType = dataType;
		}
	};
	/**
	 * Clear - clears slides from the carousel
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {string} carousel - target carousel html id
	 */
	var Clear = class {
		constructor (carousel) {
			this.carousel = carousel;
		}
	};
	/**
	 * Add - adds a slide(s) to the carousel
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {string} carousel - target carousel html id
	 * @parameter {string} imgWidth - width of the individual slide in px
	 * @parameter {string} imgHeight - height of the individual slide in px
	 * @parameter {[object]} imgArray - array of AbstractPartType items
	 */
	var Add = class {
		constructor (carousel, imgWidth, imgHeight, imgArray) {
			this.carousel = carousel;
			this.imgWidth = imgWidth;
			this.imgHeight = imgHeight;
			this.imgArray = imgArray;
		}
	};
	/**
	 * BorderColor
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {object} carousel - target carousel as jquery element
	 * @parameter {string} borderColor - valid string html color
	 */
	var BorderColor = class {
		constructor (carousel, borderColor) {
			this.carousel = carousel;
			this.color = borderColor;
		}
	};
	/**
	 * Action
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {string} action - type of action to take
	 */
	var Action = class {
		constructor(action) {
			this.action = action;
		}
	};
	/**
	 * TypeSelection
	 * @type {$ES6_ANONYMOUS_CLASS$}
	 * @parameter {PartType} typeSelection - value of typeSelection
	 */
	var TypeSelection = class {
		constructor (typeSelection) {
			this.typeSelection = typeSelection;
		}
	};
	return {
		Action: Action,
		Add: Add,
		BorderColor: BorderColor,
		Clear: Clear,
		Render: Render,
		Selection: Selection,
		TypeSelection: TypeSelection
	};
})();

