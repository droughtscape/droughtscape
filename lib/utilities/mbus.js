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
 * Adds publishAsynch, try-catch protection
 * A very simplistic pubsub message bus.  No bubbling.
 * 
 */
/**
 * MBusImpl - global class.  Currently only used to create MBus but if we later want to create
 * private buses, we would create more instances of this class.
 * @type {MBusImpl}
 */
MBusImpl = class MBusImpl { 
	constructor (busName) {
		this.busName = busName;
		this.topics = {};
	}
	/**
	 * subscribe - use this to subscribe to an event topic
	 * @param  {string} topic
	 * @param  {object} listener who wishes to subscribe
	 * @return {function} unsubscribe function
	 */
	subscribe (topic, listener) {
		let topics = this.topics;
		console.log('MBusImpl.subscribe[' + this.busName + ']: topic[' + topic + ']');
		// Create the topic's object if not yet created
		if (!topics[topic]) {
			topics[topic] = {queue: []};
		}

		// Add the listener to queue
		var index = topics[topic].queue.push(listener) - 1;

		// Provide handle back for removal of topic
		return {
			remove: () => {
				delete topics[topic].queue[index];
			}
		};
	}

	/**
	 * publish - Transitional function, when we refactor all type fields out, deprecate publish
	 * @param {string} topic 
	 * @param {object | number | string | array} value message data that listeners will get
	 */
	publish (topic, value) {
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		let topics = this.topics;
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
	}

	/**
	 * validateMessage - simple validation of required fields
	 * @param {object} message
	 * @returns {boolean}
	 */
	validateMessage (message) {
		return message.hasOwnProperty('topic') && message.hasOwnProperty('value');
	};

	/**
	 * publishAsynch - use this to publish an event topic that listeners might be interested in
	 * Uses setTimeout to cause an asynch dispatch to free up the main thread.
	 * @param  {string} topic
	 * @param  {string} type type of message
	 * @param  {object | number | string | array} value message data that listeners will get
	 */
	publishAsynch (topic, type, value) {
		let topics = this.topics;
		// If the topic doesn't exist, or there's no listeners in queue, just leave
		if (!topics[topic] || !topics[topic].queue.length) {
			return;
		}

		var info = {type: type, value: value};
		// Cycle through topics queue, fire!
		var items = topics[topic].queue;
		items.forEach(function (item) {
			setTimeout(function () {
				// wrap in try catch so that exceptions don't prevent downstream listeners from firing
				try {
					item(info || {});
				}
				catch (err) {}
			}, 0);
		});
	}
};

/**
 * MBus - system bus.  There is an implicit load order here, Do not use functions in the global frame to avoid issues.
 * @type {{subscribe, publish, publish, publishAsynch, validateMessage}}
 */
MBus = (function () {
	var systemBus = new MBusImpl('system');
	return systemBus;
})();
