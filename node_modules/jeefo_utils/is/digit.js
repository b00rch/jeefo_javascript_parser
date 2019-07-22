/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : digit.js
* Created at  : 2017-08-09
* Updated at  : 2017-08-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var IS_DIGITS_SIGNED_NUMBER   = /^\-?\d+(?:.\d+)?$/,
	IS_DIGITS_UNSIGNED_NUMNER = /^\d+(?:.\d+)?$/;

module.exports = function (value, is_unsigned) {
	return (is_unsigned ? IS_DIGITS_UNSIGNED_NUMNER : IS_DIGITS_SIGNED_NUMBER).test(value);
};
