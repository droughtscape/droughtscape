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
Object.size = function (obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

Template.navBar.onRendered(function () {
	// if there is a signin macro button, size it
	var signin = document.getElementById('at-nav-button');
	if (signin) {
		signin.style.height = '54px';
		signin.style.lineHeight = '56px';
		signin.fontSize = '1.6rem';
	}
});

// From useraccounts_materialize.js
// Simply 'inherits' helpers from AccountsTemplates
Template.atNavItem.helpers(AccountsTemplates.atNavButtonHelpers);  
Template.atNavItem.helpers({
	text: function(){
		var key = Meteor.userId() ? AccountsTemplates.texts.navSignOut : AccountsTemplates.texts.navSignIn;
		var text = T9n.get(key, markIfMissing=false);
		text = text.toLowerCase();
		return text;
	},
	loginColor: function () {
		return (Meteor.userId()) ? 'teal-text' : 'red-text';
	},
	loginIcon: function () {
		return (Meteor.userId()) ? 'mdi-action-verified-user right' : 'mdi-action-input right';
	}
});

// Simply 'inherits' events from AccountsTemplates
Template.atNavItem.events(AccountsTemplates.atNavButtonEvents);

Template.navBar.helpers({
	navButtons: function () {
		// The nav bar is a singleton per "page" so we use a global
		// Session variable: navBarConfig which can by dynamically
		// set when different templates are loaded to allow configuration
		return NavConfig.getNavBarConfig(Session.get('navBarConfig'));
	}
});

Template.navBar.events({
	// We follow the convention that the currentTarget.id is the renderView target template
	'click': function (event) {
		console.log('Template.navBar.events: ' + event);
		//Session.set('renderView', event.currentTarget.id);
		var id = event.currentTarget.id;
		switch (id) {
		case 'droughtscapelogo':
			Session.set('renderView', 'splash');
			break;
		case 'at-nav-item':
		case 'at-nav-button':
			if (!Meteor.userId()) {
				Session.set('renderView', 'signin');
			}
			else {
				AccountsTemplates.logout();
			}			
			break;
		default:
			if (NavConfig.validateNavBarId(Session.get('navBarConfig'), id)) {
				Session.set('renderView', event.currentTarget.id);
			}
			break;
		}
		// dispatch a resize event to force rendering of the home page
		// Even if size doesn't change
		window.dispatchEvent(new Event('resize'));
	}
});
