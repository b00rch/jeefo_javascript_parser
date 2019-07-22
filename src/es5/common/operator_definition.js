/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : operator_definition.js
* Created at  : 2019-03-19
* Updated at  : 2019-03-24
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

const ASTNodeDefinition   = require("@jeefo/parser/src/ast_node_definition"),
      get_start_position = require("../helpers/get_start_position");

module.exports = new ASTNodeDefinition({
    id         : "Operator",
    type       : "Operator",
    precedence : -1,

    is         : () => {},
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
