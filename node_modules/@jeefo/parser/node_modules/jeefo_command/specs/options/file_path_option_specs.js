/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : file_path_option_specs.js
* Created at  : 2019-01-13
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
	FilePathOption                  = require("../../src/options/file_path_option"),
	argument_test_factory           = require("../argument_test_factory"),

	test_instance                   = require("../testers/test_instance"),
	test_initialize                 = require("../testers/test_initialize"),
	test_default_value              = require("../testers/test_default_value"),
	test_type_and_name              = require("../testers/test_type_and_name"),
	test_invalid_argument_exception = require("../testers/test_invalid_argument_exception");

const NAME          = "main",
	  TYPE          = "FilePath",
	  ALIASES       = ['m'],
	  DEFAULT_VALUE = "index.js",

	  PARAMS = ["name", "default_value"],

	  ARGUMENTS = [`--${ NAME }`, "main.js", `-${ ALIASES[0] }`, "source.js"];

describe(`class ${ TYPE }Option (${ PARAMS.join(", ") })`, () => {
	var name_argument_test          = argument_test_factory(`${ TYPE }Option`, PARAMS[0], 0);
	var default_value_argument_test = argument_test_factory(`${ TYPE }Option`, PARAMS[1], 1);
	var argument_list_argument_test = argument_test_factory(`${ TYPE }Option.initialize`, "arguments_list", 0);
	var argument_list_0_test        = argument_test_factory(`${ TYPE }Option.initialize`, "arguments_list[0]", 0);
	var index_argument_test         = argument_test_factory(`${ TYPE }Option.initialize`, "index", 1);

	var constructor_arguments_test_cases = [
		// {{{1 arg[0] : name
		name_argument_test(undefined, "undefined", function () {
			return new FilePathOption();
		}),

		name_argument_test(null, "null", function () {
			return new FilePathOption(null);
		}),

		name_argument_test(3.14, "not a string", function (error_input) {
			return new FilePathOption(error_input);
		}),

		name_argument_test("       ", "an empty string", function (error_input) {
			return new FilePathOption(error_input);
		}),

		// {{{1 arg[1] : default_value
		default_value_argument_test(3.14, "not a string", function (error_input) {
			return new FilePathOption(NAME, error_input);
		}),

		default_value_argument_test("   ", "an empty string", function (error_input) {
			return new FilePathOption(NAME, error_input);
		}),
		// }}}1
	];

	constructor_arguments_test_cases.forEach(test_invalid_argument_exception);

	var option = new FilePathOption(NAME, DEFAULT_VALUE, ALIASES);

	test_instance(option, [
		{ name : "FilePathOption", constructor_fn : FilePathOption },
		{ name : "IBaseOption", constructor_fn : IBaseOption },
	]);

	test_default_value([
		// {{{1 .value: undefined
		{
			create_instance : function () {
				return new FilePathOption(NAME);
			},
		},

		// {{{1 .value: 'index.js'
		{
			create_instance : function () {
				return new FilePathOption(NAME, DEFAULT_VALUE);
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
				var option = new FilePathOption(NAME);
				option.initialize();
			}),
			argument_list_argument_test(null, "null", function () {
				var option = new FilePathOption(NAME);
				option.initialize(null);
			}),
			argument_list_argument_test("error_input", "not an array", function (error_input) {
				var option = new FilePathOption(NAME);
				option.initialize(error_input);
			}),

			// {{{2 invalid value
			argument_list_0_test(null, "not a string", function () {
				var option = new FilePathOption(NAME);
				option.initialize([null], 0);
			}),

			// {{{2 index
			index_argument_test(undefined, "undefined", function () {
				var option = new FilePathOption(NAME);
				option.initialize([]);
			}),
			index_argument_test(null, "null", function () {
				var option = new FilePathOption(NAME);
				option.initialize([], null);
			}),
			index_argument_test('0', "not a number", function (error_input) {
				var option = new FilePathOption(NAME);
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
				value          : ARGUMENTS[1],
				expected_value : ARGUMENTS[1],
				expected_index : 1,
			},

			// {{{2 index: 2
			{
				args           : ARGUMENTS,
				index          : 2,
				value          : ARGUMENTS[3],
				expected_value : ARGUMENTS[3],
				expected_index : 3,
			}
			// }}}2
		]
		// }}}1
	});
});
