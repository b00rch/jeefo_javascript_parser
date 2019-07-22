/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : insert_at.js
* Created at  : 2017-09-14
* Updated at  : 2017-09-14
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var is_array = Array.isArray;

module.exports = function array_insert_at (array, value_or_values, index, ignore) {
	if (is_array(value_or_values)) {
		array.splice.apply(array, [index, ignore || 0].concat(value_or_values));
	} else {
		array.splice.call(array, index, ignore || 0, value_or_values);
	}
};
