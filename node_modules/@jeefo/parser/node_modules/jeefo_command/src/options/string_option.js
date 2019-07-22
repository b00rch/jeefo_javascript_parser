/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : string_option.js
* Created at  : 2018-12-28
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

var jeefo_class                       = require("../misc/jeefo_class"),
	IBaseOption                       = require("./i_base_option"),
	StringValidator                   = require("../validators/string_validator"),
	argument_validator_factory        = require("../validators/argument_validator_factory"),
	generate_string_initialize_method = require("./generate_string_initialize_method");

var TYPE             = "String",
	CONSTRUCTOR_NAME = `${ TYPE }Option`;

var default_value_validator          = new StringValidator({ define : false, trim : true, nullable : true });
var default_value_argument_validator = argument_validator_factory(CONSTRUCTOR_NAME, "default_value", 1, default_value_validator);

module.exports = jeefo_class.create(CONSTRUCTOR_NAME, IBaseOption, {
	constructor : function (name, default_value) {
		this.Super(CONSTRUCTOR_NAME, name, 0);
		this.value = default_value_argument_validator(default_value) || void 0;
	},

	type : TYPE,

	initialize : generate_string_initialize_method(CONSTRUCTOR_NAME),

	to_string : function () {
		if (this.value !== void 0) {
			var original_value = this.value;
			this.value = `'${ original_value }'`;

			var result = this._super().to_string();
			this.value = original_value;

			return result;
		}

		return this._super().to_string();
	}
});
