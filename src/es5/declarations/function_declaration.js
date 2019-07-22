/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration.js
* Created at  : 2019-01-29
* Updated at  : 2019-03-26
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum            = require("../enums/states_enum"),
      precedence_enum        = require("../enums/precedence_enum"),
      get_parameters         = require("../helpers/get_parameters"),
      get_pre_comment        = require("../helpers/get_pre_comment"),
      get_start_position     = require("../helpers/get_start_position"),
      get_current_state_name = require("../helpers/get_current_state_name");

module.exports = {
    id         : "Function declaration",
    type       : "Declaration",
    precedence : 31,

    is : (tokem, parser) => {
        switch (parser.current_state) {
            case states_enum.statement  :
            case states_enum.expression :
                return true;
        }
        return false;
    },
    initialize : (ast_node, current_token, parser) => {
        let name = null, expression_name;
        const pre_comment             = get_pre_comment(parser),
              is_function_declaration = parser.current_state === states_enum.statement;

        if (! is_function_declaration) {
            ast_node.id       = "Function expression";
            ast_node.type     = "Expression";
            expression_name = get_current_state_name(parser);
        }

        parser.prepare_next_state("expression", true);

        if (is_function_declaration || parser.next_token.id === "Identifier") {
            parser.expect("identifier", parser => parser.next_ast_node_definition.id === "Identifier");
            name = parser.next_ast_node_definition.generate_new_ast_node(parser);
            parser.prepare_next_state("expression", true);
        }

        parser.expect('(', parser => parser.next_token.value === '(');
        const parameters = get_parameters(parser);

        parser.prepare_next_state("block_statement", true);
        parser.expect('{', parser => parser.next_token.value === '{');
        const body = parser.get_next_ast_node(precedence_enum.TERMINATION);

        ast_node.name        = name;
        ast_node.parameters  = parameters;
        ast_node.body        = body;
        ast_node.pre_comment = pre_comment;
        ast_node.start       = get_start_position(pre_comment, current_token);
        ast_node.end         = body.end;

        if (is_function_declaration) {
            parser.terminate(ast_node);
        } else {
            parser.prepare_next_state(expression_name);
        }
    }
};
