/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-02-10
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

module.exports = function register_expression_ast_node_definitions (es5_ast_nodes) {
    es5_ast_nodes.register_ast_node_definition(require("./grouping_expression"));
    es5_ast_nodes.register_ast_node_definition(require("./member_expression"));
    es5_ast_nodes.register_ast_node_definition(require("./computed_member_expression"));
    es5_ast_nodes.register_ast_node_definition(require("./function_call_expression"));
    es5_ast_nodes.register_ast_node_definition(require("./sequence_expression"));
};
