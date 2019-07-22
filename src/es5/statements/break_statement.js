/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : break_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     :
* Description :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const states_enum        = require("../enums/states_enum"),
      get_pre_comment    = require("../helpers/get_pre_comment"),
      get_start_position = require("../helpers/get_start_position");

module.exports = {
	id         : "Break statement",
	type       : "Statement",
	precedence : 31,

	is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (ast_node, current_token, parser) => {
        let asi          = true,
            end          = current_token.end,
            identifier   = null,
            post_comment = null;
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state("expression", true);
        if (parser.next_token.start.line === current_token.start.line) {
            if (parser.next_ast_node_definition !== null && parser.next_ast_node_definition.type !== "Delimiter") {
                if (parser.next_ast_node_definition.id === "Identifier") {
                    identifier = parser.next_ast_node_definition.generate_new_ast_node(parser);
                    parser.prepare_next_state("expression");
                } else {
                    parser.throw_unexpected_token();
                }
            }

            if (parser.next_token            !== null &&
                parser.next_token.value      === ';'  &&
                parser.next_token.start.line === current_token.start.line) {
                asi          = false;
                end          = parser.next_token.end;
                post_comment = parser.current_ast_node;
            } else if (identifier) {
                end = identifier.end;
            }
        }

        ast_node.identifier   = identifier;
        ast_node.ASI          = asi;
        ast_node.pre_comment  = pre_comment;
        ast_node.post_comment = post_comment;
        ast_node.start        = get_start_position(pre_comment, current_token);
        ast_node.end          = end;

        parser.terminate(ast_node);
    }
};
