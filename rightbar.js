/**
 * Created by kishigo on 5/13/15.
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
	Template.rightBar.helpers({
		dynamicTemplate: function () {
			// Contents of session variable renderView will 
			// fill the content area
			return Session.get('renderView');
		}
	});

	Template.rightBar.events({
		// We follow the convention that the currentTarget.id is the renderView target template
		'click': function (event) {
			console.log('Template.rightBar.events: ' + event);
			//Session.set('renderView', event.currentTarget.id);
			var id = event.currentTarget.id;
			switch (id) {
			default:
				//Session.set('renderView', event.currentTarget.id);
				Router.go(id);
				break;
			}
		}
	});

}