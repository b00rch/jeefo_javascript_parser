/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : array_validator_specs.js
* Created at  : 2019-01-07
* Updated at  : 2019-01-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var IBaseValidator                  = require("../../src/validators/i_base_validator"),
	ArrayValidator                  = require("../../src/validators/array_validator"),
	argument_test_factory           = require("../argument_test_factory"),

	test_instance                   = require("../testers/test_instance"),
	test_validation                 = require("../testers/test_validation"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

describe("class ArrayValidator (config, is_muteable)", () => {
	var config_argument_test = argument_test_factory("ArrayValidator", "config", 0);

	test_invalid_argument_exception(config_argument_test("error_input", "not an object", function (error_input) {
		return new ArrayValidator(error_input);
	}));

	var instance = new ArrayValidator();

	test_instance(instance, [
		{ name : "ArrayValidator", constructor_fn : ArrayValidator },
		{ name : "IBaseValidator", constructor_fn : IBaseValidator },
	]);

	var arr = [];
	var sets_of_test_cases = [
		// {{{1 Error cases
		{
			description : "Error cases",
			cases : [
				// {{{2 Case: undefined
				{
					when : "undefined",
					message : "undefined"
				},

				// {{{2 Case: null
				{
					when : "null",
					value   : null,
					message : "null",
				},

				// {{{2 Case: object
				{
					when : "{}",
					value : {},
					message : "not an array"
				},

				// {{{2 Case: number
				{
					when : 0,
					value : 0,
					message : "not an array"
				},

				// {{{2 Case: string
				{
					when : '"string"',
					value : "string",
					message : "not an array"
				},

				// {{{2 Case: boolean
				{
					when : 'true',
					value : true,
					message : "not an array"
				},

				// {{{2 Case: function
				{
					when : "function () {}",
					value : function () {},
					message : "not an array"
				},
				// }}}2
			]
		},

		// {{{1 Valid cases
		{
			description : "Valid cases",
			cases : [
				// {{{2 Case: array
				{
					got            : "[]",
					when           : "[]",
					value          : arr,
					expected_value : arr
				},

				// {{{2 Case: { define = false } and (value = undefined)
				{
					config : { define : false },
				},

				// {{{2 Case: { nullable = true } and (value = null)
				{
					got : "null",
					when  : "null",
					value : null,
					config : { nullable : true },
					expected_value : null
				},
				// }}}2
			]
		}
		// }}}1
	];

	test_validation(instance, sets_of_test_cases);
});
