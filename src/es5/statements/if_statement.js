/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : if_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-24
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum               = require("../enums/states_enum"),
      precedence_enum           = require("../enums/precedence_enum"),
      keyword_definition        = require("../common/keyword_definition"),
      get_surrounded_expression = require("../helpers/get_surrounded_expression");

module.exports = function register_if_statement (es5_ast_nodes) {
    es5_ast_nodes.register_reserved_word("else", {
        id         : "Else statement",
        type       : "Statement",
        precedence : 31,

        is         : (current_token, parser) => parser.current_state === states_enum.if_statement,
        initialize : (ast_node, current_token, parser) => {
            const keyword = keyword_definition.generate_new_ast_node(parser);
            parser.prepare_next_state(null, true);

            ast_node.keyword     = keyword;
            ast_node.statement   = parser.get_next_ast_node(precedence_enum.TERMINATION);
            ast_node.start       = keyword.start;
            ast_node.end         = ast_node.statement.end;
        }
    });

    es5_ast_nodes.register_reserved_word("if", {
        id         : "If statement",
        type       : "Statement",
        precedence : 31,

        is         : (token, parser) => parser.current_state === states_enum.statement,
        initialize : (ast_node, current_token, parser) => {
            const keyword = keyword_definition.generate_new_ast_node(parser);
            let else_statement = null;

            // Surrounded expression
            parser.prepare_next_state(null, true);
            parser.expect('(', parser => parser.next_token.value === '(');
            const surrounded_expression = get_surrounded_expression(parser);

            // Statement
            parser.prepare_next_state(null, true);
            const statement = parser.get_next_ast_node(precedence_enum.TERMINATION);

            // Else statement
            parser.prepare_next_state("if_statement");
            if (parser.next_ast_node_definition !== null && parser.next_ast_node_definition.id === "Else statement") {
                else_statement = parser.get_next_ast_node(precedence_enum.TERMINATION);
            }

            ast_node.keyword        = keyword;
            ast_node.expression     = surrounded_expression;
            ast_node.statement      = statement;
            ast_node.else_statement = else_statement;
            ast_node.start          = keyword.start;
            ast_node.end            = else_statement ? else_statement.end : statement.end;

            parser.terminate(ast_node);
        }
    });
};
