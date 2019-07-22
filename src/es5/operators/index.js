/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-28
* Updated at  : 2019-03-28
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function register_operators (es5_ast_nodes) {
    require("./unary_operators")(es5_ast_nodes);
    require("./binary_operators")(es5_ast_nodes);
    es5_ast_nodes.register_ast_node_definition(require("./conditional_operator"));
};
