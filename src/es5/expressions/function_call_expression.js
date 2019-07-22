/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_call_expression.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-29
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.2
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ASTNodeDefinition               = require("@jeefo/parser/src/ast_node_definition"),
      is_expression                   = require("../helpers/is_expression"),
      get_current_state_name          = require("../helpers/get_current_state_name"),
      get_last_non_comment_ast_node   = require("../helpers/get_last_non_comment_ast_node"),
      get_comma_separated_expressions = require("../helpers/get_comma_separated_expressions");

const arguments_list_definition = new ASTNodeDefinition({
    id         : "Arguments list",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        const expression_name = get_current_state_name(parser);
        parser.change_state("delimiter");

        ast_node.open_parenthesis  = parser.next_ast_node_definition.generate_new_ast_node(parser);
        ast_node.expressions       = get_comma_separated_expressions(parser, ')');
        ast_node.close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);
        ast_node.start             = ast_node.open_parenthesis.start;
        ast_node.end               = ast_node.close_parenthesis.end;

        parser.change_state(expression_name);
        parser.prepare_next_ast_node_definition();
    }
});

module.exports = {
    id         : "Function call expression",
	type       : "Expression",
	precedence : 19,

    is : (current_token, parser) => {
        return current_token.value === '('
            && is_expression(parser)
            && get_last_non_comment_ast_node(parser) !== null;
    },

	initialize : (ast_node, current_token, parser) => {
        ast_node.callee         = get_last_non_comment_ast_node(parser);
        ast_node.arguments_list = arguments_list_definition.generate_new_ast_node(parser);
        ast_node.start          = ast_node.callee.start;
        ast_node.end            = ast_node.arguments_list.end;
    },
};
