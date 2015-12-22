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
 * Enumerates the categories of parts
 * @type {{plants: number, groundcovers: number, borders: number, pavers: number, largerocks: number, irrigation: number, lighting: number, decorative: number, other: number, all: number, nullPart: number}}
 */
PartType = {
	plants: 0,
	groundcovers: 1,
	borders: 2,
	pavers: 3,
	largerocks: 4,
	irrigation: 5,
	lighting: 6,
	decorative: 7,
	paths: 8,
	planters: 9,
	other: 100,
	all: 101,
	nullPart: 200
};

/**
 * LayoutFootprintType - enum type for 2D layout
 * @type {{rectangle: number, ellipse: number, expanding: number}}
 */
LayoutFootprintType = {
	rectangle: 0,
	ellipse: 1,
	expanding: 2
};

/**
 * RenderShapeType - enum type for 3D renderings
 * @type {{cubic: number, sphere: number, cylinder: number, baseCone: number, topCone: number}}
 */
RenderShapeType = {
	cubic: 0,
	sphere: 1,
	cylinder: 2,
	baseCone: 3,
	topCone: 4,
	plane: 5,
	custom: 100
};

/**
 * Enumerates the categories of general lawn shapes
 * @type {{rectangle: number, corner: number, custom: number, all: number, nullLawn: number}}
 */
LawnShapeType = {
	rectangle: 0,
	corner: 1,
	custom: 2,
	all: 100,
	nullLawn: 200
};

// This is just for test, templates will be dynamic
/**
 *
 * @type {{custom: number, template1: number, template2: number, template3: number}}
 */
LawnTemplateType = {
	custom: 0,
	template1: 1,
	template2: 2,
	template3: 3
};

// View controlling types
/**
 *
 * @type {{about: number, home: number, create: number}}
 */
ViewType = {
	about: 0,
	home: 1,
	create: 2

};
/**
 * Enumerates the set of views {render, navBar, rightBar}.  Use when setting views via the ViewState.pushTarget() function
 * @type {{about: number, home: number, signIn: number, create: number, createShapeLawn: number, createMeasureLawn: number, createBuildLawn: number, createLayoutLawn: number, createLayoutSettings: number, createRenderLawn: number, createSelectParts: number, createFinishLawn: number, createInfoPart: number, infoLawn: number, infoPart: number, newPart: number, parts: number, lawns: number, personalize: number, community: number, rebates: number, waterCalc: number, waterSmart: number, favorites: number, partSelectParts: number}}
 */
ViewTargetType = {
	about: 0,
	home: 1,
	signIn: 2,
	create: 3,
	createShapeLawn: 4,
	createMeasureLawn: 5,
	createBuildLawn: 6,
	createLayoutLawn: 7,
	createLayoutSettings: 8,
	createRenderLawn: 9,
	createSelectParts: 10,
	createFinishLawn: 11,
	createInfoPart: 12,
	infoLawn: 13,
	infoPart: 14,
	newPart: 15,
	parts: 16,
	lawns: 17,
	personalize: 18,
	community: 19,
	rebates: 20,
	waterCalc: 21,
	waterSmart: 22,
	favorites: 23,
	partSelectParts: 24,
	layoutInfoPart: 25
};
/**
 * Defines the set of allowable render views.  These are strings because the map the actual template names
 * @type {{about: string, build_lawn: string, community: string, create: string, favorites: string, finish_lawn: string, info_lawn: string, info_part: string, lawns: string, layout_lawn: string, layout_settings: string, measure_lawn: string, new_part: string, parts: string, personalize: string, rebates: string, render_lawn: string, select_parts: string, shape_lawn: string, signin: string, splash: string, watercalc: string, watersmart: string}}
 */
RenderViewType = {
	about: 'about',
	build_lawn: 'build_lawn',
	community: 'community',
	create: 'create',
	favorites: 'favorites',
	finish_lawn: 'finish_lawn',
	info_lawn: 'info_lawn',
	info_layout_part: 'info_layout_part',
	info_part: 'info_part',
	lawns: 'lawns',
	layout_lawn: 'layout_lawn',
	layout_settings: 'layout_settings',
	measure_lawn: 'measure_lawn',
	new_part: 'new_part',
	parts: 'parts',
	personalize: 'personalize',
	rebates: 'rebates',
	render_lawn: 'render_lawn',
	select_parts: 'select_parts',
	shape_lawn: 'shape_lawn',
	signin: 'signin',
	splash: 'splash',
	watercalc: 'watercalc',
	watersmart: 'watersmart'
};
/**
 * Defines set of nav bars.  String for now, can later be changed to int if we want
 * @type {{home: string, create: string, layout: string, render: string}}
 */
NavBarType = {
	create: 'create',
	home: 'home',
	layout: 'layout',
	render: 'render'
};
NavBarTagActionType = {
	MoveToBack: 0,
	MoveToFront: 1,
	MoveBackward: 2,
	MoveForward: 3,
	SelectMode: 4,
	Fit: 5,
	FitWidth: 6,
	FitHeight: 7,
	FitToBox: 8,
	Zoom100: 9,
	Zoom200: 10,
	Zoom300: 11,
	Zoom400: 12,
	Delete: 13,
	Copy: 14,
	Paste: 15,
	Rotate90: 16,
	FlipVertical: 17,
	FlipHorizontal: 18,
	Undo: 19
	
};
RightBarTagActionType = {
	ZoomIn: 100,
	ZoomOut: 101,
	PanCameraLeft: 102,
	PanCameraRight: 103,
	MoveCameraUp: 104,
	MoveCameraDn: 105,
	RotateCameraLt: 106,
	RotateCameraRt: 107
};
RenderActionType = {
	Init: 1000
};

/**
 * Defines set of right bars.  String for now, can later be changed to int if we want
 * @type {{create_info_item: string, finish_lawn: string, home: string, lawns: string, layout_lawn: string, new_parts: string, part_info_item: string, parts: string, render_lawn: string, select_parts: string, none: string}}
 */
RightBarType = {
	create_info_item: 'create.info_item',
	finish_lawn: 'finish_lawn',
	home: 'home',
	lawns: 'lawns',
	layout_lawn: 'layout_lawn',
	new_parts: 'new_parts',
	part_info_item: 'part.info_item',
	parts: 'parts',
	render_lawn: 'render_lawn',
	select_parts: 'select_parts',
	none: 'none'
};

/**
 * Use when you define a part that isn't "real", e.g., a null part
 * @type {Function}
 * @parameter {string} url - mandatory image path
 * @parameter {string} id - mandatory id key
 * @parameter {PartType} partType - mandatory specification of the class of part
 */
AbstractPartShape = class AbstractPartShape {
	constructor (url, id, partType) {
		this.url = url;
		this.id = this.itemId = id;
		this.partType = partType;
	}
};
/**
 * AbstractPart - abstract part, used as in memory representation of collection item
 * @type {AbstractPart}
 * @parameter {string} url - mandatory image path
 * @parameter {number} width - mandatory width in meters
 * @parameter {number} height - mandatory height in meters (really w x h in 2D)
 * @parameter {number} depth - mandatory 3D height of object
 * @parameter {string} itemId - mandatory collection key
 * @parameter {PartType} partType - mandatory specification of the class of part
 * @parameter {LayoutFootprintType} footprint - shape of 2D footprint viewed from top - rectangle, ellipse
 * @parameter {RenderShapeType} renderShape - 3D volume for item, if applicable - cube, sphere, cylinder, baseCone, topCone
 */
AbstractPart = class AbstractPart {
	constructor (url, width, height, depth, itemId, partType, footprint, renderShape) {
		this.url = url;
		this.width = width;
		this.height = height;
		this.depth = depth;
		this.itemId = itemId;
		this.partType = partType;
		this.footprint = footprint || LayoutFootprintType.ellipse;
		this.renderShape = renderShape || RenderShapeType.sphere;
		this.id = null;
	}
};
/**
 * 
 * @type {AbstractPlant}
 * @parameter {string} url - mandatory image path
 * @parameter {number} width - mandatory width in meters
 * @parameter {number} height - mandatory height in meters (really w x h in 2D)
 * @parameter {number} depth - mandatory 3D height of object
 * @parameter {string} itemId - mandatory collection key
 * @parameter {PartType} partType - mandatory specification of the class of part
 * @parameter {LayoutFootprintType} footprint - shape of 2D footprint viewed from top - rectangle, ellipse
 * @parameter {RenderShapeType} renderShape - 3D volume for item, if applicable - cube, sphere, cylinder, baseCone, topCone
 * @parameter {number} daysToMaturity - days for plant to grow to full size
 */
AbstractPlant = class AbstractPlant extends AbstractPart {
	constructor (url, width, height, depth, itemId, partType, footprint, renderShape, daysToMaturity) {
		super (url, width, height, depth, itemId, partType, footprint, renderShape);
		this.daysToMaturity = daysToMaturity || 365;
	}
};

var testMe = new AbstractPlant('dummy', 0.6, 0.6, 0.7, 8888, PartType.groundcovers);
console.log('testMe.itemId: ' + testMe.itemId + ', daysToMaturity: ' + testMe.daysToMaturity);

/**
 * Use to define a lawn that isn't "real", e.g., null lawn
 * @type {Function}
 * @parameter {string} url - shape image specifier
 * @parameter {string} id - lawn shape collection id
 * @parameter {LawnShapeType} shapeType - shape classification
 */
AbstractLawnShape = class AbstractLawnShape {
	constructor (url, id, shapeType) {
		this.url = url;
		this.id = this.itemId = id;
		this.shapeType = shapeType;
	}
};
/**
 * Define a lawn template.  These are dynamic and will add more items as we evolve
 * @type {Function}
 * @parameter {string} url - shape image specifier
 * @parameter {string} id - lawn shape collection id
 * @parameter {LawnTemplateType} templateType - template classification
 */
AbstractLawnTemplate = class AbstractLawnTemplate {
	constructor (url, id, templateType) {
		this.url = url;
		this.id = this.itemId = id;
		this.templateType = templateType;
	}
};

/**
 * Base type for lawns
 * @type {Function}
 * @parameter {string} url - shape image specifier
 * @parameter {string} id - lawn shape collection id
 * @parameter {LawnShapeType} lawnShape
 * @parameter {LawnTemplateType} lawnTemplate
 * @parameter {number} width
 * @parameter {number} height
 * @parameter {string} itemId
 */
AbstractLawn = class AbstractLawn {
	constructor (url, id, lawnShape, lawnTemplate, width, height, itemId) {
		this.url = url;
		this.id = id;
		this.lawnShape = lawnShape;
		this.lawnTemplate = lawnTemplate;
		this.width = width;
		this.height = height;
		this.itemId = itemId;
	}
};
/**
 * Base type for splash images
 * @type {Function}
 * @parameter {string} url - shape image specifier
 * @parameter {string} id - lawn splash collection id
 */
AbstractSplashLawn = class AbstractSplashLawn {
	constructor (url, id) {
		this.url = url;
		this.id = this.itemId = id;
	}
};
/**
 * Real world units (Meter) and clockwise degree rotation
 * Defaults for undefined parameters
 * @type {Function}
 * @parameter {number} x - meters
 * @parameter {number} y - meters
 * @parameter {number} z - z-order
 * @parameter {number} rotation - degrees clockwise
 */
AbstractLayoutLocus = class AbstractLayoutLocus {
	constructor (x, y, z, rotation) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.rotation = rotation || 0;
	}
};
AbstractLayoutPart = class AbstractLayoutPart {
	constructor (abstractPart, x, y, z, rotation) {
		this.abstractPart = abstractPart;
		this.locus = new AbstractLayoutLocus(x, y, z, rotation);
	}
};