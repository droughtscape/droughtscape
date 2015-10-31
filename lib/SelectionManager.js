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
 * Manages selection for info-part
 * @class SelectionManager
 */
SelectionManager = (function () {
	var currentSelection = null;

	// Order of execution matters only because we are executing in the global frame => _handleSelectPartsMessages must
	// be defined first.  No unsubscribe for this, lives as long as the app.
	//MBus.subscribe(Constants.mbus_selection, _handleSelectPartsMessages);
	
	/**
	 * gets the currentSelection
	 * @function getSelection
	 * @return {object} value is either null or {itemId: {string}}
	 */
	var getSelection = function getSelection () {
		return currentSelection;
	};

	/**
	 * Sends message with htmlItem's data-part attribute which should be itemId
	 * @function sendSelection - static
	 * @param {object} htmlItem - The div which is selected
	 */
	var sendSelection = function sendSelection (htmlItem) {
		// We expect an attribute here
		let itemId = htmlItem.getAttribute(Constants.dataPart);
		console.log('SelectionManager.sendSelection: itemId: ' + itemId);
		currentSelection = {itemId: itemId};
		Session.set('currentSelection', true);
	};

	/**
	 * Sends unselect message
	 * @function clearSelection - static
	 */
	var clearSelection = function clearSelection () {
		currentSelection = null;
		Session.set('currentSelection', false);
	};
	
	return {
		getSelection: getSelection,
		sendSelection: sendSelection,
		clearSelection: clearSelection
	};

})();

