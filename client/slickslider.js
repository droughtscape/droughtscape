/**
 * Created by kishigo on 7/24/15.
 * Copyright (c) 2015 DirecTV LLC, All Rights Reserved
 *
 * This software and its documentation may not be used, copied, modified or distributed, in whole or in part, without express
 * written permission of DirecTV LLC.
 *
 * The source code is the confidential and proprietary information of DirecTV, Inc. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement
 * you entered into with DirecTV LLC.
 *
 */

Template.slick_slider.rendered = function () {
	$('.multiple-items').slick({
		dots: true,
		arrows: true,
		slidesToShow: 2,
		slidesToScroll: 1,
		variableWidth: true
	});
};
