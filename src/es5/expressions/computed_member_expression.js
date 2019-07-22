/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : computed_member_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-19
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
      operator_definition           = require("../common/operator_definition"),
      is_expression                 = require("../helpers/is_expression"),
      prepare_next_expression       = require("../helpers/prepare_next_expression"),
      get_current_state_name        = require("../helpers/get_current_state_name"),
      get_last_non_comment_ast_node = require("../helpers/get_last_non_comment_ast_node");

module.exports = {
    id         : "Computed member expression",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) => {
        if (is_expression(parser) && current_token.value === '[') {
            const lvalue = get_last_non_comment_ast_node(parser);
            if (lvalue !== null) {
                // TODO: check lvalue
                return true;
            }
        }
        return false;
    },

	initialize : (ast_node, current_token, parser) => {
        const object = parser.current_ast_node;

        const state_name = get_current_state_name(parser);
        parser.current_ast_node   = null;
        parser.previous_ast_nodes = [];
        parser.change_state(state_name);

        const open_square_bracket = operator_definition.generate_new_ast_node(parser);

        prepare_next_expression(parser, true);
        const expression = parser.get_next_ast_node(precedence_enum.TERMINATION);

        parser.expect(']', parser => parser.next_token.value === ']');
        const close_square_bracket = operator_definition.generate_new_ast_node(parser);

        ast_node.object               = object;
        ast_node. open_square_bracket = open_square_bracket;
        ast_node.expression           = expression;
        ast_node.close_square_bracket = close_square_bracket;
        ast_node.start                = object.start;
        ast_node.end                  = close_square_bracket.end;

        parser.prepare_next_state(state_name);
    },
};
