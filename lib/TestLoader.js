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
 * TestAbstractPart - prototype for real abstract part
 * @type {Function}
 * @parameter {string} url - image path
 * @parameter {number} width - width in meters
 * @parameter {number} height - height in meters (really w x h in 2D)
 * @parameter {number} depth - 3D height of object
 * @parameter {string} itemId - collection key
 * @parameter {string} footprint - shape of 2D footprint viewed from top - rectangle, ellipse
 * @parameter {string} renderShape - 3D volume for item, if applicable - cube, sphere, cylinder, baseCone, topCone
 */
TestAbstractPart = (function (url, width, height, depth, itemId, footprint, renderShape) {
	var _id = null;
	
	var setId = function setId (id) {
		_id = id;
	};
	
	var getUrl = function getUrl () { return url; };
	var getWidth = function getWidth () { return width; };
	var getHeight = function getHeight () { return height; };
	var getImageUrl = function getImageUrl () { return url; };
	
	return {
		id: _id,
		url: url,
		width: width,
		height: height,
		depth: depth,
		itemId: itemId,
		footprint: footprint,
		renderShape: renderShape,
		setId: setId,
		getUrl: getUrl,
		getWidth: getWidth,
		getHeight: getHeight,
		getImageUrl: getImageUrl
	};
});

TestLoader = class TestLoader {
	constructor () {
		console.log('TestLoader: constructor');
		this.fakePartId = 0;
		this.fakeItemId = 0;
		this.fakeItemList = {};
	}
	
	createTestPart (url) {
		console.log('TestLoader.createTestPart');
		let partId = 'partId-' + this.fakePartId;
		this.fakePartId++;
		this.fakeItemList[partId] = new TestAbstractPart(url, .5, .5, .5, partId);
		return this.fakeItemList[partId];
	}
	
	createTestParts (urlArray) {
		let parts = [];
		for (i=0, len=urlArray.length; i<len; ++i) {
			parts.push(this.createTestPart(urlArray[i]));
		}
		return parts;
	}
	
	createTestItem (item, itemIdPrefix) {
		let itemId = itemIdPrefix + '-' + this.fakeItemId;
		this.fakeItemId++;
		let theItem = new TestAbstractPart(item.img, .5, .5, .5, itemId);
		theItem.setId(item.id);
		this.fakeItemList[itemId] = theItem;
		return theItem;
	}
	
	createTestItems (itemArray, itemIdPrefix) {
		let items = [];
		for (i=0, len=itemArray.length; i<len; ++i) {
			items.push(this.createTestItem(itemArray[i], itemIdPrefix));
		}
		return items;
	}
	
	getItem (itemId) {
		return this.fakeItemList[itemId];
	}
};

testLoader = null;

getTestLoader = function () {
	if (!testLoader) {
		testLoader = new TestLoader();
	}
	return testLoader;
};
