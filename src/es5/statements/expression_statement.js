/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-30
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum     = require("../enums/states_enum"),
      precedence_enum = require("../enums/precedence_enum"),
      get_right_value = require("../helpers/get_right_value");

const expression_delimiters = ['[', '('];
const expression_keywords = [
    "new",
    "void",
    "delete",
    "typeof",

    "null",
    "true",
    "false",
    "undefined",
];
const unary_expressions = [ "~", "!", "+", "-", "++", "--" ];

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : 40,

    is : (token, parser) => {
        switch (parser.current_state) {
            case states_enum.statement :
                switch (token.id) {
                    case "Slash"  :
                    case "String" :
                    case "Number" :
                        return true;
                    case "Identifier" :
                        if (expression_keywords.includes(token.value)) {
                            return true;
                        }
                        return parser.ast_nodes.reserved_words[token.value] === undefined;
                    case "Delimiter" :
                        return expression_delimiters.includes(token.value);
                    case "Operator" :
                        return unary_expressions.includes(token.value);
                }
                break;
        }
        return false;
    },

    initialize : (ast_node, current_token, parser) => {
        let terminator = null;
        const is_individual_block_statement = parser.current_state === states_enum.statement;

        parser.change_state("expression");

        // Labelled statement
        if (parser.next_ast_node_definition.id === "Identifier") {
            parser.current_ast_node   = parser.next_ast_node_definition.generate_new_ast_node(parser);
            parser.previous_ast_nodes = [parser.current_ast_node];
            parser.prepare_next_ast_node_definition();

            if (parser.next_token !== null && parser.next_token.value === ':') {
                ast_node.identifier = parser.current_ast_node;
                ast_node.delimiter  = parser.next_ast_node_definition.generate_new_ast_node(parser);
                return parser.change_state("labelled_statement");
            }
        }

        parser.post_comment = null;
        const expression = get_right_value(parser, precedence_enum.TERMINATION);
        parser.current_ast_node = parser.post_comment;

        if (parser.next_token !== null && parser.next_token.value === ';') {
            parser.change_state("delimiter");
            terminator = parser.next_ast_node_definition.generate_new_ast_node(parser);
        }

        ast_node.expression = expression;
        ast_node.terminator = terminator;
        ast_node.start      = expression.start;
        ast_node.end        = terminator ? terminator.end : expression.end;

        if (is_individual_block_statement) {
            parser.terminate(ast_node);
        }
    }
};
