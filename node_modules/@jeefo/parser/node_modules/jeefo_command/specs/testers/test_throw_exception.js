/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_throw_exception.js
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

var expect = require("expect");

module.exports = function test_throw_message (message, thrower) {
	it(`Should be throw new Error('${ message }').`, () => {
		try {
			thrower();
			expect("throw failed").toBe("executed unreachble state.");
		} catch (e) {
			expect(e instanceof Error).toBe(true);
			expect(e.message.indexOf(message) !== -1).toBe(true);
		}
	});
};
