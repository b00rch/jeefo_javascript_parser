/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : boolean_option.js
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

var jeefo_class                = require("../misc/jeefo_class"),
	IBaseOption                = require("./i_base_option"),

	ArrayValidator             = require("../validators/array_validator"),
	NumberValidator            = require("../validators/number_validator"),
	BooleanValidator           = require("../validators/boolean_validator"),

	InvalidArgumentException   = require("../exceptions/invalid_argument_exception"),
	argument_validator_factory = require("../validators/argument_validator_factory");

var TYPE             = "Boolean",
	CONSTRUCTOR_NAME = `${ TYPE }Option`;

var array_validator  = new ArrayValidator(),
	number_validator = new NumberValidator();

var default_value_validator          = new BooleanValidator({ define : false, nullable : true });
var default_value_argument_validator = argument_validator_factory(CONSTRUCTOR_NAME, "default_value", 1, default_value_validator);

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, IBaseOption, {
	constructor : function (name, default_value) {
		this.Super(CONSTRUCTOR_NAME, name, 0);

		var value = default_value_argument_validator(default_value);
		if (typeof value === "boolean") {
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

		switch (arguments_list[index]) {
			case "true" :
				this.value = true;
				break;
			case "false" :
				this.value = false;
				break;
			default:
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.initialize`,
					`arguments_list[${ index }]`, 0, arguments_list[index], "not a boolean");
		}

		return index;
	},
});
