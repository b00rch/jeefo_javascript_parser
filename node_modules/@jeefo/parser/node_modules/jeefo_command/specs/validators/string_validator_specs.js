/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : string_validator_specs.js
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
	StringValidator                 = require("../../src/validators/string_validator"),
	argument_test_factory           = require("../argument_test_factory"),

	test_instance                   = require("../testers/test_instance"),
	test_validation                 = require("../testers/test_validation"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

describe("class StringValidator (config, is_muteable)", () => {
	var config_argument_test = argument_test_factory("StringValidator", "config", 0);

	test_invalid_argument_exception(config_argument_test("error_input", "not an object", function (error_input) {
		return new StringValidator(error_input);
	}));

	var instance = new StringValidator();

	test_instance(instance, [
		{ name : "StringValidator", constructor_fn : StringValidator },
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
					message : "not a string"
				},

				// {{{2 Case: object
				{
					when : "{}",
					value : {},
					message : "not a string"
				},

				// {{{2 Case: number
				{
					when : 123,
					value : 123,
					message : "not a string"
				},

				// {{{2 Case: function
				{
					when : "function () {}",
					value : function () {},
					message : "not a string"
				},

				// {{{2 Case: boolean
				{
					when : "true",
					value : true,
					message : "not a string"
				},

				// {{{2 Case: { trim = true } and (value = String("     "))
				{
					when : '"    "',
					value : "    ",
					config : { trim : true },
					message : "an empty string"
				},
				// }}}2
			]
		},

		// {{{1 Valid cases
		{
			description : "Valid cases",
			cases : [
				// {{{2 Case: string
				{
					got            : '"  untrimmed string  "',
					when           : '"  untrimmed string  "',
					value          :  "  untrimmed string  ",
					expected_value :  "  untrimmed string  "
				},

				// {{{2 Case: { define = false } and (value = undefined)
				{
					got : "undefined",
					when  : "undefined",
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

				// {{{2 Case: { trim = true } and (value = "  Hello world  ")
				{
					got : '"Hello world"',
					when  : '"  Hello world  "',
					value :  "  Hello world  ",
					config : { trim : true },
					expected_value : "Hello world"
				},
				// }}}2
			]
		}
		// }}}1
	];

	test_validation(instance, sets_of_test_cases);
});
