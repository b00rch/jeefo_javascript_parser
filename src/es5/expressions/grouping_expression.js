/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-22
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const precedence_enum                 = require("../enums/precedence_enum"),
      is_expression                   = require("../helpers/is_expression"),
      get_current_state_name          = require("../helpers/get_current_state_name"),
      get_last_non_comment_ast_node   = require("../helpers/get_last_non_comment_ast_node"),
      get_comma_separated_expressions = require("../helpers/get_comma_separated_expressions");

module.exports = {
	id         : "Grouping expression",
    type       : "Expression",
	precedence : precedence_enum.GROUPING_EXPRESSION,

	is : (token, parser) => {
        return token.value === '('
            && is_expression(parser)
            && get_last_non_comment_ast_node(parser) === null;
    },
    initialize : (ast_node, current_token, parser) => {
        const expression_name = get_current_state_name(parser);
        parser.change_state("delimiter");

        ast_node.open_parenthesis  = parser.next_ast_node_definition.generate_new_ast_node(parser);
        ast_node.expression        = get_comma_separated_expressions(parser, ')');
        ast_node.close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);
        ast_node.start             = ast_node.open_parenthesis.start;
        ast_node.end               = ast_node.close_parenthesis.end;

        parser.prepare_next_state(expression_name, true);
    }
};
