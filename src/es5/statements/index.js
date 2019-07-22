/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-29
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

module.exports = function register_statement_ast_node_definitions (es5_ast_nodes) {
    es5_ast_nodes.register_ast_node_definition(require("./empty_statement"));
    es5_ast_nodes.register_ast_node_definition(require("./block_statement"));
    es5_ast_nodes.register_ast_node_definition(require("./labelled_statement"));
    es5_ast_nodes.register_ast_node_definition(require("./expression_statement"));

    es5_ast_nodes.register_reserved_word("do"       , require("./do_while_statement"));
    es5_ast_nodes.register_reserved_word("var"      , require("./variable_declaration_list_statement"));
    es5_ast_nodes.register_reserved_word("for"      , require("./for_statement"));
    es5_ast_nodes.register_reserved_word("with"     , require("./with_statement"));
    es5_ast_nodes.register_reserved_word("while"    , require("./while_statement"));
    es5_ast_nodes.register_reserved_word("throw"    , require("./throw_statement"));
    es5_ast_nodes.register_reserved_word("break"    , require("./break_statement"));
    es5_ast_nodes.register_reserved_word("return"   , require("./return_statement"));
    es5_ast_nodes.register_reserved_word("continue" , require("./continue_statement"));
    es5_ast_nodes.register_reserved_word("debugger" , require("./debugger_statement"));

    require("./if_statement")(es5_ast_nodes);
    require("./try_statement")(es5_ast_nodes);
    require("./switch_statement")(es5_ast_nodes);
};
