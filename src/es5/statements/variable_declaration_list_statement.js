/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : variable_declaration_list_statement.js
* Created at  : 2019-03-18
* Updated at  : 2019-03-29
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

const states_enum                   = require("../enums/states_enum"),
      get_pre_comment               = require("../helpers/get_pre_comment"),
      get_start_position            = require("../helpers/get_start_position"),
      get_variable_declaration_list = require("../helpers/get_variable_declaration_list");

module.exports = {
    id         : "Variable declaration list",
    type       : "Statement",
    precedence : 31,

    is         : (current_token, parser) => parser.current_state === states_enum.statement,
    initialize : (ast_node, current_token, parser) => {
        let terminator = null;
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state("expression", true);

        const list = get_variable_declaration_list(parser, true);

        if (parser.next_token !== null && parser.next_token.value === ';') {
            terminator = parser.next_ast_node_definition.generate_new_ast_node(parser);
        }

        ast_node.pre_comment = pre_comment;
        ast_node.token       = current_token;
        ast_node.list        = list;
        ast_node.terminator  = terminator;
        ast_node.start       = get_start_position(pre_comment, current_token);
        ast_node.end         = terminator ? terminator.end : list[list.length - 1].end;

        parser.terminate(ast_node);
    }
};
