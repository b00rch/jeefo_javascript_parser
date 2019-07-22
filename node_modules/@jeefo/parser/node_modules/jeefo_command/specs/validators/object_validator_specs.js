/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_validator_specs.js
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
	ObjectValidator                 = require("../../src/validators/object_validator"),
	argument_test_factory           = require("../argument_test_factory"),

	test_instance                   = require("../testers/test_instance"),
	test_validation                 = require("../testers/test_validation"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

describe("class ObjectValidator (config, is_muteable)", () => {
	var config_argument_test = argument_test_factory("ObjectValidator", "config", 0);

	test_invalid_argument_exception(config_argument_test("error_input", "not an object", function (error_input) {
		return new ObjectValidator(error_input);
	}));

	var instance = new ObjectValidator();

	test_instance(instance, [
		{ name : "ObjectValidator", constructor_fn : ObjectValidator },
		{ name : "IBaseValidator", constructor_fn : IBaseValidator },
	]);

	const object = {}, array = [];
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

				// {{{2 Case: number
				{
					when : 123,
					value : 123,
					message : "not an object"
				},

				// {{{2 Case: string
				{
					when : '"string"',
					value : "string",
					message : "not an object"
				},

				// {{{2 Case: function
				{
					when : "function () {}",
					value : function () {},
					message : "not an object"
				},

				// {{{2 Case: boolean
				{
					when : "false",
					value : false,
					message : "not an object"
				},

				// {{{2 Case: array
				{
					when : "[]",
					value : [],
					config : { strict : true },
					message : "an array"
				},
				// }}}2
			]
		},

		// {{{1 Valid cases
		{
			description : "Valid cases",
			cases : [
				// {{{2 Case: object
				{
					got            : "an object",
					when           : "{}",
					value          : object,
					expected_value : object
				},

				// {{{2 Case: { strict = false } and (value = [])
				{
					got            : "an array",
					when           : "[]",
					value          : array,
					config         : { strict : false },
					expected_value : array
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
				// }}}2
			]
		}
		// }}}1
	];

	test_validation(instance, sets_of_test_cases);
});
