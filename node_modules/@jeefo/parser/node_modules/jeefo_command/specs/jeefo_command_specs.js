/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_command_specs.js
* Created at  : 2019-01-04
* Updated at  : 2019-01-22
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var expect                          = require("expect"),
	JeefoCommand                    = require("../src/jeefo_command"),
	argument_test_factory           = require("./argument_test_factory"),

	IBaseOption                     = require("../src/options/i_base_option"),
	StringOption                    = require("../src/options/string_option"),
	NumberOption                    = require("../src/options/number_option"),
	BooleanOption                   = require("../src/options/boolean_option"),
	FilePathOption                  = require("../src/options/file_path_option"),
	EnumerationOption               = require("../src/options/enumeration_option"),
	DirectoryPathOption             = require("../src/options/directory_path_option"),

	test_readonly                   = require("./testers/test_readonly"),
	test_invalid_argument_exception = require("./testers/test_invalid_argument_exception");

const NAME             = "build",
	  DESCRIPTION      = 'Compile the source codes.',
	  CONSTRUCTOR_NAME = "JeefoCommand";

describe(`class ${ CONSTRUCTOR_NAME } (name, description, execute_fn)`, () => {
	var name_argument_test        = argument_test_factory(CONSTRUCTOR_NAME, "name"        , 0);
	var description_argument_test = argument_test_factory(CONSTRUCTOR_NAME, "description" , 1);
	var execute_fn_argument_test  = argument_test_factory(CONSTRUCTOR_NAME, "execute_fn"  , 2);
	var execute_fn = function () {};

	var test_cases = [
		// {{{1 arg[0] : name
		name_argument_test(undefined, "undefined", function () {
			return new JeefoCommand();
		}),

		name_argument_test(null, "null", function () {
			return new JeefoCommand(null);
		}),

		name_argument_test(3.14, "not a string", function (error_input) {
			return new JeefoCommand(error_input);
		}),

		name_argument_test("       ", "an empty string", function (error_input) {
			return new JeefoCommand(error_input);
		}),

		// {{{1 arg[1] : description
		description_argument_test(3.14, "not a string", function (error_input) {
			return new JeefoCommand(NAME, error_input);
		}),

		description_argument_test("       ", "an empty string", function (error_input) {
			return new JeefoCommand(NAME, error_input);
		}),

		// {{{1 arg[3] : execute_fn
		execute_fn_argument_test(undefined, "undefined", function () {
			return new JeefoCommand(NAME, DESCRIPTION);
		}),

		execute_fn_argument_test(null, "null", function () {
			return new JeefoCommand(NAME, DESCRIPTION, null);
		}),

		execute_fn_argument_test({}, "not a function", function (error_input) {
			return new JeefoCommand(NAME, DESCRIPTION, error_input);
		}),
		// }}}1
	];

	test_cases.forEach(test_invalid_argument_exception);

	// {{{1 .name
	describe(".name", () => {
		var command = new JeefoCommand(NAME, null, execute_fn);
		test_readonly(command, "name");

		it(`Should be got '${ NAME }'`, () => {
			expect(command.name).toBe(NAME);
		});
	});

	// {{{1 .description
	describe(".description", () => {
		var test_cases = [{}, { description : null }, { description : DESCRIPTION }];
		test_cases.forEach(test_case => {
			var description = test_case.description;
			if (typeof description === "string") {
				description = `'${ description }'`;
			}
			it(`Should be got ${ description }`, () => {
				var command = new JeefoCommand(NAME, test_case.description, execute_fn);
				expect(command.description).toBe(test_case.description);
			});
		});
	});

	// {{{1 .execute
	describe(".execute", () => {
		var test_cases = [{}, { description : null }, { description : DESCRIPTION }];
		test_cases.forEach(test_case => {
			var description = test_case.description;
			if (typeof description === "string") {
				description = `'${ description }'`;
			}
			it(`Should be got ${ description }`, () => {
				var command = new JeefoCommand(NAME, test_case.description, execute_fn);
				expect(command.description).toBe(test_case.description);
			});
		});
	});

	// {{{1 .add_option(option_definition)
	describe(".add_option(option_definition)", () => {
		var option_definition_argument_test = argument_test_factory(`${ CONSTRUCTOR_NAME }.add_option`, "option_definition", 0);
		var option_type_test                = argument_test_factory(`${ CONSTRUCTOR_NAME }.add_option`, "option_definition.type"    , 0);
		var option_name_test                = argument_test_factory(`${ CONSTRUCTOR_NAME }.add_option`, "option_definition.name"    , 0);
		var option_aliases_test             = argument_test_factory(`${ CONSTRUCTOR_NAME }.add_option`, "option_definition.aliases" , 0);
		var option_aliases_1_test           = argument_test_factory(`${ CONSTRUCTOR_NAME }.add_option`, "option_definition.aliases[1]" , 0);

		var error_test_cases = [
			// {{{2 optoin
			option_definition_argument_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option();
			}),
			option_definition_argument_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option(null);
			}),
			option_definition_argument_test("error_input", "not an object", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option(error_input);
			}),

			// {{{2 optoin.type
			option_type_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({});
			}),
			option_type_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : null });
			}),
			option_type_test(3.14, "not a string", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : error_input });
			}),
			option_type_test('     ', "an empty string", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : error_input });
			}),
			option_type_test("Int32", "not a valid option type", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : error_input });
			}),

			// {{{2 optoin.name
			option_name_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string" });
			}),
			option_name_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : null });
			}),
			option_name_test(3.14, "not a string", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : error_input });
			}),
			option_name_test("     ", "an empty string", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : error_input });
			}),
			option_name_test("option_name", "duplicated option name", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : error_input });
				command.add_option({ type : "string", name : error_input });
			}),

			// {{{2 optoin.aliases
			option_aliases_test({}, "not an array", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : "option_name", aliases : error_input });
			}),
			option_aliases_1_test('c', "duplicated alias name", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : "option_name", aliases : [error_input, error_input] });
			}),
			// }}}2
		];
		error_test_cases.forEach(test_invalid_argument_exception);

		var test_case_groups = [
			// {{{2 String Option
			{
				type : "String",
				constructor : StringOption,
				cases : [
					{
						type : "  String  ",
						name : "name",
					},
					{
						type    : "string",
						name    : "name",
						default : "application",
						aliases : ['n']
					},
				]
			},

			// {{{2 Number Option
			{
				type : "Number",
				constructor : NumberOption,
				cases : [
					{
						type : "  Number  ",
						name : "optimization-level",
					},
					{
						type    : "number",
						name    : "optimization-level",
						default : 3,
						aliases : ['l']
					},
				]
			},

			// {{{2 Boolean Option
			{
				type : "Boolean",
				constructor : BooleanOption,
				cases : [
					{
						type : "  Boolean  ",
						name : "minify",
					},
					{
						type    : "bool",
						name    : "minify",
						default : true,
						aliases : ['m']
					},
				]
			},

			// {{{2 Enumeration Option
			{
				type : "Enumeration",
				constructor : EnumerationOption,
				cases : [
					{
						type : "  Enumeration  ",
						name : "type",
						list : ['app', 'dll']
					},
					{
						type    : "enum",
						name    : "type",
						list    : ['app', 'dll'],
						default : 'dll',
						aliases : ['t']
					},
				]
			},

			// {{{2 FilePath Option
			{
				type : "FilePath",
				constructor : FilePathOption,
				cases : [
					{
						type : "  FilePath  ",
						name : "main",
					},
					{
						type    : "file",
						name    : "main",
						default : 'value',
						aliases : ['m']
					},
				]
			},

			// {{{2 DirectoryPath Option
			{
				type : "DirectoryPath",
				constructor : DirectoryPathOption,
				cases : [
					{
						type : "  DirectoryPath  ",
						name : "destinition",
					},
					{
						type    : "directory",
						name    : "destinition",
						default : 'js',
					},
					{
						type    : "dir",
						name    : "destinition",
						default : 'js',
						aliases : ['d']
					},
				]
			},
			// }}}2
		];

		test_case_groups.forEach(test_group => {
			test_group.cases.forEach(test_case => {
				var command = new JeefoCommand(NAME, null, execute_fn),
					option  = command.add_option(test_case);

				if (test_case.aliases) {
					test_case.aliases.forEach(alias_name => {
						it(`Should be got new ${ test_group.type }Option by alias name '${ alias_name }'`, () => {
							expect(command.get_option_by_alias_name(alias_name)).toBe(option);
						});
					});
					return;
				}

				it(`Should be got new ${ test_group.type }Option instance`, () => {
					expect(option !== test_case).toBe(true);
					expect(command.get_options_length()).toBe(1);
					expect(option.type).toBe(test_group.type);
					expect(option.value).toBe(test_case.default);
					expect(option instanceof test_group.constructor).toBe(true);
				});
			});
		});

		describe("Return new instance of class IBaseOption", () => {
			it("Should be return instance of IBaseOption", () => {
				var command = new JeefoCommand(NAME, null, execute_fn),
					option  = command.add_option({ name : "command", type : "string" });

				expect(option instanceof IBaseOption).toBe(true);
			});

			describe(".aliases", () => {
				var command = new JeefoCommand(NAME, null, execute_fn),
					option  = command.add_option({ name : "command", type : "string" });

				test_readonly(option, "aliases");

				it("Should not be affected when directly modified", () => {
					var command = new JeefoCommand(NAME, null, execute_fn),
						option  = command.add_option({ name : "command", type : "string" });

					expect(option.aliases.length).toBe(0);

					option.aliases.push(1,2,3);
					expect(option.aliases.length).toBe(0);
				});

				it("Should be return new array instance every time read", () => {
					var command = new JeefoCommand(NAME, null, execute_fn),
						option  = command.add_option({ name : "command", type : "string" });

					expect(option.aliases).not.toBe(option.aliases);
				});

				it(`Should be modified from class ${ CONSTRUCTOR_NAME } instance`, () => {
					var command = new JeefoCommand(NAME, null, execute_fn),
						option  = command.add_option({ name : "command", type : "string" });

					expect(option.aliases.length).toBe(0);

					command.set_alias('c', option);
					expect(option.aliases.length).toBe(1);
					expect(option.aliases[0]).toBe("-c");
				});
			});
		});
	});

	// {{{1 .get_options_length()
	describe(".get_options_length()", () => {
		var command = new JeefoCommand(NAME, null, execute_fn), i = 0, EXPECTED_LENGTH = 5;

		for (; i < EXPECTED_LENGTH; ++i) {
			it(`Should be ${ i }`, () => {
				expect(command.get_options_length()).toBe(i);
			});
			command.add_option({ type : "string", name : `name${ i }` });
		}

		it(`Should be ${ EXPECTED_LENGTH }`, () => {
			expect(command.get_options_length()).toBe(EXPECTED_LENGTH);
		});
	});

	// {{{1 .get_option(option_name), get_option_by_alias_name(alias_name)
	[{
		param    : "option_name",
		method   : "get_option",
		message  : "not a valid option name",
		fn_name  : `${ CONSTRUCTOR_NAME }.get_option`,
		argument : "option",
	},
	{
		param    : "alias_name",
		method   : "get_option_by_alias_name",
		message  : "not a valid alias name",
		fn_name  : `${ CONSTRUCTOR_NAME }.get_option_by_alias_name`,
		argument : 'c',
	}].forEach(test_case => {
		describe(`.${ test_case.method }(${ test_case.param })`, () => {
			test_invalid_argument_exception({
				thrower : function () {
					var command = new JeefoCommand(NAME, null, execute_fn);
					command[test_case.method](test_case.argument);
				},
				error_message  : test_case.message,
				function_name  : test_case.fn_name,
				argument_name  : test_case.param,
				argument_index : 0,
				argument_value : test_case.argument
			});

			it("Should be pass", () => {
				var command = new JeefoCommand(NAME, null, execute_fn),
					option  = command.add_option({ name : "option", type : "string", aliases : ['c'] });

				expect(command[test_case.method](test_case.argument)).toBe(option);
			});
		});
	});

	// {{{1 .get_options()
	describe(".get_options()", () => {
		var value   = "hello world",
			command = new JeefoCommand(NAME, null, execute_fn);

		command.add_option({ type : "string", name : "command", aliases : ['c'] });

		it(`Should be got undefined`, () => {
			expect(command.get_options().command).toBe(undefined);
		});

		it(`Should be got '${ value }'`, () => {
			command.set_options(['-c', value], 0);
			expect(command.get_options().command).toBe(value);
		});
	});

	// {{{1 .set_alias(alias_name, option)
	describe(".set_alias(alias_name, option)", () => {
		var alias_name_argument_test = argument_test_factory(`${ CONSTRUCTOR_NAME }.set_alias`, "alias_name", 0);
		var option_argument_test     = argument_test_factory(`${ CONSTRUCTOR_NAME }.set_alias`, "option", 1);

		var set_alias_error_cases = [
			// {{{2 Argument: alias_name
			alias_name_argument_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias();
			}),
			alias_name_argument_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias(null);
			}),
			alias_name_argument_test(3.14, "not a string", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias(error_input);
			}),
			alias_name_argument_test("        ", "an empty string", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias(error_input);
			}),
			alias_name_argument_test('c', "duplicated alias name", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				var option  = command.add_option({ type : "string", name : "command_name", aliases : [error_input] });

				command.set_alias(error_input, option);
			}),

			// {{{2 Argument: option
			option_argument_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias("key");
			}),
			option_argument_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias("key", null);
			}),
			option_argument_test("error_input", "not an object", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_alias("key", error_input);
			}),
			option_argument_test(new StringOption("option"), "not a valid option", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.add_option({ type : "string", name : "option" });

				command.set_alias('o', error_input);
			}),
			// }}}2
		];

		set_alias_error_cases.forEach(test_invalid_argument_exception);

		it("Should be pass", () => {
			var command           = new JeefoCommand(NAME, null, execute_fn),
				option            = command.add_option({ type : "string", name : "command_name" }),
				has_error_ocurred = false;

			try {
				command.set_alias('c', option);
			} catch (e) {
				has_error_ocurred = true;
			} finally {
				expect(has_error_ocurred).toBe(false);
				expect(command.get_option_by_alias_name('c')).toBe(option);
			}
		});
	});

	// {{{1 .set_options(argument_list, index)
	describe(".set_options(arguments_list, index)", () => {
		var args_test   = argument_test_factory(`${ CONSTRUCTOR_NAME }.set_options`, "arguments_list" , 0);
		var index_test  = argument_test_factory(`${ CONSTRUCTOR_NAME }.set_options`, "index"         , 1);

		var test_cases = [
			// {{{2 args
			args_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_options();
			}),
			args_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_options(null);
			}),
			args_test({}, "not an array", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_options(error_input);
			}),

			// {{{2 index
			index_test(undefined, "undefined", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_options([]);
			}),
			index_test(null, "null", function () {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_options([], null);
			}),
			index_test('0', "not a number", function (error_input) {
				var command = new JeefoCommand(NAME, null, execute_fn);
				command.set_options([], error_input);
			}),
			// }}}2
		];

		test_cases.forEach(test_invalid_argument_exception);

		it("Should be pass", () => {
			var command           = new JeefoCommand(NAME, null, execute_fn),
				option            = command.add_option({ type : "string", name : "command", aliases : ['c'] }),
				new_value         = "value",
				has_error_ocurred = false;

			try {
				expect(command.set_options(['not found'], 0)).toBe(0);
				expect(command.set_options(['--command', 'help'], 0)).toBe(2);
				expect(command.set_options(['--command', 'help', '-c', new_value], 0)).toBe(4);
			} catch (e) {
				has_error_ocurred = true;
			} finally {
				expect(has_error_ocurred).toBe(false);
				expect(option.value).toBe(new_value);
			}
		});
	});

	// {{{1 .each(iterator(option, index) => {})
	describe(".each(iterator)", () => {
		var command = new JeefoCommand(NAME, null, execute_fn),
			i = 0, EXPECTED_LENGTH = 5, counter = 0;

		for (; i < EXPECTED_LENGTH; ++i) {
			command.add_option({ name : `option${ i }`, type : "string" });
		}

		command.each((option, index) => {
			(function (expected_index, received_index, option) {
				it(`Should be index => ${ expected_index }`, () => {
					expect(expected_index).toBe(received_index);
				});
				it(`Should be option.name => '--option${ expected_index }'`, () => {
					expect(option.name).toBe(`--option${ expected_index }`);
				});
			}(counter, index, option));

			counter += 1;
		});

		it(`Should be called ${ EXPECTED_LENGTH } times`, () => {
			expect(counter).toBe(EXPECTED_LENGTH);
		});
	});

	// {{{1 .map(iterator(option, index) => {})
	describe(".map(iterator)", () => {
		var command = new JeefoCommand(NAME, null, execute_fn);

		command.add_option({ name : "option1", type : "string" });
		command.add_option({ name : "option2", type : "string" });

		var option_names   = command.map(function (option) { return option.name; });
		var option_indices = command.map((option, index) => index);

		it("Should be [0, 1]", () => {
			expect(option_indices[0]).toBe(0);
			expect(option_indices[1]).toBe(1);
			expect(option_indices.length).toBe(2);
		});

		it("Should be ['--option1', '--option2']", () => {
			expect(option_names[0]).toBe("--option1");
			expect(option_names[1]).toBe("--option2");
			expect(option_names.length).toBe(2);
		});
	});

	// }}}1
});
