/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
* Created at  : 2019-03-28
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const precedence_enum               = require("../enums/precedence_enum"),
      is_expression                 = require("../helpers/is_expression"),
      get_expression                = require("../helpers/get_expression"),
      get_current_state_name        = require("../helpers/get_current_state_name"),
      get_last_non_comment_ast_node = require("../helpers/get_last_non_comment_ast_node");

module.exports = {
	id         : "Sequence expression",
    type       : "Expression",
	precedence : precedence_enum.COMMA,

	is : (token, parser) => {
        return token.value === ','
            && is_expression(parser)
            && get_last_non_comment_ast_node(parser) !== null;
    },
    initialize : (ast_node, current_token, parser) => {
        const expressions     = [get_last_non_comment_ast_node(parser, true)];
        const expression_name = get_current_state_name(parser);

        parser.change_state("delimiter");
        expressions.push(parser.next_ast_node_definition.generate_new_ast_node(parser));
        parser.prepare_next_state(expression_name, true);

        LOOP:
        while (true) {
            if (parser.next_token.value === ';') { break; }

            expressions.push(get_expression(parser, precedence_enum.COMMA));

            if (parser.next_token === null) {
                break;
            }

            switch (parser.next_token.value) {
                case ',' :
                    parser.change_state("delimiter");
                    expressions.push(parser.next_ast_node_definition.generate_new_ast_node(parser));

                    parser.prepare_next_state(expression_name, true);
                    break;
                case ';' :
                    break LOOP;
                default:
                    parser.throw_unexpected_token();
            }
        }

        ast_node.expressions = expressions;
        ast_node.start       = expressions[0].start;
        ast_node.end         = expressions[expressions.length - 1].end;
        // console.log(ast_node);
        process.exit();
    }
};
