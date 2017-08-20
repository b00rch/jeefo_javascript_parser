/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : break_statement_specs.js
* Created at  : 2017-08-18
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var expect = require("expect"),
	parser = require("../../../src/es5_parser");

describe("BreakStatement", () => {
	var stmt = parser.parse("break LABEL")[0];

	it('Type should be "BreakStatement"', function () {
		expect(stmt.type).toBe("BreakStatement");
	});

	it('Precedence should be (31)', function () {
		expect(stmt.precedence).toBe(31);
	});

	it('Label should be "LABEL"', function () {
		expect(stmt.label.name).toBe("LABEL");
	});

	it('Label type should be "Identifier"', function () {
		expect(stmt.label.type).toBe("Identifier");
	});

	it("Should be has start object", function () {
		expect(stmt.start.line).toBe(1);
		expect(stmt.start.index).toBe(0);
		expect(stmt.start.column).toBe(1);
		expect(stmt.start.virtual_column).toBe(1);
	});

	it("Should be has end object", function () {
		expect(stmt.end.line).toBe(1);
		expect(stmt.end.index).toBe(11);
		expect(stmt.end.column).toBe(12);
		expect(stmt.end.virtual_column).toBe(12);
	});
});