/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_validator.js
* Created at  : 2019-01-03
* Updated at  : 2019-01-10
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
	InvalidArgumentException = require("../exceptions/invalid_argument_exception");

var is_array        = Array.isArray,
	FAKE_INSTANCE   = {},
	DEFAULT_OPTIONS = {
		strict   : false,
		define   : true,
		nullable : false,
	},
	CONSTRUCTOR_NAME = "ObjectValidator";

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, IBaseValidator, {
	constructor : function (config, is_muteable) {
		var self = this;
		is_muteable = "unused";

		this.validate.call(FAKE_INSTANCE, config, function (err, value) {
			if (err) {
				throw new InvalidArgumentException(CONSTRUCTOR_NAME, "config", 0, config, err.message);
			}

			config = value || {};

			self.define   = config.define   === void 0 ? DEFAULT_OPTIONS.define   : config.define   === true;
			self.strict   = config.strict   === void 0 ? DEFAULT_OPTIONS.strict   : config.strict   === true;
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

		if (this.strict && is_array(value)) {
			return callback({ message : "an array" });
		}

		if (typeof value !== "object") {
			return callback({ message : "not an object" });
		}

		callback(null, value);
	}
});
