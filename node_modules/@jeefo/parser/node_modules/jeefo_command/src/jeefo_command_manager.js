/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_command_manager.js
* Created at  : 2019-01-03
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

var HashTable                = require("./hash_table"),
	JeefoCommand             = require("./jeefo_command"),
	object_freeze            = require("./object_freeze"),

	ArrayValidator           = require("./validators/array_validator"),
	StringValidator          = require("./validators/string_validator"),
	NumberValidator          = require("./validators/number_validator"),
	ObjectValidator          = require("./validators/object_validator"),
	FunctionValidator        = require("./validators/function_validator"),
	StringsOfArrayValidator  = require("./validators/strings_of_array_validator"),

	InvalidArgumentException = require("./exceptions/invalid_argument_exception");

var CONSTRUCTOR_NAME = "JeefoCommandManager";

var object_create             = Object.create,
	object_validator          = new ObjectValidator(),
	aliases_validator         = new StringsOfArrayValidator({ define : false, nullable : true, trim : true, empty : true }),
	options_validator         = new ArrayValidator({ define : false, nullable : true }),
	function_validator        = new FunctionValidator(),
	arguments_list_validator  = new ArrayValidator(),
	required_string_validator = new StringValidator({ trim : true }),
	required_number_validator = new NumberValidator();

function JeefoCommandManager (application_name) {
	var instance             = this,
		_aliases_map         = object_create(null),
		_aliases_hash_table  = new HashTable(),
		_commands_hash_table = new HashTable();

	// {{{1 Validating: application_name
	required_string_validator.validate(application_name, (err, result_value) => {
		if (err) {
			throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }`,
				"application_name", 0, application_name, err.message);
		}

		application_name = result_value;
		object_freeze(this, "application_name", application_name);
	});
	// }}}1

	// {{{1 .register(command_definition)
	this.register = function (command_definition) {
		var aliases = [], name, command;

		// {{{2 Validating: command_definition
		object_validator.validate(command_definition, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					"command_definition", 0, command_definition, err.message);
			}
		});

		// {{{2 Validating: command_definition.name
		required_string_validator.validate(command_definition.name, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					"command_definition.name", 0, command_definition.name, err.message);
			}
			name = result_value;

			if (_commands_hash_table.has(name)) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					"command_definition.name", 0, name, "duplicated command name");
			}
		});

		// {{{2 Validating: command_definition.aliases
		aliases_validator.validate(command_definition.aliases, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					"command_definition.aliases", 0, command_definition.aliases, err.message);
			}
		});

		// {{{2 Validating: command_definition.options
		options_validator.validate(command_definition.options, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					"command_definition.options", 0, command_definition.options, err.message);
			}
		});

		// {{{2 Validating: command_definition.execute
		function_validator.validate(command_definition.execute, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					"command_definition.execute", 0, command_definition.execute, err.message);
			}
		});
		// }}}2

		if (_commands_hash_table.has(name)) {
			throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
				"command_definition.name", 0, name, "duplicated command name");
		}

		command = new JeefoCommand(name, command_definition.description, command_definition.execute);
		_commands_hash_table.add(name, command);

		(command_definition.options || []).forEach(option => {
			command.add_option(option);
		});

		// {{{2 aliases
		_aliases_map[command.name] = aliases;
		object_freeze(command, "aliases", function () { return aliases.concat(); });

		(command_definition.aliases || []).forEach((alias_name, index) => {
			if (_aliases_hash_table.has(alias_name)) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.register`,
					`command_definition.aliases[${ index }]`, 0, alias_name, "duplicated alias name");
			}

			_aliases_hash_table.add(alias_name, command);
			_aliases_map[command.name].push(alias_name);
		});
		// }}}2

		return command;
	};

	// {{{1 .has_command(command_name)
	this.has_command = function (command_name) {
		return _commands_hash_table.has(command_name);
	};

	// {{{1 .has_alias(alias_name)
	this.has_alias = function (alias_name) {
		return _aliases_hash_table.has(alias_name);
	};

	// {{{1 .set_alias(alias_name, command)
	this.set_alias = function (alias_name, command) {
		// {{{2 Validating: alias_name
		required_string_validator.validate(alias_name, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"alias_name", 0, alias_name, err.message);
			}

			if (_aliases_hash_table.has(result_value)) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"alias_name", 0, alias_name, "duplicated alias name");
			}

			alias_name = result_value;
		});

		// {{{2 Validating: command
		object_validator.validate(command, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"command", 1, command, err.message);
			}

			if (command instanceof JeefoCommand === false ||
				command !== _commands_hash_table.get_value(command.name)
			) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"command", 1, command, "not a valid command");
			}
		});
		// }}}2

		_aliases_hash_table.add(alias_name, command);
		_aliases_map[command.name].push(alias_name);
	};

	// {{{1 .get_commands_length();
	this.get_commands_length = function () {
		return _commands_hash_table.get_length();
	};

	// {{{1 .get_command(command_name)
	this.get_command = function (command_name) {
		if (_commands_hash_table.has(command_name)) {
			return _commands_hash_table.get_value(command_name);
		}

		throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.get_command`,
			"command_name", 0, command_name, "not a valid command name");
	};

	// {{{1 .get_command_by_alias_name(alias_name)
	this.get_command_by_alias_name = function (alias_name) {
		if (_aliases_hash_table.has(alias_name)) {
			return _aliases_hash_table.get_value(alias_name);
		}

		throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.get_command_by_alias_name`,
			"alias_name", 0, alias_name, "not a valid alias name");
	};

	// {{{1 .each(iterator(command, index) => {})
	this.each = function (interator) {
		_commands_hash_table.each((value, key, index) => interator(value, index));
	};

	// {{{1 .map(iterator(command, index) => {})
	this.map = function (interator) {
		return _commands_hash_table.map((value, key, index) => interator(value, index));
	};

	// {{{1 .execute_commands(arguments_list, index)
	this.execute_commands = function (arguments_list, index) {
		var executing_commands_list = [], command, next_command_name;

		arguments_list_validator.validate(arguments_list, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.execute_commands`,
					"arguments_list", 0, arguments_list, err.message);
			}
		});

		required_number_validator.validate(index, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.execute_commands`,
					"index", 1, index, err.message);
			}
		});

		for (; index < arguments_list.length; ++index) {
			next_command_name = arguments_list[index];

			if (_commands_hash_table.has(next_command_name)) {
				command = _commands_hash_table.get_value(next_command_name);
			} else if (_aliases_hash_table.has(next_command_name)) {
				command = _aliases_hash_table.get_value(next_command_name);
			} else {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.execute_commands`,
					`arguments_list[${ index }]`, 0, next_command_name, "not a valid command name");
			}

			index = command.set_options(arguments_list, index + 1) - 1;

			if (executing_commands_list.indexOf(command) === -1) {
				executing_commands_list.push(command);
			}
		}

		executing_commands_list.forEach(command => {
			command.execute(command.get_options(), instance);
		});

		return index;
	};
	// }}}1
}

module.exports = JeefoCommandManager;
