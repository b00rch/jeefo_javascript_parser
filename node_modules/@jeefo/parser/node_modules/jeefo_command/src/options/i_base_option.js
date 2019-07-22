/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : i_base_option.js
* Created at  : 2019-01-02
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

var style                    = require("../misc/style"),
	jeefo_class              = require("../misc/jeefo_class"),
	throw_error              = require("../exceptions/throw_error"),
	object_freeze            = require("../object_freeze"),
	StringValidator          = require("../validators/string_validator"),
	InvalidArgumentException = require("../exceptions/invalid_argument_exception");

var name_argument_validator = new StringValidator({ trim : true });

var IBaseOption = jeefo_class.create("IBaseOption", {
	constructor : function (derived_class_name, name, index) {
		var instance = this;

		if (instance instanceof IBaseOption === false) {
			throw_error("Invalid instance.");
		}
		if (Object.getPrototypeOf(instance) === IBaseOption.prototype) {
			throw_error("Interface class cannot be instantiated.");
		}

		if (typeof index !== "number") {
			throw new InvalidArgumentException(derived_class_name, "index", 2, index, "not a number");
		}

		name_argument_validator.validate(name, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(derived_class_name, "name", index, name, err.message);
			}

			object_freeze(instance, "name", `--${ result_value }`);
		});
	},

	type    : null,
	aliases : [],

	to_string : function () {
		var result  = style(`  ${ this.name } (${ this.type })`, "cyan"),
			aliases = this.aliases;

		if (this.value !== void 0) {
			result += style(` and (Value => ${ this.value })`, "cyan");
		}

		if (aliases.length) {
			result += style(`\n    ${ aliases.length === 1 ? "alias" : "aliases" }: ${ this.aliases.join(", ") }`, "gray");
		}

		if (this.description) {
			result += `\n    ${ this.description }`;
		}

		return result;
	},

	initialize : function () {
		throw_error("Interface only virtual function called.");
	}
});

module.exports = IBaseOption;
