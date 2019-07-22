/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_default_value.js
* Created at  : 2019-01-05
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

var expect = require("expect");

module.exports = function test_default_value (test_cases) {
	describe(".value", () => {
		test_cases.forEach(test_case => {
			var instance = test_case.create_instance();

			it(`Should be got ${ test_case.got }`, () => {
				expect(instance.value).toBe(test_case.value);
			});
		});
	});
};
