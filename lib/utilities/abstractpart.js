/**
 * Created by kishigo on 10/26/15.
 * Copyright (c) 2015 DirecTV LLC, All Rights Reserved
 *
 * This software and its documentation may not be used, copied, modified or distributed, in whole or in part, without express
 * written permission of DirecTV LLC.
 *
 * The source code is the confidential and proprietary information of DirecTV, LLC. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement
 * you entered into with DirecTV LLC.
 *
 */
/**
 * LayoutFootprintType - enum type for 2D layout
 * @type {{rectangle, ellipse}}
 */
LayoutFootprintType = (function () {
	return {
		rectangle: 0,
		ellipse: 1
	};
})();

/**
 * RenderShapeType - enum type for 3D renderings
 * @type {{cubic, sphere, cylinder, baseCone, topCone}}
 */
RenderShapeType = (function () {
	return {
		cubic: 0,
		sphere: 1,
		cylinder: 2,
		baseCone: 3,
		topCone: 4
	};
})();

/**
 * AbstractPart - abstract part, used as in memory representation of collection item
 * @type {Function}
 * @parameter {string} url - image path
 * @parameter {number} width - width in meters
 * @parameter {number} height - height in meters (really w x h in 2D)
 * @parameter {number} depth - 3D height of object
 * @parameter {string} itemId - collection key
 * @parameter {LayoutFootprintType} footprint - shape of 2D footprint viewed from top - rectangle, ellipse
 * @parameter {RenderShapeType} renderShape - 3D volume for item, if applicable - cube, sphere, cylinder, baseCone, topCone
 */
AbstractPart = (function (url, width, height, depth, itemId, footprint, renderShape) {
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