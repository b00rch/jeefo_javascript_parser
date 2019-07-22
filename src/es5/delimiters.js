/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : delimiters.js
* Created at  : 2017-08-17
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

const states_enum        = require("./enums/states_enum"),
      get_start_position = require("./helpers/get_start_position");

module.exports = function register_delimiter_ast_node_definitions (es5_ast_nodes) {
    es5_ast_nodes.register_ast_node_definition({
        id         : "Delimiter",
        type       : "Delimiter",
        precedence : -1,

        is : (token, parser) => {
            switch (token.value) {
                case '(' : case ')' :
                case '[' : case ']' :
                case '{' : case '}' :
                case ':' : case ';' :
                    return true;
                case ',' :
                    return parser.current_state === states_enum.delimiter;
            }
            return false;
        },
        initialize : (ast_node, current_token, parser) => {
            let pre_comment = null;
            if (parser.current_ast_node !== null && parser.current_ast_node.id === "Comment") {
                pre_comment = parser.current_ast_node;
            }

            ast_node.pre_comment = pre_comment;
            ast_node.token       = current_token;
            ast_node.start       = get_start_position(pre_comment, current_token);
            ast_node.end         = current_token.end;
        }
    });
};
