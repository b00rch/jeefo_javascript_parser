/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : snake_case.js
* Created at  : 2017-09-01
* Updated at  : 2017-09-01
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var CAMEL_CASE_REGEXP = /[A-Z]/g;

module.exports = function snake_case (str) {
	return str.replace(CAMEL_CASE_REGEXP, function (letter, pos) {
		return (pos ? '_' : '') + letter.toLowerCase();
	});
};
