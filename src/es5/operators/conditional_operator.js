/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : conditional_operator.js
* Created at  : 2019-03-28
* Updated at  : 2019-03-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.12
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const precedence_enum               = require("../enums/precedence_enum"),
      operator_definition           = require("../common/operator_definition"),
      is_expression                 = require("../helpers/is_expression"),
      get_current_state_name        = require("../helpers/get_current_state_name"),
      get_last_non_comment_ast_node = require("../helpers/get_last_non_comment_ast_node");

module.exports = {
    id         : "Conditional operator",
    type       : "Ternary operator",
    precedence : precedence_enum.TERNARY,

    is : (token, parser) =>
        token.value === '?'   &&
        is_expression(parser) &&
        get_last_non_comment_ast_node(parser) !== null,

    initialize : (ast_node, current_token, parser) => {
        const condition         = parser.current_ast_node;
        const expression_name   = get_current_state_name(parser);
        const question_operator = operator_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        const truthy_expression = parser.get_next_ast_node(precedence_enum.TERMINATION);

        parser.expect(':', parser => parser.next_token.value === ':');
        const colon_operator = operator_definition.generate_new_ast_node(parser);

        parser.prepare_next_state(expression_name, true);
        const falsy_expression = parser.get_next_ast_node(precedence_enum.TERMINATION);

        ast_node.condition         = condition;
        ast_node.question_operator = question_operator;
        ast_node.truthy_expression = truthy_expression;
        ast_node.colon_operator    = colon_operator;
        ast_node.falsy_expression  = falsy_expression;
        ast_node.start             = condition.start;
        ast_node.end               = falsy_expression.end;
    }
};
