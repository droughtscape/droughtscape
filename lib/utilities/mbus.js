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
 * 
 * javascript MBus, well, actually stolen from http://davidwalsh.name/pubsub-javascript
 * Adds publishAsynch
 * A very simplistic pubsub message bus.  No bubbling.
 * 
 */
MBus = (function () {
	//'use strict';

	var topics = {};

	/**
	 * subscribe - use this to subscribe to an event topic
	 * @param  {string} topic
	 * @param  {object} listener who wishes to subscribe
	 * @return {function} unsubscribe function
	 */
	var subscribe = function subscribe (topic, listener) {
		// Create the topic's object if not yet created
		if (!topics[topic]) {
			topics[topic] = {queue: []};
		}

		// Add the listener to queue
		var index = topics[topic].queue.push(listener) - 1;

		// Provide handle back for removal of topic
		return {
			remove: function () {
				delete topics[topic].queue[index];
			}
		};
	};

	/**
	 * publish - use this to publish an event topic that listeners might be interested in
	 * @param  {string} topic
	 * @param  {string} type type of message 
	 * @param  {object | number | string | array} value message data that listeners will get
	 */
	var publish = function publish(topic, type, value) {
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		if (!topics[topic] || !topics[topic].queue.length) {
			return;
		}

		var info = {topic: topic, type: type, value: value};
		// Cycle through topics queue, fire!
		var items = topics[topic].queue;
		items.forEach(function (item) {
			// wrap in try catch so that exceptions don't prevent downstream listeners from firing
			try {
				item(info || {});
			}
			catch (err) {}
		});
	};
	
	var publishSimple = function publishSimple (topic, value) {
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		if (!topics[topic] || !topics[topic].queue.length) {
			return;
		}

		var info = {topic: topic, value: value};
		// Cycle through topics queue, fire!
		var items = topics[topic].queue;
		items.forEach(function (item) {
			// wrap in try catch so that exceptions don't prevent downstream listeners from firing
			try {
				item(info || {});
			}
			catch (err) {}
		});
	};
	
	var validateMessage = function validateMessage (message) {
		return message.hasOwnProperty('topic') && message.hasOwnProperty('value');
	};

	/**
	 * publishAsynch - use this to publish an event topic that listeners might be interested in
	 * Uses setTimeout to cause an asynch dispatch to free up the main thread.
	 * @param  {string} topic
	 * @param  {string} type type of message
	 * @param  {object | number | string | array} value message data that listeners will get
	 */
	var publishAsynch = function publishAsynch(topic, type, value) {
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		if (!topics[topic] || !topics[topic].queue.length) {
			return;
		}

		var info = {type: type, value: value};
		// Cycle through topics queue, fire!
		var items = topics[topic].queue;
		items.forEach(function (item) {
			setTimeout(function () {
				item(info || {});
			}, 0);
		});
	};

	return {
		subscribe: subscribe,
		publish: publish,
		publishSimple: publishSimple,
		publishAsynch: publishAsynch,
		validateMessage: validateMessage
	};
})();

