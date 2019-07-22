/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_validation.js
* Created at  : 2019-01-03
* Updated at  : 2019-01-04
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var expect = require("expect");

module.exports = function test_validation (instance, sets_of_test_cases) {
	sets_of_test_cases.forEach(test_case_set => {
		
		describe(`.validate(value, callback) => ${ test_case_set.description }:`, () => {
			test_case_set.cases.forEach(test_case => {
				var got    = test_case.message ? `Error{ message : '${ test_case.message }' }` : test_case.got;
				var config = '', original_config;

				if (test_case.config) {
					var keys = Object.keys(test_case.config);
					config          = [];
					original_config = {};

					keys.forEach(key => {
						original_config[key] = instance[key];
						instance[key] = test_case.config[key];

						config.push(`${ key } : ${ instance[key] ? "truthy" : "falsy" }`);
					});

					config = `(config = { ${ config.join(", ") } }) and `;
				}

				instance.validate(test_case.value, (err, result_value) => {
					it(`Should be got ${ got } when => ${ config }(value = ${ test_case.when })`, () => {
						expect(result_value).toBe(test_case.expected_value);

						if (test_case.message) {
							expect(err.message).toBe(test_case.message);
						}
					});

					if (original_config) {
						keys.forEach(key => {
							instance[key] = original_config[key];
						});
					}
				});
			});
		});

	});
};
