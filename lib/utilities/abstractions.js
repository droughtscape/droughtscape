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
 * PartType - enum type to categorize parts
 * @type {{plants: number, groundcovers: number, borders: number, pavers: number, largerocks: number, irrigation: number, lighting: number, decorative: number, lawn: number, other: number, all: number}}
 */
PartType = {
		plants:			0,
		groundcovers:	1,
		borders:		2,
		pavers:			3,
		largerocks:		4,
		irrigation:		5,
		lighting:		6,
		decorative:		7,
		other:			100,
		all:			101
};

/**
 * LayoutFootprintType - enum type for 2D layout
 * @type {{rectangle: number, ellipse: number}}
 */
LayoutFootprintType = {
		rectangle:		0,
		ellipse:		1
};

/**
 * RenderShapeType - enum type for 3D renderings
 * @type {{cubic: number, sphere: number, cylinder: number, baseCone: number, topCone: number}}
 */
RenderShapeType = {
		cubic:			0,
		sphere:			1,
		cylinder:		2,
		baseCone:		3,
		topCone:		4
};

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
AbstractPart = (function (url, width, height, depth, itemId, footprint, renderShape, partType) {
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
		partType: partType,
		setId: setId,
		getUrl: getUrl,
		getWidth: getWidth,
		getHeight: getHeight,
		getImageUrl: getImageUrl
	};
});

AbstractLawn = (function (lawnShape, width, height, itemId) {
	return {
		lawnShape: lawnShape,
		width: width,
		height: height,
		itemId: itemId
	};
});