/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_tokenizer.js
* Created at  : 2017-04-08
* Updated at  : 2017-05-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
//ignore:start
"use strict";

var jeefo    = require("./parser"),
	_package = require("../package"),
	app      = jeefo.module(_package.name);

/* global */
/* exported */
/* exported */

//ignore:end

// ES5 Tokenizer {{{1
app.namespace("javascript.es5_tokenizer", ["tokenizer.Tokenizer"], function (Tokenizer) {
	var javascript_tokenizer = new Tokenizer("ECMA Script 5");

	// Comment {{{2
	javascript_tokenizer.regions.register({
		type  : "Comment",
		name  : "Inline comment",
		start : "//",
		end   : "\n",
	}).
	register({
		type  : "Comment",
		name  : "Multi line comment",
		start : "/*",
		end   : "*/",
	}).

	// String {{{2
	register({
		type        : "String",
		name        : "Double quote string",
		start       : '"',
		escape_char : '\\',
		end         : '"',
	}).
	register({
		type        : "String",
		name        : "Single quote string",
		start       : "'",
		escape_char : '\\',
		end         : "'",
	}).

	// Parenthesis {{{2
	register({
		type  : "Parenthesis",
		name  : "Parenthesis",
		start : '(',
		end   : ')',
		contains : [
			{ type : "Block"       } ,
			{ type : "Array"       } ,
			{ type : "String"      } ,
			{ type : "RegExp"      } ,
			{ type : "Comment"     } ,
			{ type : "Parenthesis" } ,
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '|', '$', '?', '`',
					'=', '!', '<', '>', '\\',
					':', '.', ',', ';', // delimiters
				]
			},
		]
	}).

	// Array {{{2
	register({
		type  : "Array",
		name  : "Array literal",
		start : '[',
		end   : ']',
		contains : [
			{ type : "Block"       },
			{ type : "Array"       },
			{ type : "String"      },
			{ type : "Comment"     },
			{ type : "Parenthesis" },
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '|', '$', '?', '`',
					'=', '!', '<', '>',
					':', '.', ',', ';', // delimiters
				]
			},
		]
	}).

	// Block {{{2
	register({
		type  : "Block",
		name  : "Block",
		start : '{',
		end   : '}',
		contains : [
			{ type : "Block"       } ,
			{ type : "Array"       } ,
			{ type : "String"      } ,
			{ type : "RegExp"      } ,
			{ type : "Comment"     } ,
			{ type : "Parenthesis" } ,
			{
				type  : "SpecialCharacter",
				chars : [
					'-', '_', '+', '*', '%', // operator
					'&', '|', '$', '?', '`',
					'=', '!', '<', '>', '\\',
					':', '.', ',', ';', // delimiters
				]
			},
		]
	}).

	// RegExp {{{2
	register({
		type        : "RegExp",
		name        : "RegExp",
		start       : '/',
		escape_char : '\\',
		end         : '/',
	});
	// }}}2

	return javascript_tokenizer;
});
// }}}1

//ignore:start
module.exports = jeefo;
//ignore:end