/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : i_base_option_specs.js
* Created at  : 2019-01-04
* Updated at  : 2019-01-07
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
	IBaseOption          = require("../../src/options/i_base_option"),
	test_throw_exception = require("../testers/test_throw_exception");

describe("class interface IBaseOption ()", () => {
	// {{{1 Case 1: Constructor function called.
	test_throw_exception("Interface class cannot be instantiated", function () {
		var o = new IBaseOption();
		o = null;
	});

	// {{{1 Case 2: .initlaize()
	describe(".initialize(argument_list, index)", () => {
		test_throw_exception("Interface only virtual function called", function () {
			var DerivedClass = jeefo_class.create("DerivedClass", IBaseOption, {});
			var d = new DerivedClass();
			d.initialize();
		});
	});
	// }}}1
});
