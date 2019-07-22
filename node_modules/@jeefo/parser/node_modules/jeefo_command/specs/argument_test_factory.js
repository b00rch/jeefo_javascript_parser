/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : argument_test_factory.js
* Created at  : 2019-01-04
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

module.exports = function argument_test_factory (function_name, argument_name, argument_index) {
	return function create_argument_test_case (error_value, message, thrower) {
		return {
			thrower        : thrower,
			error_message  : message,
			function_name  : function_name,
			argument_name  : argument_name,
			argument_index : argument_index,
			argument_value : error_value,
		};
	};
};
