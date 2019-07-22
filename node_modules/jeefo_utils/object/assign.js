/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assign.js
* Created at  : 2017-08-09
* Updated at  : 2017-08-11
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var object_keys = Object.keys;

module.exports = function (destination) {
	for (var i = 1, source, keys, j; i < arguments.length; ++i) {
		if ((source = arguments[i])) {
			keys = object_keys(source);
			j    = keys.length;

			while (j--) {
				destination[keys[j]] = source[keys[j]];
			}
		}
	}

	return destination;
};
