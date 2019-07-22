/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : boolean_validator.js
* Created at  : 2019-01-02
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
	CONSTRUCTOR_NAME = "BooleanValidator",
	DEFAULT_OPTIONS  = {
		define   : true,
		nullable : false,
	};

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, IBaseValidator, {
	constructor : function (config, is_muteable) {
		var self = this;
		is_muteable = "unused";

		config_validator.validate(config, function (err, value) {
			if (err) {
				throw new InvalidArgumentException(CONSTRUCTOR_NAME, "config", 0, config, err.message);
			}

			config = value || {};

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
		}

		if (value === null) {
			if (this.nullable) {
				return callback(null, null);
			}
			return callback({ message : "null" });
		}

		if (typeof value !== "boolean") {
			return callback({ message : "not a boolean" });
		}

		callback(null, value);
	}
});
