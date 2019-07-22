/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_initialize.js
* Created at  : 2019-01-01
* Updated at  : 2019-01-15
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var expect                          = require("expect"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

module.exports = function test_initialize (instance, tests) {
	describe(".initialize(arguments_list, index)", () => {
		if (tests.invalid_cases) {
			describe("Invalid cases", () => {
				tests.invalid_cases.forEach(test_invalid_argument_exception);
			});
		}

		describe("Valid cases", () => {
			tests.valid_cases.forEach(test_case => {
				var args = test_case.args;

				it(`Should be got ${ test_case.value } when => (arguments_list = [${ args.map(arg => "'" + arg + "'") }]) and (index = ${ test_case.index })`, () => {
					var return_index = instance.initialize(args, test_case.index + 1);

					expect(return_index).toBe(test_case.expected_index);
					expect(instance.value).toBe(test_case.expected_value);
				});
			});
		});
	});
};
