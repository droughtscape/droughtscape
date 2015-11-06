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
SplashManager = (function () {
	// Collection of splash lawns images.  This will move to a real collection
	var _splashLawns;
	/**
	 * Call at startup to initialize _splashLawns for test.
	 * @private
	 */
	var _initSplashlawns = function _initSplashlawns () {
		console.log('_initSplashlawns: ENTRY');
		_splashLawns = [
			new AbstractSplashLawn('//c1.staticflickr.com/9/8812/17426760895_a77bdd6c09_h.jpg', 'splash-1'),
			new AbstractSplashLawn('template1.jpg', 'splash-2'),
			new AbstractSplashLawn('template2.png', 'splash-3'),
			new AbstractSplashLawn('template3.jpg', 'splash-4')
		]
	};
	/**
	 * Returns set of acceptable splash lawn Abstract types
	 * @returns {*} 
	 * @private
	 */
	var _getSplashLawns = function _getSplashLawns () {
		return _splashLawns;
	};
	/**
	 * Gets a particular splash lawn by id
	 * @param {string} id - dom element id
	 * @returns {*}
	 * @private
	 */
	var _getSplashLawn = function _getSplashLawn (id) {
		for (var i=0, len=_splashLawns.length; i<len; ++i) {
			if (_splashLawns[i].id === id) {
				return _splashLawns[i];
			}
		}
	};
	/**
	 * Brings the element to the "front" by adding opacity class, all other elements have the base splashImage class
	 * reassigned, which effectively sets opacity to 0.  This is animated by css
	 * @param {string} id - dom element id
	 * @private
	 */
	var _bringToFront = function _bringToFront (id) {
		for (var i=0, len=_splashLawns.length; i<len; ++i) {
			if (_splashLawns[i].id === id) {
				document.getElementById(id).className += ' opaque';
			}
			else {
				document.getElementById(_splashLawns[i].id).className = 'splashImage';
			}
		}
	};
	
	return {
		initSplashLawns: _initSplashlawns,
		getSplashLawn: _getSplashLawn,
		getSplashLawns: _getSplashLawns,
		bringToFront: _bringToFront
	};
})();