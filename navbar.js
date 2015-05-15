/**
 * Created by kishigo on 5/15/15.
 * Copyright (c) 2015 Kelvin Ishigo, All Rights Reserved
 *
 * This software is released under the MIT license.
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