/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : object_freeze.js
* Created at  : 2019-01-08
* Updated at  : 2019-01-08
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function object_freeze (instance, property, value) {
	var config = { enumerable : true };

	if (typeof value === "function") {
		config.get          = value;
		config.configurable = false;
	} else {
		config.value    = value;
		config.writable = false;
	}

	Object.defineProperty(instance, property, config);
};
