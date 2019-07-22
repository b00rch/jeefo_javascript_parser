/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : jeefo_command.js
* Created at  : 2017-09-01
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

var style                      = require("./misc/style"),
	HashTable                  = require("./hash_table"),
	object_freeze              = require("./object_freeze"),

	IBaseOption                = require("./options/i_base_option"),
	StringOption               = require("./options/string_option"),
	NumberOption               = require("./options/number_option"),
	BooleanOption              = require("./options/boolean_option"),
	FilePathOption             = require("./options/file_path_option"),
	EnumerationOption          = require("./options/enumeration_option"),
	DirectoryPathOption        = require("./options/directory_path_option"),

	ArrayValidator             = require("./validators/array_validator"),
	StringValidator            = require("./validators/string_validator"),
	NumberValidator            = require("./validators/number_validator"),
	ObjectValidator            = require("./validators/object_validator"),
	FunctionValidator          = require("./validators/function_validator"),
	StringsOfArrayValidator    = require("./validators/strings_of_array_validator"),

	InvalidArgumentException   = require("./exceptions/invalid_argument_exception"),
	argument_validator_factory = require("./validators/argument_validator_factory");

var CONSTRUCTOR_NAME = "JeefoCommand";

var object_create             = Object.create,
	description_validator     = new StringValidator({ trim : true, define : false, nullable : true }),
	required_string_validator = new StringValidator({ trim : true }),
	required_number_validator = new NumberValidator(),
	array_validator           = new ArrayValidator(),
	object_validator          = new ObjectValidator(),
	aliases_validator         = new StringsOfArrayValidator({ define : false, nullable : true, trim : true });

var name_argument_validator        = argument_validator_factory(CONSTRUCTOR_NAME, "name"       , 0, required_string_validator);
var description_argument_validator = argument_validator_factory(CONSTRUCTOR_NAME, "description", 1, description_validator);
var execute_fn_argument_validator  = argument_validator_factory(CONSTRUCTOR_NAME, "execute_fn" , 2, new FunctionValidator());

function JeefoCommand (name, description, execute_fn) {
	object_freeze(this, "name", name_argument_validator(name));
	this.description = description_argument_validator(description);
	this.execute     = execute_fn_argument_validator(execute_fn);

	var _aliases_map        = object_create(null),
		_options_hash_table = new HashTable(),
		_aliases_hash_table = new HashTable();
	
	// Private methods
	// {{{1 .add_option(option_definition);
	this.add_option = function (option_definition) {
		var type, name, option, aliases;

		// {{{2 Validating: option
		object_validator.validate(option_definition, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
					"option_definition", 0, option_definition, err.message);
			}
		});

		// {{{2 Validating: option.type
		required_string_validator.validate(option_definition.type, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
					"option_definition.type", 0, option_definition.type, err.message);
			}
			type = result_value.toLowerCase();

			switch (type) {
				case "string" :
				case "number" :
				case "bool" :
				case "boolean" :
				case "enum" :
				case "enumeration" :
				case "file" :
				case "filepath" :
				case "dir" :
				case "directory" :
				case "directorypath" :
					break;
				default:
					throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
						"option_definition.type", 0, option_definition.type, "not a valid option type");
			}
		});

		// {{{2 Validating: option.name
		required_string_validator.validate(option_definition.name, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
					"option_definition.name", 0, option_definition.name, err.message);
			}
			name = result_value;

			if (_options_hash_table.has(`--${ name }`)) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
					"option_definition.name", 0, name, "duplicated option name");
			}
		});

		// {{{2 Validating: option.aliases
		aliases_validator.validate(option_definition.aliases, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
					"option_definition.aliases", 0, option_definition.aliases, err.message);
			}
		});
		// }}}2

		switch (type) {
			case "string" :
				option = new StringOption(name, option_definition.default);
				break;
			case "number" :
				option = new NumberOption(name, option_definition.default);
				break;
			case "bool" :
			case "boolean" :
				option = new BooleanOption(name, option_definition.default);
				break;
			case "enum" :
			case "enumeration" :
				option = new EnumerationOption(name, option_definition.list, option_definition.default);
				break;
			case "file" :
			case "filepath" :
				option = new FilePathOption(name, option_definition.default);
				break;
			case "dir" :
			case "directory" :
			case "directorypath" :
				option = new DirectoryPathOption(name, option_definition.default);
				break;
		}
		_options_hash_table.add(option.name, option);

		// {{{2 aliases
		aliases = _aliases_map[option.name] = [];
		object_freeze(option, "aliases", function () { return aliases.concat(); });

		(option_definition.aliases || []).forEach((alias_name, index) => {
			var prefixed_alias_name = `-${ alias_name }`;

			if (_aliases_hash_table.has(prefixed_alias_name)) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add_option`,
					`option_definition.aliases[${ index }]`, 0, alias_name, "duplicated alias name");
			}

			aliases.push(prefixed_alias_name);
			_aliases_hash_table.add(prefixed_alias_name, option);
		});
		// }}}2

		return option;
	};

	// {{{1 .get_options();
	this.get_options = function () {
		var options = object_create(null);
		_options_hash_table.each(option => {
			options[option.name.substring(2)] = option.value;
		});
		return options;
	};

	// {{{1 .set_alias(alias, option);
	this.set_alias = function (alias_name, option) {
		// {{{2 alias_name
		required_string_validator.validate(alias_name, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"alias_name", 0, alias_name, err.message);
			}

			result_value = `-${ result_value }`;
			if (_aliases_hash_table.has(result_value)) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"alias_name", 0, alias_name, "duplicated alias name");
			}

			alias_name = result_value;
		});

		// {{{2 option
		object_validator.validate(option, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"option", 1, option, err.message);
			}

			if (option instanceof IBaseOption === false ||
				option !== _options_hash_table.get_value(option.name)
			) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_alias`,
					"option", 1, option, "not a valid option");
			}
		});
		// }}}2

		_aliases_hash_table.add(alias_name, option);
		_aliases_map[option.name].push(alias_name);
	};

	// {{{1 .set_options(args, index);
	this.set_options = function (arguments_list, index) {
		var option, option_name;

		array_validator.validate(arguments_list, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_options`,
					"arguments_list", 0, arguments_list, err.message);
			}
		});

		required_number_validator.validate(index, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.set_options`,
					"index", 1, index, err.message);
			}
		});

		for (; index < arguments_list.length; ++index) {
			option_name = arguments_list[index];

			if (_options_hash_table.has(option_name)) {
				option = _options_hash_table.get_value(option_name);
			} else if (_aliases_hash_table.has(option_name)) {
				option = _aliases_hash_table.get_value(option_name);
			} else {
				return index;
			}

			index = option.initialize(arguments_list, index + 1);
		}

		return index;
	};

	// {{{1 .get_options_length();
	this.get_options_length = function () {
		return _options_hash_table.get_length();
	};

	// {{{1 .get_option();
	this.get_option = function (option_name) {
		if (_options_hash_table.has(`--${ option_name }`)) {
			return _options_hash_table.get_value(`--${ option_name }`);
		}

		throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.get_option`,
			"option_name", 0, option_name, "not a valid option name");
	};

	// {{{1 .get_option_by_alias_name();
	this.get_option_by_alias_name = function (alias_name) {
		if (_aliases_hash_table.has(`-${ alias_name }`)) {
			return _aliases_hash_table.get_value(`-${ alias_name }`);
		}

		throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.get_option_by_alias_name`,
			"alias_name", 0, alias_name, "not a valid alias name");
	};

	// {{{1 .each(iterator(option, index) => {})
	this.each = function (interator) {
		_options_hash_table.each((value, key, index) => interator(value, index));
	};

	// {{{1 .map(iterator(option, index) => {})
	this.map = function (interator) {
		return _options_hash_table.map((value, key, index) => interator(value, index));
	};
	// }}}1
}

JeefoCommand.prototype = {
	aliases : [],

	help : function (application_name) {
		var result  = `${ application_name } ${ this.name }`,
			aliases = this.aliases,
			options = this.map(option => option);

		if (options.length) {
			result += ` ${ style("<options...>", "cyan") }`;
		}

		if (this.description) {
			result += `\n  ${ this.description }`;
		}

		if (aliases.length) {
			result += style(`\n  ${ aliases.length === 1 ? "alias" : "aliases" }: ${ this.aliases.join(", ") }`, "gray");
		}

		if (options.length) {
			result += `\n${ options.map(option => option.to_string()).join("\n") }`;
		}

		return result;
	}
};

module.exports = JeefoCommand;
