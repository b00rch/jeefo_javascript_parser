/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_expression.js
* Created at  : 2019-03-22
* Updated at  : 2019-07-19
* Author      : jeefo
* Update by   : boorch
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function get_expression (parser, precedence) {
    let is_valid = false;
    switch (parser.next_ast_node_definition.type) {
        case "Primitive" :
        case "Expression" :
            is_valid = true;
            break;
        default:
            is_valid = parser.next_token.value === "function";
    }

    if (is_valid) {
        return parser.get_next_ast_node(precedence);
    }

    parser.throw_unexpected_token();
};
