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

Message = (function () {
	Selection = (function (carouselId, htmlItem) {
		var _getDataPart = function _getDataPart () {
			return htmlItem.getAttribute(Constants.dataPart);
		};
		return {
			carouselId: carouselId,
			htmlItem: htmlItem,
			getDataPart: _getDataPart
		}
	});
	
	Render = (function (id, dataType) {
		return {
			id: id,
			dataType: dataType
		};
	});
	
	Clear = (function (carousel) {
		return {
			carousel: carousel
		};
	});
	
	Add = (function (carousel, imgWidth, imgHeight, imgArray) {
		return {
			carousel: carousel,
			imgWidth: imgWidth,
			imgHeight: imgHeight,
			imgArray: imgArray
		};
	});
	
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

