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
PartsManager = (function () {
	
	// Test lists.  These should be comprised of AbstractPart objects
	var _allParts = [];
	var _myParts = [];
	
	var _testInitParts = function _testInitParts () {
		console.log('_testInitParts: ENTRY');
	};
	
	var _addToMyParts = function _addToMyParts (selection) {
		console.log('_addToMyParts: selection.itemId: ' + selection.itemId);
	};
	
	var _delFromMyParts = function _delFromMyParts (selection) {
		console.log('_delFromMyParts: selection.itemId: ' + selection.itemId);
	};
	
	_testInitParts();
	
	return {
		allParts: _allParts,
		myParts: _myParts,
		addToMyParts: _addToMyParts,
		delFromMyParts: _delFromMyParts
	};
})();