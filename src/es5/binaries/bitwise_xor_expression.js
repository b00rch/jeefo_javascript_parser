/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : bitwise_xor_expression.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var BitwiseXorExpression = function () {};
BitwiseXorExpression.prototype = require("./binary").make("BitwiseXorExpression", 8);

module.exports = {
	is          : function (token) { return token.operator === '^'; },
	token_type  : "Operator",
	Constructor : BitwiseXorExpression
};