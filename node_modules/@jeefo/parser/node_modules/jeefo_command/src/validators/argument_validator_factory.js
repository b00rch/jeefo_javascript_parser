/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : argument_validator_factory.js
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

var InvalidArgumentException = require("../exceptions/invalid_argument_exception");

module.exports = function argument_validator_factory (function_name, argument_name, argument_index, validator) {
	return function argument_validator (value) {
		validator.validate(value, function (error, result_value) {
			if (error) {
				if (error.hasOwnProperty("value")) {
					value = error.value;
				}
				throw new InvalidArgumentException(function_name, argument_name, argument_index, value, error.message);
			}

			value = result_value;
		});

		return value;
	};
};
