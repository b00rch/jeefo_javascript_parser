/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : get_right_value.js
* Created at  : 2019-02-04
* Updated at  : 2019-03-29
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const get_last_non_comment_ast_node = require("./get_last_non_comment_ast_node");

module.exports = function get_right_value (parser, left_precedence) {
    let right_value = parser.get_next_ast_node(left_precedence);

    if (right_value !== null && right_value.id === "Comment") {
        parser.post_comment = right_value;

        return get_last_non_comment_ast_node(parser, true);
    }

    return right_value;
};
