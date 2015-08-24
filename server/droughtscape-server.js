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

Admins = new Mongo.Collection('admins');

Meteor.startup(function () {
		// Create a default admin
		if (Admins.find({}).count() === 0) {
			Admins.insert({
				'admin' : 'kelvin.ishigo@gmail.com'
			});
			console.log('Admins.count: ' + Admins.find({}).count());
		}
		var admins = Admins.find({}).fetch();
		console.log('Admins: admins: ' + admins);
	}
);

var getUserName = function getUserName () {
	var user = Meteor.user();
	return user && user.emails ? user.emails[0].address : "";
};

var getAdmins = function getAdmins () {
	return Admins.find({}).fetch();
};

var _isAdmin = function _isAdmin(userName) {
	var admins = getAdmins();
	var isAdmin = false;
	if (userName) {
		for (var i = 0, len = admins.length; i < len; ++i) {
			if (userName === admins[i].admin) {
				isAdmin = true;
				break;
			}
		}
	}
	return isAdmin;
};

Meteor.methods({
	'isAdmin': function isAdmin () {
		var userName = getUserName();
		console.log('isAdmin: hello: user: ' + userName + ', admin: ' + _isAdmin(userName));
		return _isAdmin(userName);
	},
	'insertAdmin': function insertAdmin (newAdmin) {
		// Only allowed if caller is an admin
		if (_isAdmin(getUserName())) {
			Admins.insert({
				'admin' : newAdmin
			});
		}
		else {
			console.log('SECURITY: inappropriate attempt to insertAdmin: newAdmin: ' + newAdmin + ' -- from: ' + getUserName());
		}
	}
});