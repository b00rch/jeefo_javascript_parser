/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ignore_comments.js
* Created at  : 2019-01-27
* Updated at  : 2019-02-25
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function ignore_comments (parser) {
	while (parser.next_token) {
        if (parser.next_ast_node_definition === null) { break; }

        if (parser.next_ast_node_definition.id === "Comment") {
            parser.current_ast_node = parser.next_ast_node_definition.generate_new_ast_node(parser);
            parser.previous_ast_nodes.push(parser.current_ast_node);

            parser.prepare_next_ast_node_definition();
        } else {
            break;
        }
	}
};
