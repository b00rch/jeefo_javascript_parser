/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : hash_table_specs.js
* Created at  : 2019-01-05
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

var expect                          = require("expect"),
	HashTable                       = require("../src/hash_table"),
	argument_test_factory           = require("./argument_test_factory"),

	test_throw_exception            = require("./testers/test_throw_exception"),
	test_invalid_argument_exception = require("./testers/test_invalid_argument_exception");

describe("class HashTable ()", () => {
	test_throw_exception("Please use: new HashTable()", function () {
		return HashTable.call(null);
	});

	it("Should be return new instance, always!", () => {
		var fake_instance = Object.create(HashTable.prototype);
		var new_instance  = HashTable.call(fake_instance);

		expect(fake_instance).not.toBe(new_instance);
	});

	// {{{1 .get_length()
	describe(".get_length()", () => {
		var hash_table = new HashTable(), i = 0, EXPECTED_LENGTH = 5;

		for (; i < EXPECTED_LENGTH; ++i) {
			it(`Should be ${ i }`, () => {
				expect(hash_table.get_length()).toBe(i);
			});
			hash_table.add(`key${ i }`, null);
		}

		it(`Should be ${ EXPECTED_LENGTH }`, () => {
			expect(hash_table.get_length()).toBe(EXPECTED_LENGTH);
		});
	});

	// {{{1 .add(key, value)
	describe(".add(key, value)", () => {
		var key_argument_tester = argument_test_factory("HashTable.add", "key", 0);

		test_invalid_argument_exception(key_argument_tester("key", "duplicated key", function (error_input) {
			var hash_table = new HashTable();

			hash_table.add(error_input, "value");
			hash_table.add(error_input, null);
		}));
	});

	// {{{1 .has(key)
	describe(".has(key)", () => {
		var hash_table = new HashTable();

		it("Should be got false before call: instance.add('key', value);", () => {
			expect(hash_table.has("key")).toBe(false);
		});

		it("Should be got true after call: instance.add('key', value);", () => {
			hash_table.add("key", "value");
			expect(hash_table.has("key")).toBe(true);
		});
	});

	// {{{1 .each(iterator)
	describe(".each(iterator)", () => {
		var hash_table = new HashTable();
		var test_cases = [
			{ key : "key0", value : "value0" },
			{ key : "key1", value : "value1" },
		];

		test_cases.forEach(test_case => {
			hash_table.add(test_case.key, test_case.value);
		});

		it("Should be fired twice [Function: iterator].", () => {
			var counter = 0;

			hash_table.each((value, key, index) => {
				expect(key).toBe(`key${ index }`);
				expect(value).toBe(`value${ index }`);
				counter += 1;
			});

			expect(counter).toBe(2);
		});
	});

	// {{{1 .map(iterator)
	describe(".map(iterator)", () => {
		var hash_table = new HashTable();
		var test_cases = [
			{ key : "key0", value : "value0" },
			{ key : "key1", value : "value1" },
		];

		test_cases.forEach(test_case => {
			hash_table.add(test_case.key, test_case.value);
		});

		it("Should be got [{ key : 'key0', value : 'value0' }, { key : 'key1', value : 'value1' }].", () => {
			var result = hash_table.map((value, key) => { return { key : key, value : value }; });

			expect(result.length).toBe(2);

			result.forEach((element, index) => {
				expect(element.key).toBe(`key${ index }`);
				expect(element.value).toBe(`value${ index }`);
			});
		});
	});
	// }}}1
});
