/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_parameters.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-11
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ASTNodeDefinition   = require("@jeefo/parser/src/ast_node_definition"),
      get_start_position = require("../helpers/get_start_position");

const parameter_ast_node_definition = new ASTNodeDefinition({
    id         : "Parameter",
    type       : "Primitive",
    precedence : 31,
    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        parser.expect("identifier", parser => parser.next_ast_node_definition.id === "Identifier");
        const identifier = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);
        const post_comment = parser.current_ast_node;

        ast_node.identifier   = identifier;
        ast_node.post_comment = post_comment;
        ast_node.start        = get_start_position(identifier.pre_comment, identifier);
        ast_node.end          = post_comment ? post_comment.end : identifier.end;
    }
});

const parameters_ast_node_definition = new ASTNodeDefinition({
    id         : "Parameters",
    type       : "Notation",
    precedence : 31,
    is         : () => {},
    initialize : (ast_node, current_token, parser) => {
        parser.change_state("delimiter");
        const parameters       = [];
        const open_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

        parser.prepare_next_state("expression", true);

        while (parser.next_token.value !== ')') {
            const parameter = parameter_ast_node_definition.generate_new_ast_node(parser);
            parameters.push(parameter);

            if (parser.next_token.value !== ')') {
                parser.expect(',', parser => parser.next_token.value === ',');
                parser.prepare_next_state("expression", true);
            }
        }

        parser.expect(')', parser => parser.next_token.value === ')');
        parser.change_state("delimiter");
        const close_parenthesis = parser.next_ast_node_definition.generate_new_ast_node(parser);

        ast_node.open_parenthesis  = open_parenthesis;
        ast_node.parameters        = parameters;
        ast_node.close_parenthesis = close_parenthesis;
        ast_node.start             = get_start_position(open_parenthesis.pre_comment, current_token);
        ast_node.end               = close_parenthesis.end;
    }
});

module.exports = function get_parameters (parser) {
    return parameters_ast_node_definition.generate_new_ast_node(parser);
};
