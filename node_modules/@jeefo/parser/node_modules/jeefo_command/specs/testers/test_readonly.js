/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_readonly.js
* Created at  : 2019-01-08
* Updated at  : 2019-01-09
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

module.exports = function test_readonly (instance, property) {
	it(`Should be throw error when directly assign new value`, () => {
		var has_error_ocurred = false;
		try {
			instance[property] = "something else";
		} catch (e) {
			has_error_ocurred = true;
		} finally {
			expect(has_error_ocurred).toBe(true);
		}
	});

	it(`Should be throw error when try to delete instance.${ property }`, () => {
		var has_error_ocurred = false;
		try {
			delete instance[property];
		} catch (e) {
			has_error_ocurred = true;
		} finally {
			expect(has_error_ocurred).toBe(true);
		}
	});

	it(`Should be throw error when use Object.defineProperty`, () => {
		var has_error_ocurred = false;
		try {
			Object.defineProperty(instance, property, {
				value    : "something else",
				writable : false
			});
		} catch (e) {
			has_error_ocurred = true;
		} finally {
			expect(has_error_ocurred).toBe(true);
		}
	});
};
