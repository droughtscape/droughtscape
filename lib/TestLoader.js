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

TestLoader = class TestLoader {
	constructor () {
		console.log('TestLoader: constructor');
		this.fakePartId = 0;
		this.fakeItemId = 0;
		this.fakeItemList = {};
	}
	
	createTestPart (url, partType) {
		console.log('TestLoader.createTestPart');
		let partId = 'partId-' + this.fakePartId;
		this.fakePartId++;
		let renderShapeType = RenderShapeType.sphere;
		let partFootprintType = LayoutFootprintType.ellipse;
		if (partType === PartType.groundcovers) {
			renderShapeType = RenderShapeType.plane;
			partFootprintType = LayoutFootprintType.rectangle;
		}
		this.fakeItemList[partId] = new AbstractPart(url, .5, .5, .5, partId, partType, partFootprintType, renderShapeType);
		return this.fakeItemList[partId];
	}
	
	createTestPartsImpl (urlArray, partType) {
		let parts = [];
		for (i=0, len=urlArray.length; i<len; ++i) {
			parts.push(this.createTestPart(urlArray[i], partType));
		}
		return parts;
	}
	
	createTestParts (urlArray) {
		return this.createTestPartsImpl(urlArray, PartType.plants);
	}
	
	createTestItem (item, itemIdPrefix) {
		let itemId = itemIdPrefix + '-' + this.fakeItemId;
		this.fakeItemId++;
		let theItem = new AbstractPart(item.img, .5, .5, .5, itemId, PartType.plants, LayoutFootprintType.rectangle, RenderShapeType.cubic);
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
