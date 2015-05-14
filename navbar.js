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
	Template.navBar.helpers({
		// Need to functionalize here
		navButtons: [
			{name: 'personalize', class: 'mdi-action-face-unlock right'},
			{name: 'plants', class: 'mdi-image-photo-library right'},
			{name: 'gallery', class: 'mdi-image-photo-library right'},
			{name: 'community', class: 'mdi-social-group right'},
			{name: 'rebates', class: 'mdi-editor-attach-money right'},
			{name: 'watersmart', class: 'mdi-social-share right'}
		]
	});

	Template.navBar.events({
		// We follow the convention that the currentTarget.id is the renderView target template
		'click': function (event) {
			console.log('Template.navBar.events: ' + event);
			//Session.set('renderView', event.currentTarget.id);
			var id = event.currentTarget.id;
			switch (id) {
			case 'droughtscapelogo':
				Session.set('renderView', 'home');
				//Router.go('home');
				break;
			default:
				Session.set('renderView', event.currentTarget.id);
				//Router.go(id);
				break;
			}
		}
	});

}