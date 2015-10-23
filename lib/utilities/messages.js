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
	 * @type {Function}
	 * @parameter {string} carouselId - id of the carousel originating the message
	 * @parameter {object} htmlItem - div of the selected item
	 */
	Selection = (function (carouselId, htmlItem) {
		var self = this;
		self._getDataPart = function _getDataPart () {
			return htmlItem.getAttribute(Constants.dataPart);
		};
		return {
			carouselId: carouselId,
			htmlItem: htmlItem,
			getDataPart: self._getDataPart
		}
	});
	/**
	 * Render - Used as carousel objects are rendered
	 * @type {Function}
	 * @parameter {string} id - carousel id
	 * @parameter {string} dataType - carousel type
	 */
	Render = (function (id, dataType) {
		return {
			id: id,
			dataType: dataType
		};
	});
	/**
	 * Clear - clears slides from the carousel
	 * @type {Function}
	 * @parameter {string} carousel - target carousel html id
	 */
	Clear = (function (carousel) {
		return {
			carousel: carousel
		};
	});
	/**
	 * Add - adds a slide to the carousel
	 * @type {Function}
	 * @parameter {string} carousel - target carousel html id
	 * @parameter {string} imgWidth - width of the individual slide in px
	 * @parameter {string} imgHeight - height of the individual slide in px
	 * @parameter {[object]} imgArray - array of AbstractPartType items
	 */
	Add = (function (carousel, imgWidth, imgHeight, imgArray) {
		return {
			carousel: carousel,
			imgWidth: imgWidth,
			imgHeight: imgHeight,
			imgArray: imgArray
		};
	});
	/**
	 * BorderColor
	 * @type {Function}
	 * @parameter {object} carousel - target carousel as jquery element
	 * @parameter {string} borderColor - valid string html color
	 */
	BorderColor = (function (carousel, borderColor) {
		return {
			carousel: carousel,
			color: borderColor
		};
	});
	
	return {
		Add: Add,
		BorderColor: BorderColor,
		Clear: Clear,
		Render: Render,
		Selection: Selection
	};
})();

