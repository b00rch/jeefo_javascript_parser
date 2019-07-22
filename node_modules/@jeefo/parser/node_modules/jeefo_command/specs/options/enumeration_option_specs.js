/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : enumeration_option_specs.js
* Created at  : 2019-01-01
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

var IBaseOption                     = require("../../src/options/i_base_option"),
	EnumerationOption               = require("../../src/options/enumeration_option"),
	argument_test_factory           = require("../argument_test_factory"),

	test_instance                   = require("../testers/test_instance"),
	test_initialize                 = require("../testers/test_initialize"),
	test_default_value              = require("../testers/test_default_value"),
	test_type_and_name              = require("../testers/test_type_and_name"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

const NAME             = "type",
	  TYPE             = "Enumeration",
	  ALIASES          = ['t'],
	  DEFAULT_VALUE    = "uninitialized",

	  PARAMS = ["name", "enumeration_list", "default_value"],

	  ENUMERATION_LIST = ["app", "dll"],
	  ARGUMENTS        = [`--${ NAME }`, ENUMERATION_LIST[0], `-${ ALIASES[0] }`, ENUMERATION_LIST[1]];

ENUMERATION_LIST.unshift(DEFAULT_VALUE);

describe(`class ${ TYPE }Option (${ PARAMS.join(", ") })`, () => {
	var name_argument_test             = argument_test_factory(`${ TYPE }Option`, PARAMS[0], 0);
	var enumeration_list_argument_test = argument_test_factory(`${ TYPE }Option`, PARAMS[1], 1);
	var default_value_argument_test    = argument_test_factory(`${ TYPE }Option`, PARAMS[2], 2);
	var argument_list_argument_test    = argument_test_factory(`${ TYPE }Option.initialize`, "arguments_list", 0);
	var argument_list_0_test           = argument_test_factory(`${ TYPE }Option.initialize`, "arguments_list[0]", 0);
	var index_argument_test            = argument_test_factory(`${ TYPE }Option.initialize`, "index", 1);

	var constructor_arguments_test_cases = [
		// {{{1 arg[0] : name
		name_argument_test(undefined, "undefined", function () {
			return new EnumerationOption();
		}),

		name_argument_test(null, "null", function () {
			return new EnumerationOption(null);
		}),

		name_argument_test(3.14, "not a string", function (error_input) {
			return new EnumerationOption(error_input);
		}),

		name_argument_test("       ", "an empty string", function (error_input) {
			return new EnumerationOption(error_input);
		}),

		// {{{1 arg[1] : enumeration_list
		enumeration_list_argument_test(undefined, "undefined", function () {
			return new EnumerationOption(NAME);
		}),
		
		enumeration_list_argument_test(null, "null", function () {
			return new EnumerationOption(NAME, null);
		}),

		enumeration_list_argument_test("error_input", "not an array", function (error_input) {
			return new EnumerationOption(NAME, error_input);
		}),

		enumeration_list_argument_test([], "an empty array", function (error_input) {
			return new EnumerationOption(NAME, error_input);
		}),

		enumeration_list_argument_test(["string", null], "has non string value", function (error_input) {
			return new EnumerationOption(NAME, error_input);
		}),

		enumeration_list_argument_test(["string", "   "], "has an empty string value", function (error_input) {
			return new EnumerationOption(NAME, error_input);
		}),

		enumeration_list_argument_test('  a ', "has duplicated value", function (error_input) {
			return new EnumerationOption(NAME, [error_input, 'c', 'b', 'a']);
		}),

		// {{{1 arg[2] : default_value
		default_value_argument_test(3.14, "not a string", function (error_input) {
			return new EnumerationOption(NAME, ENUMERATION_LIST, error_input);
		}),

		default_value_argument_test("   ", "an empty string", function (error_input) {
			return new EnumerationOption(NAME, ENUMERATION_LIST, error_input);
		}),

		default_value_argument_test("error_input", "not a valid enumeration value", function (error_input) {
			return new EnumerationOption(NAME, ENUMERATION_LIST, error_input);
		}),
		// }}}1
	];

	constructor_arguments_test_cases.forEach(test_invalid_argument_exception);

	var option = new EnumerationOption(NAME, ENUMERATION_LIST, DEFAULT_VALUE, ALIASES);

	test_instance(option, [
		{ name : "EnumerationOption", constructor_fn : EnumerationOption },
		{ name : "IBaseOption", constructor_fn : IBaseOption },
	]);

	test_default_value([
		// {{{1 .value: undefined
		{
			create_instance : function () {
				return new EnumerationOption(NAME, ENUMERATION_LIST);
			},
		},

		// {{{1 .value: uninitialized
		{
			create_instance : function () {
				return new EnumerationOption(NAME, ENUMERATION_LIST, DEFAULT_VALUE);
			},
			got   : `'${ DEFAULT_VALUE }'`,
			value : DEFAULT_VALUE
		},
		// }}}1
	]);

	test_type_and_name(option, TYPE, NAME);
	test_initialize(option, {
		// {{{1 Invalid cases
		invalid_cases : [
			// {{{2 args
			argument_list_argument_test(undefined, "undefined", function () {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize();
			}),
			argument_list_argument_test(null, "null", function () {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize(null);
			}),
			argument_list_argument_test("error_input", "not an array", function (error_input) {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize(error_input);
			}),

			// {{{2 invalid value
			argument_list_0_test("error_input", "not a valid enumeration value", function (error_input) {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize([error_input], 0);
			}),

			// {{{2 index
			index_argument_test(undefined, "undefined", function () {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize([]);
			}),
			index_argument_test(null, "null", function () {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize([], null);
			}),
			index_argument_test('0', "not a number", function (error_input) {
				var option = new EnumerationOption(NAME, ENUMERATION_LIST);
				option.initialize([], error_input);
			}),
			// }}}2
		],

		// {{{1 Valid cases
		valid_cases : [
			// {{{2 index: 0
			{
				args           : ARGUMENTS,
				index          : 0,
				value          : `'${ ENUMERATION_LIST[1] }'`,
				expected_value : ENUMERATION_LIST[1],
				expected_index : 1,
			},

			// {{{2 index: 2
			{
				args           : ARGUMENTS,
				index          : 2,
				value          : `'${ ENUMERATION_LIST[2] }'`,
				expected_value : ENUMERATION_LIST[2],
				expected_index : 3,
			}
			// }}}2
		]
		// }}}1
	});
});
