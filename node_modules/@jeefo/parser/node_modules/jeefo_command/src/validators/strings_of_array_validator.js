/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : strings_of_array_validator.js
* Created at  : 2019-01-02
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

const ObjectValidator          = require("./object_validator"),
	  InvalidArgumentException = require("../exceptions/invalid_argument_exception"),

	is_array         = Array.isArray,
	config_validator = new ObjectValidator({ define : false }),
	DEFAULT_OPTIONS  = {
		trim     : true,
		empty    : false,
		define   : true,
		strict   : true,
		unique   : false,
		nullable : false,
	};

module.exports = class StringsOfArrayValidator {
	constructor (config) {
		config_validator.validate(config, (err, value) => {
			if (err) {
				throw new InvalidArgumentException("StringsOfArrayValidator", "config", 0, config, err.message);
			}

			config = value || {};

			this.trim     = config.trim     === undefined ? DEFAULT_OPTIONS.trim     : config.trim     === true;
			this.empty    = config.empty    === undefined ? DEFAULT_OPTIONS.empty    : config.empty    === true;
			this.strict   = config.strict   === undefined ? DEFAULT_OPTIONS.strict   : config.strict   === true;
			this.define   = config.define   === undefined ? DEFAULT_OPTIONS.define   : config.define   === true;
			this.unique   = config.unique   === undefined ? DEFAULT_OPTIONS.unique   : config.unique   === true;
			this.nullable = config.nullable === undefined ? DEFAULT_OPTIONS.nullable : config.nullable === true;
		});
	}

	validate (values, callback) {
		let i, result_array, current_value;

		if (values === undefined) {
			if (this.define) {
				return callback({ message : "undefined" });
			}
			return callback(null);
		} else if (values === null) {
			if (this.nullable) {
				return callback(null, null);
			}
			return callback({ message : "null" });
		} else if (this.strict && ! is_array(values)) {
			return callback({ message : "not an array" });
		} else if (! this.empty && values.length === 0) {
			return callback({ message : "an empty array" });
		}

		i            = values.length;
		result_array = new Array(values.length);

		while (i--) {
			current_value = values[i];

			if (typeof current_value !== "string") {
				return callback({ message : "has non string value" });
			}

			if (this.trim) {
				current_value = current_value.trim();
				if (current_value === '') {
					return callback({ message : "has an empty string value" });
				}
			}

			/**
			 * I'm gonna leave this way for looking result array each iteration.
			 * I feel bad for not using hash table here. But I don't want to 
			 * double assign operator for result array and hash_table.
			 * Which is called only few times anyway.
			 * TODO: add option for not create result_array everytime validate.
			 */
			if (this.unique && result_array.indexOf(current_value) !== -1) {
				return callback({ message : "has duplicated value", value : values[i] });
			}

			// TODO: add option for not create result_array everytime validate.
			result_array[i] = current_value;
		}

		callback(null, result_array);
	}
};
