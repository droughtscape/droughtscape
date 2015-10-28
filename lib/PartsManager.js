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
	var _emptyPart = [];
	
	var _testInitParts = function _testInitParts () {
		console.log('_testInitParts: ENTRY');
		// Create some parts
		// all parts
		let testLoader = getTestLoader();
		_allParts = _allParts.concat(testLoader.createTestPartsImpl([
			'custom.png',
			'https://lh3.googleusercontent.com/ER8azvf5Xy-Bno_pHXYAPGbOSOvb_VRXMJnjX5E6xgvCL0EndJb5FD8-l7apbixJOndhZpMaVEY6Etfli82vtFc2ogdSF2HTdV5H7TD_JpYyVLJm5Fs5KXYmSPk9xD4kpDlHKrbtyV64e5jb0Ij3IvjC8IXii-5HDhkmv7AUCxXlIIPfL8eSh2Jj59pznlHCiEGCkTHrWD81kf9XiDhWrNAU32UgD3jrnbSEIeb44cI53LBBpY07ktdaEKN45qYQtRH94aBGhMWAeeXyhtVQiPTrFWKlzKF82_3SMWhOE6ATnAATz2fZGaHIFJP9AKsrotU2rspO42itmqLXDHq-14HeP-P7ovADnD_FSS7xgp0Q5kHa82a1sr8TBwXF1qR57xNAKZ8E3xEcOlfPcMY-nLND-OPTpc02rht9Ry0S0lRv9_AiEHTokXQJU66zrauI4hX4bS99ytOjsfE3DJwS1DOg7FVqOYFPW8Rpo_iJix3rAybF_MZvMGrTBk3V5BPL-tc_JSarBcY31xnA6fLAgaVhL69zPCKlzozv1r1zhX4=w864-h1151-no',
			'http://lorempixel.com/580/250/nature/1',
			'http://lorempixel.com/580/250/nature/2',
			'http://lorempixel.com/580/250/nature/3',
			'http://lorempixel.com/580/250/nature/4',
			'http://lorempixel.com/580/250/nature/5'
		], PartType.plants));
		_allParts = _allParts.concat(testLoader.createTestPartsImpl([
			'corner.png',
			'http://lorempixel.com/580/250/nature/2',
			'http://lorempixel.com/580/250/nature/3',
			'http://lorempixel.com/580/250/nature/4',
			'http://lorempixel.com/580/250/nature/5'
		], PartType.groundcovers));
		_allParts = _allParts.concat(testLoader.createTestPartsImpl([
			'rectangle.png',
			'http://lorempixel.com/580/250/nature/2',
			'http://lorempixel.com/580/250/nature/3',
			'http://lorempixel.com/580/250/nature/4',
			'http://lorempixel.com/580/250/nature/5'
		], PartType.borders));
		
		_emptyPart = testLoader.createTestPartsImpl(['noparts.png'], PartType.nullPart);
	};
	
	var _addToMyParts = function _addToMyParts (selection) {
		console.log('_addToMyParts: selection.itemId: ' + selection.itemId);
		// See if part already in myParts
		if (_getPartsByItemId(_myParts, selection.itemId).length === 0) {
			// Not found, add it
			let part = _getPartsByItemId(_allParts, selection.itemId);
			// part better be an array of length === 1
			if (part.length === 1) {
				_myParts.push(part[0]);
				MBus.publish(Constants.mbus_myPartsType, new Message.TypeSelection(part[0].partType));
			}
		}
		else {
			// already a member, alert
			Materialize.toast('Already in My Parts', 3000, 'rounded red-text');
		}
	};
	
	var _delFromMyParts = function _delFromMyParts (selection) {
		console.log('_delFromMyParts: selection.itemId: ' + selection.itemId);
		// In this case, we know the item is in _myParts so just delete it
		let itemId = selection.itemId;
		let foundIndex = -1;
		for (var i=0, len=_myParts.length; i<len; ++i) {
			if (_myParts[i].itemId === itemId) {
				foundIndex = i;
				break;
			}
		}
		if (foundIndex >= 0) {
			let removedPart = _myParts.splice(foundIndex, 1);
			if (removedPart && removedPart.length === 1) {
				MBus.publish(Constants.mbus_myPartsType, new Message.TypeSelection(removedPart[0].partType));
				SelectionManager.clearSelection();
			}
		}
	};

	var _getPartsByMatch = function _getPartsByMatch (partsList, matchFn) {
		let foundParts = [];
		for (var i=0, len=partsList.length; i<len; ++i) {
			if (matchFn(partsList[i])) {
				foundParts.push(partsList[i]);
			}
		}
		return foundParts;
	};
	
	var _getPartsByItemId = function _getPartsByItemId (partsList, itemId) {
		return _getPartsByMatch(partsList, function (candidatePart) {
			return candidatePart.itemId === itemId;
		});
	};

	var _getPartsByType = function _getPartsByType (partsList, partType) {
		var matchFn = function (candidatePart) {
			return candidatePart.partType === partType || partType == PartType.all;
		};
		return _getPartsByMatch(partsList, matchFn);
	};
	
	var _getAllPartsByType = function _getAllPartsByType (partType) {
		return _getPartsByType(_allParts, partType);
	};
	
	var _getMyPartsByType = function _getMyPartsByType (partType) {
		return _getPartsByType(_myParts, partType);
	};
	
	var _getEmptyPart = function _getEmptyPart () {
		return _emptyPart;
	};
	
	return {
		testInitParts: _testInitParts,
		allParts: _allParts,
		myParts: _myParts,
		addToMyParts: _addToMyParts,
		delFromMyParts: _delFromMyParts,
		getPartsByMatch: _getPartsByMatch,
		getAllPartsByType: _getAllPartsByType,
		getMyPartsByType: _getMyPartsByType,
		getEmptyPart: _getEmptyPart
	};
})();