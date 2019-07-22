/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : initiliazer.js
* Created at  : 2019-01-29
* Updated at  : 2019-02-02
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const get_start_position      = require("../helpers/get_start_position"),
      value_ast_node_definition = require("./value_ast_node_definition");

module.exports = (ast_node, current_token, parser) => {
    let pre_comment = null;
    if (parser.current_ast_node) {
        if (parser.current_ast_node.id === "Comment") {
            pre_comment = parser.current_ast_node;
        } else {
            parser.throw_unexpected_token();
        }
    }

    ast_node.value       = value_ast_node_definition.generate_new_ast_node(current_token);
    ast_node.pre_comment = pre_comment;
    ast_node.start       = get_start_position(pre_comment) || current_token.start;
    ast_node.end         = current_token.end;
};
