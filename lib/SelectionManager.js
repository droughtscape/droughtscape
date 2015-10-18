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
SelectionManager = class SelectionManager {
	constructor () {
		console.log('SelectionManager: constructor');
		this.currentPartsSelection = null;
		this.currentLawnSelection = null;
		this.unsubscribe = MBus.subscribe(Constants.mbus_selection, this.handleSelectPartsMessages);
	}

	handleSelectPartsMessages (message) {
		if (MBus.validateMessage(message)) {
			switch (message.type) {
			case Constants.mbus_selected:
				console.log('SelectionManager._handleSelectPartsMessages[' + message.topic + ']: ' + message.type + ' --> ' + message.value);
				break;
			}
		}
		else {
			console.log('handleSelectPartsMessages:ERROR, invalid message');
		}
	}

	setPartSelection (selectedPart) {
		this.currentPartsSelection = selectedPart;
	}
	
	getPartSelection () {
		return this.currentPartsSelection;
	}
	
	setLawnSelection (selectedLawn) {
		this.currentLawnSelection = selectedLawn;
	}
	
	getLawnSelection () {
		return this.currentLawnSelection;
	}
};