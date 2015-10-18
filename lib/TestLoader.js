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
class TestAbstractPart {
	constructor (url, width, height, itemId) {
		this.url = url;
		this.width = width;
		this.height = height;
		this.itemId = itemId;
	}
	
	setId (id) {
		// augmentation
		this.id = id;
	}
}

TestLoader = class TestLoader {
	constructor () {
		console.log('TestLoader: constructor');
		this.fakePartId = 0;
		this.fakeItemId = 0;
	}
	
	createTestPart (url) {
		console.log('TestLoader.createTestPart');
		let partId = 'partId-' + this.fakePartId;
		this.fakePartId++;
		return new TestAbstractPart(url, .5, .5, partId);
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
		let theItem = new TestAbstractPart(item.img, .5, .5, itemId);
		theItem.setId(theItem.id);
		return theItem;
	}
	
	createTestItems (itemArray, itemIdPrefix) {
		let items = [];
		for (i=0, len=itemArray.length; i<len; ++i) {
			items.push(this.createTestItem(itemArray[i], itemIdPrefix));
		}
		return items;
	}
};

testLoader = null;

getTestLoader = function () {
	if (!testLoader) {
		testLoader = new TestLoader();
	}
	return testLoader;
};
