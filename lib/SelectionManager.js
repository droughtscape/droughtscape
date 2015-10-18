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
	/**
	 * Handle MBus messages on the mbus_selection bus
	 * @function _handleSelectPartsMessages
	 * @param {object} message - must have type attribute Constants.mbus_selected or Constants.mbus_unselected
	 * 							value is either null or {itemId: {string}}
	 */
	var _handleSelectPartsMessages = function _handleSelectPartsMessages (message) {
		if (MBus.validateMessage(message)) {
			// Only the two messsage.type(s) below are valid
			switch (message.type) {
			case Constants.mbus_selected:
				if (message.value) {
					console.log('SelectionManager._handleSelectPartsMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value.itemId);
				}
				else {
					console.log('SelectionManager._handleSelectPartsMessages[' + message.topic + ']: ' + message.type + ' --> ' + 'null value');
				}
				currentSelection = {itemId: message.value.itemId};
				break;
			case Constants.mbus_unselected:
				console.log('SelectionManager._handleSelectPartsMessages[' + message.topic + ']: ' + message.type + ' --> ' + 'null value');
				currentSelection = null;
				break;
			default :
				console.log('SelectionManager._handleSelectPartsMessages[' + message.topic + ']: ' + 'ERROR: unknown message.type: ' + message.type);
				break;
			}
		}
		else {
			console.log('_handleSelectPartsMessages:ERROR, invalid message');
		}
	};

	// Order of execution matters only because we are executing in the global frame => _handleSelectPartsMessages must
	// be defined first.  No unsubscribe for this, lives as long as the app.
	MBus.subscribe(Constants.mbus_selection, _handleSelectPartsMessages);
	
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
		MBus.publish(Constants.mbus_selection, Constants.mbus_selected, {itemId: itemId});
	};

	/**
	 * Sends unselect message
	 * @function clearSelection - static
	 */
	var clearSelection = function clearSelection () {
		MBus.publish(Constants.mbus_selection, Constants.mbus_unselected, null);
	};
	
	return {
		getSelection: getSelection,
		sendSelection: sendSelection,
		clearSelection: clearSelection
	};

})();

