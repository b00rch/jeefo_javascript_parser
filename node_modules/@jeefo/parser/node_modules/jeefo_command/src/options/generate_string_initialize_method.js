/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generate_string_initialize_method.js
* Created at  : 2019-01-16
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

var ArrayValidator           = require("../validators/array_validator"),
	NumberValidator          = require("../validators/number_validator"),
	InvalidArgumentException = require("../exceptions/invalid_argument_exception");

var array_validator  = new ArrayValidator(),
	number_validator = new NumberValidator();

module.exports = function generate_string_initialize_method (constructor_name) {
	return function (arguments_list, index) {
		array_validator.validate(arguments_list, err => {
			if (err) {
				throw new InvalidArgumentException(`${ constructor_name }.initialize`,
					"arguments_list", 0, arguments_list, err.message);
			}
		});
		number_validator.validate(index, err => {
			if (err) {
				throw new InvalidArgumentException(`${ constructor_name }.initialize`,
					"index", 1, index, err.message);
			}
		});

		if (typeof arguments_list[index] !== "string") {
			throw new InvalidArgumentException(`${ constructor_name }.initialize`,
				`arguments_list[${ index }]`, 0, arguments_list[index], "not a string");
		}

		this.value = arguments_list[index];
		return index;
	};
};
