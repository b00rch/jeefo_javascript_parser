/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_invalid_argument_exception.js
* Created at  : 2019-01-03
* Updated at  : 2019-01-16
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var expect                   = require("expect"),
	InvalidArgumentException = require("../../src/exceptions/invalid_argument_exception");

module.exports = function test_invalid_argument_exception (test_case) {
	it(`Should be throw new InvalidArgumentException('${ test_case.argument_index }:${ test_case.argument_name }', '${ test_case.error_message }')`, () => {
		try {
			test_case.thrower(test_case.argument_value);
			expect("throw failed").toBe("throw");
		} catch (e) {
			expect(e instanceof InvalidArgumentException).toBe(true);
			expect(e instanceof TypeError).toBe(true);

			expect(e.error_message).toBe(test_case.error_message);
			expect(e.function_name).toBe(test_case.function_name);
			expect(e.parameter_name).toBe(test_case.argument_name);
			expect(e.parameter_index).toBe(test_case.argument_index);
			expect(e.parameter_value).toBe(test_case.argument_value);
		}
	});
};
