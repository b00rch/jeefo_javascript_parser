/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : hash_table.js
* Created at  : 2019-01-04
* Updated at  : 2019-01-15
* Author      : jeefo
* Purpose     :
* Description : Secure private hash table using closure technique.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

var throw_error              = require("./exceptions/throw_error"),
	StringValidator          = require("./validators/string_validator"),
	InvalidArgumentException = require("./exceptions/invalid_argument_exception");

var create_object    = Object.create,
	string_validator = new StringValidator({ trim : true }),
	CONSTRUCTOR_NAME = "HashTable";

module.exports = function HashTable () {
	if (this instanceof HashTable === false) {
		throw_error(`Please use: new ${ CONSTRUCTOR_NAME }();`);
	}

	// Private data members
	var _keys     = [],
		_length   = 0,
		_hash_map = create_object(null),
		// new instance
		instance  = create_object(HashTable.prototype);
	
	instance.add        = add;
	instance.has        = has;
	instance.map        = map;
	instance.each       = each;
	instance.get_value  = get_value;
	instance.get_length = get_length;

	// jshint latedef : false
	return instance;
	// {{{1 Method => add(key, value)
	function add (key, value) {
		string_validator.validate(key, (err, result_value) => {
			if (err) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add`, "key", 0, key, err.message);
			}
			key = result_value;

			if (_hash_map[key] !== void 0) {
				throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.add`,
					"key", 0, key, "duplicated key");
			}

			_hash_map[key] = value;
			_keys.push(key);
			_length += 1;
		});
	}

	// {{{1 Method => has(key)
	function has (key) {
		return _hash_map[key] !== void 0;
	}

	// {{{1 Method => map(iterator)
	function map (interator) {
		var result = [];
		for (var i = 0; i < _keys.length; ++i) {
			result.push(interator(_hash_map[_keys[i]], _keys[i], i));
		}

		return result;
	}

	// {{{1 Method => each(iterator)
	function each (interator) {
		for (var i = 0; i < _keys.length; ++i) {
			interator(_hash_map[_keys[i]], _keys[i], i);
		}
	}

	// {{{1 Method => get_value(key)
	function get_value (key) {
		if (_hash_map[key] === void 0) {
			throw new InvalidArgumentException(`${ CONSTRUCTOR_NAME }.get_value`, "key", 0, key, "invalid key");
		}
		return _hash_map[key];
	}

	// {{{1 Method => get_length()
	function get_length () {
		return _length;
	}
	// }}}1
	// jshint latedef : true
};
