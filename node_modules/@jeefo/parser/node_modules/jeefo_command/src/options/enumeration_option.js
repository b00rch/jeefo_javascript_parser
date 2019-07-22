/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : enumeration_option.js
* Created at  : 2019-01-01
* Updated at  : 2019-01-15
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var style                      = require("../misc/style"),
	jeefo_class                = require("../misc/jeefo_class"),
	IBaseOption                = require("./i_base_option"),

	ArrayValidator             = require("../validators/array_validator"),
	NumberValidator            = require("../validators/number_validator"),
	StringValidator            = require("../validators/string_validator"),
	StringsOfArrayValidator    = require("../validators/strings_of_array_validator"),

	InvalidArgumentException   = require("../exceptions/invalid_argument_exception"),
	argument_validator_factory = require("../validators/argument_validator_factory");

var TYPE             = "Enumeration",
	CONSTRUCTOR_NAME = `${ TYPE }Option`;

var array_validator  = new ArrayValidator(),
	number_validator = new NumberValidator();

var default_value_validator    = new StringValidator({ trim : true, nullable : true, define : false });
var enumeration_list_validator = new StringsOfArrayValidator({ unique : true });

var enumeration_list_argument_validator = argument_validator_factory(CONSTRUCTOR_NAME, "enumeration_list", 1, enumeration_list_validator);
var default_value_argument_validator    = argument_validator_factory(CONSTRUCTOR_NAME, "default_value"   , 2, default_value_validator);

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, IBaseOption, {
	constructor : function (name, enumeration_list, default_value) {
		this.Super(CONSTRUCTOR_NAME, name, 0);
		this.list = enumeration_list_argument_validator(enumeration_list);

		var value = default_value_argument_validator(default_value);
		if (value) {
			if (this.list.indexOf(value) === -1) {
				throw new InvalidArgumentException(CONSTRUCTOR_NAME,
					"default_value", 2, value, "not a valid enumeration value");
			}
			this.value = value;
		}
	},

	type : TYPE,

	initialize : function (arguments_list, index) {
		array_validator.validate(arguments_list, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.initialize`,
					"arguments_list", 0, arguments_list, err.message);
			}
		});
		number_validator.validate(index, err => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.initialize`,
					"index", 1, index, err.message);
			}
		});

		var value = arguments_list[index];
		if (this.list.indexOf(value) === -1) {
			throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.initialize`,
				`arguments_list[${ index }]`, 0, value, "not a valid enumeration value");
		}

		this.value = value;
		return index;
	},

	to_string : function (styles) {
		return this._super(styles).to_string() +
			style(`\n    Enumeration list: {${ this.list.join(" | ") }}`, "magenta");
	}
});
