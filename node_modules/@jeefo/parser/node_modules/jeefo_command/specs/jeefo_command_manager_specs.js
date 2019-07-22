/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_command_manager_specs.js
* Created at  : 2019-01-08
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
	JeefoCommandManager             = require("../src/jeefo_command_manager"),
	argument_test_factory           = require("./argument_test_factory"),

	test_readonly                   = require("./testers/test_readonly"),
	test_invalid_argument_exception = require("./testers/test_invalid_argument_exception");

const APP_NAME                 = "jeefo",
	  CONSTRUCTOR_NAME         = "JeefoCommandManager",
	  VALID_COMMAND_DEFINITION = {
		  name        : "help",
		  aliases     : [],
		  description : "Shows help messages for this CLI",
		  options     : [],
		  execute     : function (options, args) {
		      console.log(options, args);
		  }
	  },
	  execute_fn = function () {};

describe(`class ${ CONSTRUCTOR_NAME } (application_name)`, () => {
	var app_name_argument_test = argument_test_factory(CONSTRUCTOR_NAME, "application_name", 0);

	var test_cases = [
		// {{{1 arg[0] : application_name
		app_name_argument_test(undefined, "undefined", function () {
			return new JeefoCommandManager();
		}),

		app_name_argument_test(null, "null", function () {
			return new JeefoCommandManager(null);
		}),

		app_name_argument_test(3.14, "not a string", function (error_input) {
			return new JeefoCommandManager(error_input);
		}),

		app_name_argument_test("       ", "an empty string", function (error_input) {
			return new JeefoCommandManager(error_input);
		}),
		// }}}1
	];

	test_cases.forEach(test_invalid_argument_exception);

	// {{{1 .application_name
	describe(".application_name", () => {
		var command_manager = new JeefoCommandManager(APP_NAME);

		test_readonly(command_manager, "application_name");

		it(`Should be got '${ APP_NAME }'`, () => {
			expect(command_manager.application_name).toBe(APP_NAME);
		});
	});

	// {{{1 .register(command_definition)
	describe(".register(command_definition)", () => {
		var command_test           = argument_test_factory(`${ CONSTRUCTOR_NAME }.register` , "command_definition"            , 0);
		var command_name_test      = argument_test_factory(`${ CONSTRUCTOR_NAME }.register` , "command_definition.name"       , 0);
		var command_aliases_test   = argument_test_factory(`${ CONSTRUCTOR_NAME }.register` , "command_definition.aliases"    , 0);
		var command_aliases_1_test = argument_test_factory(`${ CONSTRUCTOR_NAME }.register` , "command_definition.aliases[1]" , 0);
		var command_options_test   = argument_test_factory(`${ CONSTRUCTOR_NAME }.register` , "command_definition.options"    , 0);
		var command_execute_test   = argument_test_factory(`${ CONSTRUCTOR_NAME }.register` , "command_definition.execute"    , 0);

		var error_test_cases = [
			// {{{2 command_definition
			command_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register();
			}),
			command_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register(null);
			}),
			command_test("error_input", "not an object", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register(error_input);
			}),

			// {{{2 command_definition.name
			command_name_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({});
			}),
			command_name_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : null });
			}),
			command_name_test(3.14, "not a string", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : error_input });
			}),
			command_name_test("      ", "an empty string", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : error_input });
			}),
			command_name_test(VALID_COMMAND_DEFINITION.name, "duplicated command name", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register(VALID_COMMAND_DEFINITION);
				command_manager.register(VALID_COMMAND_DEFINITION);
			}),

			// {{{2 command_definition.aliases
			command_aliases_test("error_input", "not an array", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : "command", aliases : error_input });
			}),
			command_aliases_1_test('c', "duplicated alias name", error_inpit => {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : "command", aliases : [error_inpit, error_inpit], execute : execute_fn });
			}),

			// {{{2 command_definition.options
			command_options_test("error_input", "not an array", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : "command", options : error_input });
			}),

			// {{{2 command_definition.options
			command_execute_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : "command" });
			}),
			command_execute_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : "command", execute : null });
			}),
			command_execute_test("error_input", "not a function", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.register({ name : "command", execute : error_input });
			}),
			// }}}2
		];
		error_test_cases.forEach(test_invalid_argument_exception);

		describe("Return new instance of class JeefoCommand", () => {
			it("Should be return instance of JeefoCommand", () => {
				var command_manager = new JeefoCommandManager(APP_NAME),
					command         = command_manager.register({ name : "command", execute : execute_fn });

				expect(command instanceof JeefoCommand).toBe(true);
			});

			describe(".aliases", () => {
				var command_manager = new JeefoCommandManager(APP_NAME),
					command         = command_manager.register({ name : "command", execute : execute_fn });

				test_readonly(command, "aliases");

				it("Should not be affected when directly modified", () => {
					var command_manager = new JeefoCommandManager(APP_NAME),
						command         = command_manager.register({ name : "command", execute : execute_fn });

					expect(command.aliases.length).toBe(0);

					command.aliases.push(1,2,3);
					expect(command.aliases.length).toBe(0);
				});

				it("Should be return new array instance every time read", () => {
					var command_manager = new JeefoCommandManager(APP_NAME),
						command         = command_manager.register({ name : "command", execute : execute_fn });

					expect(command.aliases).not.toBe(command.aliases);
				});

				it("Should be modified from class CommandManager instance", () => {
					var command_manager = new JeefoCommandManager(APP_NAME),
						command         = command_manager.register({ name : "help", execute : execute_fn });

					expect(command.aliases.length).toBe(0);

					command_manager.set_alias('h', command);
					expect(command.aliases.length).toBe(1);
					expect(command.aliases[0]).toBe('h');
				});
			});
		});
	});

	// {{{1 .set_alias(alias_name, command)
	describe(".set_alias(alias_name, command)", () => {
		var alias_name_argument_test = argument_test_factory(`${ CONSTRUCTOR_NAME }.set_alias`, "alias_name", 0);
		var command_argument_test    = argument_test_factory(`${ CONSTRUCTOR_NAME }.set_alias`, "command", 1);

		var set_alias_error_cases = [
			// {{{2 Argument: alias_name
			alias_name_argument_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias();
			}),
			alias_name_argument_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias(null);
			}),
			alias_name_argument_test(3.14, "not a string", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias(error_input);
			}),
			alias_name_argument_test("        ", "an empty string", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias(error_input);
			}),
			alias_name_argument_test('c', "duplicated alias name", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME),
					command         = command_manager.register({
						name    : "command",
						aliases : [error_input],
						execute : execute_fn
					});

				command_manager.set_alias(error_input, command);
			}),

			// {{{2 Argument: command
			command_argument_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias("key");
			}),
			command_argument_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias("key", null);
			}),
			command_argument_test("error_input", "not an object", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.set_alias("key", error_input);
			}),
			command_argument_test(new JeefoCommand("command", null, execute_fn), "not a valid command", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);

				command_manager.register({ name : "command", execute : execute_fn });
				command_manager.set_alias('c', error_input);
			}),
			// }}}2
		];

		set_alias_error_cases.forEach(test_invalid_argument_exception);

		it("Should be pass", () => {
			var command_manager   = new JeefoCommandManager(APP_NAME),
				command           = command_manager.register(VALID_COMMAND_DEFINITION),
				has_error_ocurred = false;

			try {
				command_manager.set_alias('c', command);
			} catch (e) {
				has_error_ocurred = true;
			} finally {
				expect(has_error_ocurred).toBe(false);
				expect(command_manager.get_command_by_alias_name('c')).toBe(command);
			}
		});
	});

	// {{{1 .get_commands_length()
	describe(".get_commands_length()", () => {
		var command_manager = new JeefoCommandManager(APP_NAME),
			i = 0, EXPECTED_LENGTH = 5;

		for (; i < EXPECTED_LENGTH; ++i) {
			it(`Should be ${ i }`, () => {
				expect(command_manager.get_commands_length()).toBe(i);
			});
			command_manager.register({ name : `command${ i }`, execute : execute_fn });
		}

		it(`Should be ${ EXPECTED_LENGTH }`, () => {
			expect(command_manager.get_commands_length()).toBe(EXPECTED_LENGTH);
		});
	});

	// {{{1 .get_command(option_name), get_command_by_alias_name(alias_name)
	[{
		param    : "command_name",
		method   : "get_command",
		message  : "not a valid command name",
		fn_name  : `${ CONSTRUCTOR_NAME }.get_command`,
		argument : "command",
	},
	{
		param    : "alias_name",
		method   : "get_command_by_alias_name",
		message  : "not a valid alias name",
		fn_name  : `${ CONSTRUCTOR_NAME }.get_command_by_alias_name`,
		argument : 'c',
	}].forEach(test_case => {
		describe(`.${ test_case.method }(${ test_case.param })`, () => {
			test_invalid_argument_exception({
				thrower : function () {
					var command_manager = new JeefoCommandManager(APP_NAME);
					command_manager[test_case.method](test_case.argument);
				},
				error_message  : test_case.message,
				function_name  : test_case.fn_name,
				argument_name  : test_case.param,
				argument_index : 0,
				argument_value : test_case.argument,
			});

			it("Should be pass", () => {
				var command_manager = new JeefoCommandManager(APP_NAME),
					option  = command_manager.register({
						name    : "command",
						aliases : ['c'],
						execute : execute_fn
					});

				expect(command_manager[test_case.method](test_case.argument)).toBe(option);
			});
		});
	});

	// {{{1 .each(iterator(command, index) => {})
	describe(".each(iterator(command, index) => {})", () => {
		var command_manager = new JeefoCommandManager(APP_NAME),
			i = 0, EXPECTED_LENGTH = 5, counter = 0;

		for (; i < EXPECTED_LENGTH; ++i) {
			command_manager.register({ name : `command${ i }`, execute : execute_fn });
		}

		command_manager.each((command, index) => {
			(function (expected_index, received_index, command) {
				it(`Should be index => ${ expected_index }`, () => {
					expect(expected_index).toBe(received_index);
				});
				it(`Should be command.name => 'command${ expected_index }'`, () => {
					expect(command.name).toBe(`command${ expected_index }`);
				});
			}(counter, index, command));

			counter += 1;
		});

		it(`Should be called ${ EXPECTED_LENGTH } times`, () => {
			expect(counter).toBe(EXPECTED_LENGTH);
		});
	});

	// {{{1 .map(iterator(command, index) => {})
	describe(".map(iterator(command, index) => {})", () => {
		var command_manager = new JeefoCommandManager(APP_NAME);

		command_manager.register({ name : "command1", execute : execute_fn });
		command_manager.register({ name : "command2", execute : execute_fn });

		var command_names   = command_manager.map(command => { return command.name; });
		var command_indices = command_manager.map((command, index) => index);

		it("Should be [0, 1]", () => {
			expect(command_indices[0]).toBe(0);
			expect(command_indices[1]).toBe(1);
			expect(command_indices.length).toBe(2);
		});

		it("Should be ['command1', 'command2']", () => {
			expect(command_names[0]).toBe("command1");
			expect(command_names[1]).toBe("command2");
			expect(command_names.length).toBe(2);
		});
	});

	// {{{1 .execute_commands(arguments_list, index)
	describe(".execute_commands(arguments_list, index)", () => {
		var arguments_list_test = argument_test_factory(`${ CONSTRUCTOR_NAME }.execute_commands`, "arguments_list", 0),
			index_test          = argument_test_factory(`${ CONSTRUCTOR_NAME }.execute_commands`, "index"         , 1);

		var error_test_cases = [
			// {{{2 Validating argument: arguments_list
			arguments_list_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.execute_commands();
			}),
			arguments_list_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.execute_commands(null);
			}),
			arguments_list_test("error_input", "not an array", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.execute_commands(error_input);
			}),

			// {{{2 Validating argument: index
			index_test(undefined, "undefined", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.execute_commands([]);
			}),
			index_test(null, "null", function () {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.execute_commands([], null);
			}),
			index_test("error_input", "not a number", function (error_input) {
				var command_manager = new JeefoCommandManager(APP_NAME);
				command_manager.execute_commands([], error_input);
			}),
			// {{{2 Validating arguments[index]: (Special cases)
			{
				thrower : function () {
					var command_manager = new JeefoCommandManager(APP_NAME);
					command_manager.register({ name : "help", execute : execute_fn });
					command_manager.execute_commands(["help", "error_command"], 0);
				},
				error_message  : "not a valid command name",
				function_name  : `${ CONSTRUCTOR_NAME }.execute_commands`,
				argument_name  : "arguments_list[1]",
				argument_index : 0,
				argument_value : "error_command",
			},
			{
				thrower : function () {
					var command_manager = new JeefoCommandManager(APP_NAME);
					command_manager.register({
						name : "help",
						execute : execute_fn,
						options : [
							{
								type : "string",
								name : "command",
							},
						]
					});

					command_manager.execute_commands(["help", "--command", "build", "error_command"], 0);
				},
				error_message  : "not a valid command name",
				function_name  : `${ CONSTRUCTOR_NAME }.execute_commands`,
				argument_name  : "arguments_list[3]",
				argument_index : 0,
				argument_value : "error_command",
			},
			{
				thrower : function () {
					var command_manager = new JeefoCommandManager(APP_NAME);
					command_manager.register({
						name    : "help",
						execute : execute_fn,
						options : [
							{ type : "string", name : "command", aliases : ['c'] },
						]
					});

					var args = [
						"help",
						"--command" , "build"    ,
						"-c"        , "generato" ,
						"error_command"
					];
					command_manager.execute_commands(args, 0);
				},
				error_message  : "not a valid command name",
				function_name  : `${ CONSTRUCTOR_NAME }.execute_commands`,
				argument_name  : "arguments_list[5]",
				argument_index : 0,
				argument_value : "error_command",
			},
			// }}}2
		];
		error_test_cases.forEach(test_invalid_argument_exception);

		it("Should be pass", () => {
			var command_manager        = new JeefoCommandManager(APP_NAME),
				return_index           = -1,
				has_error_ocurred      = false,
				help_command_executed  = false,
				build_command_executed = false;

			var args = [
				'help'      ,
				'--command' , 'build'    ,
				'-c'        , 'generate' ,
				'b'         ,
				'-m'        , 'index.js' ,
			];

			command_manager.register({
				name    : "help",
				execute : function (option) {
					if (option.command === "generate") {
						help_command_executed = true;
					}
				},
				options : [
					{ type : "string", name : "command", aliases : ['c'] },
				]
			});
			command_manager.register({
				name    : "build",
				aliases : ['b'],
				execute : function (option) {
					if (option.main === "index.js") {
						build_command_executed = true;
					}
				},
				options : [
					{ type : "string", name : "main", aliases : ['m'] },
				]
			});

			try {
				return_index = command_manager.execute_commands(args, 0);
			} catch (e) {
				has_error_ocurred = true;
			} finally {
				expect(return_index).toBe(args.length);
				expect(has_error_ocurred).toBe(false);
				expect(help_command_executed).toBe(true);
				expect(build_command_executed).toBe(true);
			}
		});
	});
	// }}}1
});
