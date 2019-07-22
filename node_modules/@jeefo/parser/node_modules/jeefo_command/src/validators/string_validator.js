/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : string_validator.js
* Created at  : 2019-01-01
* Updated at  : 2019-01-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var jeefo_class              = require("../misc/jeefo_class"),
	IBaseValidator           = require("./i_base_validator"),
	ObjectValidator          = require("./object_validator"),
	InvalidArgumentException = require("../exceptions/invalid_argument_exception");

var config_validator = new ObjectValidator({ define : false, nullable : true }),
	DEFAULT_OPTIONS  = {
		trim     : false,
		define   : true,
		nullable : false,
	},
	CONSTRUCTOR_NAME = "StringValidator";

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, IBaseValidator, {
	constructor : function (config, is_muteable) {
		var self = this;
		is_muteable = "unused";

		config_validator.validate(config, function (err, value) {
			if (err) {
				throw new InvalidArgumentException(CONSTRUCTOR_NAME, "config", 0, config, err.message);
			}

			config = value || {};

			self.trim     = config.trim     === void 0 ? DEFAULT_OPTIONS.trim     : config.trim     === true;
			self.define   = config.define   === void 0 ? DEFAULT_OPTIONS.define   : config.define   === true;
			self.nullable = config.nullable === void 0 ? DEFAULT_OPTIONS.nullable : config.nullable === true;
		});
	},

	validate : function (value, callback) {
		if (value === void 0) {
			if (this.define) {
				return callback({ message : "undefined" });
			}
			return callback(null);
		} else if (value === null) {
			if (this.nullable) {
				return callback(null, null);
			}
			return callback({ message : "null" });
		} else if (typeof value !== "string") {
			return callback({ message : "not a string" });
		} else if (this.trim) {
			value = value.trim();
			if (value === '') {
				return callback({ message : "an empty string" });
			}
		}

		callback(null, value);
	}
});
// ignore:start

if (require.main === module) {
	var StringValidator = module.exports;
	var string_validator = new StringValidator({ trim : true }), error_value;

	switch (Math.floor(Math.random() * 5)) {
		case 0 : error_value =  void 0; break; // undefined
		case 1 : error_value =    null; break; // null
		case 2 : error_value = [1,2,3]; break; // not a string
		case 3 : error_value =      {}; break; // not a string
		case 4 : error_value = '     '; break; // empty string
	}

	string_validator.validate(error_value, function (err, result_value) {
		if (err) {
			throw new InvalidArgumentException("StringValidator.validate", "value", 0, error_value, err.message);
		}

		console.log("PASS", result_value);
	});
}

// ignore:end
