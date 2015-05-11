/**
 * Created by kishigo on 5/6/15.
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
if (Meteor.isClient) {
	Template.plants.events({
		'click #plants-mwd-top-50': function () {
			window.location.href = 'http://bewaterwise.com/pdf/50_Faves.pdf';
		},
		'click #turf-terminators-plant-catalog': function () {
			window.location.href = 'http://turfterminators.com/how-turf-terminators-works/plant-and-groundcover-catalog/';
		}
	})
}