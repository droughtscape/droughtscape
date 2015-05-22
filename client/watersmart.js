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

var tipIndex = 0;

Template.watersmart.onCreated(function () {
	this.subscribe('watersavertips');
});

Template.watersmart.onRendered(function () {
	var tipCard = document.getElementById('watersmart-card');
	if (tipCard) {
		// Center the card
		var width = tipCard.clientWidth;
		var height = tipCard.clientHeight;
		var render = document.getElementById('render');
		if (render) {
			var renderWidth = render.clientWidth;
			var renderHeight = render.clientHeight;
			var left = renderWidth / 2 - (width/2);
			var top = renderHeight / 2 - (height/2);
			tipCard.style.position = 'absolute';
			tipCard.style.left = left + 'px';
			tipCard.style.top = top + 'px';
		}
	}
	var tip = document.getElementById("tip-contents");
	if (tip) {
		if (Tips.length > 0) {
			tip.innerHTML = Tips[0].tip;
		}
	}
});

Template.watersmart.events({
	'click #dismiss-watersmart-btn': function () {
		Session.set('renderView','home');
	},
	'click #next-tip-btn': function () {
		var tip = document.getElementById("tip-contents");
		if (tip) {
			tipIndex++;
			if (tipIndex === Tips.length) {
				tipIndex = 0;
			}
			tip.innerHTML = Tips[tipIndex].tip;
		}
	},
	'click #add-tip-btn': function () {
		console.log('add a tip');
		Session.set('renderView','newtip');
		//Materialize.toast('I am a toast!', 0);
	}
});
