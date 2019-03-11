/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : null_literal_specs.js
* Created at  : 2019-02-05
* Updated at  : 2019-02-25
* Author      : jeefo
* Purpose     : Easier to develop. Please make me happy :)
* Description : Describe what is Null notation and unit test every single case.
*             : Make sure it is working correctly.
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const expect = require("expect.js"),
      parser = require("../../../src/es5_parser.js");

describe("Null literal >", () => {
    const source = "null";

    describe(`Test against source text '${ source }'`, () => {
        parser.tokenizer.init(source);
        parser.prepare_next_state("expression");

        const streamer = parser.tokenizer.streamer;
        const symbol   = parser.next_symbol_definition.generate_new_symbol(parser);

        it(`cursor index should be move ${ source.length } characters to right`, () => {
            expect(streamer.get_current_character()).to.be('l');
            expect(streamer.cursor.index).to.be(source.length - 1);
        });

        it(`should be in correct range`, () => {
            expect(streamer.substring_from_token(symbol)).to.be(source);
        });

        it("should be Null literal", () => {
            expect(symbol.id).to.be("Null literal");
            expect(symbol.token.value).to.be(source);
        });

        it("should be Primitive", () => {
            expect(symbol.type).to.be("Primitive");
            expect(symbol.precedence).to.be(31);
        });
    });
});
