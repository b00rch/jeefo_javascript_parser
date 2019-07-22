/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : boolean_validator_specs.js
* Created at  : 2019-01-03
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
	BooleanValidator                = require("../../src/validators/boolean_validator"),
	argument_test_factory           = require("../argument_test_factory"),

	test_instance                   = require("../testers/test_instance"),
	test_validation                 = require("../testers/test_validation"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

describe("class BooleanValidator (config, is_muteable)", () => {
	var config_argument_test = argument_test_factory("BooleanValidator", "config", 0);

	test_invalid_argument_exception(config_argument_test("error_input", "not an object", function (error_input) {
		return new BooleanValidator(error_input);
	}));

	var instance = new BooleanValidator();

	test_instance(instance, [
		{ name : "BooleanValidator", constructor_fn : BooleanValidator },
		{ name : "IBaseValidator", constructor_fn : IBaseValidator },
	]);

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

				// {{{2 Case: array
				{
					when : "[]",
					value : [],
					message : "not a boolean",
				},

				// {{{2 Case: object
				{
					when : "{}",
					value : {},
					message : "not a boolean"
				},

				// {{{2 Case: number
				{
					when : 0,
					value : 0,
					message : "not a boolean"
				},

				// {{{2 Case: string
				{
					when : '"string"',
					value : "string",
					message : "not a boolean"
				},

				// {{{2 Case: function
				{
					when : "function () {}",
					value : function () {},
					message : "not a boolean"
				},
				// }}}2
			]
		},

		// {{{1 Valid cases
		{
			description : "Valid cases",
			cases : [
				// {{{2 Case: boolean
				{
					got            : "true",
					when           : "true",
					value          : true,
					expected_value : true
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
