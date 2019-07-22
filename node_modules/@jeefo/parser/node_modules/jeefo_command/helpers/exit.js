/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : exit.js
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

module.exports = function exit (error_message) {
	if (error_message) {
		console.error(error_message);
		process.exit(1);
	}

	process.exit(0);
};
