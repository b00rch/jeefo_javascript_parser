/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : i_base_validator.js
* Created at  : 2019-01-04
* Updated at  : 2019-01-04
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var jeefo_class = require("../misc/jeefo_class"),
	throw_error = require("../exceptions/throw_error");

module.exports = jeefo_class.create("IBaseValidator", {
	constructor : function () {
		throw_error("Interface class cannot be instantiated.");
	},

	validate : function () {
		throw_error("Unimplemented virtual function called.");
	}
});
