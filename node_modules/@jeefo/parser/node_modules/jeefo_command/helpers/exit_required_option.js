/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : exit_required_option.js
* Created at  : 2019-01-13
* Updated at  : 2019-01-13
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const style = require("../src/misc/style");

module.exports = function exit_required_option (option_name) {
	console.error([
		style("Option ", "red"),
		style(`'${ option_name }'`, "cyan"),
		style(" is required for this task.", "red")
	].join(''));

	process.exit(1);
};
