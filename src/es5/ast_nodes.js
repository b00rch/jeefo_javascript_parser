/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_nodes.js
* Created at  : 2017-08-16
* Updated at  : 2019-03-31
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const ASTNodes = require("@jeefo/parser/src/ast_nodes");

const es5_ast_nodes = new ASTNodes();

const future_reserved_words = [
    "let",
    "enum",
    "const",
    "class",
    "super",
    "yield",
    "public",
    "export",
    "import",
    "static",
    "extends",
    "package",
    "private",
    "interface",
    "protected",
    "implements",
];

es5_ast_nodes.register_reserved_words(future_reserved_words, {
    id         : "Future reserved word",
    type       : "Statement",
    precedence : 31,

    is         : () => true,
    initialize : (ast_node, current_token, parser) => {
        parser.throw_unexpected_token("Found future reserved word");
    }
});

require("./delimiters")(es5_ast_nodes);
require("./operators")(es5_ast_nodes);
require("./primitives")(es5_ast_nodes);
require("./declarations")(es5_ast_nodes);
require("./expressions")(es5_ast_nodes);
require("./statements")(es5_ast_nodes);

module.exports = es5_ast_nodes;
