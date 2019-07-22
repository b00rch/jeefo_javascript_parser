/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : i_base_validator_specs.js
* Created at  : 2019-01-04
* Updated at  : 2019-01-05
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var jeefo_class          = require("../../src/misc/jeefo_class"),
	IBaseValidator       = require("../../src/validators/i_base_validator"),
	test_throw_exception = require("../testers/test_throw_exception");

describe("class interface IBaseValidator ()", () => {
	// {{{1 Case 1: Constructor function called.
	test_throw_exception("Interface class cannot be instantiated", function () {
		var o = new IBaseValidator();
		o = null;
	});

	// {{{1 Case 2: .validate()
	describe(".validate(value, callback)", () => {
		test_throw_exception("Unimplemented virtual function called", function () {
			var DerivedClass = jeefo_class.create("DerivedClass", IBaseValidator, {});
			var d = new DerivedClass();
			d.validate();
		});
	});
	// }}}1
});
