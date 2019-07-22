/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_instance.js
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

var expect = require("expect");

module.exports = function test_instance (instance, test_cases) {
	describe("Inherited classes...", () => {
		test_cases.forEach(test_case => {
			it(`Should be instanceof [Function: ${ test_case.name }] class.`, () => {
				expect(instance instanceof test_case.constructor_fn).toBe(true);
			});
		});
	});
};
