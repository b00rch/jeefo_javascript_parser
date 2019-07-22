/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_type_and_name.js
* Created at  : 2019-01-01
* Updated at  : 2019-01-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var expect        = require("expect"),
	test_readonly = require("./test_readonly");

module.exports = function test_type_and_name (instance, type, name) {
	describe(".type", () => {
		it(`Should be ${ type }`, () => {
			expect(instance.type).toBe(type);
		});
	});

	describe(".name", () => {
		test_readonly(instance, "name");

		it(`Should be got '--${ name }' prefixed with '--'`, () => {
			expect(instance.name).toBe(`--${ name }`);
		});
	});
};
